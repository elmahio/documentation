---
title: Managing Organizations and Users
description: elmah.io offers great features to manage users in your organization and to specify who should be allowed access to what. Learn how to set it up.
---

# Managing Organizations and Users

[TOC]

Chances are that you are not the only one needing to access your logs. Luckily, elmah.io offers great features to manage the users in your organization and to specify who should be allowed access to what.

This guide is also available as a short video tutorial here:

<a class="video-box" data-fancybox="" href="https://www.youtube.com/watch?v=7O43XBy4Kfg&amp;autoplay=1&amp;rel=0" title="user-administration">
  <img class="no-lightbox" src="../images/tour/user-administration.jpg" alt="user-administration" />
  <i class="fad fa-play-circle"></i>
</a>

To manage access, you will need to know about the concepts of **users** and **organizations**.

A **user** represents a person wanting to access one or more logs. Each user logs in using a username/password or a social provider of choice. A user can be added to one or more organizations. Each user has an access level within the organization as well as an access level on each log. The access level on the organization and the logs doesn't need to be the same.

An **organization** is a collection of users and their roles inside the organization. You will typically only need a single organization, representing all of the users in your company needing to access one or more logs on elmah.io. Your elmah.io subscription is attached to your organization and everyone with administrator access to the organization will be able to manage the subscription.

## Adding existing users to an organization

To assign users to a log, you will need to add them to the organization first. When hovering the organization name in either the left menu or on the dashboard, you will see a small gear icon. When clicking the icon, you will be taken to the organization settings page:

![Organization Settings](images/organisation_settings.png)

At first, the user creating the organization will be the only one on the list. To add a new user to the list, click the *Add user* button and input the user's email or name in the textbox. The dropdown will show a list of users on elmah.io matching your query.

> Each user needs to sign up on elmah.io before being visible through *Add user*. Jump to [Invite new users to an organization](#invite-new-users-to-an-organization) to learn how to invite new users.

When the new user is visible in the dropdown, click the user and select an access level. The chosen access level decides what the new user is allowed to do inside the organization. *Read* users are only allowed to view the organization, while *Administrator* users are allowed to add new users and delete the entire organization and all logs beneath it. The access level set for the user in the organization will become the user's access level on all new logs inside that organization as well.

To change the access level on an added user, click one of the grouped buttons to the right of the user's name. Changing a user's access level on the organization won't change the user's access level on each log. To delete a user from the organization, click the red delete button to the far right.

When a user is added to an organization, the user will automatically have access to all new logs created in that organization. For security reasons, a new user added to the organization, will not have access to existing logs in the organization. To assign the new user to existing logs, assign an access level on each log by clicking the settings button to the right of the user:

![Manage log(s) access](images/manage-log-access.png)

> Awarding a user *Administrator* on a log doesn't give them *Administrator* rights to the organization.

To assign a user to all logs, click the _None_, _Read_, _Write_, or _Administrator_ buttons in the table header above the list of logs.

## Invite new users to an organization

If someone not already created as a user on elmah.io needs access to your organization, you can use the *Invite* feature. Inviting users will send them an email telling them to sign up for elmah.io and automatically add them to your organization.

To invite a user click the *Invite user* button and input the new user's email. Select an organization access level and click the green *Invite user* button. This will add the new user to the organization and display it as "Invited" until the user signs up.

## Control security

You may have requirements of using two-factor authentication or against using social sign-ins in your company. These requirements can be configured on elmah.io as well. Click the *Security* button above the user's list to set it up:

![Users security](images/users-security-new.png)

Using this view you can allow or disallow sign-ins using:

- An elmah.io username and password
- Twitter
- Facebook
- Microsoft
- Google

Notice that disallowing different sign-in types will still allow users in your organization to sign into elmah.io. As soon as a disallowed user type is trying to access pages inside the organization and/or logs a page telling them which sign-in type or required settings is shown.