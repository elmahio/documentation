---
title: Logging to elmah.io from React
description: Utilize elmah.io to log all errors from a single-page React app. Detailed client information, instant notifications, and much more with elmah.io.
---

[![NuGet](https://img.shields.io/nuget/v/elmah.io.javascript.svg)](https://www.nuget.org/packages/elmah.io.javascript)
[![npm](https://img.shields.io/npm/v/elmah.io.javascript.svg)](https://www.npmjs.com/package/elmah.io.javascript)
[![Samples](https://img.shields.io/badge/samples-2-brightgreen.svg)](https://github.com/elmahio/elmah.io.javascript/tree/main/samples)

# Logging to elmah.io from React

To log all errors from a React application, install the `elmah.io.javascript` npm package as described in [Logging from JavaScript](https://docs.elmah.io/logging-to-elmah-io-from-javascript/). Then modify the `index.js` or `index.tsx` file:

```javascript
// ...
import Elmahio from 'elmah.io.javascript'; 

new Elmahio({
  apiKey: 'API_KEY',
  logId: 'LOG_ID'
});

// After this the ReactDOM.render etc. will be included
```

When launching your React app, elmah.io is configured and all errors happening in the application are logged.

Check out the <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/elmahio-react" target="_blank" rel="noopener noreferrer">elmahio-react</a> and <a href="https://github.com/elmahio/elmah.io.javascript/tree/main/samples/elmahio-react-typescript" target="_blank" rel="noopener noreferrer">elmahio-react-typescript</a> samples for some real working code.

> React have a known bug/feature in DEV mode where errors are submitted twice. For better error handling in React, you should look into <a href="https://legacy.reactjs.org/docs/error-boundaries.html" target="_blank" rel="noopener noreferrer">Error Boundaries</a>.