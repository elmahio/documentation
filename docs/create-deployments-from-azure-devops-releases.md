---
title: Create deployments from Azure DevOps Releases
description: If you are using Releases in Azure DevOps, you should use our extension to notify elmah.io about new deployments. Learn how to install it here.
howto_steps:
  - name: Install the extension
    text: "Go to the elmah.io Deployment Tasks extension on the Azure DevOps Marketplace and click Get it free: https://marketplace.visualstudio.com/items?itemName=elmahio.deploy-tasks"
  - name: Install it into your organization
    text: Select your organization and click the Install button.
  - name: Add and configure the deployment task
    text: Go to your Azure DevOps project, add the elmah.io Deployment Notification task, and select task version 5.*. Replace API_KEY with an API key with permission to create deployments, and LOG_ID with a log ID if the deployment should be specific to one log (deployments without a log ID show on all logs). The task uses the current release name (RELEASE_RELEASENAME) as the version by default; override this in the Version text box if needed.
---

# Create deployments from Azure DevOps Releases

If you are using Releases in Azure DevOps, you should use our extension to notify elmah.io about new deployments. To install and configure the extension, follow the simple steps below:

1. Go to the [elmah.io Deployment Tasks](https://marketplace.visualstudio.com/items?itemName=elmahio.deploy-tasks) extension on the Azure DevOps Marketplace and click the _Get it free_ button:

![Install the extension](images/deploy-notification/marketplace_get_it_free.png)

2. Select your organization and click the *Install* button:

![Select organization](images/deploy-notification/marketplace_select_organization.png)

3. Go to your Azure DevOps project and add the *elmah.io Deployment Notification* task. Select task version 5.* and fill in all fields as shown here:

![Add the task](images/deploy-notification/release-pipeline-task-v4.png)

You will need to replace `API_KEY` with an API key ([Where is my API key?](where-is-my-api-key.md)) with permission ([How to configure API key permissions](how-to-configure-api-key-permissions.md)) to create deployments. If the deployment is specific to a single log, insert a log ID ([Where is my log ID?](where-is-my-log-id.md)) with the ID of the log instead of `LOG_ID`. Deployments without a log ID will show on all logs in the organization.

The task uses the current release name (`RELEASE_RELEASENAME`) as the version name on elmah.io. If you want to override this behavior, you can insert a value in the *Version* text box.

The task runs on Windows, Linux, and macOS agents and requires agent version 3.232.1 or newer, which all Microsoft-hosted agents already run. If you already use version 4 of the task, select task version 5.* on the existing task. The inputs are the same. Version 4 does not run on Linux agents.

That's it! Azure DevOps will now notify elmah.io every time the release pipeline is executed.