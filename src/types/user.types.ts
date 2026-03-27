/**
 * User profile related types
 */

/**
 * Extended user profile with timestamps
 */
export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: string
  createdAt?: string
  updatedAt?: string
}
