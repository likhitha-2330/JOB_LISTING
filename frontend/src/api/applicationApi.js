import client from "./client";

export function applyJob(jobId, coverLetter = '') {
  return client.post("/applications", { jobId, coverLetter });
}

export function getApplications(params) {
  return client.get("/applications", { params });
}

export function list(params) {
  return getApplications(params);
}

export function getApplication(id) {
  return client.get(`/applications/${id}`);
}

export function updateApplication(id, data) {
  return client.put(`/applications/${id}`, data);
}

export function deleteApplication(id) {
  return client.delete(`/applications/${id}`);
}

const applicationApi = { applyJob, getApplications, list, getApplication, updateApplication, deleteApplication };
export default applicationApi;
