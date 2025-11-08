import client from "./client";

export function getJobs(params) {
  return client.get("/jobs", { params });
}

export function getMyJobs() {
  return client.get("/jobs/my-jobs");
}

export function getJobById(id) {
  return client.get(`/jobs/${id}`);
}

export function getById(id) {
  return getJobById(id);
}

export function createJob(data) {
  return client.post("/jobs", data);
}

export function updateJob(id, data) {
  return client.put(`/jobs/${id}`, data);
}

export function deleteJob(id) {
  return client.delete(`/jobs/${id}`);
}

const jobApi = { getJobs, getMyJobs, getJobById, getById, createJob, updateJob, deleteJob };
export default jobApi;
