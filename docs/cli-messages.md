---
title: Count, create, list and more log message commands
description: Learn about the various CLI commands related to log messages. Fetch frequent log messages, execute counts, and more.
---

# Messages command

The `messages` command provide a range of sub-commands related to log messages.

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#count" title="Count">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-hashtag"></i>
                </div>
                <div class="guide-title">Count</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#create" title="Create">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-plus"></i>
                </div>
                <div class="guide-title">Create</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#get" title="Get">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file"></i>
                </div>
                <div class="guide-title">Get</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#list-frequent" title="List frequent">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-list"></i>
                </div>
                <div class="guide-title">List frequent</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#list-recent" title="List recent">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-list"></i>
                </div>
                <div class="guide-title">List recent</div>
            </div>
        </a>
    </div>
</div>

## Count

The `count` command is used to count messages in a log based on various options.

**Usage**

```cmd
> elmahio messages count --help

Description:
  Count log messages matching optional filters

Usage:
  elmahio messages count [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The ID of the log
  --query <query>             Full-text or Lucene query to filter messages
  --severity <severity>       Filter by severity (Verbose, Debug, Information, Warning, Error, Fatal)
  --from <from>               Count messages from this date (defaults to 90 days ago)
  --json                      Output results as JSON instead of formatted text
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Simple example:**

```cmd
elmahio messages count --logId LOG_ID
```

**Full example:**

```cmd
elmahio messages count --apiKey API_KEY --logId LOG_ID --query "statusCode:500" --severity Error --from 2026-03-17
```

## Create

The `create` command is used to create a log message in a specified log.

**Usage**

```cmd
> elmahio messages create --help

Description:
  Log a message to the specified log

Usage:
  elmahio messages create [options]

Options:
  --apiKey <apiKey>                An API key with permission to execute the command. If omitted, the key stored via
                                   'elmahio login' is used.
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
  --proxyHost <proxyHost>          A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>          A port number for a proxy to use to call elmah.io
  -?, -h, --help                   Show help and usage information
```

**Simple example:**

```cmd
elmahio messages create --logId LOG_ID --title "An error happened"
```

**Full example:**

```cmd
elmahio messages create --apiKey API_KEY --logId LOG_ID --title "An error happened" --application "My app" --details "Some details" --hostname "localhost" --titleTemplate "An {severity} happened" --source "A source" --statusCode 500 --dateTime 2022-01-13 --type "The type" --user "A user" --severity "Error" --url "https://elmah.io" --method "GET" --version "1.0.0"
```

## Get

The `get` command is used to fetch a single log messages.

**Usage**

```cmd
> elmahio messages get --help

Description:
  Fetch a single log message by ID

Usage:
  elmahio messages get [options]

Options:
  --apiKey <apiKey>                   An API key with permission to execute the command. If omitted,
                                      the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)          The ID of the log
  --messageId <messageId> (REQUIRED)  The ID of the message to fetch
  --json                              Output results as JSON instead of formatted text
  --proxyHost <proxyHost>             A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>             A port number for a proxy to use to call elmah.io
  -?, -h, --help                      Show help and usage information
```

**Example:**

```cmd
elmahio messages get --logId LOG_ID --messageId MESSAGE_ID
```

## List frequent

The `list-frequent` command is used to list frequent log message groups based on options.

**Usage**

```cmd
> elmahio messages list-frequent --help

Description:
  List the most frequently occurring error groups

Usage:
  elmahio messages list-frequent [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The ID of the log
  --count <count>             Number of frequent groups to return (1-25) [default: 5]
  --query <query>             Full-text or Lucene query to filter messages
  --severity <severity>       Filter by severity (Verbose, Debug, Information, Warning, Error, Fatal)
                              [default: Error]
  --from <from>               Search from this date
  --to <to>                   Search to this date
  --json                      Output results as JSON instead of formatted text
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Simple example:**

```cmd
elmahio messages list-frequent --logId LOG_ID
```

**Full example:**

```cmd
elmahio messages list-frequent --apiKey API_KEY --logId LOG_ID --count 10 --query "statusCode:500" --severity Error --from 2026-03-17 --to2026-03-18
```

## List recent

The `list-recent` command is used to list recent log messages based on options.

**Usage**

```cmd
> elmahio messages list-recent --help

Usage:
  elmahio messages list-recent [options]

Options:
  --apiKey <apiKey>           An API key with permission to execute the command. If omitted,
                              the key stored via 'elmahio login' is used.
  --logId <logId> (REQUIRED)  The ID of the log
  --count <count>             Number of messages to return (1-100) [default: 10]
  --query <query>             Full-text or Lucene query to filter messages
  --severity <severity>       Filter by severity (Verbose, Debug, Information, Warning, Error, Fatal)
                              [default: Error]
  --from <from>               Return messages from this date
  --to <to>                   Return messages up to this date
  --json                      Output results as JSON instead of formatted text
  --proxyHost <proxyHost>     A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>     A port number for a proxy to use to call elmah.io
  -?, -h, --help              Show help and usage information
```

**Simple example:**

```cmd
elmahio messages list-recent --logId LOG_ID
```

**Full example:**

```cmd
elmahio messages list-recent --apiKey API_KEY --logId LOG_ID --count 25 --query "statusCode:500" --severity Error --from 2026-03-17 --to2026-03-18
```