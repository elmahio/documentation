# Managing Organisations and Users

Chances are that you are not the only one needing to access your logs. Luckily, elmah.io offers great features in order to manage the users in your organisation and to specify who should be allowed access to what.

This guide is also available as a short video tutorial here:

<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/7O43XBy4Kfg?rel=0" allowfullscreen></iframe>
</div><br/>

In order to manage access, you will need to know about the concepts of **users** and **organisations**.

A **user** represents a person wanting to access one or more logs. Each user has its own login using username/password or a social provider of choice. A user can be added to one or more organisations. Each user has an access level within the organisation as well as an access level on each log. The access level on the organisation and the logs doesn't need to be the same.

An **organisation** is a collection of users and their role inside the organisation. You will typically only need a single organisation, representing all of the users in your company needing to access one or more logs on elmah.io. Your elmah.io subscription is attached your organization and everyone with administrator access to the organization, will be able to manage the subscription.

## Adding users to an organisation

To assign users to a log, you will need to add them to the organisation first. When hovering the organisation name in either the left menu or on the dashboard, you will see a small gear icon. When clicking the icon, you will be taken to the organisation settings page:

![Organisation Settings](images/organisation_settings.png)

At first, the user creating the organisation will be the only one in the list. To add a new user to the list, input the user's email or name in the textbox below *Add new user*. The dropdown will show a list of users on elmah.io matching your query.

> Each user needs to sign up on elmah.io before being visible in the *Add new user* list.

When the new user is visible in the dropdown, click the user and select an access level. The chosen access level decides what the new user is allowed to do inside the organisation. *Read* users are only allowed to view the organisation, while *Administrator* users are allowed to add new users and delete the entire organisation and all logs beneath it. The access level set for the user in the organisation, will become the user's access level on all new logs inside that organisation as well. Let's add a new user to the organisation:

![Add User to Organisation](images/add_user_to_org.png)

To change the access level on an already added user, click one of the grouped buttons to the right of the user's name. Changing a user's access level on the organisation won't change the users access level on each log. To delete a user from the organisation, click the red delete button to the far right.

When a user is added to an organisation, the user will automatically have access to all new logs created in that organisation. For security reasons, a new user added to the organisation, will not have access to existing logs in the organisation. To assign the new user to existing logs, assign an access level on each log shown beneath the user. The list of logs can be opened by clicking the dropdown button to the right of the user.

> Awarding a user *Administrator* on a log, doesn't give them *Administrator* rights on the organisation.

To assign a user to all logs, click the _None_, _Read_, _Write_ or _Administrator_ buttons in the table header above the list of logs.