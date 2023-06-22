const taskRepository = require('../repository/time-entries.repository');

class TimeEntriesService {
  constructor() { }

  async getTasks() {
    return await taskRepository.getTasks();
  }

  async getTask(taskId) {
    return await taskRepository.getTask(taskId);
  }

  async getTaskByUser(userId) {
    return await taskRepository.getTaskByUser(userId);
  }

  async createTask(task) {
    return await taskRepository.createTask(task);
  }

  async updateTask(task, taskId) {
    return await taskRepository.updateTask(task, taskId);
  }

  async deleteTask(taskId) {
    return await taskRepository.deleteTask(taskId);
  }

}

module.exports = new TimeEntriesService();