import api from "./api";

export const getStudentDashboard = async () => (await api.get("/students/dashboard")).data;
export const getStudentProfile = async () => (await api.get("/students/profile")).data;
export const updateStudentProfile = async (payload) =>
  (await api.put("/students/profile", payload)).data;
export const uploadStudentAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return (
    await api.post("/students/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};
export const getStudentAttendance = async () => (await api.get("/students/attendance")).data;
export const getStudentMarks = async () => (await api.get("/students/marks")).data;
export const getStudentNotifications = async () =>
  (await api.get("/students/notifications")).data;
export const downloadReportCard = async () =>
  (
    await api.get("/students/report-card", {
      responseType: "blob",
    })
  ).data;
