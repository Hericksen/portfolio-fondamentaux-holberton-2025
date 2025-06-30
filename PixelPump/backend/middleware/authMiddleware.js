const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token manquant ou invalide' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pixelpump_secret_key_2025');
    
    // Pour les tokens temporaires d'admin, pas besoin de vérifier l'utilisateur en base
    if (decoded.isTemporary && decoded.role === 'admin') {
      req.user = decoded;
      return next();
    }
    
    // Pour les utilisateurs normaux, vérifier en base
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    req.user = { ...decoded, dbUser: user };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token manquant ou invalide'
    });
  }
};

module.exports = authMiddleware;
