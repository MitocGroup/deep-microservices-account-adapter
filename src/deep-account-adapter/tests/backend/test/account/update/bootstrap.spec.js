'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/account/update/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-accounts-update module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
