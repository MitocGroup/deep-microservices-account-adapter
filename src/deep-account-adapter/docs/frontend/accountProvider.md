#DeepAccountProvider#
DeepAccountProvider is an angular service([DeepAccountProvider](frontend/js/app/angular/services/DeepAccountProvider.js)
that wraps the backend functionality. This service retrieves user accounts on login and create a new account for user on first login. It also defines some convenience methods. Most of the return promises that are
resolved or rejected once the request is done, except the methods that register callbacks, they return nothing.

- `DeepAccountProvider.createAccount()`: accepts the same input as the [account-create](lambdas/account/create.md)
and returns a promise that later is resolved with the same lambda output.

- `DeepAccountProvider.deleteAccount()`: accepts as input the id of the account to delete and is resolved with the [account-delete]
(lambdas/account/delete.md) execution result.

- `DeepAccountProvider.updateAccount()`: accepts the same input as the [account-update](lambdas/account/update.md)
and returns a promise that later is resolved with the same lambda output.

- `DeepAccountProvider.retrieveAccount()`: accepts the one of the inputs of [account-retrieve](lambdas/account/retrieve.md)
and returns a promise that later is resolved with the same lambda output.

- `DeepAccountProvider.linkUser()`: for this function input is user email and returns a promise that later is resolved with the
 [account-linkUser](lambdas/account/linkUser.md) lambda output.

- `DeepAccountProvider.unlinkuser()`: accepts the one of the inputs of [account-unlinkUser](lambdas/account/unlinkUser.md)
and returns a promise that later is resolved with the same lambda output.

- `DeepAccountProvider.register<eventName>Callback()`: method that accept as a parameter a function that is triggered when
some event occur. The current events available are: `ACCOUNT_CHANGED`, `ACCOUNT_UPDATED`, `ACCOUNT_CREATED`, `ACCOUNTS_RETRIEVED `, `ACCOUNT_DELETED`,
`ACCOUNT_DELETED`, `ACCOUNT_USER_LINKED`, `ACCOUNT_USER_UNLINKED`.

- `DeepAccountProvider.account`: an object with current selected account
- `DeepAccountProvider.accounts`: an object with all user accounts
- `DeepAccountProvider.ownedAccounts`: an object with all user owned accounts