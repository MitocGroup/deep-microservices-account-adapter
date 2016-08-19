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
    this.User = this.kernel.get('db').get('User');
  }

  /**
   * Handle lambda execution
   * @param {Object} data
   */
  handle(data) {
    if (data.Id) {
      this.retrieveById(data.Id, (user) => {
        return this.createResponse(user).send();
      });

    } else if (data.Email) {
        this.retrieveByEmail(data.Email, (user) => {
          return this.createResponse(user).send();
        });

    } else if (data.Ids) {
      this.retrieveByIds(data.Ids, (users) => {
        return this.createResponse(users).send();
      });

    } else {

      // temporary hook!
      // @todo: remove possibility to retrieve all users...
      //throw new this.exception.InvalidArgumentException(data.Id, 'string');

      this.retrieveAll((users) => {
        return this.createResponse(users).send();
      });
    }
  }

  /**
   *
   * @param {Function} callback
   */
  retrieveAll(callback) {
    this.User.findAll((error, users) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(users);
    });
  }

  /**
   *
   * @param {String} id
   * @param {Function} callback
   */
  retrieveById(id, callback) {
    this.User.findOneById(id, (error, user) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(user);
    });
  }

  /**
   *
   * @param {String} email
   * @param {Function} callback
   */
  retrieveByEmail(email, callback) {
    this.User.findAllBy('Email', email, (error, user) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(user);
    });
  }

  /**
   *
   * @param {Array} ids
   * @param {Function} callback
   */
  retrieveByIds(ids, callback) {
    this.User.getItems(ids, (error, users) => {
      if (error) {
        throw new this.exception.DatabaseOperationException(error);
      }

      return callback(users);
    });
  }

  /**
   * Validation schema for request data
   * @returns {Object}
   */
  get validationSchema() {
    return (Joi) => {
      return Joi.object().keys({
        Id: Joi.string().min(16),
        Email: Joi.string().email(),
        Ids: Joi.array().includes(Joi.string().min(16)).min(1),
      }).required();
    };
  }
}
