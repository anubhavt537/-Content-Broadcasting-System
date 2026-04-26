import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('teacher', 'principal').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


export const uploadSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  subject: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional().allow(''),

  start_time: Joi.date().required(),
  end_time: Joi.date().greater(Joi.ref('start_time')).required(),

  duration: Joi.number().integer().min(1).max(120).optional(),
});


export const rejectSchema = Joi.object({
  rejection_reason: Joi.string().min(5).max(500).required(),
});