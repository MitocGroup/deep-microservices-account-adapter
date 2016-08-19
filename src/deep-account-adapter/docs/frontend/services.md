Services
-----------

### DeepAccountProvider ###
DeepAccountProvider is an angular service[DeepAccountProvider](frontend/js/app/angular/services/DeepAccountProvider.js)
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

### DeepAccountUserManager ###
DeepAccountUserManager is an angular service[DeepAccountUserManager](frontend/js/app/angular/services/DeepAccountUserManager.js)
that wraps the backend functionality.

- `DeepAccountUserManager.createUser()`: accepts the same input as the [user-create](lambdas/account/create.md)
and returns a promise that later is resolved with the same lambda output.

- `DeepAccountUserManager.loadUserByIdentityId()`: accepts as input the id of the user ([user-retrieve]
(lambdas/user/retrieve.md))  and return user info.

- `DeepAccountUserManager.loadUserByEmail()`: accepts as input the email of the user and is resolved with the [user-retrieve]
(lambdas/user/retrieve.md)  execution result.

- `DeepAccountUserManager.loadUsersById()`: accepts as input the ids of the users to retrieve and is resolved with the [user-retrieve]
(lambdas/user/retrieve.md)  execution result.

- `DeepAccountUserManager.updateUser()`: accepts as input the info of the user to update and is resolved with the [user-delete]
(lambdas/user/update.md) execution result.

- `DeepAccountUserManager.deleteUser()`: accepts as input the id of the user to delete and is resolved with the [user-delete]
(lambdas/user/delete.md) execution result.


### msAuthentication ###
msAuthentication service provide a quick way to authenticate users. 

It also provides a feature of automatic restoring of user session after page reload.

#### Logining-in

By default, login form displayed as a pop-up modal. It can be shown by calling the following function:

```javascript
// ...
msAuthentication.auth0Login(isClosable, isPopup, container)
```

After logining-in via one of indenty providers user's profile and token will be cached and served through `$rootScope.profile`.

#### Loging-out

For logout-out  there's a simple function:

```javascript
// ...
msAuthentication.signOut(callback);
```

### DeepAccountPasswordlessAuth

DeepAccountPasswordlessAuth is service which provides wrapped interface for interacting with Auth0 Passwordless Lock library.
It give a whole set of methods to be used to provide login/logout controll in a Microservice.

#### Available methods:

- `DeepAccountPasswordlessAuth.emailCode(params)`: accepts as input the params for Auth0 Passwordless and returns promise,
which is resolved when user proceeds to login using email-code method.

- `DeepAccountPasswordlessAuth.smsCode(params)`: accepts as input the params for Auth0 Passwordless and returns promise,
which is resolved when user proceeds to login using sms-code method.

- `DeepAccountPasswordlessAuth.authenticate(profile, token, accessToken)`: accepts as input the profile, token, accessToken and returns promise
which is resolved when user gets successfully logged-in.

- `DeepAccountPasswordlessAuth.logout()`: method which restores authentication state and makes user logged-out.

- `DeepAccountPasswordlessAuth.close()`: method for closing Lock modal.

- `DeepAccountPasswordlessAuth.initLock()`: method for recreation of `lock` instance.

#### Available fields:

- `DeepAccountPasswordlessAuth.profile`: returns profile promise

- `DeepAccountPasswordlessAuth.token`: returns token promise

- `DeepAccountPasswordlessAuth.isAuthenticated`: returns authentication state

- `DeepAccountPasswordlessAuth.config`: returns config object

- `DeepAccountPasswordlessAuth.lock`: returns lock object
