import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { SpaceRoleEntity } from './spaceRole.entity';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';
import { SpaceMemberEntity } from './spaceMember.entity';

@Entity({ name: 'Space' })
export class SpaceEntity {
  // space 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // space 이름
  @Column('varchar')
  name: string;

  // space 로고
  @Column('varchar')
  logo: string;

  // space 입장 코드
  @Column('varchar', { length: 8 })
  code: string;

  // space 관리자 입장 코드
  @Column('varchar', { length: 8 })
  adminCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // userEntity와의 관계
  @ManyToMany(() => UserEntity, (user) => user.spaces)
  members: UserEntity[];

  // spaceMemberEntity와의 관계
  @OneToMany(() => SpaceMemberEntity, (spaceMember) => spaceMember.space)
  spaceMembers: SpaceMemberEntity[];

  // postEntity와의 관계
  @OneToMany(() => PostEntity, (post) => post.space, {
    cascade: true,
  })
  posts: PostEntity[];

  // spaceRoleEntity와의 관계
  @OneToMany(() => SpaceRoleEntity, (spaceRole) => spaceRole.space, {
    cascade: true,
  })
  spaceRoles: SpaceRoleEntity[];
}
