---
title: Heartbeats Troubleshooting
description: Here you will a list of common problems with elmah.io Heartbeats and how to solve them. Resolve timeouts and more by including a bit of code.
---

# Heartbeats Troubleshooting

## Common problems and how to fix them

Here you will a list of common problems and how to solve them.

### Timeout when creating heartbeats through Elmah.Io.Client

If you experience a timeout when calling the `Healthy`, `Degraded`, or `Unhealthy` method, you may want to adjust the default HTTP timeout. `Elmah.Io.Client` has a default timeout of 5 seconds to make sure that logging to elmah.io from a web application won't slow down the web app too much in case of slow response time from the elmah.io API. While 99.9% of the requests to the elmah.io API finish within this timeout, problems with Azure, the network connection, and a lot of other issues can happen.

Since heartbeats typically run outside the scope of a web request, it's safe to increase the default HTTP timeout in this case:

```csharp
var api = ElmahioAPI.Create("API_KEY", new ElmahIoOptions
{
    Timeout = new TimeSpan(0, 0, 30)
});
```

The example set a timeout of 30 seconds.

### SocketException when creating heartbeats through Elmah.Io.Client

A `System.Net.Sockets.SocketException` when communicating with the elmah.io API can mean multiple things. The API can be down or there's network problems between your machine and the API. Increasing the timeout as shown in the previous section should be step one. If you still experience socket exceptions, it might help to implement retries. This can be done by setting up a custom `HttpClient`:

```csharp
builder.Services
    .AddHttpClient("elmahio")
    .AddPolicyHandler(HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(3, i => TimeSpan.FromSeconds(i)));
```

The `AddPolicyHandler` is available when installing the `Microsoft.Extensions.Http.Polly` NuGet package. Next, create the elmah.io client with the custom `HttpClient`:

```csharp
var httpClient = httpClientFactory.CreateClient("elmahio");
var elmahIoClient = ElmahioAPI.Create("API_KEY", options, httpClient);
```