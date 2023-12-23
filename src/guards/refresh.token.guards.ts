import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request.headers['refresh-token'];

    if (!refreshToken) {
      throw new Error('No accessToken in header');
    }

    const [type, token] = refreshToken.split(' ');

    if (type !== 'Bearer') {
      throw new Error('Invalid accessToken');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!decoded.userId) {
        throw new Error('Invalid refreshToken');
      }

      request.userId = decoded.userId;
      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Expired refreshToken');
      } else {
        throw new Error('Expired refreshToken');
      }
      return false;
    }
  }
}
