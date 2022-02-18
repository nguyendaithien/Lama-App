import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import middlewares from '@src/api/middlewares';
import { UserRole } from '@src/entities/user.entity';
import { projectValidators } from '@src/api/middlewares/validators';
import ProjectService from '@src/services/project.service';
import {
  AddProjectCostDto,
  AddUserToProjectDto,
  ChangeProjectStatusDto,
  CreateProjectDto,
  DeleteUserInProjectDto,
  GetAllProjectsParamDto,
  UpdateProjectCostDto,
  UpdateProjectDto,
  UpdateUserInProjectDto,
} from '@src/dto/project.dto';
import { NotFoundException } from '@src/config/custom-error.config';

const route = Router();

export default (app: Router) => {
  app.use('/projects', route);

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      let { page, limit, search, sort, status } = req.query as GetAllProjectsParamDto;
      (page = +page || 1),
        (limit = +limit || 100),
        (search = search || ''),
        (sort = +sort || 2),
        (status = +status || null);

      try {
        const projectService = Container.get(ProjectService);
        const result = await projectService.getAllProjects({ page, limit, search, sort, status });

        return res.status(200).json(result);
      } catch (error) {}
    },
  );

  route.post(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.createProject,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const projectService = Container.get(ProjectService);
        const result = await projectService.createProject(req.body as CreateProjectDto);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.get(
    '/:projectId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.findOne(projectId);
        if (!result) {
          throw new NotFoundException('findOneProject', 'Project not found');
        }

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:projectId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.updateProject,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.updateProject(projectId, req.body as UpdateProjectDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:projectId/status/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.changeProjectStatus,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.changeProjectStatus(
          projectId,
          req.body as ChangeProjectStatusDto,
        );
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.delete(
    '/:projectId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.deleteProject(projectId);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.post(
    '/:projectId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.addUserToProject,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.addUserToProject(
          projectId,
          req.body as AddUserToProjectDto,
        );

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:projectId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.updateUserInProject,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.updateUserInProject(
          projectId,
          req.body as UpdateUserInProjectDto,
        );

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.delete(
    '/:projectId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.deleteUserInProject,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.deleteUserInProject(
          projectId,
          req.body as DeleteUserInProjectDto,
        );

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.post(
    '/:projectId/costs/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.addProjectCost,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.addProjectCost(
          projectId,
          req.body as AddProjectCostDto,
        );

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:projectId/costs/:projectCostId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    projectValidators.updateProjectCost,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId, projectCostId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.updateProjectCost(
          +projectId,
          +projectCostId,
          req.body as UpdateProjectCostDto,
        );

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.delete(
    '/:projectId/costs/:projectCostId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { projectId, projectCostId } = req.params;
        const projectService = Container.get(ProjectService);
        const result = await projectService.deleteProjectCost(+projectId, +projectCostId);

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
