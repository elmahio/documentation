# Logging from Express

That's right. elmah.io doesn't only work with .NET. To integrate elmah.io into a Node Express web application, install the [elmah.io](https://www.npmjs.com/package/elmah.io) npm package

```powershell
npm install elmah.io
```

Add the following to your Express application:

```javascript
var elmah = require("elmah.io");
var express = require("express");
 
var app = express();
app.use(elmah.auto({logId:"LOG_ID", application:"My App Name", version: "42.0.0"}));
```

Replace `LOG_ID` with your log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)). Every error is logged to elmah.io.