import { Service, Inject, Container } from 'typedi';
import { Brackets, Repository } from 'typeorm';
import slugify from 'slugify';

import { User } from '@src/entities/user.entity';
import {
  ChangeUserStatusDto,
  CreateUserDto,
  GetAllUsersParamsDto,
  GetUserSortParams,
  UpdateUserDto,
} from '@src/dto/user.dto';
import { BadRequestException, NotFoundException } from '@src/config/custom-error.config';
import { convertDto } from '@src/utils/common.util';
import { PaginationDto } from '@src/dto/pagination.dto';
import PaginationService from './pagination.service';
import _ from 'lodash';

@Service()
export default class UserService {
  constructor(
    @Inject('userRepository') private userRepository: Repository<User>,
    private readonly paginationService = Container.get(PaginationService),
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    // Check if email is already existed
    if (await this._checkExistUser(createUserDto.email)) {
      throw new BadRequestException('signUp', 'This email already exists');
    }

    const newUser: User = new User();
    convertDto(createUserDto, newUser);
    if (!newUser.avatar) {
      newUser.avatar = UserService.generateAvatar(createUserDto.firstName, createUserDto.lastName);
    }

    const user = await this.userRepository.save(newUser);

    return user;
  }

  public async findAllUsers(params: GetAllUsersParamsDto): Promise<PaginationDto<User>> {
    const { page, limit, search, sort, status } = params;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userTeams', 'userTeam')
      .leftJoinAndSelect('userTeam.team', 'team')
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy(GetUserSortParams[sort][0], GetUserSortParams[sort][1]);
    if (search) {
      qb.andWhere(
        new Brackets(sqb => {
          sqb
            .where('user.firstName LIKE :search', { search: `%${search}%` })
            .orWhere('user.lastName LIKE :search', { search: `%${search}%` })
            .orWhere('user.email LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    // status:
    // 1: isActive = true
    // 2: isActive = false
    if (status) {
      switch (status) {
        case 1:
          qb.andWhere('user.isActive = true');
          break;
        case 2:
          qb.andWhere('user.isActive = false');
          break;
      }
    }

    const result = await qb.getManyAndCount();
    return this.paginationService.paginate(params, result[0], result[1]);
  }

  private async _checkExistUser(email: string): Promise<boolean> {
    const userCount = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getCount();

    return userCount > 0;
  }

  public async findOne(id: number | string) {
    const user = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userTeams', 'userTeam')
      .leftJoinAndSelect('userTeam.team', 'team')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  public async changeUserStatus(userId: number | string, changeUserStatusDto: ChangeUserStatusDto) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('changeUserStatus', 'User not found');
    }

    user.isActive = changeUserStatusDto.isActive;
    await this.userRepository.save(user);
    return _.omit(user, ['password', 'salt']);
  }

  public async updateUser(userId, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('updateUser', 'User not found');
    }
    if (updateUserDto.email !== user.email) {
      const isDuplicatedEmail = await this._checkExistUser(updateUserDto.email);
      if (isDuplicatedEmail) {
        throw new BadRequestException('updateUser', 'This email already exists');
      }
    }
    convertDto(updateUserDto, user);
    await this.userRepository.save(user);

    return user;
  }

  public static generateAvatar(firstName: string, lastName = '') {
    const str = slugify(firstName + ' ' + lastName);
    return `https://avatars.dicebear.com/api/micah/${str}.png`;
  }
}
