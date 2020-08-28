---
title: Log a message from the CLI
---

# Log a message from the CLI

The `log` command is used to store a log message in a specified log

## Usage

```cmd
> elmahio log --help

log:
  Log a message to the specified log

Usage:
  elmahio log [options]

Options:
  --apiKey <apikey> (REQUIRED)       An API key with permission to execute the command
  --logId <logid> (REQUIRED)         The ID of the log to send the log message to
  --application <application>        Used to identify which application logged this message. You can use this if you
                                     have multiple applications and services logging to the same log
  --detail <detail>                  A longer description of the message. For errors this could be a stacktrace, but
                                     it's really up to you what to log in there.
  --hostname <hostname>              The hostname of the server logging the message.
  --title <title> (REQUIRED)         The textual title or headline of the message to log.
  --titleTemplate <titletemplate>    The title template of the message to log. This property can be used from logging
                                     frameworks that supports structured logging like: "{user} says {quote}". In the
                                     example, titleTemplate will be this string and title will be "Gilfoyle says It's
                                     not magic. It's talent and sweat".
  --source <source>                  The source of the code logging the message. This could be the assembly name.
  --statusCode <statuscode>          If the message logged relates to a HTTP status code, you can put the code in this
                                     property. This would probably only be relevant for errors, but could be used for
                                     logging successful status codes as well.
  --dateTime <datetime>              The date and time in UTC of the message. If you don't provide us with a value in
                                     dateTime, we will set the current date and time in UTC.
  --type <type>                      The type of message. If logging an error, the type of the exception would go into
                                     type but you can put anything in there, that makes sense for your domain.
  --user <user>                      An identification of the user triggering this message. You can put the users
                                     email address or your user key into this property.
  --severity <severity>              An enum value representing the severity of this message. The following values are
                                     allowed: Verbose, Debug, Information, Warning, Error, Fatal
  --url <url>                        If message relates to a HTTP request, you may send the URL of that request. If
                                     you don't provide us with an URL, we will try to find a key named URL in
                                     serverVariables.
  --method <method>                  If message relates to a HTTP request, you may send the HTTP method of that
                                     request. If you don't provide us with a method, we will try to find a key named
                                     REQUEST_METHOD in serverVariables.
  --version <version>                Versions can be used to distinguish messages from different versions of your
                                     software. The value of version can be a SemVer compliant string or any other
                                     syntax that you are using as your version numbering scheme.
  -?, -h, --help                     Show help and usage information
```