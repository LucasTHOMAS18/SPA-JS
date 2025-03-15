module.exports = (req, res, next) => {
    const votes = req.app.votes || {};
    const db = req.app.db;

    const vaisseaux = db.get('vaisseaux');
    console.log(vaisseaux)

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const id = parseInt(req.params.id, 10);
    if (!votes[ip]) votes[ip] = {};

    // Like
    if (req.method === 'POST' && req.path.startsWith('/like/')) {
        if (votes[ip][id]) {
            return res.status(400).json({ error: 'Vous avez déjà voté pour ce vaisseau !' });
        }
        const vaisseau = vaisseaux.find({ id }).value();
        if (!vaisseau) return res.status(404).json({ error: 'Vaisseau non trouvé' });

        vaisseau.score += 1;
        votes[ip][id] = 'like';
        db.write(); 

        return res.json({ success: true, score: vaisseau.score });
    }

    // Dislike
    if (req.method === 'POST' && req.path.startsWith('/dislike/')) {
        if (votes[ip][id]) {
            return res.status(400).json({ error: 'Vous avez déjà voté pour ce vaisseau !' });
        }
        const vaisseau = vaisseaux.find({ id }).value();
        if (!vaisseau) return res.status(404).json({ error: 'Vaisseau non trouvé' });

        vaisseau.score -= 1;
        votes[ip][id] = 'dislike';
        db.write();

        return res.json({ success: true, score: vaisseau.score });
    }

    req.app.set('votes', votes);
    next();
};
