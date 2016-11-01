# Set Up Deployment Tracking* [Decorate your messages with a version number](#decorate-your-messages-with-a-version-number)* [Tell elmah.io when you release](#tell-elmahio-when-you-release)    + [Manually using Swagger UI](#manually-using-swagger-ui)    + [Using PowerShell](#using-powershell)    + [Using Kudu](#using-kudu)    + [Using Octopus Deploy](#using-octopus-deploy)    + [Using Visual Studio Team Services](#using-visual-studio-team-services)* [Versioning different services](#versioning-different-services)    Deployment tracking creates an overview of the different versions of your software and show you how well each version performed. With this integration in place, you will be able to see when you released and if some of your releases caused more errors than others. While most pages on elmah.io supports everything from verbose to fatal messages, the context on deployment tracking is around warnings and errors.To set up deployment tracking, you will need two things:1. Decorate all of your messages with a version number.
2. Tell elmah.io when you release using our REST API or one of the integrations.

When set up, deployment tracking is available on each of your logs.

## Decorate your messages with a version number

Check out [Adding Version Information](http://docs.elmah.io/adding-version-information/) for details.

## Tell elmah.io when you release

When you create a release of your software either manually or with the help from a tool like Octopus, you need to tell elmah.io about it. The [elmah.io REST API v3](https://api.elmah.io/swagger/ui/index), provides an endpoint named `deployments`, which you can call when creating releases.

### Manually using Swagger UI

If you release your software manually, creating the new release manually is easy using Swagger UI. Swagger UI is a graphical client for calling a Swagger enabled endpoint (much like Postman). Navigate to [https://api.elmah.io/swagger/ui/index](https://api.elmah.io/swagger/ui/index), expand the _Deployments_ node and click the POST request:

![Deployments POST](images/deployments_post.png)

To create the release, input your API key (found on your profile) in the top right cornor and click the JSON beneath _Model Schema_. This copies the example JSON to the deployment parameter. A minimal deployment would look like the following, but adding more information makes the experience within elmah.io even better:

```json
{
  "version": "1.42.7"
}
```

The version string in the example conforms to SemVer, but the content can be anything. The date of the release is automatically added if not specified in the JSON body.

Click the _Try it out!_ button and the deployment is created.

### Using PowerShell

If you release your software using a build or deployment server, creating the new release is easy using a bit of PowerShell. To request the `deployments` endpoint, write the following PowerShell script:

```powershell
$version = "1.42.7"
$ProgressPreference = "SilentlyContinue"
$url = 'https://api.elmah.io/v3/deployments?api_key=API_KEY'
$body = @{
  version = $version
}
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

(replace `API_KEY` with your API key found on your profile)

In the example, a simple version string is sent to the API and elmah.io will automatically put a timestamp on that. Overriding user information and description, makes the experience withing the elmah.io UI better. Pulling release notes and the name and email of the deployer, is usually available through environment variables or similar, depending on the technology used for creating the deployment.

### Using Kudu

Kudu is the engine behind Git deployments on Microsoft Azure. To create a new elmah.io deployment every time you deploy a new app service to Azure, add a new post deployment script as shown in [Decorating errors with version number using Azure websites](http://blog.elmah.io/decorating-errors-with-version-number-using-azure-websites/).

With a post deployment script running inside Kudu, we have the possibility to extract some more information about the current deployment. A full deployment PowerShell script for Kudu, would look like this:

```powershell
$version = Get-Date -format u

(Get-Content ..\wwwroot\web.config).replace('$version', $version) | Set-Content ..\wwwroot\web.config

$ProgressPreference = "SilentlyContinue"

$commit = [System.Environment]::GetEnvironmentVariable("SCM_COMMIT_MESSAGE");
$commitId = [System.Environment]::GetEnvironmentVariable("SCM_COMMIT_ID");
$httpHost = [System.Environment]::GetEnvironmentVariable("HTTP_HOST");
$deployUrl = "https://$httpHost/api/deployments/$commitId"

$username = "MY_USERNAME"
$password = "MY_PASSWORD"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username,$password)))

$deployInfo = Invoke-RestMethod -Method Get -Uri $deployUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}

$url = 'https://api.elmah.io/v3/deployments?api_key=API_KEY'
$body = @{
  version = $version
  description = $commit
  userName = $deployInfo.author
  userEmail = $deployInfo.author_email
}

Invoke-RestMethod -Method Post -Uri $url -Body $body
```

(replace `MY_USERNAME` and `MY_PASSWORD` with your Azure deployment credentials and `API_KEY` with your elmah.io API key located on your profile)

The script generates a new version string from the current date and time. How you want your version string looking, is really up to you. To fetch additional informations about the deployment, the Kudu `deployments` endpoint is requested with the current commit id. Finally, the script creates the deployment using the elmah.io REST API.

### Using Octopus Deploy

Notifying elmah.io of a new deployment from Octopus Deploy, is supported through a custom step template. To install and configure the template, follow the steps below:

1. Go to the  [elmah.io - Register Deployment](https://library.octopusdeploy.com/step-template/actiontemplate-elmah.io-register-deployment) step template on the Octopus Deploy Library.
![Octopus Deploy Library](images/octopus_deploy_library.png)

2. Click the _Copy to clipboard_ button.

3. Click _Library_ in the header on your Octopus Deploy instance and go to the _Step templates_ tab.

4. Click the _Import_ link and paste the step template copied from the Library. Then click _Import_.
![Add step template to Octopus](images/add_step_template_to_octopus.png)

5. Go to the Process tab of your project on Octopus Deploy and click the _Add step_ button. The elmah.io step template is available in the bottom of the list.
![Add step template to process](images/add_elmah_io_deployment_step.png)

6. When added to the process, select _Octopus Server_ in _Run on_ and input your API key found on your [profile](https://elmah.io/profile). Optionally input a version number prefix, to [support multiple services](#using-visual-studio-team-services).
![Save notification step](images/save_notification_step.png)

And we're done. On every new deployment, Octopus Deploy will notify elmah.io

### Using Visual Studio Team Services

If you are using Visual Studio Team Services, you should use our VSTS extension to notify elmah.io about new deployments. To install and configure the extension, follow the simple steps below:

1. Go to the [elmah.io Deployment Tasks extension](https://marketplace.visualstudio.com/items?itemName=elmahio.deploy-tasks) on the Visual Studio Marketplace and click _Install_ (log in if not already).
![elmah.io VSTS extension](images/vsts_extension.png)

2. Select the account to install the extension into and click _Confirm_:
![elmah.io VSTS account](images/vsts_select_account.png)

3. Go to your Visual Studio Team Services project and edit your Release definition.
![VSTS release definition](images/vsts_release_definition.png)

4. Click _Add tasks_ and locate the elmah.io Deployment Notification task. Click _Add_.
![Add VSTS task](images/vsts_add_task.png)

5. Copy your API key from your [profile](https://elmah.io/profile) and paste it into the _API Key_ field. Click _Save_.
![VSTS task added](images/vsts_task_added.png)

That's it! VSTS will now notify elmah.io every time the release definition is executed. Remember to [decorate all messages sent to elmah.io with the same version number](#decorate-your-messages-with-a-version-number).

## Versioning Different Services

Chances are that your software consist of multiple services released independently and with different version numbers. This is a common pattern when splitting up a software system in microservices. How you choose to split your elmah.io logs is entirely up to you, but we almost always recommend having a separate log for each service. When doing so, you only want deployment tracking to show the releases from the service you are currently looking at. The problem here is that deployments on elmah.io are not related to a log in any way. We could have implemented it this way, but that would limit the ways to split up logs.

To make sure that only deployments related to the service you are looking at are shown, you need unique deployment names. A simple approach is to name your releases with a service name prefix like this:

* service1-1.0.0
* service1-1.1.0
* service2-1.0.0

In the examples we have two services: service1 and service2. By prefixing deployments with the servicename, we make sure that not both service1-1.0.0 and service2-1.0.0 are shown when looking at one of the services.