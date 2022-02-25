import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { UserProject } from './user-project.entity';
import { UserTeam } from './user-team.entity';

export enum UserRole {
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true, select: false })
  salt: string;

  @OneToMany(() => UserTeam, userTeam => userTeam.user, { cascade: true })
  userTeams: UserTeam[];

  @OneToMany(() => UserProject, userProject => userProject.user, { cascade: true })
  userProjects: UserProject[];

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
