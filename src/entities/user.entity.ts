import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ReplyChatEntity } from './replyChat.entity';
import { ChatEntity } from './chat.entity';
import { PostEntity } from './post.entity';
import { SpaceMemberEntity } from './spaceMember.entity';
import { SpaceEntity } from './space.entity';

@Entity({ name: 'User' })
export class UserEntity {
  // user 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // user 이메일
  @Column('varchar', { unique: true })
  email: string;

  // user 비밀번호
  @Column('varchar')
  password: string;

  // user 이름
  @Column('varchar')
  firstName: string;

  // user 성
  @Column('varchar')
  lastName: string;

  // user 프로필 이미지 주소
  @Column('varchar')
  profileImageSrc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // spaceMemberEntity와의 관계
  @ManyToMany(() => SpaceEntity, (space) => space.members)
  @JoinTable({
    name: 'SpaceMember',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'spaceId',
      referencedColumnName: 'id',
    },
  })
  spaces: SpaceEntity[];

  // spaceMemberEntity와의 관계
  @OneToMany(() => SpaceMemberEntity, (spaceMember) => spaceMember.user)
  spaceMembers: SpaceMemberEntity[];

  // postEntity와의 관계
  @OneToMany(() => PostEntity, (post) => post.user, {
    cascade: true,
  })
  posts: PostEntity[];

  // chatEntity와의 관계
  @OneToMany(() => ChatEntity, (chat) => chat.user, {
    cascade: true,
  })
  chats: ChatEntity[];

  // replyChatEntity와의 관계
  @OneToMany(() => ReplyChatEntity, (replyChat) => replyChat.user, {
    cascade: true,
  })
  replyChats: ReplyChatEntity[];
}
