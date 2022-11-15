---
title: Integrate elmah.io with YouTrack
description: Integrate elmah.io with YouTrack to automatically create a list of issues from your production environment. Follow up on all new errors.
---

# Install YouTrack App for elmah.io

## Get your token

To allow elmah.io to create issues on YouTrack, you will need a permanent token. Go to your YouTrack profile, click the _Account Security_. Here you can generate a new token:

![Generate permanent token](images/apps/youtrack/generate_permanent_token_v2.png)

Copy the generated token.

## Install the YouTrack App on elmah.io

Log into elmah.io and go to the log settings. Click the Apps tab. Locate the YouTrack app and click the *Install* button. Input your token and instance name. Next, click the _Login_ button to fetch the list of projects from YouTrack:

![Install YouTrack App](images/apps/youtrack/install_youtrack_app_v2.png)

Click *Save* and the app is added to your log. When new errors are logged, issues are automatically created in the configured YouTrack project.