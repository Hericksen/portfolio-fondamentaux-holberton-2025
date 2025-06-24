const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcrypt');

const UserController = {
  async create(req, res) {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Tous les champs sont requis' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ 
          success: false,
          message: 'Email ou nom d\'utilisateur déjà utilisé' 
        });
      }
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getOne(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getUserProfile(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Project,
          as: 'projects'
        }]
      });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      // Si le mot de passe est fourni, le hacher
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      await user.update(req.body);
      
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      res.json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async remove(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: 'Utilisateur non trouvé' 
        });
      }

      await user.destroy();
      res.json({ 
        success: true,
        message: 'Utilisateur supprimé' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  },

  async getUserProjects(req, res) {
    try {
      const projects = await Project.findAll({
        where: { userId: req.params.id }
      });
      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  }
};

module.exports = UserController;
