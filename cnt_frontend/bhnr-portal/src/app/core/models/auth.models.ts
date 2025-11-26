export interface AuthUser {
  id: string;
  name: string;
  company: string;
  email: string;
}

export interface Credentials {
  identifier: string;
  password: string;
  remember: boolean;
}

