import api from "./api";

export const getAdminDashboard = async () => (await api.get("/admin/dashboard")).data;
export const getAdminUsers = async (params) =>
  (await api.get("/admin/users", { params })).data;
export const updateRegistrationStatus = async (id, payload) =>
  (await api.patch(`/admin/registrations/${id}`, payload)).data;
export const createClass = async (payload) => (await api.post("/admin/classes", payload)).data;
export const updateClass = async (id, payload) =>
  (await api.put(`/admin/classes/${id}`, payload)).data;
export const deleteClass = async (id) => (await api.delete(`/admin/classes/${id}`)).data;
export const getAdminReports = async () => (await api.get("/admin/reports")).data;
export const getAdminLogs = async (params) => (await api.get("/admin/logs", { params })).data;
