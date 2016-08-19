'use strict';
'format es6';

import moduleName from '../name';

class Config {
  constructor($httpProvider, authProvider, jwtInterceptorProvider, msAuthenticationProvider) {

    msAuthenticationProvider.init($httpProvider, authProvider, jwtInterceptorProvider);

  }
}
angular.module(moduleName).config(['$httpProvider', 'authProvider', 'jwtInterceptorProvider',
  'msAuthenticationProvider', (...args) => {
    return new Config(...args);
  },

]);
