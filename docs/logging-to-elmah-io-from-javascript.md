# Logging to elmah.io from JavaScript

elmah.io doesn't only support server-side .NET logging. We also log JavaScript errors happening on your website. Logging client-side errors, requires nothing more than installing the `elmahio.js` script on your website.

Pick an installation method of your choice:

<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#manually" aria-controls="home" role="tab" data-toggle="tab">Manually</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#cdn" aria-controls="home" role="tab" data-toggle="tab">CDN</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#npm" aria-controls="profile" role="tab" data-toggle="tab">npm</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#bower" aria-controls="profile" role="tab" data-toggle="tab">Bower</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#libman" aria-controls="profile" role="tab" data-toggle="tab">Library Manager</a></li>
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
<script src="https://cdn.rawgit.com/elmahio/elmah.io.js/1.0.2/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
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

Install the `elmah.io.js` Bower package:

```ps
bower install elmah.io.js
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
      "library": "https://raw.githubusercontent.com/elmahio/elmah.io.js/1.0.2/dist/elmahio.min.js",
      "destination": "wwwroot/lib/elmahio"
    }
  ]
}
```

Reference `elmahio.min.js` just before the `</body>` tag (but before all other JavaScripts) in your shared `_Layout.cshtml` or all HTML files, depending on how you've structured your site:

```html
<script src="~/lib/elmahio/dist/elmahio.min.js?apiKey=YOUR-API-KEY&logId=YOUR-LOG-ID" type="text/javascript"></script>
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

log.verbose('This is verbose');
log.verbose('This is verbose', new Error("A JavaScript error object"));

log.debug('This is debug');
log.debug('This is debug', new Error("A JavaScript error object"));

log.information('This is information');
log.information('This is information', new Error("A JavaScript error object"));

log.warning('This is warning');
log.warning('This is warning', new Error("A JavaScript error object"));

log.error('This is error');
log.error('This is error', new Error("A JavaScript error object"));

log.fatal('This is fatal');
log.fatal('This is fatal', new Error("A JavaScript error object"));
```

> Manual logging only works when initializing the elmah.io logger from code.