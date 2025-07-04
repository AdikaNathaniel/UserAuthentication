import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token missing');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
      req.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
