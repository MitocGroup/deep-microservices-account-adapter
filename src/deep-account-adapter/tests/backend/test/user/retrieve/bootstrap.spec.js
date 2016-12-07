'use strict';

import chai from 'chai';
import bootstrap from '../../../../../backend/src/user/retrieve/bootstrap';

suite('Bootstraps', () => {
  test(' bootstrap exists in deep-account-adapter-user-retrieve module', () => {
    chai.expect(bootstrap).to.be.an('object');
  });
});
