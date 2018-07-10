# Remove sensitive form data

You may have something like usernames and passwords in form posts on your website. Since elmah.io automatically logs the content of a failing form POST, sensitive data potentially ends up in your log. No one else but you and your company should really get to look inside your log, but remember that everyone connected to the Internet, is a potential hacking victim.

## ASP.NET / MVC / Web API

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

## ASP.NET Core

Our integration for ASP.NET Core (`Elmah.Io.AspNetCore`) provides you with a hook to overwrite values, before sending them to elmah.io. In order to do this, implement the `OnMessage` handler as part of calling the `AddElmahIo` method.

In this example, we remove the server variable named `Secret-Key` from all messages, before sending them to elmah.io.

```csharp
services.AddElmahIo(options =>
{
    options.ApiKey = "API_KEY";
    options.LogId = new Guid("LOG_ID");
    
    options.OnMessage = msg =>
    {
        var item = msg.ServerVariables.FirstOrDefault(x => x.Key == "Secret-Key"); 
        if (item != null)
        {
            msg.ServerVariables.Remove(item);
        }
    };
});
```