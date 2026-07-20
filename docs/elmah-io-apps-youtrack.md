---
title: Integrate elmah.io with YouTrack
description: Integrate elmah.io with YouTrack to automatically create a list of issues from your production environment. Follow up on all new errors.
howto_steps:
  - name: Generate a permanent token
    text: Go to your YouTrack profile, click Account Security, generate a new permanent token, and copy the generated token.
  - name: Install the YouTrack app on elmah.io
    text: Log into elmah.io, go to the log settings, click the Apps tab, locate the YouTrack app, and click Install.
  - name: Enter your token and URL, then log in
    text: Input your token and the base URL of your YouTrack Cloud installation, then click the Login button to fetch the list of projects from YouTrack.
  - name: Save the configuration
    text: Click Save to add the app to your log. New errors will automatically create issues in the configured YouTrack project.
---

# Install YouTrack App for elmah.io

## Get your token

To allow elmah.io to create issues on YouTrack, you will need a permanent token. Go to your YouTrack profile, click the _Account Security_. Here you can generate a new token:

![Generate permanent token](images/apps/youtrack/generate_permanent_token_v2.png)

Copy the generated token.

## Install the YouTrack App on elmah.io

Log into elmah.io and go to the log settings. Click the Apps tab. Locate the YouTrack app and click the *Install* button. Input your token and the base URL of your YouTrack Cloud installation. Next, click the _Login_ button to fetch the list of projects from YouTrack:

![Install YouTrack App](images/apps/youtrack/install_youtrack_app_v3.png)

Click *Save* and the app is added to your log. When new errors are logged, issues are automatically created in the configured YouTrack project.