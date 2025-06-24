const Project = require('../models/Project');
const User = require('../models/User');

const ProjectController = {
  async getAll(req, res) {
    try {
      const projects = await Project.findAll({
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }]
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
  },

  async getOne(req, res) {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }]
      });
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const projectData = {
        ...req.body,
        userId: req.user.userId
      };

      const project = await Project.create(projectData);
      res.status(201).json({
        success: true,
        data: project
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
      const project = await Project.findByPk(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      // Vérifier que l'utilisateur est le propriétaire du projet
      if (project.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }

      await project.update(req.body);
      res.json({
        success: true,
        data: project
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
      const project = await Project.findByPk(req.params.id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Projet non trouvé'
        });
      }

      // Vérifier que l'utilisateur est le propriétaire du projet
      if (project.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé'
        });
      }

      await project.destroy();
      res.json({
        success: true,
        message: 'Projet supprimé'
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

module.exports = ProjectController;
