#Create#
> The lambda creates a new user in DynamoDb table User. If the user Id already exists, the operation will fail.

Request
-----------
```javascript
  {
    "Id": "string",       // user cognito identityId
    "Email": "string",    // user email
    "Name": "string",     // user name
    "Nickname": "string"  // user nickname
  }
```

**Id**

User Id from Dynamo DB is a cognito identityId.<br />
Type: String<br />
Should be identical.<br />
Required: Yes

**Email**

User Email<br />
Type: String<br />
Valid Range: Maximum 255 chars<br />
Required: No

**Name**

User Name<br />
Type: String<br />
Valid Range: Maximum 255 chars<br />
Required: No

**Nickname**

User Nickname<br />
Type: String<br />
Valid Range: Maximum 255 chars<br />
Required: No

Response
-----------
```javascript
  {
    "Id": "string",       // user cognito identityId
    "Email": "string",    // user email
    "Name": "string",     // user name
    "Nickname": "string", // user email
    "createdAt": "string" // creation date
  } // created user
```

**Id**

User Id from Dynamo DB is a cognito identityId.<br />
Type: String

**Email**

User Email<br />
Type: String<br />
Length constraints: Minimum length of 0. Maximum length of 256.

**Name**

User Name<br />
Type: String<br />
Length constraints: Minimum length of 0. Maximum length of 256.

**Nickname**

User Nickname<br />
Type: String<br />
Length constraints: Minimum length of 0. Maximum length of 256.

**createdAt**

User creation date<br />
Type: String

Errors
-------
**DatabaseOperationException**

The error while adding/retrieving/updating/deleting item in DynamoDB.

**InvalidArgumentException**

One of the parameters in the request is invalid. For exmaple, "Id" is absent

**ServiceException**

The AWS Lambda service encountered an internal error.

**TooManyRequestsException**

The AWS Lambda exception due to exceeding max limit of allowed lambdas.