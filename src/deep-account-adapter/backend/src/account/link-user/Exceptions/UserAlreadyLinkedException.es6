'use strict';

import DeepFramework from 'deep-framework';

/**
 * Thrown when user is already linked with account
 */
export class UserAlreadyLinkedException extends DeepFramework.Core.Exception.Exception {
  /**
   * @param accountId
   * @param userId
   */
  constructor(accountId, userId) {
    super(`User: ${userId} already linked with account: ${accountId}`);
  }
}
