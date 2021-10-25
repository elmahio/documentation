---
title: Install HipChat App for elmah.io
description: Learn about how to set up the HipChat app for elmah.io. Automatically notify your team on HipChat when new errors are logged to elmah.io.
---

# Install HipChat App for elmah.io

## Generate OAuth 2 Token

To allow elmah.io to log messages to HipChat, you will need to generate an OAuth 2 token. To do so, log into HipChat and go to the [API Access](https://elmahio.hipchat.com/account/api) page (replace *elmahio* with your subdomain).

![OAuth Tokens Page](/images/apps/hipchat/generate_token.png)

Input a label, click the *Create* button and copy the generated token.

> If you want to test your configuration using the _Test_ button on the elmah.io UI, you will need to select both _Send Notification_ and _View Room_ in _Scopes_.

## Install the HipChat App on elmah.io

Log into elmah.io and go to the log settings. Click the Apps tab. Locate the HipChat app and click the *Install* button:

![Install HipChat App](/images/apps/hipchat/install_hipchat.png)

Paste the token copied in the previous step into the Token textbox. In the Room textbox, input the name of the HipChat chat room you want messages from elmah.io to show up in.

Click *Save* and the app is added to your log. When new errors are logged, messages start appearing in the chat room that you configured.

> HipChat doesn't allow more than 500 requests per 5 minutes. If you generate more messages to elmah.io, not all of them will show up in HipChat because of this.

Finally, if you need more control over what to log, you should read our guide on [Integrating elmah.io with HipChat manually](https://docs.elmah.io/integrate-elmah-io-with-hipchat/).