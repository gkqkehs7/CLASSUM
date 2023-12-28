import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiLogInterceptor implements NestInterceptor {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, originalUrl } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${method} ${originalUrl} has been excuted`);
      }),
    );
  }
}
