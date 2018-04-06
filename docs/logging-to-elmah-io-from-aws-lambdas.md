# Logging from AWS Lambdas

Since AWS now supports .NET Core, logging to elmah.io from a lambda is easy.

## Logging from AWS Serverless Application

AWS Serverless Applications are running on ASP.NET Core. The configuration therefore matches our documentation for ASP.NET Core. Check out [Logging from ASP.NET Core](https://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/) for details on how to log all uncaught exceptions from an AWS Serverless Application.

The .NET SDK for AWS comes with native support for logging to CloudWatch. We recommend to use Microsoft.Extensions.Logging for logging everything to CloudWatch and warnings and errors to elmah.io. The configuration follows that of [Logging from Microsoft.Extensions.Logging](https://docs.elmah.io/logging-to-elmah-io-from-microsoft-extensions-logging/).

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

## Logging from AWS Lambda Project

AWS Lambda Project comes with native support for CloudWatch too. In our experience, it's not possible to configure multiple destinations on `LambdaLogger`, why you would want to use another framework when logging to elmah.io from an AWS Lambda Project. We recommend using a logging framework like [Serilog](https://docs.elmah.io/logging-to-elmah-io-from-serilog/), [Microsoft.Extensions.Logging](logging-from-a-console-application), [NLog](https://docs.elmah.io/logging-to-elmah-io-from-nlog/) or [log4net](https://docs.elmah.io/logging-to-elmah-io-from-log4net/).