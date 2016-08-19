'use strict';
'format es6';

import moduleName from './name';

import './module/index';
import './controllers/index';
import './directives/index';
import './filters/index';
import './services/index';

export default moduleName;

export function bootstrap() {

  //Bootstrap the ng application
  angular.element(document).ready(() => {
    try {
      angular.bootstrap(document, [moduleName], {strictDi: true});
    } catch (e) {
      DeepFramework.Kernel.get('log').log(e);
    }
  });
}
