import api from "./axiosInstance";

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AxiosResponse>}
 */
export const register = (email, password) =>
  api.post("/auth/register", { email, password });

/**
 * Login and receive a JWT token.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, expiresAt: string }>}
 */
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // { token, expiresAt }
};
