'use strict';

import DeepFramework from 'deep-framework';

/**
 * Sample lambda runtime
 */
export default class extends DeepFramework.Core.AWS.Lambda.Runtime {
  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);

    this.exception = DeepFramework.Core.Exception;
  }

  /**
   * Handle lambda execution
   * @param {Object} data
   */
  handle(data) {
    let User = this.kernel.get('db').get('User');

    User.updateItem(data.Id, data, (error, user) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      this.createResponse(user).send();
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        Id: Joi.string().min(16).required(),
        Email: Joi.string().email(),
        Name: Joi.string().min(3),
        Nickname: Joi.string().min(3),
        NumberOfAccounts: Joi.number().min(0),
        Picture: Joi.string(),
        Roles: Joi.array().includes(Joi.string()).min(1),
      }).required();
    };
  }
}
