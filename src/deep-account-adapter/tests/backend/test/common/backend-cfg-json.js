export default {
  'env': 'dev',
  'deployId': 'a44dd54d',
  'awsRegion': 'us-west-2',
  'models': [
    {
      'Account': {
        'OwnerId': 'string',
        'Name': 'string',
        'Email': 'email',
        'Users': 'stringSet',
        'Description': 'string',
        'MarkedAs': 'string'
      }
    },
    {
      'User': {
        'Id': 'string',
        'Email': 'email',
        'Name': 'string',
        'Nickname': 'string',
        'Roles': 'stringSet',
        'NumberOfAccounts': 'number',
        'Picture': 'string'
      }
    }
  ],
  'identityPoolId': 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xx0123456789',
  'identityProviders': '',
  'microservices': {
    'deep-account-adapter': {
      'isRoot': false,
      'parameters': {},
      'resources': {
        'user': {
          'create': {
            'type': 'lambda',
            'methods': [
              'POST'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/user/create',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-user-create',
              '_localPath': './src/deep-account-adapter/backend/src/user/create/bootstrap.js'
            }
          },
          'retrieve': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': true,
              'ttl': 300
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/user/retrieve',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-user-retrieve',
              '_localPath': './src/deep-account-adapter/backend/src/user/retrieve/bootstrap.js'
            }
          }
        },
        'account': {
          'create': {
            'type': 'lambda',
            'methods': [
              'POST'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/create',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-create',
              '_localPath': './src/deep-account-adapter/backend/src/account/create/bootstrap.js'
            }
          },
          'retrieve': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': true,
              'ttl': 300
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/retrieve',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-retrieve',
              '_localPath': './src/deep-account-adapter/backend/src/account/retrieve/bootstrap.js'
            }
          },
          'delete': {
            'type': 'lambda',
            'methods': [
              'DELETE'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/delete',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-delete',
              '_localPath': './src/deep-account-adapter/backend/src/account/delete/bootstrap.js'
            }
          },
          'update': {
            'type': 'lambda',
            'methods': [
              'PUT'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/update',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-update',
              '_localPath': './src/deep-account-adapter/backend/src/account/update/bootstrap.js'
            }
          },
          'link-user': {
            'type': 'lambda',
            'methods': [
              'POST'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/link-user',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-link-user',
              '_localPath': './src/deep-account-adapter/backend/src/account/link-user/bootstrap.js'
            }
          },
          'unlink-user': {
            'type': 'lambda',
            'methods': [
              'POST'
            ],
            'forceUserIdentity': true,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'public',
            'source': {
              'api': '/deep-account-adapter/account/unlink-user',
              'original': 'arn:aws:lambda:::function:deep-account-adapter-account-unlink-user',
              '_localPath': './src/deep-account-adapter/backend/src/account/unlink-user/bootstrap.js'
            }
          }
        }
      }
    },
    'deep-root-angular': {
      'isRoot': true,
      'parameters': {},
      'resources': {
        'async-config': {
          'dump': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': false,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'private',
            'source': {
              'api': null,
              'original': 'arn:aws:lambda:::function:deep-root-angular-async-config-dump',
              '_localPath': './src/deep-root-angular/backend/src/async-config/dump/bootstrap.js'
            }
          }
        },
        'scheduler': {
          'rule': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': false,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'private',
            'source': {
              'api': null,
              'original': 'arn:aws:lambda:::function:deep-root-angular-scheduler-rule',
              '_localPath': './src/deep-root-angular/backend/src/scheduler/rule/bootstrap.js'
            }
          }
        },
        'ddb-eventual-consistency': {
          'listen-queues': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': false,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'private',
            'source': {
              'api': null,
              'original': 'arn:aws:lambda:::function:deep-root-angular-ddb-eventual-consistency-listen-queues',
              '_localPath': './src/deep-root-angular/backend/src/ddb-eventual-consistency/listen-queues/bootstrap.js'
            }
          },
          'pool-queue': {
            'type': 'lambda',
            'methods': [
              'GET'
            ],
            'forceUserIdentity': false,
            'apiCache': {
              'enabled': false,
              'ttl': -1
            },
            'region': 'us-west-2',
            'scope': 'private',
            'source': {
              'api': null,
              'original': 'arn:aws:lambda:::function:deep-root-angular-ddb-eventual-consistency-pool-queue',
              '_localPath': './src/deep-root-angular/backend/src/ddb-eventual-consistency/pool-queue/bootstrap.js'
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
        'callbackURL': 'http://YOUR_APP/callback'
      },
      'signin': {
        'popup': true,
        'connections': 'amazon',
        'closable': true,
        'socialBigButtons': false,
        'gravatar': false
      }
    },
    'userProviderEndpoint': '@deep-account-adapter:user:retrieve',
    'favicon': '@deep-root-angular:img/favicon.ico',
    'pageLoader': {
      'src': '@deep-root-angular:img/loader.gif',
      'alt': 'Loading...'
    },
    'engine': {
      'ngRewrite': '/'
    }
  },
  'searchDomains': {},
  'validationSchemas': [],
  'modelsSettings': [
    {
      'Account': {
        'readCapacity': 1,
        'writeCapacity': 1,
        'maxReadCapacity': 10000,
        'maxWriteCapacity': 10000
      }
    },
    {
      'User': {
        'readCapacity': 1,
        'writeCapacity': 1,
        'maxReadCapacity': 10000,
        'maxWriteCapacity': 10000
      }
    }
  ],
  'forceUserIdentity': false,
  'microserviceIdentifier': 'deep-account-adapter',
  'awsAccountId': 123456789123,
  'appIdentifier': 'gfhfgdhfghgjgh7687687fghgfhgf',
  'timestamp': 1465996738254,
  'buckets': {
    'temp': {
      'name': 'fdgfd56765gfhjgj768768ghjjhgjhg898-temp'
    },
    'public': {
      'name': 'fdgfd56765gfhjgj768768ghjjhgjhg898-public'
    },
    'private': {
      'name': 'fdgfd56765gfhjgj768768ghjjhgjhg898-private'
    },
    'shared': {
      'name': 'fdgfd56765gfhjgj768768ghjjhgjhg898-shared'
    }
  },
  'tablesNames': {
    'Account': 'DeepDevAccount123e94b5',
    'User': 'DeepDevUser123e94b5'
  },
  'cacheDsn': '',
  'name': 'deep-account-adapter-account-create',
  'path': './src/deep-account-adapter/backend/src/account/create/bootstrap.js'
};