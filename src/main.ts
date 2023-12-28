import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiLogInterceptor } from './interceptor/api.log.interceptor';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // api log interceptor
  if (process.env.NODE_ENV === 'development') {
    app.useGlobalInterceptors(new ApiLogInterceptor());
  }

  // class-validator pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
