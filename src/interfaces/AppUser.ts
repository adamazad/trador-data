export interface UserAuth {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  auth: UserAuth;
}
