'use strict';

import DeepFramework from 'deep-framework';

/**
 * Thrown when user is not found in account
 */
export class UserNotFoundInAccountException extends DeepFramework.Core.Exception.Exception {
  /**
   * @param accountId
   * @param userId
   */
  constructor(accountId, userId) {
    super(`User ${userId} is not found in account ${accountId}`);
  }
}
