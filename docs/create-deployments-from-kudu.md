---
title: Create deployments from Kudu
description: Kudu is the engine behind Git deployments on Microsoft Azure. Learn how to create an elmah.io deployment when you deploy app services to Azure.
howto_steps:
  - name: Open the Kudu debug console
    text: "Navigate to https://yoursite.scm.azurewebsites.net (replacing yoursite with your Azure website name), click Debug console, and navigate to site\\deployments\\tools\\PostDeploymentActions (create it if it doesn't exist)."
  - name: Create the PowerShell script file
    text: "In the console prompt, run: touch CreateDeployment.ps1"
  - name: Write the deployment script
    text: |
      Add a post-deployment script that generates a version from the current date, fetches commit info from the Kudu deployments endpoint ($deployUrl = "https://$httpHost/api/deployments/$commitId") using Basic auth built from MY_USERNAME/MY_PASSWORD, then POSTs version, description, userName and userEmail to https://api.elmah.io/v3/deployments?api_key=API_KEY with Invoke-RestMethod -Method Post.
  - name: Replace the placeholders
    text: Replace MY_USERNAME and MY_PASSWORD with your Azure deployment credentials, and API_KEY with your elmah.io API key found on your organization settings page.
---

# Create deployments from Kudu

Kudu is the engine behind Git deployments on Microsoft Azure. To create a new elmah.io deployment every time you deploy a new app service to Azure, add a new post-deployment script by navigating your browser to `https://yoursite.scm.azurewebsites.net` where `yoursite` is the name of your Azure website. Click the Debug console and navigate to `site\deployments\tools\PostDeploymentActions` (create it if it doesn't exist).

To create the new PowerShell file, write the following in the prompt:

```shell
touch CreateDeployment.ps1
``` 

With a post-deployment script running inside Kudu, we can to extract some more information about the current deployment. A full deployment PowerShell script for Kudu would look like this:

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

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

(replace `MY_USERNAME` and `MY_PASSWORD` with your Azure deployment credentials and `API_KEY` with your elmah.io API key located on your organization settings page)

The script generates a new version string from the current date and time. How you want your version string looking, is really up to you. To fetch additional information about the deployment, the Kudu `deployments` endpoint is requested with the current commit id. Finally, the script creates the deployment using the elmah.io REST API.