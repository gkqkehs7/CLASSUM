import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entities/user.entity';
import { PostEntity } from '../entities/post.entity';
import { ChatEntity } from '../entities/chat.entity';
import { ReplyChatEntity } from '../entities/replyChat.entity';
import { SpaceEntity } from '../entities/space.entity';
import { SpaceMemberEntity } from '../entities/spaceMember.entity';
import { SpaceRoleEntity } from '../entities/spaceRole.entity';
import { AlarmEntity } from '../entities/alarm.entity';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [
        UserEntity,
        PostEntity,
        ChatEntity,
        ReplyChatEntity,
        SpaceEntity,
        SpaceMemberEntity,
        SpaceRoleEntity,
        AlarmEntity,
      ],
      synchronize: true,
    };
  }
}
