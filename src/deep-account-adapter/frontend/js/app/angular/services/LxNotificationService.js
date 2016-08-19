/**
 * Created by mgoria on 3/31/16.
 */

'use strict';
'format es6';

import moduleName from '../name';

angular.module(moduleName).factory('LxNotificationService', ['Notification', (Notification) => {
  let notificationService = Notification;

  let logger = (method, message) => {
    notificationService[method](message);
  };

  return {
    notify: message => logger('info', message),
    info: message => logger('info', message),
    success: message => logger('success', message),
    warning: message => logger('warning', message),
    error: message => logger('error', message),
  };
}]);
