'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/user/create/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-user-create module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
