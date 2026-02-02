export type UserRole = 'Admin' | 'Source' | 'Provider' | 'Analyst' | 'Member'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
}

export interface UserProfile extends User {
  createdAt?: string
  updatedAt?: string
}
