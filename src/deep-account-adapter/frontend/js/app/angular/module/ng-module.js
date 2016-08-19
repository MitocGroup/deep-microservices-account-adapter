'use strict';
'format es6';

import moduleName from '../name';

angular.module(moduleName, ['ui.router',
  'ngCookies',
  'angular-storage',
  'angular-jwt',
  'auth0',
  'ui.bootstrap',
]);
