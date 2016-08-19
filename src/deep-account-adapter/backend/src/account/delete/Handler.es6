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
    this.deleteAccount(data.Id, (error) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return this.createResponse({}).send();
    });
  }

  /**
   *
   * @param {String} id
   * @param {Function} callback
   */
  deleteAccount(id, callback) {
    let Account = this.kernel.get('db').get('Account');

    Account.deleteById(id, (error) => {
      callback(error);
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        Id: Joi.string().guid().required()
      }).required();
    };
  }
}
