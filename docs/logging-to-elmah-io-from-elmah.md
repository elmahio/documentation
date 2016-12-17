# Logging from ELMAH

This article will explain the steps necessary to log errors from your web application into elmah.io. We also offer more specific guides on [ASP.NET MVC](/logging-to-elmah-io-from-aspnet-mvc), [Web API](/logging-to-elmah-io-from-web-api), [Nancy](/logging-to-elmah-io-from-nancy) and a lot of other web- and logging-frameworks. Read through this tutorial and head over to a tutorial specific for your choice of framework afterwards. If you don’t know ELMAH, check out our [ELMAH Tutorial](http://blog.elmah.io/elmah-tutorial/) and visit the nice folks over at the [ELMAH project page](http://elmah.github.io/). Let’s get started.

Create a new ASP.NET MVC project in Visual Studio (you can choose another web project type if you’d like):

![Create ASP.NET MVC Website](images/create_aspnetmvc_website.png)

Select a project template of your choice:

![Select Project Template](images/select_project_template.png)

Navigate to elmah.io and login using your favorite social provider. When logged in, elmah.io redirects you to the dashboard. Click on _Create new log_ and name your log:

![Create New Log](images/create_new_log.png)

When created, elmah.io shows you the install instructions. Don’t pay too much attention to the install steps, because the rest of this tutorial will guide you through the installation. Copy your log id from Step 2 in the installation instructions (located in the dialog):

![Copy your log id](images/copy_log_id_dialog.png)

Navigate back to your web project, right click _References_ and select _Manage NuGet Packages_:

![Open Manage NuGet Packages](images/open_manage_nuget_packages.png)

In the NuGet dialog, search for elmah.io:

![Search for elmah.io](images/search_for_elmah_io.png)

Click Install and input your log id in the dialog appearing during installation of the NuGet package:

![Insert your log id](images/input_log_id.png)

You’re ready to rock and roll. Hit F5 and input a URL you know doesn’t exist (like http://localhost:64987/notfound). You should see the standard 404 message displayed in the browser. To verify that the installation of elmah.io is successful, navigate back to the elmah.io dashboard and select the Search tab of your newly created log:

![Error Details](images/error_details.png)

See the error? Congrats! Every error on your application is now logged to elmah.io.
