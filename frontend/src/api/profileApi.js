import client from "./client";

export function getMyProfile() {
  return client.get("/profiles/me");
}

export function updateMyProfile(data) {
  return client.put("/profiles/me", data);
}

export function getPublicProfile(id, role) {
  return client.get(`/profiles/${id}`, { params: { role } });
}

const profileApi = { getMyProfile, updateMyProfile, getPublicProfile };
export default profileApi;