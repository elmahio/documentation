---
title: Create deployments from GitLab Pipelines
description: Learn how to create deployments on elmah.io from GitLab Pipelines. Get the perfect overview of your deployments in one place.
howto_steps:
  - name: Define API key and log ID variables
    text: |
      In your deploy job, add variables with your elmah.io API key (with permission to create deployments) and the ID of the log to create the deployment in:
      variables:
        API_KEY: 'API_KEY'
        LOG_ID: 'LOG_ID'
  - name: Add a deployment notification step
    text: |
      In the job's script section, after deploying, run:
      curl --location --request POST "https://api.elmah.io//v3/deployments?api_key=$API_KEY" --header 'Content-Type: application/x-www-form-urlencoded' --data "version=$CI_PIPELINE_ID&description=$CI_COMMIT_MESSAGE&userName=$GITLAB_USER_NAME&userEmail=$GITLAB_USER_EMAIL&logId=$LOG_ID"
      This uses the GitLab pipeline ID as the version, and sets the commit message and triggering user as additional deployment details.
---

# Create deployments from GitLab Pipelines

Notifying elmah.io of new deployments on GitLab Pipelines can be done by adding a bit of YAML code. You can create the integration in whatever job you prefer. In the following example, a deploy job is extended to create a new deployment on elmah.io:

```yml
deploy-job:
  stage: deploy
  environment: production
  variables:
    API_KEY: 'API_KEY'
    LOG_ID: 'LOG_ID'
  script:
    - echo "Deploying application..."
    - echo "Application successfully deployed."
    - |
      curl --location --request POST "https://api.elmah.io//v3/deployments?api_key=$API_KEY" --header 'Content-Type: application/x-www-form-urlencoded' --data "version=$CI_PIPELINE_ID&description=$CI_COMMIT_MESSAGE&userName=$GITLAB_USER_NAME&userEmail=$GITLAB_USER_EMAIL&logId=$LOG_ID"
```

The code defines two new variables named `API_KEY` and `LOG_ID`. Replace the values with an API key ([Where is my API key?](where-is-my-api-key.md)) with permission to create deployments and the ID ([Where is my log ID?](where-is-my-log-id.md)) of the log to create the deployment in.

The script uses `curl` to call the elmah.io API. As part of the HTTP POST, the pipeline ID (basically a build number) is used for the version. You can change that to SemVer or whatever you prefer. The commit message and user triggering the build are added as part of the deployment.