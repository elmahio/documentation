---
title: Logging to elmah.io from SvelteKit
description: Utilize elmah.io to log all errors from a single-page SvelteKit app. Detailed client information, instant notifications, and much more with elmah.io.
---

[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-1-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples/elmahio-sveltekit)

# Logging to elmah.io from SvelteKit

To log all errors from a SvelteKit application, install the `elmah.io.javascript` npm package as described in [Logging from JavaScript](https://docs.elmah.io/logging-to-elmah-io-from-javascript/). Then add the following code to the `hooks.client.js` file. If the file does not exist, make sure to create it in the `src` folder since SvelteKit will automatically load it from there.

```javascript
import Elmahio from 'elmah.io.javascript';
var logger = new Elmahio({
    apiKey: 'API_KEY',
    logId: 'LOG_ID'
});

/** @type {import('@sveltejs/kit').HandleClientError} */
export function handleError({ error, event }) {
    if (error && error.message) {
        logger.error(error.message, error);
    } else {
        logger.error('Error in application', error);
    }
}
```

When launching your SvelteKit app, elmah.io is configured and all errors happening in the application are logged. For now, `elmah.io.javascript` only supports SvelteKit apps running inside the browser, why implementing the `HandleServerError` is not supported.

Check out the <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/elmahio-sveltekit" target="_blank" rel="noopener noreferrer">elmahio-sveltekit</a> sample for some real working code.