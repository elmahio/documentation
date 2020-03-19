# Create deployments from Umbraco Cloud

Umbraco Cloud uses Azure to host Umbraco websites, why supporting deployment tracking pretty much corresponds the steps specified in [Using Kudu](#using-kudu). Navigate to `https://your-umbraco-site.scm.s1.umbraco.io` where `your-umbraco-site` is the name of your Umbraco site. Click the Debug console link and navigate to `site\deployments\tools\PostDeploymentActions\deploymenthooks` (create it if it doesn't exist). Notice the folder `deploymenthooks`, which is required in order for your scripts to run on Umbraco Cloud.

Unlike Kudu, Umbraco Cloud only executes `cmd` and `bat` files. Create a new `cmd` file:

```shell
touch create-deployment.cmd
```

with the following content:

```shell
echo "Creating elmah.io deployment"

cd %POST_DEPLOYMENT_ACTIONS_DIR%

cd deploymenthooks

powershell -command ". .\create-deployment.ps1"
```

The script executes a PowerShell script, which we will create next:

```shell
touch create-deployment.ps1
```

The content of the PowerShell script looks a lot like in [Using Kudu](#using-kudu), but with some minor tweaks to support Umbraco Cloud:

```powershell
$version = Get-Date -format u

$ProgressPreference = "SilentlyContinue"

$commitId = [System.Environment]::GetEnvironmentVariable("SCM_COMMIT_ID");
$deployUrl = "https://your-umbraco-site.scm.s1.umbraco.io/api/deployments/$commitId"

$username = "MY_USERNAME"
$password = "MY_PASSWORD"
$logId = "LOG_ID"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username,$password)))

$deployInfo = Invoke-RestMethod -Method Get -Uri $deployUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)}

$url = 'https://api.elmah.io/v3/deployments?api_key=API_KEY'
$body = @{
  version = $version
  description = $deployInfo.message
  userName = $deployInfo.author
  userEmail = $deployInfo.author_email
  logId = $logId
}

[Net.ServicePointManager]::SecurityProtocol = `
    [Net.SecurityProtocolType]::Tls12,
    [Net.SecurityProtocolType]::Tls11,
    [Net.SecurityProtocolType]::Tls
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

Replace `your-umbraco-site` with the name of your site, `MY_USERNAME` with your Umbraco Cloud username, `MY_PASSWORD` with your Umbraco Cloud password, `LOG_ID` with the id if the elmah.io log that should contain the deployments ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) and finally `API_KEY` with your elmah.io API key, found and your organization settings page.

There you go. When deploying changes to your Umbraco Cloud site, a new deployment is automatically created on elmah.io.