---
title: How to search custom data
description: Learn how to make properties searchable on elmah.io. By using a special naming convention you can run full-text searches on custom properties.
---

# How to search custom data

Custom data is not searchable by default. Sometimes it makes sense that errors can be searched from values logged as part of custom data. For now, this feature is supported through the use of variable naming, but we may extend this to a configuration option through the API or UI as well.

To make a custom variable and its value searchable through the UI (as well as through the API), name the variable with the prefix `X-ELMAHIO-SEARCH-`. The variable will become searchable through the name added after the prefix.

Examples:

<div class="tabbable-responsive">
<div class="tabbable">
<ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="nav-item"><a class="nav-link active" href="#aspnet" aria-controls="home" role="tab" data-bs-toggle="tab">ASP.NET</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#aspnetcore" aria-controls="profile" role="tab" data-bs-toggle="tab">ASP.NET Core</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#serilog" aria-controls="profile" role="tab" data-bs-toggle="tab">Serilog</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#nlog" aria-controls="profile" role="tab" data-bs-toggle="tab">NLog</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#log4net" aria-controls="profile" role="tab" data-bs-toggle="tab">log4net</a></li>
    <li role="presentation" class="nav-item"><a class="nav-link" href="#mel" aria-controls="profile" role="tab" data-bs-toggle="tab">Microsoft.Extensions.Logging</a></li>
</ul>
</div>
</div>

<div class="tab-content tab-content-tabbable" markdown="1">
<div role="tabpanel" class="tab-pane active" id="aspnet" markdown="1">
```csharp
Elmah.ErrorLog.GetDefault(null);
var logger = Elmah.Io.ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    if (args.Message.Data == null) args.Message.Data = new List<Item>();
    args.Message.Data.Add(new Item { Key = "X-ELMAHIO-SEARCH-author", Value = "Walter Sobchak" });
};
```
</div>
<div role="tabpanel" class="tab-pane" id="aspnetcore" markdown="1">
```csharp
builder.Services.AddElmahIo(o =>
{
    o.OnMessage = message =>
    {
        if (message.Data == null) message.Data = new List<Item>();
        message.Data.Add(new Item { Key = "X-ELMAHIO-SEARCH-author", Value = "Walter Sobchak" });
    };
});
```
</div>
<div role="tabpanel" class="tab-pane" id="serilog" markdown="1">
```csharp
using (LogContext.PushProperty("X-ELMAHIO-SEARCH-author", "Walter Sobchak"))
{
    logger.Error("You see what happens, Larry?");
}
```
</div>
<div role="tabpanel" class="tab-pane" id="nlog" markdown="1">
```csharp
var errorMessage = new LogEventInfo(LogLevel.Error, "", "You see what happens, Larry?");
errorMessage.Properties.Add("X-ELMAHIO-SEARCH-author", "Walter Sobchak");
log.Error(errorMessage);
```
</div>
<div role="tabpanel" class="tab-pane" id="log4net" markdown="1">
```csharp
var properties = new PropertiesDictionary();
properties["X-ELMAHIO-SEARCH-author"] = "Walter Sobchak";
log.Logger.Log(new LoggingEvent(new LoggingEventData
{
    Level = Level.Error,
    TimeStampUtc = DateTime.UtcNow,
    Properties = properties,
    Message = "You see what happens, Larry?",
}));
```
</div>
<div role="tabpanel" class="tab-pane" id="mel" markdown="1">
```csharp
var scope = new Dictionary<string, object> { { "X-ELMAHIO-SEARCH-author", "Walter Sobchak" } };
using (logger.BeginScope(scope}))
{
    logger.LogError("You see what happens, Larry?");
}
```
</div>
</div>

The examples will make `author` searchable using this query:

```
data.author:"Walter Sobchak"
```

Observe how `X-ELMAHIO-SEARCH-` is replaced with the `data.` prefix when indexed in elmah.io.

Adding searchable properties is available when logging exceptions too:

```csharp
try
{
    // ...
}
catch (NullReferenceException e)
{
    e.Data.Add("X-ELMAHIO-SEARCH-author", "Walter Sobchak");
    // Log the exception or throw e to use this catch for decorating the exception
}
```

To avoid someone filling up our cluster with custom data, only the first three variables containing `X-ELMAHIO-SEARCH-` are made searchable. Also, variables with a value containing more than 256 characters are not indexed.