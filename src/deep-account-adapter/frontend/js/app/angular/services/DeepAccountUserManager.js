'use strict';
'format es6';

import moduleName from '../name';

class DeepAccountUserManager{
  constructor($q, $rootScope) {
    this.deepResource = DeepFramework.Kernel.container.get('resource');
    this.userResource = this.deepResource.get('@deep-account-adapter:user');
    this._$rootScope = $rootScope;
    this._$q = $q;
  }
  /**
   * @param profile
   * @param token
   * @returns {promise}
   */
  createUser(profile, token) {
    var defer = this._$q.defer();

    var payload = {
      Id: token.identityId,
      Name: profile.name,
      Email: profile.email,
      Nickname: profile.nickname,
      NumberOfAccounts: 1,
      Picture: profile.picture,
    };

    this.userResource.request('create', payload, 'POST').send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * @param {String} identityId
   * @returns {promise}
   */
  loadUserByIdentityId(identityId) {
    var defer = this._$q.defer();

    var payload = {
      Id: identityId,
    };

    this.userResource.request('retrieve', payload).retry(3).send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * @param {String} email
   * @returns {promise}
   */
  loadUserByEmail(email) {
    var defer = this._$q.defer();

    var payload = {
      Email: email,
    };

    this.userResource.request('retrieve', payload).retry(3).send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * @param {Array} ids
   * @returns {promise}
   */
  loadUsersById(ids) {
    var defer = this._$q.defer();

    var payload = {
      Ids: ids,
    };

    this.userResource.request('retrieve', payload).retry(3).send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * @return {promise}
   */
  updateUser(user) {
    var defer = this._$q.defer();

    if (typeof (user.Selected) !== 'undefined') {
      delete user.Selected;
    }

    var payload = {
      Id: user.Id,
      Email: user.Email,
      Name: user.Name,
      Nickname: user.Nickname,
      Roles: user.Roles,
    };

    this.userResource.request('update', payload).send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * @return {promise}
   */
  deleteUser(user) {
    var defer = this._$q.defer();

    var payload = {
      Id: user.Id,
    };

    this.userResource.request('delete', payload).send((response) => {
      if (response.isError) {
        defer.reject(response.error);
      } else {
        defer.resolve(response.data);
      }
    });

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }
}

angular.module(moduleName).service('DeepAccountUserManager', ['$q', '$rootScope', (...args) => {
  return new DeepAccountUserManager(...args);
},
]);
