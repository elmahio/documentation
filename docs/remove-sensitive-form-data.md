---
title: Remove sensitive form data from log messages
description: You may have something like usernames and passwords in form posts on your website. Learn about how to exclude these when logging to elmah.io.
---

# Remove sensitive form data

You may have something like usernames and passwords in form posts on your website. Since elmah.io automatically logs the content of a failing form POST, sensitive data potentially ends up in your log. No one else but you and your company should get to look inside your log, but remember that everyone connected to the Internet, is a potential hacking victim.

In this example, we hide the value of a form value named `SomeSecretFormField`. Add the following code in the `Application_Start` method in the `global.asax.cs` file:

```csharp
Elmah.ErrorLog.GetDefault(null); // Forces creation of logger client
var logger = Elmah.Io.ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    var form = args.Message.Form.FirstOrDefault(f => f.Key == "SomeSecretFormField");
    if (form != null)
    {
        form.Value = "***hidden***";
    }
};
```
