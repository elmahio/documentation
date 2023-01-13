---
title: Logging to elmah.io from AWS Lambdas
description: Learn how to set up automatic error logging of all uncaught errors inside AWS Lambdas. Use elmah.io to monitor your serverless environments.
---

# Logging to elmah.io from AWS Lambdas

[TOC]

Since AWS now supports .NET Core, logging to elmah.io from a lambda is easy.

## Logging to elmah.io from AWS Serverless Application

AWS Serverless Applications are running on ASP.NET Core. The configuration matches our documentation for ASP.NET Core. Check out [Logging from ASP.NET Core](https://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/) for details on how to log all uncaught exceptions from an AWS Serverless Application.

The .NET SDK for AWS comes with native support for logging to CloudWatch. We recommend using Microsoft.Extensions.Logging for logging everything to CloudWatch and warnings and errors to elmah.io. The configuration follows that of [Logging from Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/).

AWS Serverless Applications doesn't have a `Program.cs` file. To configure logging, you will need to modify either `LambdaEntryPoint.cs`, `LocalEntryPoint.cs` or both:

```csharp
public class LambdaEntryPoint : Amazon.Lambda.AspNetCoreServer.APIGatewayProxyFunction
{
    protected override void Init(IWebHostBuilder builder)
    {
        builder
            .UseStartup<Startup>()
            .ConfigureLogging((ctx, logging) =>
            {
                logging.AddElmahIo(options =>
                {
                    options.ApiKey = "API_KEY";
                    options.LogId = new Guid("LOG_ID");
                });
                logging.AddFilter<ElmahIoLoggerProvider>(null, LogLevel.Warning);
            });
    }
}
```

The same configuration would go into `LocalEntryPoint.cs`, if you want to log from localhost as well.

## Logging when using Amazon.Lambda.AspNetCoreServer.Hosting

AWS supports running ASP.NET Core applications as Lambdas using the `Amazon.Lambda.AspNetCoreServer.Hosting` package. This can serve as an easy way for .NET developers like us to create minimal API-based endpoints and deploy them as Lambda functions on AWS. There's a downside to deploying ASP.NET Core this way since AWS will kill the process when it decides that it is no longer needed. The `Elmah.Io.Extensions.Logging` package runs an internal message queue and stores log messages asynchronously to better handle a large workload. When AWS kills the process without disposing of configured loggers, log messages queued for processing are left unhandled.

To solve this, `Elmah.Io.Extensions.Logging` supports a property named `Synchronous` that disables the internal message queue and stores log messages in a synchronous way. You may still experience log messages not being stored, but that's a consequence of AWS's choice of killing the process rather than shutting it down nicely (like ASP.NET Core).

To log messages synchronously, include the following code in your logging setup:

```csharp
builder.Services.AddLogging(logging =>
{
    logging.AddElmahIo(options =>
    {
        // ...
        options.Synchronous = true;
    });
});
```

Be aware that logging a large number of log messages synchronously, may slow down your application and/or cause thread exhaustion. We recommend only logging errors this way and not debug, information, and similar.

## Logging from AWS Lambda Project

AWS Lambda Project comes with native support for CloudWatch too. In our experience, it's not possible to configure multiple destinations on `LambdaLogger`, why you would want to use another framework when logging to elmah.io from an AWS Lambda Project. We recommend using a logging framework like [Serilog](https://docs.elmah.io/logging-to-elmah-io-from-serilog/), [Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/), [NLog](https://docs.elmah.io/logging-to-elmah-io-from-nlog/), or [log4net](https://docs.elmah.io/logging-to-elmah-io-from-log4net/).