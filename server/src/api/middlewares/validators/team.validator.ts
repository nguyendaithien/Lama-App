import { celebrate, Joi } from 'celebrate';

export default {
  createTeam: celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      avatar: Joi.string(),
    }),
  }),

  updateTeam: celebrate({
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      avatar: Joi.string(),
    }),
  }),

  changeTeamStatus: celebrate({
    body: Joi.object({
      isActive: Joi.boolean().required(),
    }),
  }),

  addUserToTeam: celebrate({
    body: Joi.object({
      isOwner: Joi.boolean(),
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      role: Joi.string().required(),
    }),
  }),

  updateUserInTeam: celebrate({
    body: Joi.object({
      isOwner: Joi.boolean().required(),
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      role: Joi.string().required(),
    }),
  }),

  deleteUserInTeam: celebrate({
    body: Joi.object({
      userId: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    }),
  }),
};
