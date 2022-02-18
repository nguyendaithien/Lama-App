import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { ProjectCost } from './project-cost.entity';
import { UserProject } from './user-project.entity';

export enum ProjectStatus {
  CANCELED = 'Canceled',
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.IN_PROGRESS })
  status: ProjectStatus;

  @Column({ type: 'float', nullable: true })
  income?: number;

  @OneToMany(() => ProjectCost, cost => cost.project, { cascade: true })
  costs: ProjectCost[];

  @OneToMany(() => UserProject, userProject => userProject.project, { cascade: true })
  userProjects: UserProject[];

  @Column({ type: 'datetime', nullable: true })
  startTime?: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime?: Date;

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
