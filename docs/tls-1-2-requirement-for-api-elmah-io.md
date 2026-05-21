---
title: TLS 1.2 Requirement for api.elmah.io
description: Starting May 1, 2027, elmah.io requires TLS 1.2 or higher when connecting to api.elmah.io. Learn how to check if you are affected and how to upgrade.
---

# TLS 1.2 Requirement for api.elmah.io

Starting **May 1, 2027**, elmah.io will require a minimum of TLS 1.2 when communicating with `api.elmah.io`. Connections using TLS 1.0 or TLS 1.1 will be rejected after this date. This change is driven by Microsoft Azure retiring support for TLS versions below 1.2 on May 31, 2027.

Most applications will not be affected. If you are running a modern version of .NET (5+) or .NET Core, TLS 1.2 or higher is already used by default. The same is true for most current runtimes and operating systems.

## Who is affected?

You may be affected if your application runs on an older platform that defaults to TLS 1.0 or TLS 1.1. The most common example is **.NET Framework 4.5.x**, which negotiates TLS 1.0 by default.

If your application uses any elmah.io integration (such as `Elmah.Io.Client`, `Elmah.Io`, `Elmah.Io.Mvc`, or similar packages) and runs on one of the following, check if an upgrade or configuration change is needed:

- .NET Framework 4.5, 4.5.1, or 4.5.2
- Windows Server 2008 or 2008 R2 with default TLS settings
- Any custom HTTP client configured to use TLS 1.0 or 1.1 explicitly

## How to fix it

### .NET Framework

For applications targeting .NET Framework 4.5.x, you can force TLS 1.2 by setting the security protocol explicitly, preferably at application startup:

```csharp
System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
```

If you also want to support TLS 1.3 where available, combine the flags:

```csharp
System.Net.ServicePointManager.SecurityProtocol =
    System.Net.SecurityProtocolType.Tls12 |
    System.Net.SecurityProtocolType.Tls13;
```

For .NET Framework 4.6 and above, TLS 1.2 is already negotiated by default and no code change is required.

### Upgrading the target framework

The most durable fix is to upgrade your application to a supported version of .NET. .NET 8 (LTS) and .NET 9 both default to TLS 1.2+ and receive ongoing security updates.

## Verifying your TLS version

You can verify which TLS version your application uses by capturing outbound HTTPS traffic with a tool like Fiddler, or by adding a temporary log statement:

```csharp
System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, errors) =>
{
    var request = sender as System.Net.HttpWebRequest;
    // Check the negotiated TLS version in your network trace
    return errors == System.Net.Security.SslPolicyErrors.None;
};
```

Alternatively, check the .NET documentation for your target framework to confirm the default TLS version.

## Timeline

| Date | Event |
|------|-------|
| May 1, 2027 | elmah.io stops accepting TLS 1.0 and 1.1 on `api.elmah.io` |
| May 31, 2027 | Microsoft Azure retires TLS 1.0 and 1.1 across all services |

If you have questions or need help determining whether your setup is affected, please reach out via support.