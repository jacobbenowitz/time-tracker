const usersRepository = require('../repository/user.repository');

class UserService {
  constructor() { }

  async getUsers() {
    return await usersRepository.getUsers();
  }

  async getUser(userId) {
    return await usersRepository.getUser(userId);
  }

  async getUserByEmail(email) {
    return await usersRepository.getUserByEmail(email);
  }

  async getUserByUsername(username) {
    return await usersRepository.getUserByUsername(username);
  }

  async createUser(user) {
    return await usersRepository.createUser(user);
  }

  async updateUser(user) {
    return await usersRepository.updateUser(user);
  }

  async deleteUser(userId) {
    return await usersRepository.deleteUser(userId);
  }

}

module.exports = new UserService();