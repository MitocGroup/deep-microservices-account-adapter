'use strict';

import DeepFramework from 'deep-framework';

export default class Handler extends DeepFramework.Core.AWS.Lambda.Runtime {

  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);

    this.exception = DeepFramework.Core.Exception;
  }

  handle(data) {
    let Account = this.kernel.get('db').get('Account');

    Account.updateItem(data.Id, data, (error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return this.createResponse(account).send();
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        Id: Joi.string().guid().required(),
        OwnerId: Joi.string().min(16),
        Name: Joi.string().min(3),
        Email: Joi.string().email(),
        Users: Joi.array().includes(Joi.string().min(16)).min(1),
        Description: Joi.string().min(3),
        MarkedAs: Joi.string().min(3),
      }).required();
    };
  }
}
