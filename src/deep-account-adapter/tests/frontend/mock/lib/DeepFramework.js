DeepFramework.Kernel.load({
  'env': 'prod',
  'deployId': 'asdfdsfdsgdfgfdgfd5454654',
  'awsRegion': 'us-east-1',
  'models': [],
  'identityPoolId': 'us-east-1:1e6b7663-19ff-4a81-bc94-34543fdgf',
  'identityProviders': {
    'www.amazon.com': 'amzn1.application.cxvbgfh5454654654'
  },
  'microservices': {
    'deep-account-adapter': {
      'isRoot': true,
      'parameters': {},
      'resources': {
        'user': {
          'create': {
            'type': 'lambda',
            "methods": [
              "POST"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/user/create',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-user-create',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'retrieve': {
            'type': 'lambda',
            "methods": [
              "GET"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": true,
              "ttl": 300
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/user/retrieve',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-user-retrieve'
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          }
        },
        'account': {
          'create': {
            'type': 'lambda',
            "methods": [
              "POST"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/create',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-create'
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'retrieve': {
            'type': 'lambda',
            "methods": [
              "GET"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": true,
              "ttl": 300
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/retrieve',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-retrieve',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'delete': {
            'type': 'lambda',
            "methods": [
              "DELETE"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/delete',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-delete',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'update': {
            'type': 'lambda',
            "methods": [
              "PUT"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/update',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-update',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'link-user': {
            'type': 'lambda',
            "methods": [
              "POST"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/link-user',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-link-user',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          },
          'unlink-user': {
            'type': 'lambda',
            "methods": [
              "POST"
            ],
            "forceUserIdentity": true,
            'apiCache': {
              "enabled": false,
              "ttl": -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/unlink-user',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-unlink-user',
            },
            'api': {
              'authorization': 'AWS_IAM',
              "keyRequired": false
            }
          }
        }
      }
    }
  },
  'globals': {
    'auth0': {
      'init': {
        'domain': 'yourdomain.auth0.com',
        'clientID': 'your-client-id',
        'loginState': 'auth.signIn',
        'thumbprint': 'ajdfajdlo3upou1jp3oj2p8j139pr8hp912',
        'callbackURL': 'http://YOUR_APP/callback'
      },
      'signin': {
        "popup": true,
        'connections': 'amazon',
        "closable": true,
        "socialBigButtons": false,
        "gravatar": false
      }
    },
    'logDrivers': {
      'sentry': {
        'dsn': 'https://905e3e7244fe432993751cb500b56b4d:3527453acb2c47bf9aa66707c65cc31d@app.getsentry.com/48093'
      }
    },
    'userProviderEndpoint': '@deep.account:user:retrieve',
    'security': {
      'identityProviders': {
        'www.amazon.com': 'amzn1.application.12057697ba3347cda73dd9f6d3b9ce2b'
      }
    }
  },
  'microserviceIdentifier': 'deep-account-adapter',
  'awsAccountId': 122435435456,
  'propertyIdentifier': 'propertyIdentifier',
  'timestamp': 1441198970148,
  'buckets': {
    'public': {
      'name': 'deep.prod.public.test2343'
    },
    'system': {
      'name': 'deep.prod.system.test2343'
    }
  },
  'tablesNames': {},
  'validationSchemas': [],
}, function(){});
