'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/account/unlink-user/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-accounts-unlink-user module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
