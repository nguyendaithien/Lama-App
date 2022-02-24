import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Project } from './project.entity';

@Entity()
export class UserProject {
  @Column()
  role: string;

  @Column({ type: 'float', nullable: true })
  wage: number;

  @ManyToOne(() => User, user => user.userProjects, { primary: true })
  user: User;

  @ManyToOne(() => Project, project => project.userProjects, { primary: true })
  project: Project;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
