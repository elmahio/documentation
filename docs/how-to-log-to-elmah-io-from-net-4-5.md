---
title: How to log to elmah.io from .NET 4.5
description: Ensure your .NET 4.5 apps continue logging to elmah.io by enabling TLS 1.2 before Azure removes support for older protocols in August 2025.
---

# How to log to elmah.io from .NET 4.5

elmah.io is being hosted on Microsoft Azure. Azure is getting ready to phase out support for security protocols lower than TLS 1.2. The support for earlier versions like SSL, TLS, and TLS 1.1 will be removed by 31 August 2025. This means that our API will not accept connections with settings lower than TLS 1.2 from that date.

If you are running on .NET 4.6 or newer, you don't need to change anything since TLS 1.2 is the default from that version and forward. Since our clients don't support .NET versions earlier than .NET 4.5, this only leaves out .NET 4.5. So, if your application is running on .NET 4.5, you will need to do one of two things before August 2025 to continue logging errors to elmah.io:

1. Upgrade your application to use a minimum of .NET 4.6 (recommended).
2. Include the following code during startup in your application (like in the `Global.asax.cs` file for ASP.NET applications and `Program.cs` for other types of applications):

```csharp
ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
```

This will include TLS 1.2 as a supported security protocol in your application.