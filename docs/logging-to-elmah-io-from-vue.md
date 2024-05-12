---
title: Logging to elmah.io from Vue
description: Monitoring and logging errors happening in Vue.js applications is easy with elmah.io. Learn about how to set up client-side logging in Vue.js.
---

[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples/Elmah.Io.JavaScript.VueJs)

# Logging to elmah.io from Vue

To log all errors from a Vue.js application, install the `elmah.io.javascript` npm package as described in [Logging from JavaScript](logging-to-elmah-io-from-javascript.md) or include it with a direct `<script>` include:

```javascript
<script src="https://cdn.jsdelivr.net/gh/elmahio/elmah.io.javascript@latest/dist/elmahio.min.js" type="text/javascript"></script>
```

Before initializing the application, include the following code:

```javascript
var logger = new Elmahio({
  apiKey: "API_KEY",
  logId: "LOG_ID"
});
Vue.config.errorHandler = function (err, vm, info) {
  logger.error(err.message, err);
};
Vue.config.warnHandler = function (msg, vm, trace) {
  logger.warning(msg);
};
```

`elmah.io.javascript` will automatically log all errors raised through `window.onerror`and log additional errors and warnings from Vue.js through the `errorHandler` and `warnHandler` functions. If you want to exclude warnings, simply remove the `warnHandler` function.

Check out the <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/Elmah.Io.JavaScript.VueJs" target="_blank" rel="noopener noreferrer">Elmah.Io.JavaScript.VueJs</a> sample for some real working code.