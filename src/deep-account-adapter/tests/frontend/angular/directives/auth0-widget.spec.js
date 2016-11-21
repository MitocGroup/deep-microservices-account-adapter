// THIS TEST WAS GENERATED AUTOMATICALLY ON 11/09/2016 17:41:07

'use strict';

import {auth0-widget} from '../../../../frontend/js/app/angular/directives/auth0-widget';

// @todo: Add more advanced tests
describe('Directives', () => {

  describe('auth0-widget', () => {
    it('Class auth0-widget exists', () => {
      expect(typeof auth0-widget).toBe('function');
    });

    // @todo: should be reworked by passing valid arguments and add asserts
    it('Check auth0-widget constructor', () => {
      let $q = {
        defer: function() { return; },
      };
      let auth0-widget;
      let error = null;

      try {
        auth0-widget = new auth0-widget($q);
      } catch(exception) {
        error = exception;
      }

      if(!error) {
        expect(auth0-widget instanceof auth0-widget).toBeTruthy();
      }
    });
  
  });
});
