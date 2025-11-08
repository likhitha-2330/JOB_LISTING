import client from "./client";

export async function loginUser(payload) {
  return client.post("/auth/login", payload);
}

export async function registerUser(payload) {
  return client.post("/auth/register", payload);
}

const authApi = {
  login: loginUser,
  register: registerUser,
};

export default authApi;
