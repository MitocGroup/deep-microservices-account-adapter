'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/account/create/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-accounts-create module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
