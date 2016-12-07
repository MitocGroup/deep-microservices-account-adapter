// THIS TEST WAS GENERATED AUTOMATICALLY ON 12/07/2016 14:07:24

'use strict';

import moduleName from '../../../../frontend/js/app/angular/name';

  // @todo: Add more advanced tests
  describe('Directives', () => {

  let directiveElement;
  let compile;
  let scope, rootScope;
  let $controller;
  let controller;

  beforeEach(() => {

    // Load modules
    module('ui.router');
    module('templates');

    // module('auth0', function(authProvider) {
    //   spyOn(authProvider, 'init').andCallThrough();
    // });

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

    inject((_$controller_, $templateCache, $compile, $rootScope) => {

      let template = $templateCache.get('frontend/js/app/angular/views/directives/account-switcher.html');
      $templateCache.put('js/app/angular/views/directives/account-switcher.html', template);

      $controller = _$controller_;
      compile = $compile;
      rootScope = $rootScope;
      scope = $rootScope.$new();
    });
  });

  /**
  * Return compiled directive ready for testing
  * @returns {HTMLDivElement}
  */
  function getCompiledElement() {
    scope.$digest();

    controller = $controller('AccountSwitcherController', {
      $scope: scope,
      $rootScope: rootScope,
      deepAccount: {},
    });

    scope.$digest();

    let element = angular.element('<account-switcher>');
    let compiledElement = compile(element)(scope);
    scope.$digest();
    return compiledElement;
  }

  //@todo - should be added directive's use cases by using "directiveElement"
  describe('accountSwitcher', () => {
    it('account-switcher has html', () => {
      let error = null;

      try {
        directiveElement = getCompiledElement();
      } catch (exception) {
        error = exception;
      }

      if (!error) {
        expect(typeof directiveElement).toEqual('object');
        expect(directiveElement.html()).not.toEqual(undefined);
      }
    });
  });
});
