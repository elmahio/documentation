# Create deployments from GitHub Actions

GitHub Actions is a great platform for building and releasing software. To notify elmah.io when you deploy a new version of your project, you will need an additional step in your build definition. Before you do that, start by creating new secrets:

1. Go to your project on GitHub.

2. Click the *Settings* tab.

3. Click the *Secrets* navigation item.

4. Click *Add a new secret*.

5. Name the secret `ELMAH_IO_API_KEY`.

6. Insert your elmah.io API key in *Value* ([Where is my API key?](/where-is-my-api-key/)). Make sure to use an API key that includes the *Deployments* | *Write* permission ([How to configure API key permissions](/how-to-configure-api-key-permissions/)).

7. Click *Add secret*

8. Do the same for your elmah.io log ID but name it `ELMAH_IO_LOG_ID` ([Where is my log ID?](/where-is-my-log-id/)).

9. Insert the following step as the last one in your YAML build specification:

```yaml
- name: Notify elmah.io
      shell: powershell
      run: |
        $ProgressPreference = "SilentlyContinue"
        
        $url = "https://api.elmah.io/v3/deployments?api_key=${{ secrets.ELMAH_IO_API_KEY }}"
        $body = @{
          version = "${{ github.run_number }}"
          userName = "${{ github.actor }}"
          logId = "${{ secrets.ELMAH_IO_LOG_ID }}"
        }
        [Net.ServicePointManager]::SecurityProtocol = `
          [Net.SecurityProtocolType]::Tls12,
          [Net.SecurityProtocolType]::Tls11,
          [Net.SecurityProtocolType]::Tls
        Invoke-RestMethod -Method Post -Uri $url -Body $body
```