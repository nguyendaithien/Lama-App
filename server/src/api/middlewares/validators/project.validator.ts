import { celebrate, Joi } from 'celebrate';

import { ProjectStatus } from '@src/entities/project.entity';

export default {
  createProject: celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      avatar: Joi.string(),
      income: Joi.number(),
      startTime: Joi.string().isoDate(),
      endTime: Joi.string().isoDate(),
      status: Joi.string().valid(
        ProjectStatus.CANCELED,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.COMPLETED,
      ),
    }),
  }),

  updateProject: celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      avatar: Joi.string(),
      income: Joi.number(),
      startTime: Joi.string().isoDate(),
      endTime: Joi.string().isoDate(),
      status: Joi.string().valid(
        ProjectStatus.CANCELED,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.COMPLETED,
      ),
    }),
  }),

  changeProjectStatus: celebrate({
    body: Joi.object({
      status: Joi.string().valid(
        ProjectStatus.CANCELED,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.COMPLETED,
      ),
    }),
  }),

  addUserToProject: celebrate({
    body: Joi.object({
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      role: Joi.string().required(),
      wage: Joi.number(),
    }),
  }),

  updateUserInProject: celebrate({
    body: Joi.object({
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      role: Joi.string().required(),
      wage: Joi.number(),
    }),
  }),

  deleteUserInProject: celebrate({
    body: Joi.object({
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    }),
  }),

  addProjectCost: celebrate({
    body: Joi.object({
      title: Joi.string().required(),
      value: Joi.number(),
    }),
  }),

  updateProjectCost: celebrate({
    body: Joi.object({
      title: Joi.string().required(),
      value: Joi.number(),
    }),
  }),
};
