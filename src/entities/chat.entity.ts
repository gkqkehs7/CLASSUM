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
import { PostEntity } from './post.entity';
import { ReplyChatEntity } from './replyChat.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'Chat' })
export class ChatEntity {
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

  // postEntity 참조 id
  @Column('int', { name: 'postId', nullable: true })
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // userEntity와의 관계
  @ManyToOne(() => UserEntity, (user) => user.chats, {
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

  // postEntity와의 관계
  @ManyToOne(() => PostEntity, (post) => post.chats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'postId',
      referencedColumnName: 'id',
    },
  ])
  post: PostEntity;

  // replyChatEntity와의 관계
  @OneToMany(() => ReplyChatEntity, (replyChat) => replyChat.chat, {
    cascade: true,
  })
  replyChats: ReplyChatEntity[];
}
