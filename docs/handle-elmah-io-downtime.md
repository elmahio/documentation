---
title: Handle elmah.io downtime
description: Learn how to use the elmah.io client to monitor if logging messages to the elmah.io API fails. Implement a retry, log to somewhere else, etc.
---

# Handle elmah.io downtime

Like every other SaaS product out there, we cannot promise you 100% uptime on elmah.io. We understand, that your logging data is extremely important for your business and we do everything in our power to secure that elmah.io is running smoothly. To monitor our APIs and websites, check out [status.elmah.io](https://status.elmah.io/).

It is our general recommendation to implement code that listens for communication errors with the elmah.io API and log errors elsewhere. How you do this depends on which elmah.io NuGet package you have installed. The documentation for each package will show how to subscribe to errors. For `Elmah.Io.Client` it would look similar to this:

```csharp
var elmahIo = ElmahioAPI.Create("API_KEY");
elmahIo.Messages.OnMessageFail += (sender, args) =>
{
    var message = args.Message;
    var exception = args.Error;

    // TODO: log it
};
```

For a logging framework like Serilog, it would look similar to this:

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.ElmahIo(new ElmahIoSinkOptions("API_KEY", new Guid("LOG_ID"))
    {
        OnError = (msg, ex) =>
        {
            // TODO: log it
        }
    })
    .CreateLogger();
```

It is important not to log errors in `OnMessageFail` and `OnError` callbacks to elmah.io, since that could cause an infinite loop. Check out the documentation for the package you are using for additional details.

## Response explanation

Here's an overview of the types of errors you can experience from the API:

| Response | Meaning |
| --- | --- |
| Timeout | Something is very wrong with our API or Azure. You can be sure that we are working 24/7 to fix it. |
| 500 | The API is reachable, but we have a problem communicating with Azure Service bus. Azure has great uptime and all of our resources are dedicated and replicated. Still, we experience short periods of downtime from time to time. |
| 429 | We allow a maximum (per API key) of 500 requests per minute and 3600 per hour. 429 means that you have crossed that line. This status code doesn't indicate that the API is down. |
| 4xx | Something is wrong with the request. Check out the [API documentation](https://api.elmah.io/swagger/index.html) for details. This status code doesn't indicate that the API is down. |