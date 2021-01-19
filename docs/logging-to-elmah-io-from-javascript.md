[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-5-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples)

# Logging to elmah.io from JavaScript

[TOC]

elmah.io doesn't only support server-side .NET logging. We also log JavaScript errors happening on your website. Logging client-side errors, requires nothing more than installing the `elmahio.js` script on your website.

> Remember to [generate a new API key](https://blog.elmah.io/api-key-permissions/) with `messages_write` permission only. This makes it easy to revoke the API key if someone starts sending messages to your log with your key.

## Installation

Pick an installation method of your choice:

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#manually" aria-controls="home" role="tab" data-toggle="tab">Manually</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#cdn" aria-controls="home" role="tab" data-toggle="tab">CDN</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#npm" aria-controls="profile" role="tab" data-toggle="tab">npm</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#nuget" aria-controls="profile" role="tab" data-toggle="tab">NuGet</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#libman" aria-controls="profile" role="tab" data-toggle="tab">Library Manager</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#aspnetcore" aria-controls="profile" role="tab" data-toggle="tab">ASP.NET Core</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#bower" aria-controls="profile" role="tab" data-toggle="tab">Bower</a></li>
</ul>
</div>
</div>

 <div class="tab-content tab-content-tabbable">
<div role="tabpanel" class="tab-pane active" id="manually">

Download the latest release as a zip: [https://github.com/elmahio/elmah.io.javascript/releases](https://github.com/elmahio/elmah.io.javascript/releases)

Unpack and copy `elmahio.min.js` to the `Scripts` folder or whatever folder you use to store JavaScript files.

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/Scripts/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

</div>
  <div role="tabpanel" class="tab-pane" id="cdn">

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="https://cdn.jsdelivr.net/gh/elmahio/elmah.io.javascript@3.3.1/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="npm">

Install the elmah.io.javascript npm package:

```ps
npm install elmah.io.javascript
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/node_modules/elmah.io.javascript/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="bower">

Since Bower is <a href="https://bower.io/blog/2017/how-to-migrate-away-from-bower/" target="_blank" rel="noopener noreferrer">no longer maintained</a>, installing `elmah.io.javascript` through Bower, is supported using `bower-npm-resolver`. Install the resolver:

```ps
npm install bower-npm-resolver --save
```

Add the resolver in your `.bowerrc` file:

```json
{
  "resolvers": [
    "bower-npm-resolver"
  ]
}
```

Install the `elmah.io.javascript` npm package:

```ps
bower install npm:elmah.io.javascript --save
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/bower_components/elmah.io.javascript/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="libman">

Add the `elmah.io.javascript` library in your `libman.json` file:

```json
{
  // ...
  "libraries": [
    // ...
    {
      "provider": "filesystem",
      "library": "https://raw.githubusercontent.com/elmahio/elmah.io.javascript/3.3.1/dist/elmahio.min.js",
      "destination": "wwwroot/lib/elmahio"
    }
  ]
}
```

or using the LibMan CLI:

```cmd
libman install https://raw.githubusercontent.com/elmahio/elmah.io.javascript/3.3.1/dist/elmahio.min.js --provider filesystem --destination wwwroot\lib\elmahio
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/lib/elmahio/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="nuget">

Install the `elmah.io.javascript` NuGet package:

```powershell fct_label="Package Manager"
Install-Package elmah.io.javascript
```
```cmd fct_label=".NET CLI"
dotnet add package elmah.io.javascript
```
```xml fct_label="PackageReference"
<PackageReference Include="elmah.io.javascript" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add elmah.io.javascript
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/Scripts/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="aspnetcore">

If not already configured, follow the guide [installing elmah.io in ASP.NET Core](https://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/).

Install the `Elmah.Io.AspNetCore.TagHelpers` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.TagHelpers
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.TagHelpers
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.TagHelpers" Version="3.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.TagHelpers
```

Copy and paste the following line to the top of the `_Layout.cshtml` file:

```html
@addTagHelper *, Elmah.Io.AspNetCore.TagHelpers
```

In the bottom of the file (but before referencing other JavaScript files), add the following tag helper:

```html
<elmah-io/>
```

If you want to log JavaScript errors from production only, make sure to move the `elmah-io` element inside the tag `<environment exclude="Development">`.

elmah.io automatically pulls your API key and log ID from the options specified as part of the installation for logging serverside errors from ASP.NET Core.

  </div>
</div>

That's it. All uncaught errors on your website, are now logged to elmah.io.

## Options

If you prefer configuring in code (or need to access the options for something else), API key and log ID can be configured by referencing the `elmahio.min.js` script without parameters:

```html
<script src="~/scripts/elmahio.min.js" type="text/javascript"></script>
```

Then initialize the logger in JavaScript:

```javascript
new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID'
});
```

##### Application name

The `application` property on elmah.io, can be set on all log messages by setting the `application` option:

```javascript
new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID',
    application: 'My application name'
});
```

##### Debug output

For debug purposes, debug output from the logger to the console can be enabled using the `debug` option:

```javascript
new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID',
    debug: true
});
```

##### Message filtering

Log messages can be filtered, by adding an `filter` handler in options:

```javascript
new Elmahio({
    // ...
    filter: function(msg) {
        return msg.severity === 'Verbose';
    }
});
```

In the example, all log [messages](#message-reference) with a severity of `Verbose`, are not logged to elmah.io.

## Events

##### Enriching log messages

Log messages can be enriched by subscribing to the `message` event:

```javascript
new Elmahio({
    // ...
}).on('message', function(msg) {
    if (!msg.data) msg.data = [];
    msg.data.push({key: 'MyCustomKey', value: 'MyCustomValue'});
});
```

In the example, all log [messages](#message-reference) are enriched with a data variable with they key `MyCustomKey` and value `MyCustomValue`.

##### Handling errors

To react on errors happening in elmah.io.javascript, subscribe to the `error` event:

```javascript
new Elmahio({
    // ...
}).on('error', function(status, text) {
    console.log('An error happened in elmah.io.javascript', status, text);
});
```

In the example, all errors are written to the console.

## Logging manually

You may want to log errors manually or even log information messages from JavaScript. To do so, `Elmahio` is actually a logging framework too:

```javascript
var logger = new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID'
});

logger.verbose('This is verbose');
logger.verbose('This is verbose', new Error('A JavaScript error object'));

logger.debug('This is debug');
logger.debug('This is debug', new Error('A JavaScript error object'));

logger.information('This is information');
logger.information('This is information', new Error('A JavaScript error object'));

logger.warning('This is warning');
logger.warning('This is warning', new Error('A JavaScript error object'));

logger.error('This is error');
logger.error('This is error', new Error('A JavaScript error object'));

logger.fatal('This is fatal');
logger.fatal('This is fatal', new Error('A JavaScript error object'));

logger.log({
  title: 'This is a custom log message',
  type: 'Of some type',
  severity: 'Error'
});

var msg = logger.message(); // Get a prefilled message
msg.title = "This is a custom log message";
logger.log(msg);
```

The `Error` object used, should be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank" rel="noopener noreferrer">JavaScript Error object</a>.

As for the `log`-function, check out [message reference](#message-reference).

> Manual logging only works when initializing the elmah.io logger from code.

### Logging from console

If you don't like to share the `Elmahio` logger or you want to hook elmah.io logging up to existing code, you can capture log messages from `console`. To do so, set the `captureConsoleMinimumLevel` option:

```javascript
var log = new Elmahio({
  apiKey: 'YOUR-API-KEY',
  logId: 'YOUR-LOG-ID',
  captureConsoleMinimumLevel: 'error'
});

console.error('This is an %s message.', 'error');
```

`captureConsoleMinimumLevel` can be set to one of the following values:

- `none`: will disable logging from console (default).
- `debug`: will capture logging from `console.debug`, `console.info`, `console.warn`, `console.error`.
- `info`: will capture logging from `console.info`, `console.warn`, `console.error`.
- `warn`: will capture logging from `console.warn`, `console.error`.
- `error`: will capture logging from `console.error`.

> Capturing the console only works when initializing the elmah.io logger from code. Also, `console.log` is not captured.

## IntelliSense

If installing through npm or similar, Visual Studio should pick up the TypeScript mappings from the elmah.io.javascript package. If not, add the following line in the top of the JavaScript file where you wan't elmah.io.javascript IntelliSense:

```xml
/// <reference path="/path/to/elmahio.d.ts" />
```

## Source maps

`elmah.io.javascript` automatically tries to translate stack traces from minified code into developer friendly traces using JavaScript source maps. In order for this to work, you will need to publish a valid `.map` source map file to your production environment and reference it in the end of your JavaScript:

```javascript
var v = 42;
//# sourceMappingURL=/script.map
```

## Samples

##### Angular

`elmah.io.javascript` works great with Angular applications too. To log all errors happening in your Angular app, install `elmah.io.javascript` through npm as described above. Then add `elmahio.min.js` to the `scripts` section in the `.angular-cli.json` file (`angular.json` in Angular 6):

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

###### AngularJS/Angular 1

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

##### React

To log all errors from a React application, install the `elmah.io.javascript` npm package as described above. Then modify the `App.js` file:

```javascript
// ...
import Elmahio from '../node_modules/elmah.io.javascript/dist/elmahio';

export default class App extends Component {
  // ...

  constructor() {
    super();
    var log = new Elmahio({
      apiKey: 'API_KEY',
      logId: 'LOG_ID'
    });
  }

  // ...
}
```

When initializing your React app, elmah.io is configured and all errors happening in the application are logged.

Check out the <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/Elmah.Io.JavaScript.React" target="_blank" rel="noopener noreferrer">Elmah.Io.JavaScript.React</a> sample for some real working code.

> React have a known bug where errors are submitted twice. For better error handling in React, you should look into [Error Boundaries](https://reactjs.org/docs/error-boundaries.html).

## Message reference

This is an example of the elmah.io.javascript `Message` object that is used in various callbacks, etc.:

```javascript
{
  title: 'The title of the message',
  detail: 'The error stack',
  source: 'The source of the error (typically a filename)',
  severity: 'Error',
  type: 'The type of the error',
  url: 'http://url.of/current/page',
  application: 'Application name set through options',
  queryString: [
    {key: 'id', value: '42'}
  ],
  data: [
    {key: 'User-Language', value: 'en-US'},
    {key: 'Color-Depth', value: '24'}
  ],
  serverVariables: [
    {key: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'}
  ]
}
```

For a complete definition, check out the `Message` interface in the [elmah.io.javascript TypeScript mappings](https://github.com/elmahio/elmah.io.javascript/blob/main/typescript/elmahio.d.ts).

## Troubleshooting

If errors aren't logged from JavaScript, here's a list of things to try out:

- Make sure that the log with the specified ID exists.
- Make sure that the log isn't disabled and/or contain any ignore filters that could ignore client-side errors.
- Make sure that the API key is valid and contain the *Messages* | *Write* permission.
- Enable debugging when initializing `elmah.io.javascript` to get additional debug and error messages from within the script printed to the browser console:

```javascript
new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID',
    debug: true
});
```

- If your webserver include the `Content-Security-Policy` header make sure to include `api.elmah.io` as an allowed domain.