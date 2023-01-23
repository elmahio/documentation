---
title: Integrate elmah.io with PagerDuty
description: Learn how to integrate PagerDuty with elmah.io. Get a phone call, email, or text message when new errors are logged on elmah.io.
---

# Install PagerDuty for elmah.io

Using the PagerDuty integration for elmah.io, you can set up advanced notification rules in PagerDuty when new errors are logged on elmah.io. Receive a phone call, text message, or one of the other options provided by PagerDuty, the second new errors are introduced on your websites or services.

To integrate elmah.io with PagerDuty, you need to set up a new integration on PagerDuty and install the PagerDuty app on elmah.io.

## Setting up an integration on PagerDuty

-  Sign in to PagerDuty.

- Navigate to the *Services* page.

- Select the service that you want to integrate to from elmah.io in the list of services.

- On the *Integrations* tab click the *Add an integration* button.

- On the *Add Integrations* page search for elmah.io and select it in the search result:

![Select elmah.io](images/apps/pagerduty/add-integration-v2.png)

- Click the *Add* button.

- Expand the newly created integration:

![Update name](images/apps/pagerduty/integration-name-and-key-v2.png)

- Copy the value in the *Integration Key* field.

## Install the PagerDuty app on elmah.io

Next, the PagerDuty app needs to be installed on elmah.io.

- Sign in to elmah.io.

- Navigate to the *Log Settings* page of the log you want to integrate with PagerDuty.

- Go to the *Apps* tab.

- Locate the PagerDuty app and click the *Install* button.

- Input the Integration Key that you copied in a previous step in the *INTEGRATION KEY* field:

![Insert Integration Key on elmah.io](images/apps/pagerduty/install-pagerduty-on-elmahio.png)

- Click the *Save* button.

That's it. New errors stored in the selected log now trigger incidents in PagerDuty. To get help with this integration, make sure to reach out through the support widget on the elmah.io website.