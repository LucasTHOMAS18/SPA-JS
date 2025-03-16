module.exports = (req, res, next) => {
    if (req.method === 'POST' && (req.path.startsWith('/like/') || req.path.startsWith('/dislike/'))) {
        const db = req.app.db;
        const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
        const vaisseauId = parseInt(req.query.id, 10);
        const voteType = req.path.startsWith('/like/') ? 'like' : 'dislike';
        const value = voteType === 'like' ? 1 : -1;

        const existingVote = db.get('votes').find({ ip, vaisseauId }).value();

        // Change existing vote
        if (existingVote) {
            const oldValue = existingVote.value;
            
            // Remove vote
            db.get('votes')
              .remove({ ip, vaisseauId })
              .write();

            // Update score
            db.get('vaisseaux')
              .find({ id: vaisseauId })
              .update('score', s => s - oldValue)
              .write();

            // Update score if value changed from a like to a dislike or vice versa
            if (oldValue !== value) {
                db.get('votes')
                  .push({ ip, vaisseauId, value })
                  .write();

                db.get('vaisseaux')
                  .find({ id: vaisseauId })
                  .update('score', s => s + value)
                  .write();
            }

            return res.json({
                status: oldValue === value ? 'removed' : 'changed',
                score: db.get('vaisseaux').find({ id: vaisseauId }).value().score,
                current: oldValue === value ? null : value
            });
        }

        // Add new vote
        db.get('votes')
          .push({ ip, vaisseauId, value })
          .write();

        db.get('vaisseaux')
          .find({ id: vaisseauId })
          .update('score', s => s + value)
          .write();

        return res.json({
            status: 'added',
            score: db.get('vaisseaux').find({ id: vaisseauId }).value().score,
            current: value
        });
    }

    next();
};