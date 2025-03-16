module.exports = (req, res, next) => {
  const db = req.app.db;
  const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0].trim();
  
  // Route: Vérifier l'état du vote
  if (req.method === 'GET' && req.path.startsWith('/vote-status')) {
      const vaisseauId = parseInt(req.query.id, 10);
      const existingVote = db.get('votes').find({ ip, vaisseauId }).value();
      
      return res.json({
          hasVoted: !!existingVote,
          voteType: existingVote?.value === 1 ? 'like' : existingVote?.value === -1 ? 'dislike' : null,
          score: db.get('vaisseaux').find({ id: vaisseauId }).value()?.score || 0
      });
  }

  // Routes: Gestion des votes
  if (req.method === 'POST' && (req.path.startsWith('/like') || req.path.startsWith('/dislike'))) {
      const vaisseauId = parseInt(req.query.id, 10);
      const isLike = req.path.startsWith('/like');
      const value = isLike ? 1 : -1;

      const existingVote = db.get('votes').find({ ip, vaisseauId }).value();
      const vaisseau = db.get('vaisseaux').find({ id: vaisseauId });

      if (!vaisseau.value()) {
          return res.status(404).json({ error: 'Vaisseau non trouvé' });
      }

      let status = '';
      let scoreChange = 0;

      if (existingVote) {
          // Annuler ou modifier le vote existant
          const oldValue = existingVote.value;
          db.get('votes').remove({ ip, vaisseauId }).write();
          vaisseau.update('score', s => s - oldValue).write();
          scoreChange -= oldValue;

          if (oldValue !== value) {
              // Changer de type de vote
              db.get('votes').push({ ip, vaisseauId, value }).write();
              vaisseau.update('score', s => s + value).write();
              scoreChange += value;
              status = 'changed';
          } else {
              status = 'removed';
          }
      } else {
          // Nouveau vote
          db.get('votes').push({ ip, vaisseauId, value }).write();
          vaisseau.update('score', s => s + value).write();
          scoreChange = value;
          status = 'added';
      }

      return res.json({
          status,
          currentScore: vaisseau.value().score,
          scoreChange,
          currentVote: status === 'removed' ? null : (value === 1 ? 'like' : 'dislike')
      });
  }

  next();
};