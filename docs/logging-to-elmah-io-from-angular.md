---
title: Logging to elmah.io from Angular
description: Learn how to utilize elmah.io.javascript to log uncaught errors from Angular apps to elmah.io. Get instant notifications when your SPA fails.
---

[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples)

# Logging to elmah.io from Angular

`elmah.io.javascript` works great with Angular applications too. To log all errors happening in your Angular app, install `elmah.io.javascript` through npm as described in [Logging from JavaScript](https://docs.elmah.io/logging-to-elmah-io-from-javascript/). Then add `elmahio.min.js` to the `scripts` section in the `.angular-cli.json` file (`angular.json` in Angular 6):

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  // ...
  "apps": [
    {
      // ...
      "scripts": [
        "../node_modules/elmah.io.javascript/dist/elmahio.min.js"
      ],
      // ...
    }
  ],
  // ...
}
```

In the `app.module.ts` file, add a new `ErrorHandler` and add it to the `providers` section:

```typescript
import { NgModule, ErrorHandler } from '@angular/core';
// ...

class ElmahIoErrorHandler implements ErrorHandler {
  logger: any;
  constructor() {
    this.logger = new Elmahio({
      apiKey: 'API_KEY',
      logId: 'LOG_ID',
    });
  }
  handleError(error) {
    if (error && error.message) {
      this.logger.error(error.message, error);
    } else {
      this.logger.error('Error in application', error);
    }
  }
}

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
  ],
  providers: [{ provide: ErrorHandler, useClass: ElmahIoErrorHandler }],
  // ...
})
```

All errors are shipped to the `handleError`-function by Angular and logged to elmah.io. Check out the <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/Elmah.Io.JavaScript.Angular" target="_blank" rel="noopener noreferrer">Elmah.Io.JavaScript.Angular</a> and <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/Elmah.Io.JavaScript.AngularWebpack" target="_blank" rel="noopener noreferrer">Elmah.Io.JavaScript.AngularWebpack</a> samples for some real working code.

## AngularJS/Angular 1

For AngularJS you need to implement the `$exceptionHandler` instead:

```javascript
(function () {
  'use strict';
  angular.module('app').factory('$exceptionHandler', ['$log', function controller($log) {
    var logger = new Elmahio({
      apiKey: 'API_KEY',
      logId: 'LOG_ID'
    });
    return function elmahExceptionHandler(exception, cause) {
      $log.error(exception, cause);
      logger.error(exception.message, exception);
    };
  }]);
})();
```