import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private users: UsersService) {}

  async register(email: string, password: string) {
    return this.users.create(email, password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const valid = await argon2.verify(user.password, password);
    if (!valid) return null;
    return user;
  }

  signJwt(payload: object, expiresIn: string) {
    const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyJwt<T = any>(token: string): T {
    try {
      const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
      return jwt.verify(token, secret) as T;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  signRefreshToken(payload: object, expiresIn: string) {
    const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
    return jwt.sign(payload, secret, { expiresIn });
  }

  verifyRefreshToken<T = any>(token: string): T {
    try {
      const secret = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
      return jwt.verify(token, secret) as T;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  createRefreshJwt(userId: number, expiresIn: string) {
    const jti = randomUUID();
    const token = this.signRefreshToken({ sub: userId, jti }, expiresIn);
    return { token, jti };
  }
}
