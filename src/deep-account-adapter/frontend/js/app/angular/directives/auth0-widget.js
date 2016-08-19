'use strict';
'format es6';
import moduleName from '../name';

let deepAsset = DeepFramework.Kernel.container.get('asset');

export default
  angular.module(moduleName).directive('deepAccountAuth0Widget', ['msAuthentication', (msAuthentication)=> {
    let link = ()=> {
      msAuthentication.auth0Login(false, false);
    };

    return {
      restrict: 'E',
      link,
      templateUrl: deepAsset.locate('@deep-account-adapter:js/app/angular/views/directives/auth0-widget.html'),
    };
  },
  ]);
