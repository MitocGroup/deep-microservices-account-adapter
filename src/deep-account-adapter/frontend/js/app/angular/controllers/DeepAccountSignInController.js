'use strict';
'format es6';

import moduleName from '../name';

class DeepAccountSignOutController {
  /**
   * @param msAuthentication
   * @param $location
   */
  constructor(msAuthentication, $location) {
    msAuthentication.signOut(() => {
      let signOutUrl = DeepFramework.Kernel.config
          .microservices['deep-account-adapter']
          .parameters.signoutRedirectUrl || '/';

      $location.path(signOutUrl);
    });
  }
}

angular.module(moduleName).controller('DeepAccountSignOutController',
  ['msAuthentication', '$location', (...args) => {
    return new DeepAccountSignOutController(...args);
  },]
);
