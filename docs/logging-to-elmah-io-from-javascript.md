[![NuGet](https://img.shields.io/nuget/v/Elmah.Io.Js.svg)](https://www.nuget.org/packages/elmah.io.js)
[![npm](https://img.shields.io/nuget/v/Elmah.Io.Js.svg)](https://img.shields.io/npm/v/elmah.io.js.svg)
[![Samples](https://img.shields.io/badge/samples-3-brightgreen.svg)](https://github.com/elmahio/elmah.io.js/tree/master/samples)

# Logging to elmah.io from JavaScript

> elmah.io.js is currently in beta. We don't recommend this for production just yet. Feel free to play around with it, but remember to <a href="https://headwayapp.co/elmah-io-changelog/deprecating-the-v2-api-68030" target="_blank" rel="noopener noreferrer">disable access to the v2 API</a> on your log and [generate a new API key](https://blog.elmah.io/api-key-permissions/) with `messages_write` permission only. Without these changes, everyone will be able to browse your logs (<a href="https://www.troyhunt.com/aspnet-session-hijacking-with-google/" target="_blank" rel="noopener noreferrer">you don't want that!</a>).

[TOC]

elmah.io doesn't only support server-side .NET logging. We also log JavaScript errors happening on your website. Logging client-side errors, requires nothing more than installing the `elmahio.js` script on your website.

## Installation

Pick an installation method of your choice:

<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#manually" aria-controls="home" role="tab" data-toggle="tab">Manually</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#cdn" aria-controls="home" role="tab" data-toggle="tab">CDN</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#npm" aria-controls="profile" role="tab" data-toggle="tab">npm</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#nuget" aria-controls="profile" role="tab" data-toggle="tab">NuGet</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#libman" aria-controls="profile" role="tab" data-toggle="tab">Library Manager</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#bower" aria-controls="profile" role="tab" data-toggle="tab">Bower</a></li>
</ul>

  <div class="tab-content">
<div role="tabpanel" class="tab-pane active" id="manually">

Download the latest release as a zip: [https://github.com/elmahio/elmah.io.js/releases](https://github.com/elmahio/elmah.io.js/releases)

Unpack and copy `elmahio.min.js` to the `Scripts` folder or whatever folder you use to store JavaScript files.

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/Scripts/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

</div>
  <div role="tabpanel" class="tab-pane" id="cdn">

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="https://cdn.rawgit.com/elmahio/elmah.io.js/3.0.0-beta1/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="npm">

Install the elmah.io.js npm package:

```ps
npm install elmah.io.js
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/node_modules/elmah.io.js/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="bower">

Since Bower is <a href="https://bower.io/blog/2017/how-to-migrate-away-from-bower/" target="_blank" rel="noopener noreferrer">no longer maintained</a>, installing `elmah.io.js` through Bower, is supported using `bower-npm-resolver`. Install the resolver:

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

Install the `elmah.io.js` npm package:

```ps
bower install npm:elmah.io.js --save
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/bower_components/elmah.io.js/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="libman">

Add the `elmah.io.js` library in your `libman.json` file:

```json
{
  ...
  "libraries": [
    ...
    {
      "provider": "filesystem",
      "library": "https://raw.githubusercontent.com/elmahio/elmah.io.js/3.0.0-beta1/dist/elmahio.min.js",
      "destination": "wwwroot/lib/elmahio"
    }
  ]
}
```

or using the LibMan CLI:

```powershell
libman install https://raw.githubusercontent.com/elmahio/elmah.io.js/3.0.0-beta1/dist/elmahio.min.js --provider filesystem --destination wwwroot\lib\elmahio
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/lib/elmahio/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

  </div>
  <div role="tabpanel" class="tab-pane" id="nuget">

Install the `elmah.io.js` NuGet package:

```ps
Install-Package elmah.io.js -Prerelease
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/Scripts/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
```

  </div>
</div>

That's it. All uncaught errors on your website, are now logged to elmah.io.

## Configuration in code

If you prefer configuring in code (or need to access the options for something else), API key and log ID can be configured by referencing the `elmahio.min.js` script with parameters:

```html
<script src="~/scripts/elmahio.min.js" type="text/javascript"></script>
```

Then initialize the logger in JavaScript:

```javascript
new Elmahio({
    apiKey: 'YOUR-API-KEY',
    logId: 'YOUR-LOG-ID'
});
```

The `application` property on elmah.io, can be set on all log messages by setting the `application` option:

```javascript
new Elmahio({
    apiKey: 'YOUR-API-KEY',
    logId: 'YOUR-LOG-ID',
    application: 'My application name'
});
```

For debug purposes, debug output from the logger to the console can be enabled using the `debug` option:

```javascript
new Elmahio({
    apiKey: 'YOUR-API-KEY',
    logId: 'YOUR-LOG-ID',
    debug: true
});
```

## Logging manually

You may want to log errors manually or even log information messages from JavaScript. To do so, `Elmahio` is actually a logging framework too:

```javascript
var logger = new Elmahio({
    apiKey: 'YOUR-API-KEY',
    logId: 'YOUR-LOG-ID'
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
```

The `Error` object used, should be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank" rel="noopener noreferrer">JavaScript Error object</a>.

As for the `log`-function, check out [message reference](#message-reference).

> Manual logging only works when initializing the elmah.io logger from code.

## Events

##### Filtering log messages

Log messages can be filtered, by adding an `OnFilter` callback on the options:

```javascript
new Elmahio({
    ...
    onFilter: function(msg) {
        return msg.severity === 'Verbose';
    }
})
```

In the example, all log [messages](#message-reference) with a severity of `Verbose`, are not logged to elmah.io.

##### Enriching log messages

Log messages can be enriched by adding an `onMessage` callback on the options:

```javascript
new Elmahio({
    ...
    onMessage: function(msg) {
        if (!msg.data) msg.data = [];
        msg.data.push({key: 'MyCustomKey', value: 'MyCustomValue'});
    }
});
```

In the example, all log [messages](#message-reference) are enriched with a data variable with they key `MyCustomKey` and value `MyCustomValue`.

##### Handling errors

To react on errors happening in elmah.io.js, add a callback to `onError`:

```javascript
new Elmahio({
    ...
    onError: function(status, text) {
        console.log('An error happened in elmah.io.js', status, text);
    }
});
```

In the example, all errors are written to the console.

## Angular

`elmah.io.js` works great with Angular applications too. To log all errors happening in your Angular app, install `elmah.io.js` through npm as described above. Then add `elmahio.min.js` to the `scripts` section in the `.angular-cli.json` file (`angular.json` in Angular 6):

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  ...
  "apps": [
    {
      ...
      "scripts": [
        "../node_modules/elmah.io.js/dist/elmahio.min.js"
      ],
      ...
    }
  ],
  ...
}
```

In the `app.module.ts` file, add a new `ErrorHandler` and add it to the `providers` section:

```typescript
import { NgModule, ErrorHandler } from '@angular/core';
...

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
    ...
  ],
  imports: [
    ...
  ],
  providers: [{ provide: ErrorHandler, useClass: ElmahIoErrorHandler }],
  ...
})
```

All errors are shipped to the `handleError`-function by Angular and logged to elmah.io. Check out the <a href="https://github.com/elmahio/elmah.io.js/tree/master/samples/Elmah.Io.Js.Angular" target="_blank" rel="noopener noreferrer">Elmah.Io.Js.Angular</a> sample for some real working code.

## Message reference

This is an example of the elmah.io.js `msg` object that is used in various callbacks, etc.:

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