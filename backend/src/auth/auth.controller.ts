import { Body, Controller, Post, Res, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';
import * as argon2 from 'argon2';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private users: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto.email, dto.password);
    return { id: user.id, email: user.email };
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    if (!user) return { ok: false };
    const access = this.auth.signJwt({ sub: user.id, role: user.role }, '15m');

    // create refresh JWT with jti and store hashed
    const { token: refreshToken, jti } = this.auth.createRefreshJwt(user.id, '7d');
    const hash = await argon2.hash(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.users.createRefreshToken(user.id, hash, jti, expiresAt);

    res.cookie('jid', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    return { accessToken: access };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.jid;
    if (!token) return { ok: false };

    let payload: any;
    try {
      payload = this.auth.verifyRefreshToken(token);
    } catch (e) {
      return { ok: false };
    }

    const jti = payload.jti as string;
    const rec = await this.users.findRefreshByJti(jti);
    if (!rec || rec.revoked || rec.expiresAt < new Date()) return { ok: false };

    // verify token matches stored hash
    const matches = await argon2.verify(rec.tokenHash, token);
    if (!matches) return { ok: false };

    // rotate: revoke old, create new refresh token
    await this.users.revokeByJti(jti);
    const { token: newRefresh, jti: newJti } = this.auth.createRefreshJwt(rec.userId, '7d');
    const hash = await argon2.hash(newRefresh);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.users.createRefreshToken(rec.userId, hash, newJti, expiresAt);

    // issue new access token
    const access = this.auth.signJwt({ sub: rec.userId }, '15m');
    res.cookie('jid', newRefresh, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
    return { accessToken: access };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.jid;
    if (token) {
      try {
        const payload: any = this.auth.verifyRefreshToken(token);
        await this.users.revokeByJti(payload.jti);
      } catch (_) {}
    }
    res.clearCookie('jid', { path: '/' });
    return { ok: true };
  }
}
