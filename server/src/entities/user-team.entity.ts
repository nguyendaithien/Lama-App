import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Team } from './team.entity';

@Entity()
export class UserTeam {
  @Column()
  role: string;

  @Column({ default: false })
  isOwner: boolean;

  @ManyToOne(() => User, user => user.userTeams, { primary: true })
  user: User;

  @ManyToOne(() => Team, team => team.userTeams, { primary: true })
  team: Team;

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
