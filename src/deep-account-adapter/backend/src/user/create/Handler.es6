'use strict';

import DeepFramework from 'deep-framework';

export default class extends DeepFramework.Core.AWS.Lambda.Runtime {
  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);
  }

  /**
   * @param {Object} data
   */
  handle(data) {
    let User = this.kernel.get('db').get('User');

    User.createItem(data, (error, user) => {
      if (error) {
        throw new DeepFramework.Core.Exception.DatabaseOperationException(error);
      }

      user = user.attrs;

      this._createDefaultAccount(user, (account) => {
        return this.createResponse(user).send();
      });
    });
  }

  /**
   * @param {Object} user
   * @param {Function} callback
   * @returns {Function}
   * @private
   */
  _createDefaultAccount(user, callback) {
    let accountData = {
      OwnerId: user.Id,
      Email: user.Email,
      Name: user.Name,
      Users: [user.Id],
      // @todo: [legacy] - find a better solution for marking an account
      Description: 'Default account',
      MarkedAs: 'Default',
    };

    let accountResource = this.kernel.get('resource').get('@deep-account-adapter:account');

    accountResource.request('create', accountData, 'POST').send((response) => {
      if (response.isError) {
        throw new DeepFramework.Core.Exception.Exception(response.error)
      }

      callback(response.data);
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
        Email: Joi.string().email().required(),
        Name: Joi.string().min(3).required(),
        Nickname: Joi.string().min(3).required(),
        NumberOfAccounts: Joi.number().min(0).required(),
        Picture: Joi.string().required(),
        Roles: Joi.array().includes(Joi.string()).min(1),
      }).required();
    };
  }
}
