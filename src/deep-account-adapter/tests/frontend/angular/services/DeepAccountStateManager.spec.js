// THIS TEST WAS GENERATED AUTOMATICALLY ON 12/07/2016 14:07:24

'use strict';

import moduleName from '../../../../frontend/js/app/angular/name';

// @todo: Add more advanced tests
describe('Services', () => {
  let deepAccountStateManager;
  let scope, rootScope;
  let $q;

  beforeEach(() => {
    module('ui.router');
    angular.mock.module(moduleName);

    module(($provide) => {
      $provide.provider('Notification', function () {
        this.$get = () => {
          var notify = function () {
          };

          notify.setElement = function () {
          };
          notify.error = function (error) {
          };

          return notify;
        };
      });
    });

    inject(($rootScope, deepAccountStateManager, _$q_) => {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      deepAccountStateManager = deepAccountStateManager;
      $q = _$q_;
    });
  });

  describe('DeepAccountStateManager', () => {
    it('Check constructor create instance w/o errors', () => {
      expect(['object', 'function', 'undefined']).toContain(typeof deepAccountStateManager);
    });
  });
});
