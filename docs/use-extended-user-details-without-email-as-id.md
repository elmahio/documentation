---
title: Use extended user details without email as ID
description: Learn about how to utilize elmah.io's extended user details without using an email address as part of ASP.NET Core Identity or similar.
---

# Use extended user details without email as ID

Most of our integrations automatically log the user identity as part of the error. To make that happen, packages typically use the identity object on the current thread, which gets set by most authentication frameworks for .NET (like ASP.NET Membership Provider and ASP.NET Core Identity). You may use the user's email as the key or a database identifier. If you are using an email, you are already covered and able to see Extended User Details. If not, you need to provide elmah.io with a little help.

To tell elmah.io about the user's email and still keep the identifier in the user field, you can enrich the message with a piece of custom data, before sending it off to elmah.io. By putting the user's email in a *Data* item named `X-ELMAHIO-USEREMAIL` Extended User Details will pick this up and show the correct user. How you set the *Data* item is dependent on the elmah.io NuGet package you are using.

For ASP.NET, MVC, or Web API, the code could look like this:

```csharp
Elmah.ErrorLog.GetDefault(null); // Forces creation of logger client
var logger = ErrorLog.Client;
logger.OnMessage += (sender, args) =>
{
    if (string.IsNullOrWhiteSpace(args.Message.User)) return;
    var db = /*...*/;
    var user = db.GetById<User>(args.Message.User);
    args.Message.Data.Add(new Item {Key = "X-ELMAHIO-USEREMAIL", Value = user.Email});
}
```

For ASP.NET Core the code could look like this:

```csharp
services.AddElmahIo(o =>
{
    // ...
    o.OnMessage = message =>
    {
        if (string.IsNullOrWhiteSpace(message.User)) return;
        var db = /*...*/;
        var user = db.GetById<User>(message.User);
        message.Data.Add(new Item {Key = "X-ELMAHIO-USEREMAIL", Value = user.Email});
    };
});
```

`OnMessage` event handlers are executed just before a message is sent to elmah.io. In the body of the event handler, the user's email is fetched from the database by calling the `GetById` method. How you will be able to convert the user ID to an email depends on your tech stack, but you get the picture.

That's it! A few lines of code and you can watch every little detail about the users experiencing problems on your website:

![Extended User Details](images/extended_user_details.png)
