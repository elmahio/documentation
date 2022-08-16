---
title: How does the new detection work
description: Learn about the New Detection feature on elmah.io to help identify uniqueness across log messages. Only get notifications when new errors are logged.
---

# How does the new detection work

Being able to identify when a logged error is new or a duplicate of an already logged error, is one of the most important features on elmah.io. A lot of other features are based on this mechanism to help you reduce the number of emails, Slack/Teams messages, and much more. We often get questions about how this works and how to tweak it, why this article should bring some clarity to questions about this feature.

When logging messages to elmah.io using either one of the integrations or through the API, we automatically set a flag named `isNew` on each log message. Calculating the value of this field is based on a rather complex algorithm. The implementation is closed-source but not a huge secret. Each message is assigned a hash value based on a range of fields like the message template, the severity, the URL, and more. Some values are normalized or modified before being sent as input to the hash function. An example of this is removing numbers from the log message which will ensure that `Error on product 1` and `Error on product 2` will be considered the same log message. When receiving a new log message, we check if an existing message with the same hash is already stored in the log. If not, the new message will be marked as *New* by setting the `isNew` flag to `true`. If we already found one or more log messages with the same hash, the new message will have its `isNew` flag set to `false`.

## Messages and apps

Most apps and features around sending messages from elmah.io are based on the `isNew` flag. This means that only new errors trigger the *New Error Email*, the Slack and Teams apps, etc. This is done to avoid flooding the recipient system with emails or messages. You typically don't want 1,000 emails if the same error occurs 1,000 times. Error occurrence is still important, why there are other features to help you deal with this like the *Error Occurrence Email* and spike-based machine learning features.

## Modifying the hash function

We sometimes get requests to modify the hash function, but unfortunately, that's currently not possible. We change the implementation from time to time to improve the uniqueness detection over time. If you have an example of two log messages that should have been considered unique or not considered unique, feel free to reach out. This may or may not result in changes to the hash function.

There are still some possibilities to force two log messages to not be unique. The obvious is to include different variables inside the log message. Remember that numbers are removed, why this must consist of letters. Another approach is to put individual values in the `source` field. This can be done in all integrations by implementing the `OnMessage` action. Some integrations also support setting the `source` field by including it as structured properties like `Error from {source}`.

## Setting re-occurring messages as New

A common request is to get a notification if an error that you believed was fixed re-occur. This scenario is built into elmah.io's issue tracker. When marking a log message as fixed through the UI or API, elmah.io automatically marks all instances of the log message as fixed. If a new log message with the same hash is logged at some point, the `isNew` flag on this message will be set to `true`. This will trigger the *New Error Email* and most of the integrations again.

## Retention

Depending on your current plan, each subscription provides x days of retention for log messages. This means that log messages are automatically deleted after x days in the database. Once all instances of a log message are deleted, a new log message generating the same hash as the deleted messages will be marked as new. To increase the chance of log messages being marked as new, you can lower the retention on each log on the *Log Settings* page.