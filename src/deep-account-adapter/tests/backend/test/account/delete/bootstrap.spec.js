'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/account/delete/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-accounts-delete module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
