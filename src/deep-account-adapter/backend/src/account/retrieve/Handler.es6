'use strict';

import DeepFramework from 'deep-framework';

export default class extends DeepFramework.Core.AWS.Lambda.Runtime {

  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);

    this.exception = DeepFramework.Core.Exception;
    this.Account = this.kernel.get('db').get('Account');
  }

  handle(data) {
    if (data.Id) {
      this.retrieveAccountById(data.Id, (account) => {
        return this.createResponse(account).send();
      });
    } else if (data.UserId) {
      this.retrieveAccountsByUserId(data.UserId, (result) => {
        return this.createResponse(result).send();
      });
    } else {
      throw new this.exception.InvalidArgumentException(data.Id, 'string');
    }
  }

  /**
   *
   * @param {String} userId
   * @param {Function} callback
   */
  retrieveAccountsByUserId(userId, callback) {
    this.Account.scan().where('Users').contains(userId).loadAll().exec((error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(account.Items);
    });
  }

  /**
   *
   * @param {String} id
   * @param {Function} callback
   */
  retrieveAccountById(id, callback) {
    this.Account.findOneById(id, (error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(account ? account : null);
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        Id: Joi.string().guid(),
        UserId: Joi.string().min(16),
      }).required();
    };
  }
}
