// THIS TEST WAS GENERATED AUTOMATICALLY ON 11/09/2016 17:41:07

import {AbstractManager} from '../../../../frontend/js/app/angular/services/AbstractManager';

// @todo: Add more advanced tests
describe('Services', () => {

  describe('AbstractManager', () => {
    it('Class AbstractManager exists', () => {
      expect(typeof AbstractManager).toBe('function');
    });

    it('Check AbstractManager constructor', () => {
      let $q = {
        defer: function() { return; },
      };
      let abstractManager = new AbstractManager($q);
      expect(abstractManager instanceof AbstractManager).toBeTruthy();
    });
  
  });
});
