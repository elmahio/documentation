---
title: Create deployments from Azure DevOps Releases
description: If you are using Releases in Azure DevOps, you should use our extension to notify elmah.io about new deployments. Learn how to install it here.
---

# Create deployments from Azure DevOps Releases

If you are using Releases in Azure DevOps, you should use our extension to notify elmah.io about new deployments. To install and configure the extension, follow the simple steps below:

1. Go to the [elmah.io Deployment Tasks](https://marketplace.visualstudio.com/items?itemName=elmahio.deploy-tasks) extension on the Azure DevOps Marketplace and click the _Get it free_ button:

![Install the extension](images/deploy-notification/marketplace_get_it_free.png)

2. Select your organization and click the *Install* button:

![Select organization](images/deploy-notification/marketplace_select_organization.png)

3. Go to your Azure DevOps project and add the *elmah.io Deployment Notification* task. Fill in all fields as shown here:

![Add the task](images/deploy-notification/release_pipeline_task.png)

You will need to replace `API_KEY` with an API key ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)) with permission ([How to configure API key permissions](https://docs.elmah.io/how-to-configure-api-key-permissions/)) to create deployments. If the deployment is specific to a single log, insert a log ID ([Where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)) with the ID of the log instead of `LOG_ID`. Deployments without a log ID will show on all logs in the organization.

That's it! Azure DevOps will now notify elmah.io every time the release pipeline is executed.