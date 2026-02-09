import { api } from "../lib/api";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleId: number;
  departmentId: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Replace with actual endpoint
    const response = await api.post<AuthResponse>(
      "/auth/admin/login",
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    // There is no specific logout endpoint mentioned, but usually client-side logout is sufficient if using JWT
    // But if there is one, it would likely be similar. For now, we just clear local state.
    // If the backend has a logout endpoint, we should call it.
    // Keeping this strict to what was requested or standard.
    // await api.post("/auth/logout");
    return Promise.resolve();
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>("/auth/admin/me");
    return response.data;
  },
};
