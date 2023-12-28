import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';
import { AlarmEntity } from './alarm.entity';

export enum PostType {
  NOTIFICATION = 'notification',
  QUESTION = 'question',
}

@Entity({ name: 'Post' })
export class PostEntity {
  // post 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // post 제목
  @Column('varchar')
  title: string;

  // post 내용
  @Column('text')
  content: string;

  // file 저장소 src
  @Column('text')
  fileSrc: string;

  // post 게시글 타입
  @Column({
    type: 'enum',
    enum: PostType,
  })
  type: PostType;

  // post 익명성 여부
  @Column('boolean', { default: false })
  anonymous: boolean;

  // userEntity 참조 id
  @Column('int', { name: 'userId', nullable: true })
  userId: number;

  // spaceEntity 참조 id
  @Column('int', { name: 'spaceId', nullable: true })
  spaceId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // userEntity와의 관계
  @ManyToOne(() => UserEntity, (user) => user.posts, {
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
  @ManyToOne(() => SpaceEntity, (space) => space.posts, {
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

  // chatEntity와의 관계
  @OneToMany(() => ChatEntity, (chat) => chat.post, {
    cascade: true,
  })
  chats: ChatEntity[];

  // alarmEntity와의 관계
  @OneToMany(() => AlarmEntity, (alarm) => alarm.user, {
    cascade: true,
  })
  alarms: AlarmEntity[];
}
