import moduleName from '../name';

class DeepAccountStateManager {
  /**
   *
   * @param msAuthentication
   * @param $state
   * @param $location
   */
  constructor(msAuthentication, $state, $location) {
    this.msAuthentication = msAuthentication;
    this.kernel = DeepFramework.Kernel
    this.cache = this.kernel.get('cache');
    this.$state = $state;
    this.$location = $location;
  }

  /**
   *
   * @param stateName
   */
  goToState(stateName) {
    this.$state.go(stateName);
  }

  /**
   * Get stored state and go to it, if doesn't exist stored state, go to library page
   */
  goToStoredState() {
    this.getRedirectState().then((redirectToState) => {
      this.getRedirectStateParams().then((redirectToStateParams) => {
        if (redirectToState) {
          this.setRedirectState(null);
          this.setRedirectStateParams(null);
          this.$state.go(redirectToState, redirectToStateParams);
        } else {
          this.$state.go('app.library');
        }
      });
    });
  }

  /**
   * Returns the redirect UI router state if set
   * @returns {Promise}
   */
  getRedirectState() {
    return new Promise((resolve) => {
      this.cache.get('stateName', (error, result) => {
        if (result) {
          resolve(result);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Sets redirect UI router state after sign in
   * @param {String} stateName
   */
  setRedirectState(stateName) {
    if (stateName && stateName.length) {
      this.cache.set('stateName', stateName);
    } else {
      this.cache.invalidate('stateName');
    }
  }

  /**
   * Returns redirect UI router state params if set
   * @returns {Promise}
   */
  getRedirectStateParams() {
    return new Promise((resolve) => {
      try {
        this.cache.get('stateParams', (error, result) => {
          let stateParams = JSON.parse(result);
          resolve(stateParams);
        });
      } catch (e) {
        resolve({});
      }
    });
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
   * @param {Object} stateParams
   */
  setRedirectStateParams(stateParams) {
    if (stateParams && angular.isObject(stateParams)) {
      this.cache.set('stateParams', JSON.stringify(stateParams));
    } else {
      this.cache.invalidate('stateParams');
    }
  }

  /**
   * setRedirectStateSearchParams
   * @param {Object} searchParams
   */
  setRedirectStateSearchParams(searchParams) {
    if (searchParams && angular.isObject(searchParams)) {
      this.cache.set('searchParams', JSON.stringify(searchParams));
    } else {
      this.cache.invalidate('searchParams');
    }
  }

  /**
   * Save toState and go to signin page
   * @param event
   * @param toState
   * @param toParams
   */
  redirectToSiginin(event, toState, toParams) {
    event.preventDefault();

    let toSearchParams = this.$location.search();

    //Store the state before signin to redirect to after SAML redirection
    this.setRedirectState(toState.name);
    this.setRedirectStateParams(toParams);
    this.setRedirectStateSearchParams(toSearchParams);
    this.$state.go('app.signin', {}, {reload: true});
  }

  /**
   * Check if user email exists in publishers list
   * @returns {Boolean}
   */
  userIsPublisher() {
    let profile = this.msAuthentication.$rootScope.profile;
    
    return profile && this._publishersList.indexOf(profile.email) !== -1;
  }

  /**
   * Get publishers list from global config
   * @returns {Array}
   */
  get _publishersList() {
    let publishersList = this.kernel.config.globals.publishersList;

    if (publishersList) {
      return publishersList.split(',').map((email) => {
        return email.trim();
      });
    } else {
      return [];
    }
  }
}

angular.module(moduleName).service('deepAccountStateManager',
  ['msAuthentication', '$state', '$location', (...args) => {
    return new DeepAccountStateManager(...args);
  },
]);
