import { celebrate, Joi } from 'celebrate';

import { VIETNAMESE_PHONE_REGEX } from '@src/config/constants';

export default {
  createUser: celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(VIETNAMESE_PHONE_REGEX),
      avatar: Joi.string().uri(),
    }),
  }),

  updateUser: celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(VIETNAMESE_PHONE_REGEX),
      avatar: Joi.string().uri(),
    }),
  }),

  changeUserStatus: celebrate({
    body: Joi.object({
      isActive: Joi.boolean().required(),
    }),
  }),
};
