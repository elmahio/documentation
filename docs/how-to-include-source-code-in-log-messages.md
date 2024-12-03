---
title: How to include source code in log messages
description: SIn this article, you will learn how to include source code when logging messages using the Elmah.Io.Client.Extensions.SourceCode NuGet package.
---

# How to include source code in log messages

[TOC]

Sometimes, being able to see the exact code causing an error, is much more helpful than looking at other details around the current HTTP context and similar. If you often find yourself opening Visual Studio or Code to inspect the failing line, embedding source code in errors and log messages will speed up the process. In this article, you will learn how to configure elmah.io to include source code when logging messages using the `Elmah.Io.Client.Extensions.SourceCode` NuGet package.

!!! note
    The `Elmah.Io.Client.Extensions.SourceCode` package requires `Elmah.Io.Client` version `4.0` or newer.

No matter what integration you are using (with a few exceptions) you are using the `Elmah.Io.Client` NuGet package to communicate with the elmah.io API. We have built a range of extensions for this package, to avoid including too many features not related to communicating with the API into the client package. One of them is for including source code when logging messages. Start by installing the `Elmah.Io.Client.Extensions.SourceCode` NuGet package:

```powershell fct_label="Package Manager"
Install-Package Elmah.Io.Client.Extensions.SourceCode
```
```cmd fct_label=".NET CLI"
dotnet add package Elmah.Io.Client.Extensions.SourceCode
```
```xml fct_label="PackageReference"
<PackageReference Include="Elmah.Io.Client.Extensions.SourceCode" Version="5.*" />
```
```xml fct_label="Paket CLI"
paket add Elmah.Io.Client.Extensions.SourceCode
```

There are currently three ways of including source code with log messages. The first two ways require the `Elmah.Io.Client.Extensions.SourceCode` package, while the third one can be done manually.

## From the file system

This is the most simple approach meant for local development. When logging a stack trace from your local machine, the trace includes the absolute path to the file on your file system, as well as the line causing a log message (typically an error). To set this up, you will need to implement the `OnMessage` event through the `Elmah.Io.Client` package. Depending on which integration you are using, the name of that event or action can vary. What you are looking to do is to call the `WithSourceCodeFromFileSystem` method on log messages you want to include source code. This is an example when using the `Elmah.Io.Client` directly:

```csharp
var elmahIoClient = ElmahioAPI.Create("API_KEY");
elmahIoClient.Messages.OnMessage += (sender, e) => e.Message.WithSourceCodeFromFileSystem();
```

Using an integration like `Elmah.Io.AspNetCore` uses the same method:

```csharp
services.AddElmahIo(options =>
{
    options.OnMessage = msg => msg.WithSourceCodeFromFileSystem();
});
```

This will automatically instruct `Elmah.Io.Client.Extensions.Source` to try and parse any stack trace in the details property and embed the source code.

For an example of how to use the `WithSourceCodeFromFileSystem` method, check out the following sample: [Elmah.Io.Client.Extensions.SourceCode.FileSystem](https://github.com/elmahio/Elmah.Io.Client.Extensions.SourceCode/tree/main/samples/Elmah.Io.Client.Extensions.SourceCode.FileSystem).

## From the PDB file

When deploying your code on another environment, you typically don't have the original code available. If you copy your source code to the same absolute path as when building, you can use the file-system approach shown above. If not, embedding the source code in the PDB file can be the option. Before doing so, make sure you include filename and line numbers in stack traces on all environments as shown here: [Include filename and line number in stack traces](include-filename-and-line-number-in-stacktraces.md). For the old project template the *Debugging information* field needs a value of `Portable`. For the new project template the *Debug symbols* field needs a value of `PDB file, portable across platforms`.

To embed source code in the PDB file built alongside your DLL files, include the following property in your `csproj` file:

```xml
<PropertyGroup>
  <EmbedAllSources>true</EmbedAllSources>
</PropertyGroup>
```

Be aware that this will include your original source code in your deployment which may not be a good approach if other people have access to the environment or binary files. Next, call the `WithSourceCodeFromPdb` method:

```csharp
var elmahIoClient = ElmahioAPI.Create("API_KEY");
elmahIoClient.Messages.OnMessage += (sender, e) => e.Message.WithSourceCodeFromPdb();
```

For an example of how to do this from ASP.NET Core, you can use the same approach as specified in the previous section:

```csharp
services.AddElmahIo(options =>
{
    options.OnMessage = msg => msg.WithSourceCodeFromPdb();
});
```

All of our integrations support a message callback somehow.

For an example of how to use the `WithSourceCodeFromPdb` method, check out the following sample: [Elmah.Io.Client.Extensions.SourceCode.PdbSample](https://github.com/elmahio/Elmah.Io.Client.Extensions.SourceCode/tree/main/samples/Elmah.Io.Client.Extensions.SourceCode.PdbSample) for .NET and [Elmah.Io.Client.Extensions.SourceCode.NetFrameworkPdb](https://github.com/elmahio/Elmah.Io.Client.Extensions.SourceCode/tree/main/samples/Elmah.Io.Client.Extensions.SourceCode.NetFrameworkPdb) for .NET Framework.

## Manually

In case you want to include source code manually, you can use the `OnMessage` event and the `Code` property on the `CreateMessage` class:

```csharp
var elmahIoClient = ElmahioAPI.Create("API_KEY");
elmahIoClient.Messages.OnMessage += (sender, e) =>
{
    e.Message.Code = FetchCode();
}
```

You will need to implement the `FetchCode` method to return the source code to include. Only 21 lines of code are supported for now.

In case you want elmah.io to show the correct line numbers, you will need to tell us how the first line number in the provided code matches your original source file as well as the line number causing the error. This is done by adding two `Item`s to the `Data` dictionary on `CreateMessage`:

```csharp
var elmahIoClient = ElmahioAPI.Create("API_KEY");
elmahIoClient.Messages.OnMessage += (sender, e) =>
{
    e.Message.Code = FetchCode();
    if (e.Message.Data == null) e.Message.Data = new List<Item>();
    e.Message.Data.Add(new Item("X-ELMAHIO-CODESTARTLINE", "42"));
    e.Message.Data.Add(new Item("X-ELMAHIO-CODELINE", "51"));
}
```

This will show line number `42` next to the first code line and highlight line number `51` in the elmah.io UI.

## Troubleshooting

If no source code shows up on elmah.io log messages, you can start by running through the following checks:

- Make sure that the log message contains a stack trace in the details field.
- Make sure that the stack trace contains absolute path filenames and line numbers for the code causing the stack trace.
- Make sure that you are calling the `WithSourceCodeFromPdb` or `WithSourceCodeFromFileSystem` method.
- Make sure that the `Elmah.Io.Client.Extensions.SourceCode.dll` file is in your deployed application.
- Make sure that your project has `Portable` set in *Debugging information* or `PDB File, portable across platforms` set in *Debug symbols*.
- For PDB files, make sure that you have included the `EmbedAllSources` element in your `csproj` file.
- Look inside the *Data* tab on the logged message. It may contain a key named `X-ELMAHIO-CODEERROR` with a value explaining what went wrong.