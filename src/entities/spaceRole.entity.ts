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

export enum SpaceRoleType {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
}

@Entity({ name: 'SpaceRole' })
export class SpaceRoleEntity {
  // spaceRole 식별 id
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  // spaceRole 타입
  @Column({
    type: 'enum',
    enum: SpaceRoleType,
  })
  roleType: SpaceRoleType;

  // spaceRole 이름
  @Column('varchar')
  roleName: string;

  // spaceEntity 참조 id
  @Column('int', { name: 'spaceId', nullable: true })
  spaceId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  // spaceEntity와의 관계
  @ManyToOne(() => SpaceEntity, (space) => space.spaceRoles, {
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
