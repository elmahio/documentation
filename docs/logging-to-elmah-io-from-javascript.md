---
title: Logging to elmah.io from JavaScript
description: Set up error monitoring of single-page applications using elmah.io's integration with JavaScript. Works with React, Angular, Vue, and more.
---

[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-7-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples)

# Logging to elmah.io from JavaScript

[TOC]

elmah.io doesn't only support server-side .NET logging. We also log JavaScript errors happening on your website. Logging client-side errors require nothing more than installing the `elmahio.js` script on your website.

> Remember to [generate a new API key](https://docs.elmah.io/how-to-configure-api-key-permissions/) with `messages_write` permission only. This makes it easy to revoke the API key if someone starts sending messages to your log with your key.

`elmahio.js` supports all modern browsers like Chrome, Edge, Firefox, and Safari. Internet Explorer 10 and 11 are supported too, but because of internal dependencies on the `stacktrace-gps` library, nothing older than IE10 is supported.

If you want to see `elmahio.js` in action before installing it on your site, feel free to play on the [Playground](https://jsplayground.elmah.io/).

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

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="manually" markdown="1">

Download the latest release as a zip: [https://github.com/elmahio/elmah.io.javascript/releases](https://github.com/elmahio/elmah.io.javascript/releases)

Unpack and copy `elmahio.min.js` to the `Scripts` folder or whatever folder you use to store JavaScript files.

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/Scripts/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

</div>

<div role="tabpanel" class="tab-pane" id="cdn" markdown="1">

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="https://cdn.jsdelivr.net/gh/elmahio/elmah.io.javascript@3.5.2/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

</div>

<div role="tabpanel" class="tab-pane" id="npm" markdown="1">

Install the elmah.io.javascript npm package:

```ps
npm install elmah.io.javascript
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/node_modules/elmah.io.javascript/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

</div>

<div role="tabpanel" class="tab-pane" id="bower" markdown="1">

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

<div role="tabpanel" class="tab-pane" id="libman" markdown="1">

Add the `elmah.io.javascript` library in your `libman.json` file:

```json
{
  // ...
  "libraries": [
    // ...
    {
      "provider": "filesystem",
      "library": "https://raw.githubusercontent.com/elmahio/elmah.io.javascript/3.5.2/dist/elmahio.min.js",
      "destination": "wwwroot/lib/elmahio"
    }
  ]
}
```

or using the LibMan CLI:

```cmd
libman install https://raw.githubusercontent.com/elmahio/elmah.io.javascript/3.5.2/dist/elmahio.min.js --provider filesystem --destination wwwroot\lib\elmahio
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/lib/elmahio/dist/elmahio.min.js?apiKey=API_KEY&logId=LOG_ID" type="text/javascript"></script>
```

</div>

<div role="tabpanel" class="tab-pane" id="nuget" markdown="1">

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

<div role="tabpanel" class="tab-pane" id="aspnetcore" markdown="1">

If not already configured, follow the guide [installing elmah.io in ASP.NET Core](https://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/).

Install the `Elmah.Io.AspNetCore.TagHelpers` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.TagHelpers
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.TagHelpers
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.TagHelpers" Version="4.*" />
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

The `application` property on elmah.io can be set on all log messages by setting the `application` option:

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

Log messages can be filtered, by adding a `filter` handler in options:

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

In the example, all log [messages](#message-reference) are enriched with a data variable with the key `MyCustomKey` and value `MyCustomValue`.

##### Handling errors

To react to errors happening in elmah.io.javascript, subscribe to the `error` event:

```javascript
new Elmahio({
    // ...
}).on('error', function(status, text) {
    console.log('An error happened in elmah.io.javascript', status, text);
});
```

In the example, all errors are written to the console.

## Breadcrumbs

Breadcrumbs can be used to decorate errors with events or actions happening just before logging the error. Breadcrumbs can be added manually:

```javascript
logger.addBreadcrumb('User clicked button x', 'Information', 'click');
```

You would want to enrich your code with a range of different breadcrumbs depending on important user actions in your application.

As default, a maximum of 10 breadcrumbs are stored in memory at all times. The list acts as first in first out, where adding a new breadcrumb to a full list will automatically remove the oldest breadcrumb in the list. The allowed number of breadcrumbs in the list can be changed using the `breadcrumbsNumber` option:

```javascript
var logger = new Elmahio({
    // ...
    breadcrumbsNumber: 15
});
```

This will store a maximum of 15 breadcrumbs. Currently, we allow `25` as the highest possible value.

`elmah.io.javascript` can also be configured to automatically generate breadcrumbs from important actions like click events and xhr:

```javascript
var logger = new Elmahio({
    // ...
    breadcrumbs: true
});
```

We are planning to enable automatic breadcrumbs in the future but for now, it's an opt-in feature. Automatic breadcrumbs will be included in the same list as manually added breadcrumbs why the `breadcrumbsNumber` option is still valid.

## Logging manually

You may want to log errors manually or even log information messages from JavaScript. To do so, `Elmahio` is a logging framework too:

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

var msg = logger.message(new Error('A JavaScript error object')); // Get a prefilled message including error details
// Set custom variables. If not needed, simply use logger.error(...) instead.
logger.log(msg);
```

The `Error` object used, should be a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank" rel="noopener noreferrer">JavaScript Error object</a>.

As for the `log`-function, check out [message reference](#message-reference).

> Manual logging only works when initializing the elmah.io logger from code.

### Logging from console

If you don't like to share the `Elmahio` logger or you want to hook elmah.io logging up to existing code, you can capture log messages from `console`. To do so, set the `captureConsoleMinimumLevel` option:

```javascript
var log = new Elmahio({
  apiKey: 'API_KEY',
  logId: 'LOG_ID',
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

If installing through npm or similar, Visual Studio should pick up the TypeScript mappings from the elmah.io.javascript package. If not, add the following line at the top of the JavaScript file where you want elmah.io.javascript IntelliSense:

```xml
/// <reference path="/path/to/elmahio.d.ts" />
```

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