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
