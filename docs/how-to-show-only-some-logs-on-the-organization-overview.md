---
title: How to show only some logs on the organization overview
description: Learn how to hide test, staging, and development logs from the organization overview (organisation overview) so it only shows production logs or the logs you pick.
---

# How to show only some logs on the organization overview

The organization overview (also spelled organisation overview) shows metrics and numbers for all logs in your organization. If you only want to see production logs, you can choose which logs to include in the view. This is how you hide test, staging, development, and other logs from the organization overview.

## Choose which logs to show

1. Open the organization overview.
2. Click the gear icon in the top right corner. The tooltip says *Settings*. It sits next to the time range selector and the refresh and fullscreen buttons.
3. A list of all your logs opens, grouped by environment (Production, Test, Staging, and so on). Each log has a checkbox. Scroll the list if you have many logs.
4. Uncheck the logs you don't want on the organization overview. To show only production logs, uncheck every log in the other environments.

Logs that are unchecked are no longer included in the organization overview. Checked logs stay.

## Things to know

- The selection only controls what the organization overview shows. The log is not deleted, and it keeps receiving and storing messages as before. The metrics and numbers from an unchecked log are not loaded into the overview.
- The selection is stored in the local storage of your browser. It only applies to you, in that browser. Your colleagues don't see your choice, and you need to set it again in another browser or on another device.
- Clearing your browser data removes the selection, and all logs show again. If the overview suddenly shows logs you had hidden, repeat the steps above.
- Environments are a way to group logs, and they are not needed for this. You don't have to move logs to another environment or delete environments to hide logs from the organization overview.

## Not the same as the other gear icon

The gear icon next to the organization name on the dashboard and in the left menu opens the organization settings page, where you manage users, environments, and other organization options. The gear icon described on this page is on the organization overview itself and only controls which logs are included in that view.
