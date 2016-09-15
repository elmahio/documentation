# Set Up Deployment Tracking* [Decorate your messages with a version number](#decorate-your-messages-with-a-version-number)* [Tell elmah.io when you release](#tell-elmahio-when-you-release)    + [Manually using Swagger UI](#manually-using-swagger-ui)    + [Using PowerShell](#using-powershell)    + [Using Kudu](#using-kudu)    + [Using Octopus Deploy](#using-octopus-deploy)    + [Using Visual Studio Team Services](#using-visual-studio-team-services)    Deployment tracking creates an overview of the different versions of your software and show you how well each version performed. With this integration in place, you will be able to see when you released and if some of your releases caused more errors than others. While most pages on elmah.io supports everything from verbose to fatal messages, the context on deployment tracking is around warnings and errors.To set up deployment tracking, you will need two things:1. Decorate all of your messages with a version number.
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

In progress.

### Using Visual Studio Team Services

In progress.