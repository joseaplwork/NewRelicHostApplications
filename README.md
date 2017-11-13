# NewRelicHostApps

This is a simple library to handle host applications from NewRelic.

Installing the dependencies:
```shell
  npm install
```

Start the development mode, this will build `NewRelicHostApps.js` in the `dist/umd` directory:
```shell
  npm run build:dev
```

If you want to do TDD run:
```shell
  npm run test:coverwatch
```

# Usage:

`UMD` implementation:
```javascript
  const instance = new NewRelicHostAppsBundle(data);
```

#### `constructor : (array: <applications>) => void` [optional]

The initial data to be handled by `NewRelicHostApps`

#### `MAX_MOST_SATISFING : number`

A maximum number to return the most satisfying applications

#### `apps : array`

The sorted hosts by Apdex

#### `hostsList : array`

The list of the sorted applications ordered by Apdex

#### `getTopAppsByHost : (string: <host>, number: <limit>) => array`

Retrieves a list of the 25 most satisfying applications.

#### `addAppToHosts : (object: <app>) => array`

Adds an update the list of applications with higher Apdex

#### `removeAppFromHosts : (string: <id>) => array`

Removes an update the list of applications with higher Apdex
