'use strict';
'format es6';

/*eslint camelcase: 0 */

import moduleName from '../name';
const auth0_ = Symbol();
const onAuthCbList_ = Symbol();
const onLogOutCbList_ = Symbol();

class MsAuthentication {

  /**
   * @param $injector
   * @param $document
   * @param LxNotificationService
   */
  constructor($injector, $document, LxNotificationService) {
    this.cache = DeepFramework.Kernel.get('cache');
    this.cache.namespace = 'deep-marketplace.';
    this.cache.noSilent = false;

    this[auth0_] = $injector.get('auth');
    this.$q = $injector.get('$q');
    this.LxNotificationService = LxNotificationService;

    this[auth0_].hookEvents();

    MsAuthentication.$injector = $injector;

    this.tokenPromise = this.$q.defer();
    this.$modal = $injector.get('$modal');
    this.$state = $injector.get('$state');
    this._ready = this.$q.defer();
    this._logOutPromise = this.$q.defer();
    this.anonymousDefer = this.$q.defer();

    this.deepAsset = DeepFramework.Kernel.container.get('asset');
    this.deepSecurity = DeepFramework.Kernel.container.get('security');
    this[onAuthCbList_] = [];
    this[onLogOutCbList_] = [];

    // Next function here for auto-restoring auth state.
    this.restoreAuthentication();

    /**
     * Hide  Auth0 after going to another view
     */
    this.$rootScope = $injector.get('$rootScope');
    this.$rootScope.$on('$stateChangeStart', (event, toState, toParams)=> {
      this[auth0_].config.auth0lib.hide();
    });

    /**
     * Handler for closing login popup with ESC Key
     */
    $document.on('keyup', (e) => {
      if (e.keyCode === 27) {
        this[auth0_].config.auth0lib.hide();
      }
    });
  }

  /**
   * Is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    let $injector = MsAuthentication.$injector;
    let $q = $injector.get('$q');
    let defer = $q.defer();
    let jwtHelper = $injector.get('jwtHelper');

    // Check if there is a token and if it's valid
    if (!this[auth0_].isAuthenticated) {
      this.getStoredToken().then((token)=> {
        defer.resolve(token && !jwtHelper.isTokenExpired(token));
      });
    } else {
      defer.resolve(true);
    }


    return defer.promise;
  }

  get ready() {
    return this._ready.promise;
  }

  /**
   * On logout promise
   * @returns {Object}
   */
  get onLogOutPromise() {
    return this._logOutPromise.promise;
  }

  /**
   * Returns the redirect UI router state if set
   * @returns {string}
   */
  getRedirectState() {
    let defer = this.$q.defer();
    this.cache.get('stateName', function (error, result) {
      if (result) {
        defer.resolve(result);
      } else {
        defer.resolve(null);
      }
    });

    return defer.promise;
  }

  /**
   * Sets redirect UI router state after sign in
   * @param stateName
   * @returns {MsAuthentication}
   */
  setRedirectState(stateName) {
    if (stateName && stateName.length) {
      this.cache.set('stateName', stateName);
    } else {
      this.cache.invalidate('stateName');
    }

    return this;
  }

  /**
   * Returns redirect UI router state params if set
   * @returns {Object}
   */
  getRedirectStateParams() {
    let defer = this.$q.defer();
    try {
      this.cache.get('stateParams', function (error, result) {
        let stateParams = JSON.parse(result);
        defer.resolve(stateParams);
      });
    } catch (e) {
      defer.resolve({});
    }

    return defer.promise;
  }

  /**
   * Returns redirect UI router location search params if set
   * @returns {Object}
   */
  getRedirectStateSearchParams() {
    let defer = this.$q.defer();
    try {
      this.cache.get('searchParams', function (error, result) {
        let searchParams = JSON.parse(result);
        defer.resolve(searchParams);
      });
    } catch (e) {
      defer.resolve({});
    }

    return defer.promise;
  }

  /**
   * Sets redirects UI router state params
   * @param stateParams
   * @returns {MsAuthentication}
   */
  setRedirectStateParams(stateParams) {
    if (stateParams && angular.isObject(stateParams)) {
      this.cache.set('stateParams', JSON.stringify(stateParams));
    } else {
      this.cache.invalidate('stateParams');
    }

    return this;
  }

  /**
   * setRedirectStateSearchParams
   * @param searchParams
   * @returns {MsAuthentication}
   */
  setRedirectStateSearchParams(searchParams) {
    if (searchParams && angular.isObject(searchParams)) {
      this.cache.set('searchParams', JSON.stringify(searchParams));
    } else {
      this.cache.invalidate('searchParams');
    }

    return this;
  }

  /**
   * Checks access to an UI route
   * @param event
   * @param toState
   * @param toParams
   */
  checkAccess(event, toState, toParams) {
    if (!this.isAuthenticated && this.isPrivateState(toState)) {
      if (toState.name !== 'signin') {
        event.preventDefault();

        let $location = MsAuthentication.$injector.get('$location');
        let toSearchParams = $location.search();

        //Store the state before signin to redirect to after SAML redirection
        this.setRedirectState(toState.name);
        this.setRedirectStateParams(toParams);
        this.setRedirectStateSearchParams(toSearchParams);
      }
    }
  }

  /**
   * Define explicitly data.public = true on each public state
   * @param toState
   * @returns {boolean}
   */
  isPrivateState(toState) {
    //States are implicitly considered private unless not specified otherwise
    return (typeof toState.data === 'undefined' ||
      typeof toState.data.public === 'undefined' || !toState.data.public);
  }

  /**
   *@return {Promise}
   */
  anonymousLogin() {
    return new Promise((resolve, reject) => {
      this.deepSecurity.anonymousLogin((error, response) => {
        if (response) {
          resolve(response);
        } else {
          reject(error);
        }
      });
    });
  }

  /**
   * @param profile
   * @returns {promise}
   */
  authenticatedLogin(profile) {
    var $injector = MsAuthentication.$injector;
    var defer = $injector.get('$q').defer();
    var $rootScope = $injector.get('$rootScope');

    if (this.isTokenExpired(profile)) {
      this.signOut();
      defer.reject('Access token is expired!');
      return defer.promise;
    }

    let identity = profile.identities[0];
    this.deepSecurity.login(identity.provider, identity, (error, securityToken)=> {
      if (error) {
        this.LxNotificationService.error(error);
        this.signOut();
        defer.reject(error);
      } else {
        securityToken.registerTokenExpiredCallback((identityProvider) => {
          this.signOut(() => {
            this.$state.reload().then(() => {
              setTimeout(() => {
                this.LxNotificationService.info('Your session has expired. Please log in again');
              }, 1000);
            });
          });
        });

        var userManager = MsAuthentication.$injector.get('DeepAccountUserManager');

        userManager.loadUserByIdentityId(securityToken.identityId)
          .then((data) => {
            var userLoadedCallback = (user) => {
              securityToken.user = user;
              defer.resolve(securityToken);

              $rootScope.$emit('USER_AUTHENTICATED', profile);

              if (!$rootScope.$$phase) {
                $rootScope.$apply();
              }
            };

            if (data) {
              userLoadedCallback(data);
            } else {
              userManager.createUser(profile, securityToken)
                .then((data) => {
                  userLoadedCallback(data)
                })
                .catch((error) => {
                  this.signOut();
                  defer.reject(error);
                });
            }
          })
          .catch((error) => {
            this.signOut();
            defer.reject(error);
          });
      }
    });

    $rootScope.registerPromise(defer.promise);
    return defer.promise;
  }

  authenticateByStoredData(token, cb = () => {
  }) {
    this.getStoredProfile().then((storedProfile)=> {
      this[auth0_].authenticate(storedProfile, token).then(()=> {
        this.cache.get('profile', (error, profile)=> {
          this.authenticatedLogin(profile).then((securityToken) => {
            this.securityToken = securityToken;
            this.anonymousDefer.resolve(securityToken);
            this.tokenPromise.resolve(securityToken);
            this._ready.resolve(securityToken);
            this.onAuthenticated();
            if (typeof cb === 'function') {
              cb();
            }
          });
        });
      });
    });
  }

  /**
   * Restore authentication
   * @returns {promise}
   */
  restoreAuthentication() {
    let $injector = MsAuthentication.$injector;
    let jwtHelper = $injector.get('jwtHelper');

    // Chech if you are authenticated and log you with token from local storage
    this.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        this.getStoredToken().then((token)=> {
          if (token && !jwtHelper.isTokenExpired(token)) {
            this.authenticateByStoredData(token);
          }

        });
      } else {

        // if you are not authenticated, log you as anonymous user
        this.anonymousLogin().then((token) => {
          this.anonymousDefer.resolve(token);
        }, (error) => {
          this.anonymousDefer.reject(error);
        });
      }

    });
  }

  /**
   * @param isClosable
   * @param isPopup
   * @param mode
   * @returns {promise}
   */
  auth0Login(isClosable, isPopup, mode = 'signin') {
    var $injector = MsAuthentication.$injector;
    var $q = $injector.get('$q');
    var defer = $q.defer();

    let idpAuth = () => {
      let auth0Config = this.getAuth0Config();
      auth0Config.signin.closable = isClosable;
      auth0Config.signin.popup = isPopup;
      auth0Config.signin.mode = mode;

      if (!isPopup) {
        auth0Config.signin.container = 'auth0-widget';
      } else if ('container' in auth0Config.signin) {
        delete auth0Config.signin.container;
      }

      this[auth0_].signin(auth0Config.signin, () => {
        this.onAuthenticated();
        defer.resolve();
      });
    };

    // Login using token if they token is missing create it and login
    this.isAuthenticated().then((authenticated) => {
      if (authenticated) {
        this.getStoredToken().then((token)=> {
          this.authenticateByStoredData(token, ()=> {
            defer.resolve(token);
          });
        });
      } else {
        idpAuth();
      }
    });

    return defer.promise;
  }

  /**
   * @param {Boolean} isClosable
   * @param {Boolean} isPopup
   * @returns {Promise}
   */
  signUp(isClosable = true, isPopup = true) {
    return this.auth0Login(isClosable, isPopup, 'signup');
  }

  /**
   * @param {Function} cb
   */
  signOut(cb = () => {
  }) {
    this[auth0_].signout();

    if (typeof cb === 'function') {
      cb();
    }
  }

  /**
   * Fetch profile data
   * @returns {Object}
   */
  profile() {
    return this[auth0_].profile;
  }

  /**
   * Fetch profile data
   * @returns {Object}
   */
  token() {
    return this.securityToken;
  }

  /**
   * Fetch profile data
   * @returns {*}
   */
  profilePromise() {
    return this[auth0_].profilePromise;
  }

  promiseToken() {
    return this.tokenPromise.promise;
  }

  /**
   * @returns {Promise}
   */
  get anonymousPromise() {
    return this.anonymousDefer.promise;
  }

  /**
   * @returns {Object}
   */
  getAuth0Config() {
    // fallback to auth0 params from deep-account-adapter
    let auth0Config = DeepFramework.Kernel.config.globals.auth0 ||
      DeepFramework.Kernel.config.microservices['deep-account-adapter'].parameters.auth0;

    if (auth0Config.signin.connections && !(auth0Config.signin.connections instanceof Array)) {
      auth0Config.signin.connections = auth0Config.signin.connections.split(',').map((connection) => {
        return connection.trim();
      });
    }


    return auth0Config;
  }

  /**
   * Retrieves the token
   * @returns {string}
   */
  getStoredToken() {
    let defer = this.$q.defer();
    this.cache.get('idToken', (error, result)=> {
      if (result) {
        defer.resolve(result);
      } else {
        defer.resolve(null);
      }
    });

    return defer.promise;
  }

  /**
   * Retrieves the profile
   * @returns {Object}
   */
  getStoredProfile() {
    let defer = this.$q.defer();
    this.cache.get('profile', (error, result)=> {
      if (result) {
        defer.resolve(result);
      } else {
        defer.resolve(null);
      }
    });

    return defer.promise;
  }

  /**
   *
   * @param {Number} minutes
   * @returns {String}
   */
  addMinutesToCurrentTime(minutes) {
    let date = new Date();
    date = date.setMinutes(date.getMinutes() + minutes);
    return new Date(date).toISOString();
  }

  /**
   *
   * @param {Object} profile
   * @returns {boolean}
   */
  isTokenExpired(profile) {
    if (profile && profile.identities[0]) {
      return new Date().getTime() > new Date(profile.identities[0].tokenExpirationTime).getTime();
    }

    return true;
  }

  /**
   * onAuthenticated
   */
  onAuthenticated() {
    this[auth0_].profilePromise.then((profile)=> {
      /*Call the on auth callbacks*/
      let $rootScope = MsAuthentication.$injector.get('$rootScope');
      $rootScope.profile = profile;

      if (!$rootScope.$$phase) {
        $rootScope.$apply();
      }

      let cb;
      for (cb of this[onAuthCbList_]) {
        cb(profile);
      }
    });
  }

  /**
   * On auth0 login success callback
   * Redirected from IdP website
   * @param profilePromise
   * @param idToken
   * @param accessToken
   */
  onLoginSuccess(profilePromise, idToken, accessToken) {
    profilePromise.then((profile) => {
      profile = this.adjustProfile(profile, idToken);

      this.cache.set('profile', profile);
      this.cache.set('idToken', idToken);
      this.cache.set('accessToken', accessToken);

      this.LxNotificationService.success('Welcome! You have been successfully logged in');
      this.authenticatedLogin(profile).then((securityToken) => {
        this.tokenPromise.resolve(securityToken);
        this._ready.resolve(securityToken);
      });
    });
  }

  /**
   * onLogout
   */
  onLogout() {
    this.isAuthenticated().then((isLoggedIn) => {
      let $injector = MsAuthentication.$injector;
      let $rootScope = $injector.get('$rootScope');

      if (isLoggedIn || $rootScope.profile) {
        $rootScope.$broadcast('Logout');

        delete $rootScope.profile;
        this.cache.invalidate('profile');
        this.cache.invalidate('idToken');
        this.cache.invalidate('accessToken');
        this.cache.invalidate('searchParams');
        this._logOutPromise.resolve();

        this[auth0_].profile = {};
        this[auth0_].profilePromise = $injector.get('$q').defer();
        this.tokenPromise = $injector.get('$q').defer();
        this._ready = $injector.get('$q').defer();
        this.LxNotificationService.success('User has successfully logged out');
        this.deepSecurity.logout();

        $rootScope.$emit('USER_LOGOUT', this[auth0_].profile);

        this.anonymousLogin().then((token) => {
          this.anonymousDefer.resolve(token);

          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        }, (error) => {
          this.anonymousDefer.reject(error);
        });

        let cb;
        for (cb of this[onLogOutCbList_]) {
          cb();
        }
      }
    });
  }

  /**
   * onLoginFailure
   * @param error
   */
  onLoginFailure(error) {
    var $log = MsAuthentication.$injector.get('$log');

    $log.debug('onLoginFailure');
    $log.debug(error);
  }

  /**
   * onForbidden
   */
  onForbidden() {
    var $log = MsAuthentication.$injector.get('$log');

    $log.debug('onForbidden');
  }

  /**
   * Adjust auth0 profile to be used for logging with Cognito (e.g. deepSecurity.login(provider, profile) )
   *
   * @param {Object} profile
   * @param {String} idToken
   * @returns {Object}
   */
  adjustProfile(profile, idToken) {
    let identity = profile.identities[0];

    //Amazon access tokens are only valid for sixty minutes (https://auth0.com/docs/tokens/idp)
    //https://developer.amazon.com/public/apis/engage/login-with-amazon/docs/access_token.html
    identity.tokenExpirationTime = this.addMinutesToCurrentTime(60);

    // when signin with auth0 with database connection "idToken" is used as an access_token for Cognito
    identity.access_token = idToken;

    return profile;
  }

  /**
   * Registers callbacks once the user has authenticated
   * @param cb
   * @returns {MsAuthentication}
   */
  registerOnAuthCallback(cb = function () {
  }) {
    if (typeof cb === 'function') {
      this[onAuthCbList_].push(cb);
    }

    return this;
  }

  /**
   * Registers callbacks once the user has logout
   * @param cb
   * @returns {MsAuthentication}
   */
  registerOnLogoutCallback(cb = function () {
  }) {
    if (typeof cb === 'function') {
      this[onLogOutCbList_].push(cb);
    }

    return this;
  }
}

angular.module(moduleName).provider('msAuthentication', function () {
  // fallback to auth0 params from deep-account-adapter
  var auth0Config = DeepFramework.Kernel.config.globals.auth0 ||
    DeepFramework.Kernel.config.microservices['deep-account-adapter'].parameters.auth0;
  var serviceInitialized_ = false;

  /**
   * init msAuthentication provider
   * @param $httpProvider
   * @param authProvider
   * @param jwtInterceptorProvider
   */
  function init($httpProvider, authProvider, jwtInterceptorProvider) {
    if (serviceInitialized_) {
      throw new Error('Auth service already initialized');
    }

    authProvider.init(auth0Config.init);

    $httpProvider.interceptors.push('jwtInterceptor');

    jwtInterceptorProvider.tokenGetter = ['msAuthentication', function tokenGetter(msAuthentication) {
      msAuthentication.getStoredToken().then(function (token) {
        return token;
      });
    },
    ];

    /*Register Auth0 event callbacks*/
    authProvider.on('authenticated', ['msAuthentication',
      function authenticated(msAuthentication) {
        msAuthentication.onAuthenticated();
      },

    ]);

    authProvider.on('loginSuccess', ['profilePromise', 'idToken', 'accessToken', 'msAuthentication',
      function loginSuccess(profilePromise, idToken, accessToken, msAuthentication) {
        msAuthentication.onLoginSuccess(profilePromise, idToken, accessToken);
      },

    ]);

    authProvider.on('loginFailure', ['error', 'msAuthentication',
      function loginFailure(error, msAuthentication) {
        msAuthentication.onLoginFailure(error);
      },

    ]);

    authProvider.on('forbidden', ['msAuthentication',
      function forbidden(msAuthentication) {
        msAuthentication.onForbidden();
      },

    ]);

    authProvider.on('logout', ['msAuthentication', (msAuthentication) => {
      msAuthentication.onLogout();
    },

    ]);
  }

  return {
    init: init,
    $get: ['$injector', '$document', 'LxNotificationService', function ($injector, $document, LxNotificationService) {
      var msAuthentication = new MsAuthentication($injector, $document, LxNotificationService);
      return msAuthentication;
    },
    ],
  };
});
