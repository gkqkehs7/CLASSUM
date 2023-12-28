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
import { UserEntity } from './user.entity';

@Entity({ name: 'Alarm' })
export class AlarmEntity {
  // alarm 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // alarm 내용
  @Column('varchar')
  content: string;

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
}
