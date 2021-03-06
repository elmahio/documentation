---
title: Integrate elmah.io with GitHub
description: Why spend time navigating your error logs and creating issues in GitHub manually? Using elmah.io and our integration with GitHub we maintain your list of bugs.
---

# Install GitHub App for elmah.io

## Generate Personal Access Token

In order to allow elmah.io to create issues on GitHub, you will need to generate a Personal Access Token. To do so, log into GitHub and go to the [New personal access token](https://github.com/settings/tokens/new) page.

![OAuth Tokens Page](/images/apps/github/generate_token.png)

Input a token description, click the *Generate token* button and copy the generated token (colored with a green background).

## Install the GitHub App on elmah.io

Log into elmah.io and go to the log settings. Click the Apps tab. Locate the GitHub app and click the *Install* button:

![Install GitHub App](/images/apps/github/install_github.png)

Paste the token copied in the previous step into the *Token* textbox. In the *Owner* textbox, input the name of the user or organization owning the repository you want to create issues in. In the *Repository* textbox input the name of the repository.

Click *Save* and the app is added to your log. When new errors are logged, issues are automatically created in the configured GitHub repository.