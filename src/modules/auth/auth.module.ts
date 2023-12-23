import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
