// THIS TEST WAS GENERATED AUTOMATICALLY ON 09/16/2016 13:50:03

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
