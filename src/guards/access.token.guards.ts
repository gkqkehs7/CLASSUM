import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new Error('No accessToken in header');
    }

    const [type, token] = authorization.split(' ');

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
