#Delete#
> The lambda deletes a user from DynamoDb table User. If the user Id doesn't exist, the operation will fail.

Request
-----------
```javascript
  {
    "Id": "string",       // user cognito identityId
  }
```
**Id**

User Id from Dynamo DB is a cognito identityId.<br />
Type: String<br />
Required: Yes

Response
-----------
```javascript
  {
    "Id": "string",       // deleted user Id
  }
```

**Id**

Deleted User Id<br />
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