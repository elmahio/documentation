---
title: Creating Rules to Perform Actions on Messages
description: elmah.io comes with a great rule engine for performing various actions when messages are logged in your log. Learn about how to set them up here.
---

# Creating Rules to Perform Actions on Messages

elmah.io comes with a great rule engine for performing various actions when messages are logged in your log.

This guide is also available as a short video tutorial here:

<a class="video-box" data-fancybox="" href="https://www.youtube.com/watch?v=TLzQNX4MFkE&amp;autoplay=1&amp;rel=0" title="Ignore filters and rules">
  <img class="no-lightbox" src="../images/tour/ignore-filters-and-rules.jpg" alt="Ignore filters and rules" />
  <i class="fad fa-play-circle"></i>
</a>

The rule engine is located beneath each log on the log settings page:

![Rules Tab](images/rulestab.png)

A rule consists of three parts: a title, a query, and an action.

The title should be a short text explaining what this rule does. We don't use the title for anything, so please write something that helps you identify rules and to keep them apart.

The query should contain either a full-text search string or a Lucene query. When new messages are logged, the message is matched up against all queries registered on that log. If and only if a message matches a query, the action registered on the rule is performed.

As mentioned above, the action part of a rule is executed when a message matches the query specified in the same rule. An action can be one of four types: Ignore, Hide, Mail, and HTTP Request. To illustrate how to use each action type, here are four examples of useful rules.

## Ignore errors with an HTTP status code of 400

> Be aware that Ignore rules are only meant as a temporary way of ignoring messages. In case you want to permanently ignore one or more log messages, use client-side filtering as explained in the documentation for each client integration. In addition, there's a client-side filtering help dialog available on the log message details toolbar. Ignoring a large number of messages with Ignore rules will slow down your application logging, use unnecessary network bandwidth, and risk hitting the elmah.io API request limit.

To ignore all messages with an HTTP status code of 400, you would need to set up the following:

| Title | Query | Then |
|---|---|---|
| Ignore 400s | `statusCode:400` | Ignore |

The rule would look like this in the UI:

![Then Ignore](images/thenignore.png)

## Hide warnings

To hide all messages with a severity of `Warning`, you would need to set up the following:

| Title | Query | Then |
|---|---|---|
| Hide Warnings | `severity:Warning` | Hide |

The rule would look like this in the UI:

![Then Ignore](images/thenhide.png)

## Send an email on all messages containing a word

To send an email on all messages containing the word _billing_ somewhere, you would need to set up the following:

| Title | Query | Then |
|---|---|---|
| Mail on billing | `billing` | Email |

The rule would look like this in the UI:

![Then Email](images/thenemail.png)

## Make an HTTP request on all new and fatal messages

To make an HTTP request on every new message with a severity of `Fatal`, you would need to set up the following:

| Title | Query | Then |
|---|---|---|
| Request on new fatal | `isNew:true AND severity:Fatal` | HTTP |

The rule would look like this in the UI:

![Then HTTP](images/thenhttp.png)

