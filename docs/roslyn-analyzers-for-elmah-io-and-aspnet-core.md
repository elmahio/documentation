---
title: Roslyn analyzers for elmah.io and ASP.NET Core
description: Learn about how to catch common errors when configuring elmah.io in ASP.NET Core using our custom Roslyn Analyzers for Visual Studio.
---

# Roslyn analyzers for elmah.io and ASP.NET Core

[TOC]

> The Roslyn analyzers for elmah.io and ASP.NET Core has reached end of life. The analyzers are no longer updated and won't work for top-level statements or when configuring `Elmah.Io.AspNetCore` in the `Program.cs` file. To validate the installation we recommend running the `diagnose` command as explained here: [Diagnose potential problems with an elmah.io installation](cli-diagnose.md).

To help to install elmah.io in ASP.NET Core (by using the `Elmah.Io.AspNetCore` NuGet package) we have developed a range of Roslyn analyzers. Analyzers run inside Visual Studio and make it possible to validate your `Startup.cs` file during development.

## Installation and usage

The analyzers can be installed in two ways. As a NuGet package or a Visual Studio extension. To install it from NuGet:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.AspNetCore.Analyzers
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.AspNetCore.Analyzers
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.AspNetCore.Analyzers" Version="0.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.AspNetCore.Analyzers
```

The package is installed as a private asset, which means that it is not distributed as part of your build. You can keep the package installed after you have used it to inspect any warnings generated or uninstall it.

To install it as a Visual Studio extension, navigate to *Extensions* | *Manage extensions* | *Online* and search for `Elmah.Io.AspNetCore.Analyzers`. Then click the *Download* button and restart Visual Studio. As an alternative, you can [download the extension](https://marketplace.visualstudio.com/items?itemName=elmahio.elmahioaspnetcoreanalyzers) directly from the Visual Studio Marketplace.

Once installed, analyzers will help you add or move elmah.io-related setup code:

![Roslyn analyzers](images/roslyn-analyzers.png)

All issues are listed as warnings in the *Error list* as well. The following is an explanation of possible warnings.

## EIO1000 ConfigureServices must call AddElmahIo

`AddElmahIo` needs to be added as part of the `ConfigureServices` method:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddElmahIo(/*...*/); //👈
}
```

## EIO1001 Configure must call UseElmahIo

`UseElmahIo` needs to be added as part of the `Configure` method:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.UseElmahIo(); //👈
}
```

## EIO1002 UseElmahIo must be called before/after Use*

`UseElmahIo` needs to be called after any calls to `UseDeveloperExceptionPage`, `UseExceptionHandler`, `UseAuthorization`, and `UseAuthentication` but before any calls to `UseEndpoints` and `UseMvc`:

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler(/*...*/);
    }

    app.UseAuthentication();
    app.UseAuthorization();

    app.UseElmahIo(); //👈

    app.UseEndpoints();
    app.UseMvc(/*...*/);
}
```