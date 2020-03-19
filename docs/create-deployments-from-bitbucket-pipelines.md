# Create deployments from Bitbucket Pipelines

Pipelines uses scripts, embedded in YAML-files, to configure the different steps required to build and deploy software. To notify elmah.io as part of a build/deployment, the first you will need to do, is to add your API key as a secure environment variable. To do so, go to *Settings* | *Pipelines* | *Environment variables* and add a new variable:

![Add environment variable](/images/pipelines_environment_variable.png)

[Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)

Then add a new script to your build YAML-file after building and deploying your software:

```yaml
pipelines:
  default:
    - step:
        script:
          ...
          - curl -X POST -d "{\"version\":\"$BITBUCKET_BUILD_NUMBER\"}" -H "Content-Type:application/json" https://api.elmah.io/v3/deployments?api_key=$ELMAHIO_APIKEY
```

The script uses `curl` to invoke the elmah.io Deployments endpoint with the API key (`$ELMAHIO_APIKEY`) and a version number (`$BITBUCKET_BUILD_NUMBER`). The posted JSON can be extended to support additional properties like changelog and the name of the person triggering the deployment. Check out the [API documentation](http://api.elmah.io/swagger/ui/index) for details.