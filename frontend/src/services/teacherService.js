import api from "./api";

export const getTeacherDashboard = async () => (await api.get("/teachers/dashboard")).data;
export const getTeacherStudents = async (params) =>
  (await api.get("/teachers/students", { params })).data;
export const getTeacherClasses = async () => (await api.get("/teachers/classes")).data;
export const submitAttendance = async (payload) =>
  (await api.post("/teachers/attendance", payload)).data;
export const submitMarks = async (payload) =>
  (await api.post("/teachers/marks", payload)).data;
export const sendAnnouncement = async (payload) =>
  (await api.post("/teachers/announcements", payload)).data;
