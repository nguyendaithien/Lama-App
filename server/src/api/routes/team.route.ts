import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';

import middlewares from '@src/api/middlewares';
import { UserRole } from '@src/entities/user.entity';
import { teamValidators } from '@src/api/middlewares/validators';
import TeamService from '@src/services/team.service';
import {
  AddUserToTeamDto,
  ChangeTeamStatusDto,
  CreateTeamDto,
  DeleteUserInTeamDto,
  GetAllTeamsParamsDto,
  UpdateTeamDto,
  UpdateUserInTeamDto,
} from '@src/dto/team.dto';
import { NotFoundException } from '@src/config/custom-error.config';

const route = Router();

export default (app: Router) => {
  app.use('/teams', route);

  route.get(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      let { page, limit, search, sort, status } = req.query as GetAllTeamsParamsDto;
      (page = +page || 1),
        (limit = +limit || 100),
        (search = search || ''),
        (sort = +sort || 2),
        (status = +status || null);

      try {
        const teamService = Container.get(TeamService);
        const result = await teamService.findAllTeams({ page, limit, search, sort, status });

        return res.status(200).json(result);
      } catch (error) {}
    },
  );

  route.post(
    '/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.createTeam,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const teamService = Container.get(TeamService);
        const result = await teamService.createTeam(req.body as CreateTeamDto);
        return res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.get(
    '/:teamId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.findOne(teamId);
        if (!result) {
          throw new NotFoundException('findOneTeam', 'Team not found');
        }

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:teamId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.updateTeam,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.updateTeam(teamId, req.body as UpdateTeamDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:teamId/status/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.changeTeamStatus,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.changeTeamStatus(teamId, req.body as ChangeTeamStatusDto);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.delete(
    '/:teamId',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.deleteTeam(teamId);
        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.post(
    '/:teamId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.addUserToTeam,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.addUserToTeam(teamId, req.body as AddUserToTeamDto);

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.put(
    '/:teamId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.updateUserInTeam,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.updateUserInTeam(teamId, req.body as UpdateUserInTeamDto);

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  route.delete(
    '/:teamId/users/',
    middlewares.isAuth,
    middlewares.checkRole([UserRole.ADMIN]),
    middlewares.checkPermission,
    teamValidators.deleteUserInTeam,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { teamId } = req.params;
        const teamService = Container.get(TeamService);
        const result = await teamService.deleteUserInTeam(teamId, req.body as DeleteUserInTeamDto);

        return res.status(200).json(result);
      } catch (err) {
        next(err);
      }
    },
  );
};
