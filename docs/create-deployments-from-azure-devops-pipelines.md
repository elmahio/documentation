# Create deployments from Azure DevOps Pipelines

[TOC]
    
Notifying elmah.io about new deployments is possible as a build step in Azure DevOps, by adding a bit of PowerShell.

## Using YAML

1. Edit your build definition YAML file.

2. If not already shown, open the assistant by clicking the *Show assistant* button.

3. Search for 'powershell'.

4. Click the *PowerShell* task.

5. Select the *Inline* radio button and input the following script:

```powershell
$ProgressPreference = "SilentlyContinue"

$url = "https://api.elmah.io/v3/deployments?api_key=API_KEY"
$body = @{
  version = "$env:BUILD_BUILDNUMBER"
  description = "$env:BUILD_SOURCEVERSIONMESSAGE"
  userName = "$env:BUILD_REQUESTEDFOR"
  userEmail = "$env:BUILD_REQUESTEDFOREMAIL"
  logId = "LOG_ID"
}
[Net.ServicePointManager]::SecurityProtocol = `
    [Net.SecurityProtocolType]::Tls12,
    [Net.SecurityProtocolType]::Tls11,
    [Net.SecurityProtocolType]::Tls
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the id of the log representing the application deployed by this build configuration.

Click the *Add* button and the new task will be added to your YAML definition. You typically want to move the deployment task to the last placement in *tasks*.

## Using Classic editor

1. Edit the build definition currently building your project(s).

2. Click the _Add task_ button and locate the _PowerShell_ task. Click _Add_.
![Add PowerShell task](images/add_powershell_task.png)

3. Fill in the details as shown in the screenshot.
![Fill in PowerShell content](images/fill_powershell_task.png)

... and here's the code from the screenshot above:

```powershell
$ProgressPreference = "SilentlyContinue"

$url = "https://api.elmah.io/v3/deployments?api_key=API_KEY"
$body = @{
  version = "$env:BUILD_BUILDNUMBER"
  description = "$env:BUILD_SOURCEVERSIONMESSAGE"
  userName = "$env:BUILD_REQUESTEDFOR"
  userEmail = "$env:BUILD_REQUESTEDFOREMAIL"
  logId = "LOG_ID"
}
[Net.ServicePointManager]::SecurityProtocol = `
    [Net.SecurityProtocolType]::Tls12,
    [Net.SecurityProtocolType]::Tls11,
    [Net.SecurityProtocolType]::Tls
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

Replace `API_KEY` with your API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) and `LOG_ID` ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the id of the log representing the application deployed by this build configuration.