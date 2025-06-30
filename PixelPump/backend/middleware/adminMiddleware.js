const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token manquant - Accès administrateur requis' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'pixelpump_secret_key_2025');
    
    // Vérifier si l'utilisateur a le rôle admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Permissions administrateur requises'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

module.exports = adminMiddleware;
