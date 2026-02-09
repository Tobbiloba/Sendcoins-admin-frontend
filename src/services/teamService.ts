import { api } from "../lib/api";
import { TeamMember } from "../store/slices/teamSlice";

export interface InviteAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  role: string;
  roleId: number;
}

export interface Role {
  id: number;
  name: string;
  // Add other role fields if available
}

export const teamService = {
  getTeamMembers: async (): Promise<TeamMember[]> => {
    // This endpoint wasn't explicitly provided, so I'll assume standard naming or keep it mocked if not available yet.
    // However, since we are moving to real API, let's try to hit the backend or leave a comment.
    // The user invited admins endpoint is /admin-users (POST). Usually GET /admin-users would fetch them.
    // Let's assume GET /admin-users works for fetching the list.
    const response = await api.get<TeamMember[]>("/admin-users");
    return response.data;
  },

  inviteAdmin: async (payload: InviteAdminPayload): Promise<void> => {
    await api.post("/admin-users", payload);
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>("/roles");
    return response.data;
  },
};
