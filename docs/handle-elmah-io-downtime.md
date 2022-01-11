---
title: Handle elmah.io downtime
description: Learn how to use the elmah.io client to monitor if logging messages to the elmah.io API fails. Implement a retry, log to somewhere else, etc.
---

# Handle elmah.io downtime

Like every other SaaS product out there, we cannot promise you 100% uptime on elmah.io. We understand, that your logging data is extremely important for your business and we do everything in our power to secure that elmah.io is running smoothly. To monitor our APIs and websites, check out [status.elmah.io](https://status.elmah.io/).

But how do you handle the time where you need to log a message in elmah.io and the service is down? You have a few options actually:

**Subscribe to the `OnMessageFail` event**

You can subscribe an event handler to listen for this situation (where communicating with the elmah.io API fails). To hook up an event handler, write this piece of code in your initialization code:

```csharp
Elmah.ErrorLog.GetDefault(null); // Forces creation of logger client
var logger = ErrorLog.Client;
logger.OnMessageFail += (sender, args) =>
{
    var message = args.Message;
    var exception = args.Error;
    // TODO: log message and/or exception somewhere else.
};
```

The example is for ASP.NET and using the `Elmah.Io.Client` package. Similar options are available for other web and logging frameworks.

**Log to multiple logs**

If you want to be able to roll back to another solution, in case elmah.io goes down, you can actually log to multiple error logs as described here: [Logging to multiple ELMAH logs](/logging-to-multiple-elmah-logs/). If you are using one of our integrations for other web and logging frameworks, various options are available too. This could be logging to a local file or database.

We constantly work to improve the uptime of the entire solution.

## Response explanation

Here's an overview of the types of errors you can experience from the API:

| Response | Meaning |
| --- | --- |
| Timeout | Something is very wrong with our API or Azure. You can be sure that we are working 24/7 to fix it. |
| 500 | The API is reachable, but we have a problem communicating with Azure Service bus. Azure has great uptime and all of our resources are dedicated and replicated. Still, we experience short periods of downtime from time to time. |
| 429 | We allow a maximum (per API key) of 500 requests per minute and 3600 per hour. 429 means that you have crossed that line. This status code doesn't indicate that the API is down. |
| 4xx | Something is wrong with the request. Check out the [API documentation](http://api.elmah.io/swagger/ui/index) for details. This status code doesn't indicate that the API is down. |