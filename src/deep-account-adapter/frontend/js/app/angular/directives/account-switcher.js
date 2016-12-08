'use strict';
'format es6';
import moduleName from '../name';

export class AccountSwitcherController {

  constructor(deepAccount) {
    this._accountProvider = deepAccount;
  }

  get accountProvider() {
    return this._accountProvider;
  }
}

let deepAsset = DeepFramework.Kernel.container.get('asset');

export default
  angular.module(moduleName).directive('accountSwitcher', function accountSwitcherDirective() {
    return {
      restrict: 'E',
      controller: 'AccountSwitcherController',
      controllerAs: 'switchCtrl',
      scope: true,
      templateUrl: deepAsset.locate('@deep-account-adapter:js/app/angular/views/directives/account-switcher.html'),
    };
  })
  .controller('AccountSwitcherController', ['deepAccount', (...args) => {
    return new AccountSwitcherController(...args);
  },
  ]);
