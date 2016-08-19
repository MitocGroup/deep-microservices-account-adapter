'use strict';

import DeepFramework from 'deep-framework';
import {UserAlreadyLinkedException} from './Exceptions/UserAlreadyLinkedException';

export default class extends DeepFramework.Core.AWS.Lambda.Runtime {

  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);

    this.exception = DeepFramework.Core.Exception;
  }

  handle(data) {
    this.linkUser(data, (account) => {
      return this.createResponse(account).send();
    });
  }

  /**
   *
   * @param {Object} data
   * @param {Function} callback
   */
  linkUser(data, callback) {
    let Account = this._kernel.get('db').get('Account');

    Account.findOneById(data.Id, (error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      account = account.get();
      if (account.Users.indexOf(data.UserId) !== -1) {
        throw new UserAlreadyLinkedException(account.Id, data.UserId);
      }

      account.Users.push(data.UserId);
      Account.updateItem(account.Id, account, (error, account) => {
        if (error) {
          throw new this.exception.DatabaseOperationException(error);
        }

        callback(account);
      });
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
        UserId: Joi.string().min(16).required(),
      }).required();
    };
  }
}
