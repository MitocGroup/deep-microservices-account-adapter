'use strict';
'format es6';

import moduleName from '../name';

let deepAsset = DeepFramework.Kernel.container.get('asset');

var routes = {
  'app.signout': {
    url: '/signout',
    controller: 'DeepAccountSignOutController',
    controllerAs: 'signout',
    templateUrl: deepAsset.locate('@deep-account-adapter:js/app/angular/views/auth.signout.html'),
    ncyBreadcrumb: {
      label: 'Signout',
    }
  },
  'app.signin': {
    url: '/signin',
    controller: 'DeepAccountSignInController',
    controllerAs: 'signin',
    templateUrl: deepAsset.locate('@deep-account-adapter:js/app/angular/views/auth.signin.html'),
    ncyBreadcrumb: {
      label: 'Signin',
    }
  }
};

class Config {
  constructor($stateProvider) {
    /* Define application level routes */
    let stateNames = Object.keys(routes);
    angular.forEach(stateNames, function routesRegister(stateName) {
      $stateProvider.state(stateName, routes[stateName]);
    });
  }
}

angular.module(moduleName).config(['$stateProvider', (...args) => {
  return new Config(...args);
},
]);

export default routes;
