const Joi = require('joi')
module.exports = {
  successfull: Joi.object({
    expiresIn: Joi.number(),
    token: [
      Joi.string(),
      Joi.number(),
    ],
  }),
  errorCredentials: Joi.object({
    code: Joi.string().valid('CCA-002'),
    message: Joi.string().valid('The credentials are invalid.'),
    shortMessage: Joi.string().valid('CustomerAccessInvalidCredentials'),
  }),
  otherErrors: Joi.object({
    code: Joi.string().valid('val-001'),
    message: Joi.string().valid('Validation Error'),
    shortMessage: Joi.string().valid('validationError'),
    details: Joi.array(),
  }),
  authorizerValidation: Joi.object().valid('ok'),
  notAuthorized: Joi.object({
    message: Joi.string().valid('User is not authorized to access this resource with an explicit deny'),
  }),
}
