import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validationSchema } from './config/validation.schema';
import { TypeormConfigService } from './config/typeorm.config.service';
import { GlobalJwtModule } from './modules/jwt/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SpacesModule } from './modules/spaces/spaces.module';
import { SpaceRolesModule } from './modules/spaceRole/spaceRoles.module';
import { PostsModule } from './modules/posts/posts.module';
import { ChatsModule } from './modules/chat/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeormConfigService,
    }),
    GlobalJwtModule,
    AuthModule,
    UsersModule,
    SpacesModule,
    SpaceRolesModule,
    PostsModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
