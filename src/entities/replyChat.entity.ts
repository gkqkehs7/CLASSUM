import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SpaceEntity } from './space.entity';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'ReplyChat' })
export class ReplyChatEntity {
  // chat 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // chat 내용
  @Column('text')
  content: string;

  // chat 익명성 여부
  @Column('boolean')
  anonymous: boolean;

  // userEntity 참조 id
  @Column('int', { name: 'userId', nullable: true })
  userId: number;

  // chatEntity 참조 id
  @Column('int', { name: 'chatId', nullable: true })
  chatId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // userEntity와의 관계
  @ManyToOne(() => UserEntity, (user) => user.replyChats, {
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

  // chatEntity와의 관계
  @ManyToOne(() => ChatEntity, (chat) => chat.replyChats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'chatId',
      referencedColumnName: 'id',
    },
  ])
  chat: ChatEntity;
}
