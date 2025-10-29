// Authentication types for 4th Tier customer accounts

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  iat?: number
  exp?: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
  tokens?: AuthTokens
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload
}
