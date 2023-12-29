---
title: Logging to elmah.io from HttpClient
description: Learn how to set up logging to elmah.io from a HttpClient. With a custom logger you can decide how you want to log from using a HttpClient.
---

# Logging to elmah.io from HttpClient

When using the `HttpClient` class to make HTTP requests, log messages will be automatically published to any `ILogger` registered in your application. All requests will cause 4 log messages to be produced in your elmah.io log if you have `Information` logging enabled. While some prefer to have an extended level of log messages produced, others might want just a single log message per request or only log failing requests. This can be done by implementing a custom logger for `HttpClient`:

```csharp
public class HttpClientLogger : IHttpClientLogger
{
    private readonly ILogger<HttpClientLogger> _logger;

    public HttpClientLogger(ILogger<HttpClientLogger> logger)
    {
        _logger = logger;
    }

    public object? LogRequestStart(HttpRequestMessage request)
    {
        // We only log when there's a response or an error in this example.
        return null;
    }

    public void LogRequestStop(
        object? context,
        HttpRequestMessage request,
        HttpResponseMessage response,
        TimeSpan elapsed)
    {
        _logger.LogInformation(
            "HttpClient made a {method} request to {url} and received {statusCode}",
            request.Method,
            request.RequestUri,
            (int?)response.StatusCode);
    }

    public void LogRequestFailed(
        object? context,
        HttpRequestMessage request,
        HttpResponseMessage? response,
        Exception exception,
        TimeSpan elapsed)
    {
        _logger.LogError(
            exception,
            "HttpClient made a failing {method} request to {url} and received {statusCode}",
            request.Method,
            request.RequestUri,
            (int?)response?.StatusCode);
    }
}
```

The `HttpClientLogger` class implements that `IHttpClientLogger` interface. Three hooks are provided as part of this interface: request starting, request stopping, request failed. In the code above, we create a single `Information` message when a response is received and a single `Error` message in case of an error. By using structured properties like `{method}` and `{statusCode}` we make sure that elmah.io show these pieces of data in the right fields. The format and wording of each log message can be tailored to your preference.

Registering the custom logger can be done like this:

```csharp
builder
    .Services
    .AddHttpClient("myclient")
    .RemoveAllLoggers()
    .AddLogger<HttpClientLogger>();
```

This example registers a new `HttpClient` named `myclient`. By calling the `RemoveAllLoggers` method we make sure that the four default log messages are not logged. In the last line, the `HttpClientLogger` class that we implemented is set as the logger for this `HttpClient`.