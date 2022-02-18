import { Entity, Column, ManyToOne } from 'typeorm';

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
}
