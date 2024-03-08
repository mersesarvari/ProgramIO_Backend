const Joi = require("joi");

class Event {
  constructor(
    name,
    description,
    longDescription,
    creationDate,
    user,
    roleId,
    address
  ) {
    this.id = guid();
    this.name = name;
    this.description = description;
    this.longDescription = longDescription;
    this.creationDate = creationDate;
    this.user = user;
  }
}

const eventSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  longDescription: Joi.string().required(),
  ownerId: Joi.string().required(),
});

module.exports = { Event, eventSchema };
