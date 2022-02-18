import { Service, Inject, Container } from 'typedi';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { Team } from '@src/entities/team.entity';
import { BadRequestException, NotFoundException } from '@src/config/custom-error.config';
import { convertDto } from '@src/utils/common.util';
import PaginationService from './pagination.service';
import {
  AddUserToTeamDto,
  ChangeTeamStatusDto,
  CreateTeamDto,
  DeleteUserInTeamDto,
  GetAllTeamsParamsDto,
  GetTeamsSortParams,
  UpdateTeamDto,
  UpdateUserInTeamDto,
} from '@src/dto/team.dto';
import UserService from './user.service';
import { UserTeam } from '@src/entities/user-team.entity';

@Service()
export default class TeamService {
  constructor(
    @Inject('teamRepository') private teamRepository: Repository<Team>,
    @Inject('userTeamRepository') private userTeamRepository: Repository<UserTeam>,
    private readonly userService = Container.get(UserService),
    private readonly paginationService = Container.get(PaginationService),
  ) {}

  public async findAllTeams(getAllTeamsParams: GetAllTeamsParamsDto) {
    const { page, limit, search, sort, status } = getAllTeamsParams;

    const qb = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.userTeams', 'userTeam')
      .leftJoinAndSelect('userTeam.user', 'user')
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy(GetTeamsSortParams[sort][0], GetTeamsSortParams[sort][1]);

    if (search) {
      qb.where('team.name LIKE :search', { search: `%${search}%` });
    }

    // status:
    // 1: isActive = true
    // 2: isActive = false
    if (status) {
      switch (status) {
        case 1:
          qb.andWhere('team.isActive = true');
          break;
        case 2:
          qb.andWhere('team.isActive = false');
          break;
      }
    }

    const result = await qb.getManyAndCount();
    return this.paginationService.paginate(getAllTeamsParams, result[0], result[1]);
  }

  public async findOne(teamId: number | string) {
    return this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.userTeams', 'userTeam')
      .leftJoinAndSelect('userTeam.user', 'user')
      .where('team.id = :teamId', { teamId })
      .getOne();
  }

  public async createTeam(createTeamDto: CreateTeamDto) {
    const newTeam = new Team();
    convertDto(createTeamDto, newTeam);

    if (!newTeam.avatar) {
      newTeam.avatar = this._genTeamAvatar(createTeamDto.name);
    }

    return this.teamRepository.save(newTeam);
  }

  public async updateTeam(teamId: number | string, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('updateTeam', 'Team not found');
    }

    convertDto(updateTeamDto, team);
    await this.teamRepository.save(team);

    return team;
  }

  public async changeTeamStatus(teamId: number | string, changeTeamStatusDto: ChangeTeamStatusDto) {
    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('changeTeamStatus', 'Team not found');
    }

    team.isActive = changeTeamStatusDto.isActive;
    await this.teamRepository.save(team);

    return team;
  }

  public async deleteTeam(teamId: number | string) {
    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('deleteTeam', 'Team not found');
    }

    return this.teamRepository.softRemove(team);
  }

  public async addUserToTeam(teamId, addUserToTeamDto: AddUserToTeamDto) {
    const user = await this.userService.findOne(addUserToTeamDto.userId);
    if (!user) {
      throw new NotFoundException('addUserToTeam', 'User not found');
    }

    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('addUserToTeam', 'Team not found');
    }

    if (team.userTeams?.length && team.userTeams.some(userTeam => userTeam.user.id === user.id)) {
      throw new BadRequestException('addUserToTeam', 'User is already in team');
    }

    const newUserTeam = new UserTeam();
    newUserTeam.user = user;
    newUserTeam.team = team;
    newUserTeam.isOwner = addUserToTeamDto.isOwner || false;
    newUserTeam.role = addUserToTeamDto.role;

    await this.userTeamRepository.save(newUserTeam);

    return this.findOne(teamId);
  }

  public async updateUserInTeam(teamId, updateUserInTeamDto: UpdateUserInTeamDto) {
    const user = await this.userService.findOne(updateUserInTeamDto.userId);
    if (!user) {
      throw new NotFoundException('updateUserInTeam', 'User not found');
    }

    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('updateUserInTeam', 'Team not found');
    }

    if (!team.userTeams.some(userTeam => userTeam.user.id === updateUserInTeamDto.userId)) {
      throw new BadRequestException('updateUserInTeam', 'User is not in team');
    }

    team.userTeams = team.userTeams.map(userTeam => {
      if (userTeam.user.id === user.id) {
        return {
          ...userTeam,
          role: updateUserInTeamDto.role,
          isOwner: updateUserInTeamDto.isOwner,
        };
      }
      return userTeam;
    });

    await this.teamRepository.save(team);
    return team;
  }

  public async deleteUserInTeam(teamId, deleteUserInTeamDto: DeleteUserInTeamDto) {
    const user = await this.userService.findOne(deleteUserInTeamDto.userId);
    if (!user) {
      throw new NotFoundException('deleteUserInTeam', 'User not found');
    }

    const team = await this.findOne(teamId);
    if (!team) {
      throw new NotFoundException('deleteUserInTeam', 'Team not found');
    }

    if (!team.userTeams.some(userTeam => userTeam.user.id === user.id)) {
      throw new BadRequestException('deleteUserInTeam', 'User is not in team');
    }

    await this.userTeamRepository.delete(
      team.userTeams.find(userTeam => userTeam.user.id === user.id),
    );

    team.userTeams = team.userTeams.filter(
      userTeam => userTeam.user.id !== deleteUserInTeamDto.userId,
    );

    return team;
  }

  private _genTeamAvatar(name: string) {
    return `https://avatars.dicebear.com/api/jdenticon/${slugify(name)}.png`;
  }
}
