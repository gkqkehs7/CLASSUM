import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.headers['access-token'];

    if (!accessToken) {
      throw new Error('No accessToken in header');
    }

    const [type, token] = accessToken.split(' ');

    if (type !== 'Bearer') {
      throw new Error('Invalid accessToken');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded.userId) {
        throw new Error('Invalid accessToken');
      }

      request.userId = decoded.userId;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Expired accessToken');
      } else {
        throw new Error('Expired accessToken');
      }
      return false;
    }
  }
}
