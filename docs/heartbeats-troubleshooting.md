# Heartbeats Troubleshooting

## Common problems and how to fix them

Here you will a list of common problems and how to solve them.

### Timeout when creating heartbeats through Elmah.Io.Client

If you experience a timeout when calling the `Healthy`, `Degraded`, or `Unhealthy` method, you may want to adjust the default HTTP timeout. `Elmah.Io.Client` has a default timeout of 5 seconds to make sure that logging to elmah.io from a web application won't slow down the web app too much in case of slow response time from the elmah.io API. While 99.9% of the requests to the elmah.io API finishes within this timeout, problems with Azure, the network connection, and a lot of other issues can happen.

Since heartbeats typically run outside the scope of a web request, it's safe to increase the default HTTP timeout in this case:

```csharp
var api = (ElmahioAPI)ElmahioAPI.Create("API_KEY");
api.HttpClient.Timeout = new TimeSpan(0, 0, 30);
```

The example set a timeout of 30 seconds.