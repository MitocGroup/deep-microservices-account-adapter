'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/account/retrieve/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-accounts-retrieve module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
