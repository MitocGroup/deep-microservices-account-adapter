'use strict';
'format es6';

import moduleName from '../name';

class DeepAccountSignInController {

  /**
   * @param {MsAuthentication} msAuthentication
   * @param {DeepAccountStateManager} deepAccountStateManager
   * @param {Object} notification
   */
  constructor(msAuthentication, deepAccountStateManager, notification) {
    notification.setElement('main-header');
    this.stateManager = deepAccountStateManager;

    msAuthentication.ready.then(() => {
      this.profile = msAuthentication.$rootScope.profile;
      this.stateManager.goToStoredState();
    })
  }
}

angular.module(moduleName).controller('DeepAccountSignInController', ['msAuthentication',
  'deepAccountStateManager', 'Notification', (...args) => {
    return new DeepAccountSignInController(...args);
  },
]);
