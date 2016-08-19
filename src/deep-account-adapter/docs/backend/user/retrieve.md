#Retrieve#
> The lambda retrieves user(s) from DynamoDb table User.
Request
-----------
```javascript
    {
      "Id": "string",       // user cognito identityId
    }
```
**Id**

User Id from Dynamo DB is a cognito identityId.
Type: String
Required: Yes

Response
-----------
```javascript
    {
      "Id": "string",       // user cognito identityId
      "Email": "string",    // user email
      "Name": "string",     // user name
      "Nickname": "string", // user email
      "createdAt": "string" // creation date
    } // user with this cognito identityId if exist or null
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

Request
-----------
```javascript
  {
    "Email": "string",       // user email
  }
```
Response
-----------
```javascript
{
  "Items": [
    {
      "Id": "string",       // user cognito identityId
      "Email": "string",    // user email
      "Name": "string",     // user name
      "Nickname": "string", // user email
      "createdAt": "string" // creation date
    } //user with this email if exist
  ]
}
```
Request
-----------
```javascript
{
  "Ids": "array"  //array of users cognito identityId
}
```
Response
-----------
```javascript
  {
    "Items": [
      {
        "Id": "string",       // user cognito identityId
        "Email": "string",    // user email
        "Name": "string",     // user name
        "Nickname": "string", // user email
        "createdAt": "string" // creation date
      },
      ...
    ]  // array of objects with info about users
  }
```
Request
-----------
```javascript
  {
  }
```
Response
-----------
```javascript
    {
      "Items": [
        {
          "Id": "string",       // user cognito identityId
          "Email": "string",    // user email
          "Name": "string",     // user name
          "Nickname": "string", // user email
          "createdAt": "string" // creation date
        },
        ...
      ]  // array of objects with all users
    }
```
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