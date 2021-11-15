---
title: Logging through a HTTP proxy
description: Set up logging to elmah.io through an HTTP proxy server like squid or Nginx. Using a bit of XML you can configure logging without public access.
---

# Logging through a HTTP proxy

You may find yourself in a situation, where your production web servers aren't allowing HTTP requests towards the public Internet. This also impacts the elmah.io client, which requires access to the URL https://api.elmah.io. A popular choice of implementing this kind of restriction nowadays is through a HTTP proxy like Squid or Nginx.

Luckily the elmah.io client supports proxy configuration out of the box. Let's look at how to configure a HTTP proxy through `web.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <configSections>
    <sectionGroup name="elmah">
      <section name="security" requirePermission="false" type="Elmah.SecuritySectionHandler, Elmah" />
      <section name="errorLog" requirePermission="false" type="Elmah.ErrorLogSectionHandler, Elmah" />
      <section name="errorMail" requirePermission="false" type="Elmah.ErrorMailSectionHandler, Elmah" />
      <section name="errorFilter" requirePermission="false" type="Elmah.ErrorFilterSectionHandler, Elmah" />
    </sectionGroup>
  </configSections>
  <elmah>
    <security allowRemoteAccess="false" />
    <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" apiKey="..." logId="..." />
  </elmah>
  <system.net>
    <defaultProxy>
      <proxy usesystemdefault="True" proxyaddress="http://192.168.0.1:3128" bypassonlocal="False"/>
    </defaultProxy>
  </system.net>
</configuration>
```

The above example is of course greatly simplified.

The elmah.io client automatically picks up the `defaultProxy` configuration through the `system.net` element. `defaultProxy` tunnels every request from your server, including requests to elmah.io, through the proxy located on 192.18.0.1 port 3128 (or whatever IP/hostname and port you are using).

## Proxies with username/password

Some proxies require a username/password. Unfortunately, the `defaultProxy` element doesn't support authentication. You have two ways to set this up:

### Use default credentials

Make sure to set the `useDefaultCredentials` attribute to `true`:

```xml
<system.net>
  <defaultProxy useDefaultCredentials="true">
    <!-- ... -->
  </defaultProxy>
</system.net>
```

Run your web app (application pool) as a user with access to the proxy.

### Implement your own proxy

Add the following class:

```csharp
public class AuthenticatingProxy : IWebProxy
{
    public ICredentials Credentials
    {
        get { return new NetworkCredential("username", "password"); }
        set {}
    }

    public Uri GetProxy(Uri destination)
    {
        return new Uri("http://localhost:8888");
    }

    public bool IsBypassed(Uri host)
    {
        return false;
    }
}
```

Configure the new proxy in `web.config`:

```xml
<defaultProxy useDefaultCredentials="false">
  <module type="YourNamespace.AuthenticatingProxy, YourAssembly" />
</defaultProxy>
```