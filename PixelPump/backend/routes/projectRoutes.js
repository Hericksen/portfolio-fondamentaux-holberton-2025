const express = require('express');
const router = express.Router();
const projectController = require('../controllers/ProjectController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);

// Routes protégées
router.use(authMiddleware);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

module.exports = router;
