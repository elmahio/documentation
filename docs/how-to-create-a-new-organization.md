---
title: How to create a new organization
description: Learn how to create a new organization on elmah.io, and when you don't need one. Host logs for multiple customers or applications inside a single organization to avoid paying for multiple subscriptions.
---

# How to create a new organization

An organization is where your logs, users, and subscription live on elmah.io. Before creating a new one, it is worth knowing that most people who ask how to create an organization (also spelled organisation) don't need more than one.

## Do you need a new organization?

Each organization has its own subscription. The subscription is attached to the organization and not to the user, so creating five organizations means paying for five subscriptions, and each organization has its own message limit, users, and retention.

If you want to structure your logs, for example to host logs for several customers, applications, or teams, you can usually do that inside a single organization:

- **Create one log per customer or application.** Logs are the unit you log messages to, and an organization can contain as many logs as you need.
- **Group the logs using environments.** Environments are a grouping feature for logs. Besides Development, Test, Staging, and Production, you can create environments named after customers, departments, or servers. See [Managing Environments](managing-environments.md).
- **Control who can see which logs.** Users are added to the organization, and each user is given an access level on each log. A user can be limited to the logs they should see. Users added to the organization automatically get access to logs created later, so check the access on new logs. See [Managing Organisations and Users](managing-organisations-and-users.md).

A separate organization makes sense when the logs need their own subscription and billing, for instance when a customer pays for their own elmah.io plan. Logs can't be moved between organizations, so decide on the structure before you start logging.

## Create an organization

If you still want a new organization, there is no menu item or button for creating one once you already belong to an organization, and there is no separate organizations area in the app. Open the create organization page while signed in:

[https://app.elmah.io/createorganisation/](https://app.elmah.io/createorganisation/)

On the page:

1. Input the name of your organization or company in the *Organization* field.
2. Optionally, input one or two email addresses in *Invite Members* to invite people to the organization. Invited users need to be assigned to one or more logs on the *Users* tab of the organization settings page after they join.
3. Click *Create Organization*.

You become an administrator of the new organization. The new organization comes with the default environments Production, Staging, Test, and Development, and two API keys named *Default* and *JavaScript*.

There is no limit to the number of organizations you can create, but each one needs its own subscription once its trial ends.

## If you don't have an organization yet

If you are new to elmah.io and don't belong to an organization, the *Dashboard* shows a message saying *Create or join an organization* with a *Create Organization* button. The button opens the same page.

If you are part of an existing organization, don't create a new one. Ask an administrator of the existing organization to add you, and the logs will show on your dashboard. On the create organization page, the *Existing Organization ?* button explains this.
