import { User } from '@src/entities/user.entity';
import { Team } from '@src/entities/team.entity';
import { UserTeam } from '@src/entities/user-team.entity';
import { Project } from '@src/entities/project.entity';
import { ProjectCost } from '@src/entities/project-cost.entity';
import { UserProject } from '@src/entities/user-project.entity';

export const entities = [User, Team, UserTeam, Project, ProjectCost, UserProject];
