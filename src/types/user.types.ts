export type UserRole = 'Admin' | 'Analyst'

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
