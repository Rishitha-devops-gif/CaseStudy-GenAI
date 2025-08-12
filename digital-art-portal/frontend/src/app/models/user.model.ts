export interface User {
  id: number;
  username: string;
  email: string;
  role: 'artist' | 'curator';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: 'artist' | 'curator';
}