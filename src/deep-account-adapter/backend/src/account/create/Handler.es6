'use strict';

import DeepFramework from 'deep-framework';

export default class extends DeepFramework.Core.AWS.Lambda.Runtime {

  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);

    this.exception = DeepFramework.Core.Exception;
  }

  handle(data) {
    this.createAccount(data, (error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return this.createResponse(account).send();
    });
  }

  /**
   * Create account
   * @param data
   * @param callback
   */
  createAccount(data, callback) {
    let Account = this.kernel.get('db').get('Account');

    Account.createItem(data, (error, account) => {
      callback(error, account);
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        OwnerId: Joi.string().min(16).required(),
        Name: Joi.string().min(3).required(),
        Email: Joi.string().email(),
        Users: Joi.array().includes(Joi.string().min(16)).min(1).required(),
        Description: Joi.string().min(3),
        MarkedAs: Joi.string().min(3),
      }).required();
    };
  }
}

