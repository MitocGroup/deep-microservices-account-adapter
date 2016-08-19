'use strict';
'format es6';

/*eslint handle-callback-err: 0 */
/*eslint max-statements: 0 */
/*eslint no-return-assign: 0 */
/*eslint camelcase: 0 */

import moduleName from '../name';

class DeepAccountProvider {
  constructor($q, msAuthentication, UserManager, $rootScope) {
    this._$q                      = $q;
    this._account                 = {};
    this._accounts                = [];
    this._resources               = {};
    this._userId                  = '';
    this._user                    = null;
    this._userManager             = UserManager;
    this._ownedAccounts           = [];
    this._ready                   = this.$q.defer();
    this._loggedIn                = this.$q.defer();
    this._busy                    = true;
    this._$rootScope              = $rootScope;

    /** Define callback events **/
    this._callbacks               = {
      ACCOUNT_CHANGED: [],
      ACCOUNT_UPDATED: [],
      ACCOUNT_CREATED: [],
      ACCOUNTS_RETRIEVED: [],
      ACCOUNT_DELETED: [],
      ACCOUNT_USER_LINKED: [],
      ACCOUNT_USER_UNLINKED: [],
      ACCOUNT_LOGOUT: [],
    };

    // Cache init
    this.cache = DeepFramework.Kernel.get('cache');
    this.cache.noSilent = false;

    /** Register the resources **/
    let resources                       = DeepFramework.Kernel.container.get('resource');
    let accountResource                 = resources.get('@deep-account-adapter:account');

    this._resources.accountCreate       = accountResource.action('create');
    this._resources.accountRetrieve     = accountResource.action('retrieve');
    this._resources.accountDelete       = accountResource.action('delete');
    this._resources.accountUpdate       = accountResource.action('update');
    this._resources.accountLinkUser     = accountResource.action('link-user');
    this._resources.accountUnlinkUser   = accountResource.action('unlink-user');

    var init = () => {
      msAuthentication.promiseToken().then((token) => {
        this._user = token.user;
        this._userId = token.user.Id;

        this.retrieveAccounts().then((response) => {
          let i;
          for (i = 0; i < this.accounts.length; i++) {
            if (this.accounts[i].OwnerId === this.userId && this.accounts[i].MarkedAs === 'Default') {
              let temp = this.accounts[0];
              this.accounts[0] = this.accounts[i];
              this.accounts[i] = temp;
            }
          }

          this.cache.get('account', (err, result) => {
            if (result) {
              this.account = result;
            } else {
              this.account = this.accounts[0];
            }

            this._filterOwnedAccounts();
            this._ready.resolve(this.account);
            this._loggedIn.resolve(this.account);
          });
        });
      });
    };

    // Check if user is autheticated if not show login page
    msAuthentication.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        init();
      } else {
        this._ready.resolve(this.account);
      }
    });

    /** Register default callbacks **/
    this.registerAccountCreatedCallback(function(account) {
      this.accounts.push(account);
      this.ownedAccounts.push(account);
      if (this.accounts.length === 1) {
        this.account = this.accounts[0];
        this._ready.resolve(this.account);
        this._loggedIn.resolve(this.account);
      }
    }.bind(this));

    this.registerUserLinkedCallback(function(account) {
      let users = this._account.users;
      this._account = account;
      this._account.users = users;
      this.cache.set('account', this.account);
    }.bind(this));

    this.registerUserUnlinkedCallback(function(account) {
      let users = this._account.users;
      this._account = account;
      this._account.users = users;
      this.cache.set('account', this.account);
    }.bind(this));

    this.registerAccountUpdatedCallback(function(account) {
      this._account = account;
      this.cache.set('account', this.account);
    }.bind(this));

    this.registerAccountChangedCallback(function(account) {
      this.loadUsers(account);
    }.bind(this));

    msAuthentication.registerOnLogoutCallback(() => {
      this._account                 = {};
      this._accounts                = [];
      this._userId                  = '';
      this._user                    = null;
      this._userManager             = UserManager;
      this._ownedAccounts           = [];
      this.cache.invalidate('account');
      this._ready.resolve(this.account);
      this.runCallbacks('ACCOUNT_LOGOUT');
    });

    msAuthentication.registerOnAuthCallback(()=> {
      init();
    });
  }

  get $q() {
    return this._$q;
  }

  get resources() {
    return this._resources;
  }

  get account() {
    return this._account;
  }

  set account(account) {
    if (account && typeof account === 'object') {
      this._account = account;
      this.cache.set('account', account);
      this.runCallbacks('ACCOUNT_CHANGED', account);
    }
  }

  get accounts() {
    return this._accounts;
  }

  get ownedAccounts() {
    return this._ownedAccounts;
  }

  get userId() {
    return this._userId;
  }

  get user() {
    return this._user;
  }

  get callbacks() {
    return this._callbacks;
  }

  get userManager() {
    return this._userManager;
  }

  get ready() {
    return this._ready.promise;
  }

  get loggedIn() {
    return this._loggedIn.promise;
  }

  get busy() {
    return this._busy;
  }

  /**
   * Validates if the parameters object has no undefined fields
   * @param params
   * @returns {boolean}
   */
  static validateRequestParams(params) {
    for (let key of Object.keys(params)) {

      if (!params[key] || typeof params[key] === 'undefined') {
        return false;
      }

    }

    return true;
  }

  /**
   * Run registered callbacks on the specified event
   * @param event
   * @param data
   * @param additionalData
   */
  runCallbacks(event, data, requestInfo, additionalData) {
    let callbacksToRun = this.callbacks[event];

    if (callbacksToRun) {
      for (let callback of callbacksToRun) {
        callback(data, requestInfo, additionalData);
      }
    }
  }

  /**
   * Register callback to run when the accounts are retrieved
   * @param callback
   */
  registerAccountsRetrievedCallback(callback) {
    this.callbacks.ACCOUNTS_RETRIEVED.push(callback);
  }

  /**
   * Register callback to run when the active account is changed
   * @param callback
   */
  registerAccountChangedCallback(callback) {
    this.callbacks.ACCOUNT_CHANGED.push(callback);
  }

  /**
   * Register callback to run when the account is updated
   * @param callback
   */
  registerAccountUpdatedCallback(callback) {
    this.callbacks.ACCOUNT_UPDATED.push(callback);
  }

  /**
   * Register callback to run on account logout
   * @param callback
   */
  registerAccountLogoutCallback(callback) {
    this.callbacks.ACCOUNT_LOGOUT.push(callback);
  }

  /**
   * Register callback to run when account is deleted
   * @param callback
   */
  registerAccountDeletedCallback(callback) {
    this.callbacks.ACCOUNT_DELETED.push(callback);
  }

  /**
   * Register callback to run when account is created
   * @param callback
   */
  registerAccountCreatedCallback(callback) {
    this.callbacks.ACCOUNT_CREATED.push(callback);
  }

  /**
   * Register callback to run when a new user is linked
   * @param callback
   */
  registerUserLinkedCallback(callback) {
    this.callbacks.ACCOUNT_USER_LINKED.push(callback);
  }

  /**
   * Register callback to run when an user is unlinked fron an account
   * @param callback
   */
  registerUserUnlinkedCallback(callback) {
    this.callbacks.ACCOUNT_USER_UNLINKED.push(callback);
  }

  /**
   * Load info about users from account
   * @param {Object} account
   */
  loadUsers(account) {
    this.userManager.loadUsersById(account.Users).then(function(response) {
      let i;
      for (i = 0; i < response.length; i++) {
        if (response[i].Id === this.account.OwnerId) {
          let temp = response[0];
          response[0] = response[i];
          response[i] = temp;
        }
      }

      this._account.users = response;
    }.bind(this));
  }

  _filterOwnedAccounts() {
    let userAccounts = [];
    let i;
    for (i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].OwnerId === this.userId) {
        userAccounts.push(this.accounts[i]);
      }
    }

    this._ownedAccounts = userAccounts;
  }

  _excludeUser(userId) {
    let found = false;
    for (let i = 0; i < this._account.users.length && !found; i++) {
      if (this._account.users[i].Id === userId) {
        found = true;
        this._account.users.splice(i, 1);
      }
    }
  }

  _includeUser(user) {
    this._account.users.push(user);
  }

  /**
   * Call lambda to retrieve all the accounts for an user
   * @returns {*}
   */
  retrieveAccounts() {
    let retrieveAccountsLambda = this.resources.accountRetrieve;
    let defer                  = this.$q.defer();

    this._busy = true;

    retrieveAccountsLambda.request({UserId: this.userId}, 'GET').send(function(response) {
      if (response.error) {
        defer.reject(response);
      } else {
        response = response.data;
        defer.resolve(response);
        this._accounts = response;
        this.runCallbacks('ACCOUNTS_RETRIEVED', this.accounts);

        this._busy = false;
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * Creates an account
   * @param account
   * @returns {*}
   */
  createAccount(account) {
    let createAccountLambda = this.resources.accountCreate;
    let defer               = this.$q.defer();

    account.OwnerId = this.userId;
    account.Users = [this.userId];

    if (!DeepAccountProvider.validateRequestParams(account)) {
      defer.reject(`Invalid params for account: ${account}`);
      return defer.promise;
    }

    createAccountLambda.request(account, 'POST').send(function(response) {
      let requestInfo = {
        Resource: 'account',
        Action: createAccountLambda.name,
        ErrorMessage: String(response.error),
        RequestParameters: account,
        ResponseElements: response.data,
      };
      if (response.error) {
        defer.reject(response);
      } else {
        this.runCallbacks('ACCOUNT_CREATED', response.data, requestInfo);
        defer.resolve(response.data);
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * Update the specified account
   * @param account
   * @returns {*}
   */
  updateAccount(account) {
    let updateAccountLambda = this.resources.accountUpdate;
    let defer               = this.$q.defer();

    updateAccountLambda.request(account, 'PUT').send(function(response) {
      let requestInfo = {
        Resource: 'account',
        Action: updateAccountLambda.name,
        ErrorMessage: String(response.error),
        RequestParameters: account,
        ResponseElements: response.data,
      };
      if (response.error) {
        defer.reject(response);
      } else {
        this.runCallbacks('ACCOUNT_UPDATED', response.data, requestInfo);
        defer.resolve(response.data);
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * Delete an account
   * @param accountId
   * @returns {*}
   */
  deleteAccount(accountId) {
    let deleteAccountLambda = this.resources.accountDelete;
    let defer = this.$q.defer();
    let payload = {
      Id: accountId,
    };

    deleteAccountLambda.request(payload, 'DELETE').send(function(response) {
      let requestInfo = {
        Resource: 'account',
        Action: deleteAccountLambda.name,
        ErrorMessage: String(response.error),
        RequestParameters: payload,
        ResponseElements: response.data,
      };
      if (response.error) {
        defer.reject(response);
      } else {
        for (let i = 0; i < this.accounts.length; i++) {
          if (this.accounts[i].Id === accountId) {
            this.accounts.splice(i, 1);
            if (this.account.Id === accountId) {
              this.account = this.accounts[0];
            }
          }
        }

        this._filterOwnedAccounts();
        this.runCallbacks('ACCOUNT_DELETED', response.data, requestInfo);
        defer.resolve(response.data);
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * Link an user to an account
   * @param account
   * @param email
   * @returns {*}
   */
  linkUser(account, email) {
    let accountLinkUserLambda = this.resources.accountLinkUser;
    let defer                 = this.$q.defer();

    this._userManager.loadUserByEmail(email).then(function(response) {
      if (response.Items.length === 0) {
        defer.reject('User doesn\'t exist!');
      } else {
        let user = response.Items[0];
        let payload = {
          Id: account.Id,
          UserId: user.Id,
        };
        accountLinkUserLambda.request(payload).send(function(response) {
          let requestInfo = {
            Resource: 'account',
            Action: accountLinkUserLambda.name,
            ErrorMessage: String(response.error),
            RequestParameters: payload,
            ResponseElements: response.data,
          };
          if (response.error) {
            defer.reject(response);

          } else {
            this._includeUser(user);
            this.runCallbacks('ACCOUNT_USER_LINKED', response.data, requestInfo, user);
            defer.resolve(response.data);
          }
        }.bind(this), function(reason) {
          defer.reject(reason);
        });
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  /**
   * Unlink user from the an account
   * @param accountId
   * @param user
   * @returns {*}
   */
  unlinkUser(accountId, user) {
    let accountUnlinkUserLambda = this.resources.accountUnlinkUser;
    let defer                   = this.$q.defer();
    let payload = {
      Id: accountId,
      UserId: user.Id,
    };
    accountUnlinkUserLambda.request(payload).send(function(response) {
      let requestInfo = {
        Resource: 'account',
        Action: accountUnlinkUserLambda.name,
        ErrorMessage: String(response.error),
        RequestParameters: payload,
        ResponseElements: response.data,
      };
      if (response.error) {
        defer.reject(response);
      } else {
        this._excludeUser(user.Id);
        this.runCallbacks('ACCOUNT_USER_UNLINKED', response.data, requestInfo, user);
        defer.resolve(response.data);
      }
    }.bind(this));

    this._$rootScope.registerPromise(defer.promise);
    return defer.promise;
  }
}

angular.module(moduleName).service('deepAccount', ['$q', 'msAuthentication', 'DeepAccountUserManager',
  '$rootScope', (...args) => {
    return new DeepAccountProvider(...args);
  },
]);
