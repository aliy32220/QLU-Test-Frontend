import http from "../http-common";
class TaskDataService {
  getAll(params) {
    return http.get("/tasks", { params });
  }
  get(id) {
    return http.get(`/tasks/${id}`);
  }
  create(data) {
    return http.post("/tasks", data);
  }
  update(id, data) {
    return http.put(`/tasks/${id}`, data);
  }
  delete(id) {
    return http.delete(`/tasks/${id}`);
  }
  deleteAll() {
    return http.delete(`/tasks`);
  }
  findByTitle(title) {
    return http.get(`/tasks?title=${title}`);
  }
}
export default new TaskDataService();
