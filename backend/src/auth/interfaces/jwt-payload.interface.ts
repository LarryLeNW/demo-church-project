import { Role } from '../../common/enums/role.enum.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  jti?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}
