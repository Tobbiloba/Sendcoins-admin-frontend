/**
 * Auth Service
 * Handles all authentication-related API calls
 */

import { api } from '../lib/api';
import type {
  User,
  LoginCredentials,
  LoginResponse,
  MfaVerifyRequest,
  ChangePasswordRequest,
  MfaSetupResponse,
} from '../types/auth';

// =============================================================================
// Auth Service
// =============================================================================

export const authService = {
  /**
   * Login with email and password
   * Returns user data or MFA requirement
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.post('/auth/admin/login', credentials);
    // Support both direct body and wrapped { data } (e.g. from some proxies)
    const body = response?.data ?? response;

    // Check if MFA is required (backend returns mfaToken without admin data)
    if (body.requiresMfa && body.mfaToken) {
      return {
        success: true,
        requiresMfa: true,
        mfaToken: body.mfaToken,
      };
    }

    // Validate response has admin data
    const admin = body.admin;
    if (!admin) {
      throw new Error('Invalid response from server');
    }

    const accessToken = body.accessToken;
    const refreshToken = body.refreshToken;
    if (!accessToken) {
      throw new Error('Invalid response from server');
    }

    // Map backend response to frontend expected format
    return {
      success: true,
      user: {
        id: String(admin.id),
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        roleId: admin.roleId,
        roleName: admin.dynamicRole?.title,
        departmentId: admin.departmentId,
        departmentName: admin.department?.name,
        permissions: admin.dynamicRole?.permissions || [],
        mfaEnabled: admin.mfaEnabled || false,
        status: admin.status,
        createdAt: admin.createdAt || new Date().toISOString(),
        lastLoginAt: admin.lastLoginAt,
      },
      token: accessToken,
      refreshToken,
      requiresMfa: false,
    };
  },

  /**
   * Verify MFA code
   */
  verifyMfa: async (data: MfaVerifyRequest): Promise<LoginResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.post('/auth/admin/verify-mfa', data);
    // Map backend response to frontend expected format
    const admin = response.admin;
    return {
      success: true,
      user: {
        id: String(admin.id),
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        roleId: admin.roleId,
        roleName: admin.dynamicRole?.title,
        departmentId: admin.departmentId,
        departmentName: admin.department?.name,
        permissions: admin.dynamicRole?.permissions || [],
        mfaEnabled: admin.mfaEnabled || false,
        status: admin.status,
        createdAt: admin.createdAt,
        lastLoginAt: admin.lastLoginAt,
      },
      token: response.accessToken,
      refreshToken: response.refreshToken,
      requiresMfa: false,
    };
  },

  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    // Response is already unwrapped by axios interceptor
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin: any = await api.get('/auth/admin/me');
    // Map backend response to frontend expected format
    return {
      id: String(admin.id),
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      roleId: admin.roleId,
      roleName: admin.dynamicRole?.title,
      departmentId: admin.departmentId,
      departmentName: admin.department?.name,
      permissions: admin.dynamicRole?.permissions || [],
      mfaEnabled: admin.mfaEnabled || false,
      status: admin.status,
      createdAt: admin.createdAt,
      lastLoginAt: admin.lastLoginAt,
    };
  },

  /**
   * Logout current session
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/admin/logout');
    } catch {
      // Ignore logout errors - we'll clear local state anyway
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await api.post('/auth/admin/refresh');
    return { token: response.accessToken };
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/admin/change-password', data);
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await api.post('/auth/admin/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/admin/set-password', { token, password: newPassword });
  },

  // =========================================================================
  // MFA Management
  // =========================================================================

  /**
   * Setup MFA - get QR code and secret
   */
  setupMfa: async (): Promise<MfaSetupResponse> => {
    const response = await api.post<MfaSetupResponse>('/auth/admin/mfa/start-setup');
    return response as unknown as MfaSetupResponse;
  },

  /**
   * Enable MFA after setup
   */
  enableMfa: async (code: string): Promise<void> => {
    await api.post('/auth/admin/mfa/enable', { code });
  },

  /**
   * Disable MFA
   */
  disableMfa: async (code: string): Promise<void> => {
    await api.post('/auth/admin/mfa/disable', { code });
  },

  // =========================================================================
  // Session Management
  // =========================================================================

  /**
   * Get active sessions
   */
  getSessions: async (): Promise<
    Array<{
      id: string;
      device: string;
      ip: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>
  > => {
    const response = await api.get('/auth/admin/sessions');
    return response as unknown as Array<{
      id: string;
      device: string;
      ip: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  },

  /**
   * Revoke a session
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/auth/admin/sessions/${sessionId}`);
  },

  /**
   * Revoke all other sessions
   */
  revokeAllSessions: async (): Promise<void> => {
    await api.post('/auth/admin/logout-all');
  },
};

export default authService;
