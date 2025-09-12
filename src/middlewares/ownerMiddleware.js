const OwnerModel = require('../models/OwnerModel');

function authMiddleware(req, res, next) {
  const user = req.user;

  OwnerModel.getByUser(user.id)
    .then(owner => {
      if (!owner) {
        return res.status(403).json({ error: 'Access denied' });
      }
      req.owner = owner;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
}

module.exports = authMiddleware;
