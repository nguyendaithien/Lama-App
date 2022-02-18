import { Entity, Column, ManyToOne } from 'typeorm';

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
}
