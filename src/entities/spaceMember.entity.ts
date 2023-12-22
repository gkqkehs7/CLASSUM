import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReplyChatEntity } from './replyChat.entity';
import { ChatEntity } from './chat.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { SpaceEntity } from './space.entity';

enum SpaceRoleType {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
}

@Entity({ name: 'SpaceMember' })
export class SpaceMemberEntity {
  @Column('int', { primary: true, name: 'userId' })
  userId: number;

  @Column('int', { primary: true, name: 'spaceId' })
  spaceId: number;

  // spaceRole 타입
  @Column({
    type: 'enum',
    enum: SpaceRoleType,
  })
  roleType: SpaceRoleType;

  // spaceRole 이름
  @Column('varchar')
  roleName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // userEntity와의 관계
  @ManyToOne(() => UserEntity, (user) => user.spaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  user: UserEntity;

  // spaceEntity와의 관계
  @ManyToOne(() => SpaceEntity, (space) => space.spaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'spaceId',
      referencedColumnName: 'id',
    },
  ])
  space: SpaceEntity;
}
