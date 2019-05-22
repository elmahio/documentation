---
title: Integrate elmah.io with Atlassian Jira
description: Maintaining issues isn't exactly the highlight of anyone's day. With the elmah.io app for Jira we automatically create all new errors from your applications in Jira.
---

# Install Jira App for elmah.io

Log into elmah.io and go to the log settings. Click the Apps tab. Locate the Jira app and click the *Install* button:

![Install Jira App](images/apps/jira/install_settings.png)

Input your site name, which is the first part of the URL you use to log into Jira. For the URL `https://elmahio.atlassian.net/`, the `site` parameter would be `elmahio`. In the Project field, input the key of the project. Note that a project has both a display name and a key. The property we are looking for here is the uppercase identifier of the project.

To create issues on Jira, you will need to input the username and password of a user with permission to create issues in the project specified above. You can use your user credentials, but we recommend using a combination of your username and an API token.

To generate a new token specific for elmah.io, go to [https://id.atlassian.com/manage/api-tokens](https://id.atlassian.com/manage/api-tokens). Then click the *Create API token* button and input a label of your choice. Finally, click the *Create* button and an API token is generated for you. Make sure to copy this token, since you won't be able to access it once the dialog is closed.

Go back to elmah.io and input your email in the *Username* field and the API token from the previous step in the *Password* field. If you don't like to use an existing user account for the integration, you can create a new Atlassian account for elmah.io and generate the API token from that account instead.

Click *Save* and the app is added to your log. When new errors are logged, issues are automatically created in the configured Jira project.