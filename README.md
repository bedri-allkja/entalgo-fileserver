# Entalgo Fileserver

Configuration file to be created into `config` folder

```json
{
  "ynDb": {
    "database": "[database-name]",
    "user": "[database-username]",
    "password": "[database-password]",
    "options": {
      "host": "[ip-address]",
      "dialect": "mysql",
      "port": 5432,
      "pool": {
        "max": 40
      }
    }
  },
  "logLevel": 3,
  "root": "/files/v1",
  "defaultPort": 3002,
  "sessionExpiration": {
    "short": 7890000,
    "long": 31536000
  },
  "fileserver": {
    "root": "[fileserver-root-path]",
    "tmp": "[fileserver-temp-path]",
    "folders": {
      "users": "users",
      "csv": "csv"
    }
  },
  "limits": {
    "fileSize": 5242880,
    "fieldSize": 5242880
  },
  "bodyParserLimit": "5mb"
}
```
