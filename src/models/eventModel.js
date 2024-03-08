const Joi = require("joi");

const Event = {
  name: "",
  description: "",
  longDescription: "",
  creationDate: "",
  user: {},
  roleId: 0,
  address: {},
};

const eventSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  longDescription: Joi.string().required(),
  ownerId: Joi.string().required(),
});

module.exports = { Event, eventSchema };
