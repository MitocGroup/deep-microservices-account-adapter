// THIS TEST WAS GENERATED AUTOMATICALLY ON 12/07/2016 14:07:24

'use strict';

import moduleName from '../../../../frontend/js/app/angular/name';

// @todo: Add more advanced tests
describe('Services', () => {
  let lxNotificationService;
  let scope, rootScope;
  let $q;

  beforeEach(() => {
    module('ui.router');
    angular.mock.module(moduleName);


    // store references to scope, rootScope
    // so they are available to all tests in this describe block
    //
    // $rootScope ngMock’s service to allow getting an instance of angular’s core and create child scopes via its $new
    //
    // The underscores are a convenience trick to inject a service under a different name
    // so that we can locally assign a local variable of the same name as the service.
    inject(($rootScope, LxNotificationService, _$q_) => {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      lxNotificationService = LxNotificationService;
      $q = _$q_;
    });
  });

  describe('LxNotificationService', () => {
    it('Check constructor create instance w/o errors', () => {
      expect(['object', 'function', 'undefined']).toContain(typeof lxNotificationService);
    });
  });
});
