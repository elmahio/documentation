---
title: Log a message from the CLI
description: Learn about the log CLI command and how you can use it to log messages to elmah.io. Log a message from a shell script, test API keys, and more.
---

# Log a message from the CLI

The `log` command is used to store a log message in a specified log.

## Usage

```cmd
> elmahio log --help

Description:
  Log a message to the specified log

Usage:
  elmahio log [options]

Options:
  --apiKey <apiKey> (REQUIRED)     An API key with permission to execute the command
  --logId <logId> (REQUIRED)       The ID of the log to send the log message to
  --application <application>      Used to identify which application logged this message. You can use this if you have
                                   multiple applications and services logging to the same log
  --detail <detail>                A longer description of the message. For errors this could be a stacktrace, but it's
                                   really up to you what to log in there.
  --hostname <hostname>            The hostname of the server logging the message.
  --title <title> (REQUIRED)       The textual title or headline of the message to log.
  --titleTemplate <titleTemplate>  The title template of the message to log. This property can be used from logging
                                   frameworks that supports structured logging like: "{user} says {quote}". In the
                                   example, titleTemplate will be this string and title will be "Gilfoyle says It's not
                                   magic. It's talent and sweat".
  --source <source>                The source of the code logging the message. This could be the assembly name.
  --statusCode <statusCode>        If the message logged relates to a HTTP status code, you can put the code in this
                                   property. This would probably only be relevant for errors, but could be used for
                                   logging successful status codes as well.
  --dateTime <dateTime>            The date and time in UTC of the message. If you don't provide us with a value in
                                   dateTime, we will set the current date and time in UTC.
  --type <type>                    The type of message. If logging an error, the type of the exception would go into
                                   type but you can put anything in there, that makes sense for your domain.
  --user <user>                    An identification of the user triggering this message. You can put the users email
                                   address or your user key into this property.
  --severity <severity>            An enum value representing the severity of this message. The following values are
                                   allowed: Verbose, Debug, Information, Warning, Error, Fatal.
  --url <url>                      If message relates to a HTTP request, you may send the URL of that request. If you
                                   don't provide us with an URL, we will try to find a key named URL in
                                   serverVariables.
  --method <method>                If message relates to a HTTP request, you may send the HTTP method of that request.
                                   If you don't provide us with a method, we will try to find a key named
                                   REQUEST_METHOD in serverVariables.
  --version <version>              Versions can be used to distinguish messages from different versions of your
                                   software. The value of version can be a SemVer compliant string or any other syntax
                                   that you are using as your version numbering scheme.
  --correlationId <correlationId>  CorrelationId can be used to group similar log messages together into a single
                                   discoverable batch. A correlation ID could be a session ID from ASP.NET Core, a
                                   unique string spanning multiple microsservices handling the same request, or
                                   similar.
  --category <category>            The category to set on the message. Category can be used to emulate a logger name
                                   when created from a logging framework.
  -?, -h, --help                   Show help and usage information
```

## Examples

**Simple:**

```cmd
elmahio log --apiKey API_KEY --logId LOG_ID --title "An error happened"
```

**Full:**

```cmd
elmahio log --apiKey API_KEY --logId LOG_ID --title "An error happened" --application "My app" --details "Some details" --hostname "localhost" --titleTemplate "An {severity} happened" --source "A source" --statusCode 500 --dateTime 2022-01-13 --type "The type" --user "A user" --severity "Error" --url "https://elmah.io" --method "GET" --version "1.0.0"
```