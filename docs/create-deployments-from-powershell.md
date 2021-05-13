# Create deployments from PowerShell

If you release your software using a build or deployment server, creating the new release is easy using a bit of PowerShell. To request the `deployments` endpoint, write the following PowerShell script:

```powershell
$version = "1.42.7"
$ProgressPreference = "SilentlyContinue"
$url = 'https://api.elmah.io/v3/deployments?api_key=API_KEY'
$body = @{
  version = $version
}
[Net.ServicePointManager]::SecurityProtocol = `
    [Net.SecurityProtocolType]::Tls12,
    [Net.SecurityProtocolType]::Tls11,
    [Net.SecurityProtocolType]::Tls
Invoke-RestMethod -Method Post -Uri $url -Body $body
```

(replace `API_KEY` with your API key found on your organization settings page)

In the example, a simple version string is sent to the API and elmah.io will automatically put a timestamp on that. Overriding user information and description, makes the experience within the elmah.io UI better. Pulling release notes and the name and email of the deployer, is usually available through environment variables or similar, depending on the technology used for creating the deployment.

Here's an example of a full payload for the create deployment endpoint:

```powershell
$body = @{
  version = "1.0.0"
  created = [datetime]::UtcNow.ToString("o")
  description = "my deployment"
  userName = "Thomas"
  userEmail = "thomas@elmah.io"
  logId = "39e60b0b-21b4-4d12-8f09-81f3642c64be"
}
```

In this example, the deployment belongs to a single log why the `logId` property is set. The `description` property can be used to include a changelog or similar. Markdown is supported.