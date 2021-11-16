---
title: How to get elmah.io to resolve the correct client IP
description: In some cases, elmah.io may not be able to resolve the IP or resolve a wrong IP address. Find help getting the right client IP into elmah.io.
---

# How to get elmah.io to resolve the correct client IP

elmah.io try to resolve the IP of the client causing a log message, no matter what severity (Error, Information, etc.) and platform (browser, web-server, etc.) a log message is sent from. This is done by looking at multiple pieces of information provided by the sender. In some cases, elmah.io may not be able to resolve the IP or resolve a wrong IP address. In this document, you will find help getting the right client IP into elmah.io.

## Missing IP when using a proxy

If you are using a proxy layer in between the client and your web server, you may experience log messages without a client IP. This is probably caused by the proxy hiding the original IP from your web server. Most proxies offer an alternative server variable like the `X-Forwarded-For` header. You can inspect the server variables on the *Server Variables* tab on elmah.io and check if your proxy includes the original IP in any of the variables. We support custom headers from a range of proxies (like Cloudflare). Most proxies support some kind of settings area where the `X-Forwarded-For` header can be enabled. If you are using a proxy that uses custom headers, please make sure to reach out and we may want to include the custom header to elmah.io.

## Wrong IP when using a proxy

If the client IP is wrong when behind a proxy, it is typically because the proxy replaces the client IP when calling your server with the IP of its server. This is a poor practice and makes it very hard for elmah.io to figure out which IP belongs to the user and which one to the proxy. Luckily, this is configurable in a lot of proxies through their settings area.

## Missing IP

This can be caused by several issues. In most instances, the client doesn't include any server variables that reveal the IP address. In this case, the client IP will not be available within the elmah.io UI. In some cases, you may know the user's IP from session variables or similar. To include an IP on messages logged to elmah.io, you can implement the `OnMessage` event or action, depending on which integration you are using. In this example, we use the `OnMessage` event on the `Elmah.Io.Client` package to include the user's IP manually:

```csharp
var userIp = "1.1.1.1"; // <-- just for the demo
var client = ElmahioAPI.Create("API_KEY");
client.Messages.OnMessage += (sender, args) =>
{
    var message = args.Message;
    if (message.ServerVariables == null) message.ServerVariables = new List<Item>();
    message.ServerVariables.Add(new Item("X-FORWARDED-FOR", userIp));
};
```