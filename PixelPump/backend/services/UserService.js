const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.create({
      ...data,
      password_hash: hashedPassword
    });
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return true;
  }

  async getUserProjects(userId) {
    const user = await User.findByPk(userId, { include: [Project] });
    return user ? user.Projects : null;
  }
}

module.exports = new UserService();
