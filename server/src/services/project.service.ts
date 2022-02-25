import Container, { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import slugify from 'slugify';

import { Project, ProjectStatus } from '@src/entities/project.entity';
import {
  AddProjectCostDto,
  AddUserToProjectDto,
  ChangeProjectStatusDto,
  CreateProjectDto,
  DeleteUserInProjectDto,
  GetAllProjectsParamDto,
  GetProjectsSortParam,
  UpdateProjectCostDto,
  UpdateProjectDto,
  UpdateUserInProjectDto,
} from '@src/dto/project.dto';
import { convertDto } from '@src/utils/common.util';
import { BadRequestException, NotFoundException } from '@src/config/custom-error.config';
import PaginationService from './pagination.service';
import UserService from './user.service';
import { UserProject } from '@src/entities/user-project.entity';
import { ProjectCost } from '@src/entities/project-cost.entity';

@Service()
export default class ProjectService {
  constructor(
    @Inject('projectRepository') private projectRepository: Repository<Project>,
    @Inject('userProjectRepository') private userProjectRepository: Repository<UserProject>,
    private readonly userService = Container.get(UserService),
    private readonly paginationService = Container.get(PaginationService),
  ) {}

  public async createProject(createProjectDto: CreateProjectDto) {
    const project = new Project();
    convertDto(createProjectDto, project);
    if (!project.avatar) {
      project.avatar = this._genProjectAvatar(project.name);
    }
    return this.projectRepository.save(project);
  }

  public async updateProject(projectId: number | string, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('updateProject', 'Project not found');
    }

    convertDto(updateProjectDto, project);
    await this.projectRepository.save(project);

    return project;
  }

  public async findOne(projectId: number | string) {
    return this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.costs', 'cost')
      .leftJoinAndSelect('project.userProjects', 'userProject')
      .leftJoinAndSelect('userProject.user', 'user')
      .where('project.id = :projectId', { projectId })
      .getOne();
  }

  public async getAllProjects(getAllProjectsParamDto: GetAllProjectsParamDto) {
    const { page, limit, search, sort, status } = getAllProjectsParamDto;

    const qb = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.costs', 'cost')
      .leftJoinAndSelect('project.userProjects', 'userProject')
      .leftJoinAndSelect('userProject.user', 'user')
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy(GetProjectsSortParam[sort][0], GetProjectsSortParam[sort][1]);
    if (search) {
      qb.where('project.name LIKE :search', { search: `%${search}%` });
    }

    // status:
    // 1: status = Canceled
    // 2: status = In progress
    // 3: status = Completed
    if (status) {
      switch (status) {
        case 1:
          qb.andWhere('project.status = :status', { status: ProjectStatus.CANCELED });
          break;
        case 2:
          qb.andWhere('project.status = :status', { status: ProjectStatus.IN_PROGRESS });
          break;
        case 3:
          qb.andWhere('project.status = :status', { status: ProjectStatus.COMPLETED });
          break;
      }
    }

    const result = await qb.getManyAndCount();
    return this.paginationService.paginate(getAllProjectsParamDto, result[0], result[1]);
  }

  public async changeProjectStatus(
    projectId: number | string,
    changeProjectStatusDto: ChangeProjectStatusDto,
  ) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('changeProjectStatus', 'Project not found');
    }

    project.status = changeProjectStatusDto.status;
    await this.projectRepository.save(project);

    return project;
  }

  public async deleteProject(projectId: number | string) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('deleteProject', 'Project not found');
    }

    return this.projectRepository.softRemove(project);
  }

  public async addUserToProject(
    projectId: number | string,
    addUserToProjectDto: AddUserToProjectDto,
  ) {
    const user = await this.userService.findOne(addUserToProjectDto.userId);
    if (!user) {
      throw new NotFoundException('addUserToProject', 'User not found');
    }

    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('addUserToProject', 'Project not found');
    }

    if (project.userProjects.some(userProject => userProject.user.id === user.id)) {
      throw new BadRequestException('addUserToProject', 'User is already in project');
    }

    const userProject = new UserProject();
    userProject.role = addUserToProjectDto.role;
    userProject.wage = addUserToProjectDto.wage;
    userProject.user = user;

    project.userProjects.push(userProject);
    await this.projectRepository.save(project);

    return project;
  }

  public async updateUserInProject(
    projectId: number | string,
    updateUserInProjectDto: UpdateUserInProjectDto,
  ) {
    const user = await this.userService.findOne(updateUserInProjectDto.userId);
    if (!user) {
      throw new NotFoundException('updateUserInProject', 'User not found');
    }

    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('updateUserInProject', 'Project not found');
    }

    if (!project.userProjects.some(userProject => userProject.user.id === user.id)) {
      throw new BadRequestException('updateUserInProject', 'User is not in project');
    }

    project.userProjects = project.userProjects.map(userProject => {
      if (userProject.user.id === user.id) {
        return {
          ...userProject,
          role: updateUserInProjectDto.role,
          wage: updateUserInProjectDto.wage,
        };
      } else {
        return userProject;
      }
    });

    await this.projectRepository.save(project);
    return project;
  }

  public async deleteUserInProject(
    projectId: number | string,
    deleteUserInProjectDto: DeleteUserInProjectDto,
  ) {
    const user = await this.userService.findOne(deleteUserInProjectDto.userId);
    if (!user) {
      throw new NotFoundException('deleteUserInProject', 'User not found');
    }

    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('deleteUserInProject', 'Project not found');
    }

    const userProject = project.userProjects.find(userProject => userProject.user.id === user.id);
    if (!userProject) {
      throw new BadRequestException('deleteUserInProject', 'User is not in project');
    }

    await this.userProjectRepository
      .createQueryBuilder('userProject')
      .leftJoin('userProject.user', 'user')
      .leftJoin('userProject.project', 'project')
      .softDelete()
      .where('user.id = :userId', { userId: deleteUserInProjectDto.userId })
      .andWhere('project.id = :projectId', { projectId })
      .execute();

    project.userProjects = project.userProjects.filter(
      userProject => userProject.user.id !== deleteUserInProjectDto.userId,
    );
    return project;
  }

  public async addProjectCost(projectId: number | string, addProjectCostDto: AddProjectCostDto) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('addProjectCost', 'Project not found');
    }

    const cost = new ProjectCost();
    convertDto(addProjectCostDto, cost);

    project.costs.push(cost);
    await this.projectRepository.save(project);

    return project;
  }

  public async updateProjectCost(
    projectId: number | string,
    projectCostId: number,
    updateProjectCostDto: UpdateProjectCostDto,
  ) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('updateProjectCost', 'Project not found');
    }
    if (!project.costs.some(projectCost => projectCost.id === projectCostId)) {
      throw new NotFoundException('updateProjectCost', 'Project cost not found');
    }

    project.costs = project.costs.map(projectCost => {
      if (projectCost.id === projectCostId) {
        return { ...projectCost, ...updateProjectCostDto };
      } else {
        return projectCost;
      }
    });
    await this.projectRepository.save(project);

    return project;
  }

  public async deleteProjectCost(projectId: number | string, projectCostId: number) {
    const project = await this.findOne(projectId);
    if (!project) {
      throw new NotFoundException('deleteProjectCost', 'Project not found');
    }
    if (!project.costs.some(projectCost => projectCost.id === projectCostId)) {
      throw new NotFoundException('deleteProjectCost', 'Project cost not found');
    }
    project.costs = project.costs.filter(projectCost => projectCost.id !== projectCostId);
    await this.projectRepository.save(project);

    return project;
  }

  private _genProjectAvatar(name: string) {
    return `https://avatars.dicebear.com/api/jdenticon/${slugify(name)}.png`;
  }
}
