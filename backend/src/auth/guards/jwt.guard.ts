import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private auth: AuthService, private users: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth) throw new UnauthorizedException();
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException();
    const token = parts[1];
    try {
      const payload: any = this.auth.verifyJwt(token);
      const user = await this.users.findById(payload.sub);
      req.user = { id: user.id, role: user.role };
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
