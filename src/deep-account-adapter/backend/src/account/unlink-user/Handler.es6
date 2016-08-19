'use strict';

import DeepFramework from 'deep-framework';
import {UserNotFoundInAccountException} from './Exceptions/UserNotFoundInAccountException';

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
    this.unlinkUser(data, (account) => {
      return this.createResponse(account).send();
    });
  }

  unlinkUser(data, callback) {
    this.Account.findOneById(data.Id, (error, account) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      account = account.get();
      let index = account.Users.indexOf(data.UserId);
      if (index === -1) {
        throw new UserNotFoundInAccountException(account.Id, data.UserId);
      } else {
        account.Users.splice(index, 1);
        this.Account.updateItem(account.Id, account, (error, account) => {
          if (error) {
            throw new this.exception.DatabaseOperationException(error);
          }

          callback(account);
        });
      }
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
