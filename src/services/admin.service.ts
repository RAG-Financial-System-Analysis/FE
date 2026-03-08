import axios from '@/lib/axios';

// Types for Admin API
export interface User {
  Id: string;
  Email: string;
  FullName: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: string;
  LastLoginAt?: string;
}

export interface UserDetail extends User {
  Statistics: {
    ReportsUploaded: number;
    ChatSessions: number;
  };
}

export interface UpdateUserRequest {
  FullName: string;
  RoleId: string;
  IsActive: boolean;
}

export interface SystemStatistics {
  Users: {
    Total: number;
    Active: number;
    ByRole: {
      Admin: number;
      Analyst: number;
    };
  };
  Reports: {
    Total: number;
    Public: number;
    Private: number;
  };
  ChatSessions: {
    Total: number;
    ActiveToday: number;
  };
  Storage: {
    TotalSizeGB: number;
    FilesCount: number;
  };
}

export interface AuditLog {
  Id: string;
  UserId: string;
  UserName: string;
  Action: string;
  ResourceType: string;
  ResourceId: string;
  Details: string;
  IpAddress: string;
  CreatedAt: string;
}

export interface PaginatedResponse<T> {
  Total: number;
  Page: number;
  PageSize: number;
  Data: T[];
}

class AdminService {
  // Get all users with pagination
  async getUsers(page = 1, pageSize = 10, roleId?: string): Promise<PaginatedResponse<User>> {
    const params: Record<string, string | number> = { page, pageSize }
    if (roleId) params.roleId = roleId

    const response = await axios.get('/admin/users', { params })
    return response.data
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserDetail> {
    const response = await axios.get(`/admin/users/${id}`)
    return response.data
  }

  // Update user
  async updateUser(id: string, data: UpdateUserRequest): Promise<{ Message: string }> {
    const response = await axios.put(`/admin/users/${id}`, data)
    return response.data
  }

  // Delete user
  async deleteUser(id: string): Promise<{ Message: string }> {
    const response = await axios.delete(`/admin/users/${id}`)
    return response.data
  }

  // Get system statistics
  async getStatistics(): Promise<SystemStatistics> {
    const response = await axios.get('/admin/statistics')
    return response.data
  }

  // Get audit logs
  async getAuditLogs(
    page = 1,
    pageSize = 50,
    filters?: {
      userId?: string
      action?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<PaginatedResponse<AuditLog>> {
    const params: Record<string, string | number> = { page, pageSize, ...filters }
    const response = await axios.get('/admin/audit-logs', { params })
    return response.data
  }
}

export const adminService = new AdminService();
