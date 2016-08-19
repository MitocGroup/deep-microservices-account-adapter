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
   */
  handle(data) {
    let User = this.kernel.get('db').get('User');
    User.deleteById(data.Id, (error) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return this.createResponse({}).send();
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
      }).required();
    };
  }
}
