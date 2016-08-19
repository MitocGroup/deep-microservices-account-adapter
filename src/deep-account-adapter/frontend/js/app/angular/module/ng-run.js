'use strict';
'format es6';

import moduleName from '../name';

class Run {
  constructor($rootScope, stateManager) {

    $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
      if (error && error.error === 'UserIsNotAuthorised') {
        stateManager.redirectToSiginin(event, toState, toParams);
      } else if (error && error.error === 'UserIsNotPublisher') {
        stateManager.goToState('app.library');
      }
    });
  }
}

angular.module(moduleName).run(['$rootScope', 'deepAccountStateManager', (...args) => {
  return new Run(...args);
},
]);
