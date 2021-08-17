# Logging breadcrumbs from ASP.NET Core

[TOC]

> Breadcrumbs are currently in prerelease and only supported on `Elmah.Io.AspNetCore` version `3.12.24` or newer.

You can log one or more breadcrumbs as part of both automatic and manually logged errors. Breadcrumbs indicate steps happening just before a message logged by `Elmah.Io.AspNetCore`. Breadcrumbs with elmah.io and ASP.NET Core are supported in two ways: manual and through Microsoft.Extensions.Logging.

## Manually logging breadcrumbs

If you want to log a breadcrumb manually as part of an MVC controller action or similar, you can use the `ElmahIoApi` class:

```csharp
ElmahIoApi.AddBreadcrumb(
    new Breadcrumb(DateTime.UtcNow, message: "Requesting the front page"),
    HttpContext);
```

Notice that the `Breadcrumb` class is located in the `Elmah.Io.Client` package that will be automatically installed when installing `Elmah.Io.AspNetCore`. The `Breadcrumb` class is either in the `Elmah.Io.Client` or `Elmah.Io.Client.Models` namespace, depending on which version of `Elmah.Io.Client` you have installed.

The best example of a helpful breadcrumb is logging the input model to all endpoints as a breadcrumb. This will show you exactly which parameters the user sends to your website. The following example is created for ASP.NET Core MVC, but similar solutions can be built for other MVC features as well.

Create a new class named `BreadcrumbFilterAttribute` and place it somewhere inside your MVC project:

```csharp
public class BreadcrumbFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var arguments = context.ActionArguments;
        if (arguments.Count == 0) return;

        ElmahIoApi.AddBreadcrumb(
            new Breadcrumb(
                DateTime.UtcNow,
                "Information",
                "Request",
                string.Join(", ", arguments.Select(a => $"{a.Key} = {JsonSerializer.Serialize(a.Value)}"))),
            context.HttpContext);
    }
}
```

The action filter converts the action arguments to a comma-separated string at log it as a breadcrumb. You can either decorate each controller with the `BreadcrumbFilterAttribute` or add it globally:

```csharp
var mvcBuilder = services.AddControllersWithViews(options =>
{
    options.Filters.Add(new BreadcrumbFilterAttribute());
});
```

## Logging breadcrumbs from Microsoft.Extensions.Logging

We also provide an automatic generation of breadcrumbs using Microsoft.Extensions.Logging. This will pick up all log messages logged through the `ILogger` and include those as part of an error logged. This behavior is currently in opt-in mode, meaning that you will need to enable it in options:

```csharp
services.AddElmahIo(options =>
{
    // ...
    options.TreatLoggingAsBreadcrumbs = true;
});
```

The boolean can also be configured through `appsettings.json`:

```json
{
  // ...
  "ElmahIo": {
    // ...
    "TreatLoggingAsBreadcrumbs": true
  }
}
```

When enabling this automatic behavior, you may need to adjust the log level included as breadcrumbs. This is done in the `appsettings.json` file by including the following JSON:

```json
{
  "Logging": {
    // ...
    "ElmahIoBreadcrumbs": {
      "LogLevel": {
        "Default": "Information"
      }
    }
  }
}
```

## Filtering breadcrumbs

Breadcrumbs can be filtered using one or more rules as well:

```csharp
services.AddElmahIo(options =>
{
    // ...
    options.OnFilterBreadcrumb =
        breadcrumb => breadcrumb.Message == "A message we don't want as a breadcrumb";
});
```