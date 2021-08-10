# Create deployments from GitHub Actions

GitHub Actions is a great platform for building and releasing software. To notify elmah.io when you deploy a new version of your project, you will need an additional step in your build definition. Before you do that, start by creating new secrets:

1. Go to your project on GitHub.

2. Click the *Settings* tab.

3. Click the *Secrets* navigation item.

4. Click *New repository secret*.

5. Name the secret `ELMAH_IO_API_KEY`.

6. Insert your elmah.io API key in *Value* ([Where is my API key?](/where-is-my-api-key/)). Make sure to use an API key that includes the *Deployments* | *Write* permission ([How to configure API key permissions](/how-to-configure-api-key-permissions/)).

7. Click *Add secret*

8. Do the same for your elmah.io log ID but name it `ELMAH_IO_LOG_ID` ([Where is my log ID?](/where-is-my-log-id/)).

9. Insert the following step as the last one in your YAML build specification:

```yaml
- name: Create Deployment on elmah.io
  uses: elmahio/github-create-deployment-action@v1
  with:
    apiKey: ${{ secrets.ELMAH_IO_API_KEY }}
    version: ${{ github.run_number }}
    description: ${{ github.event.head_commit.message }}
    userName: ${{ github.actor }}
    logId: ${{ secrets.ELMAH_IO_LOG_ID }}
```

The configuration will automatically notify elmah.io every time the build script is running. The build number (`github.run_number`) is used as the version for this sample, but you can modify this if you prefer another scheme. The description will contain the last commit message (`github.event.head_commit.message`). The user responsible for triggering the build (`github.actor`) will be used as the user name on the elmah.io deployment.