---
title: Logging custom data
description: Learn about attaching custom data to exceptions logged through ELMAH from ASP.NET, MVC, and Web API. Include additional debug data and much more.
---

# Logging custom data

ELMAH stores a lot of contextual information when an error occurs. Things like cookies, stack trace, server variables, and much more are stored to ease debugging the error at a later point in time. Most error log implementations for ELMAH doesn't support custom variables. Luckily, this is not the case for the elmah.io client.

Let's look at some code. You have two options for decorating your errors with custom variables.

### Use the [Data](https://docs.microsoft.com/en-us/dotnet/api/system.exception.data?view=net-6.0) dictionary on .NET's Exception type

All exceptions in .NET contain a property named `Data` and of type `IDictionary`. The `Data` dictionary is intended for user-defined information about the exception. The elmah.io client iterates through key/values in this dictionary and ships it off to [elmah.io's API](https://elmah.io/api/v3/). To log custom data using `Data`, just add a new key/value pair to the `Data` dictionary:

```csharp
try
{
    CallSomeBusinessLogic(inputValue);
}
catch (Exception e)
{
    e.Data.Add("InputValueWas", inputValue);
    ErrorSignal.FromCurrentContext().Raise(e);
}
```

In the example, a custom variable named `InputValueWas` with the value of the `inputValue` variable is added. This way you will be able to see which input value caused the exception.

### Use the `OnMessage` hook in the elmah.io client

You may not use ELMAH's ErrorSignal feature but rely on ELMAH to log uncaught exceptions only. In this scenario, you probably don't have access to the thrown exception. The elmah.io client offers a hook for you to be able to execute code every time something is logged:

```csharp
Elmah.ErrorLog.GetDefault(null); // Forces creation of logger client
var logger = Elmah.Io.ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    if (args.Message.Data == null) args.Message.Data = new List<Item>();
    args.Message.Data.Add(new Item { Key = "SomeOtherVariable", Value = someVariable });
};
```

You may not have seen the Logger type of elmah.io before, but what's important to know right now is, that Logger is responsible for logging messages to the elmah.io API. Another new term here is Message. A message is the type encapsulating all of the information about the thrown exception.

In the code example, a new event handler is subscribed to the `OnMessage` event. This tells the elmah.io client to execute your event handler, before actually logging an exception to elmah.io. The event is used to add a custom variable to the `Data` dictionary of the message logged to elmah.io.

### Looking at your custom data

Custom data are shown on the *Data* tab on the extended messages details page. To open inspect custom data go to the log search page, extend a log message, click the three bars (hamburger) icon in the upper right corner. The custom data is beneath the *Data* tab. As the content in the other tabs of the message details, you will be able to filter results by the variable key.

### Searching custom data

Custom data is not searchable by default. Sometimes it makes sense, that errors can be searched from values logged as part of custom data. For now, this feature is supported through the use of variable naming, but we may extend this to a configuration option through the UI as well.

To make a custom variable and its value searchable through the UI (as well as through the API), name the variable with the prefix `X-ELMAHIO-SEARCH-`. The variable will become searchable through the name added after the prefix.

Example:

```csharp
Elmah.ErrorLog.GetDefault(null);
var logger = Elmah.Io.ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    if (args.Message.Data == null) args.Message.Data = new List<Item>();
    args.Message.Data.Add(new Item { Key = "X-ELMAHIO-SEARCH-myVariable", Value = "Some value" });
};
```

would make `myVariable` searchable using this query:

```
data.myVariable:funky
```

Observe how `X-ELMAHIO-SEARCH-` is replaced with the `data.` prefix when indexed in elmah.io.

Adding searchable properties is available when logging exceptions too:

```csharp
try
{

}
catch (NullReferenceException e)
{
    e.Data.Add("X-ELMAHIO-SEARCH-myVariable", "Some value");
    // Log the exception somewhere
}
```

To avoid someone filling up our cluster with custom data, only the first three variables containing `X-ELMAHIO-SEARCH-` are made searchable. Also, variables with a value containing more than 256 characters are not indexed.