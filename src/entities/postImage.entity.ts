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
import { PostEntity } from './post.entity';

@Entity({ name: 'PostImage' })
export class PostImageEntity {
  // postImage 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // postImage 저장 주소
  @Column('varchar')
  src: string;

  // postEntity 참조 id
  @Column('int', { name: 'postId', nullable: true })
  postId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // postEntity와의 관계
  @ManyToOne(() => PostEntity, (post) => post.images, {
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
}
