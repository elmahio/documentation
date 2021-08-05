# JavaScript Troubleshooting

## Errors aren't logged

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

## Missing information on log messages

When logging uncaught errors with `elmah.io.javascript` you get a lot of additional information stored as part of the log messages. Like the client IP and browser details. If you don't see this information on the messages logged from your application, it's probably because you are using the `log` function:

```javascript
logger.log({
  title: 'This is a custom log message',
  severity: 'Error'
});
```

The `log` function only logs what you tell it to log. To include the additional information, switch to use the `message` builder:

```javascript
var msg = logger.message(); // Get a prefilled message
msg.title = 'This is a custom log message';
msg.severity = 'Error';
logger.log(msg);
```

## Missing stack trace on errors

If errors logged through `elmah.io.javascript` have a stack trace, it is logged as part of the error on elmah.io. If errors don't include a stack trace, the following actions may fix it:

- Not all errors include a stack trace. Make sure that the thrown error does include a stack trace by inspecting:

```javascript
e.stack
```

- Move the `elmahio.js` script import to the top of the list of all referenced JavaScript files.
- Remove any `defer` or `async` attributes from the `elmahio.js` script import.

## CORS problems when running on localhost

When running with `elmah.io.javascript` on localhost you may see errors in the console like this:

```bash
Access to XMLHttpRequest at 'https://api.elmah.io/v3/messages/...' from origin 'http://localhost' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Browsers like Chrome doesn't allow CORS when running locally. There are three ways to fix this:

1. Run Chrome with the `--disable-web-security` switch.
2. Run your website on a hostname like `https://mymachine`.
3. Allow CORS on localhost with extensions like [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related?hl=en) for Chrome or [Allow CORS: Access-Control-Allow-Origin](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/) for Firefox.