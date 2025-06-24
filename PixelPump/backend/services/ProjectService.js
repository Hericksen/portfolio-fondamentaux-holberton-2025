const Project = require('../models/Project');

class ProjectService {
  async getAllProjects() {
    return await Project.findAll();
  }

  async createProject(data) {
    return await Project.create(data);
  }

  async getProjectById(id) {
    return await Project.findByPk(id);
  }

  async updateProject(id, data) {
    const project = await Project.findByPk(id);
    if (!project) return null;
    return await project.update(data);
  }

  async deleteProject(id) {
    const project = await Project.findByPk(id);
    if (!project) return null;
    await project.destroy();
    return true;
  }
}

module.exports = new ProjectService();
