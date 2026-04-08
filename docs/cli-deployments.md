---
title: Create and list deployments from the CLI
description: Learn about the deployments CLI command and how you can use it to create and list deployments on elmah.io. Automate your deployment monitoring.
---

# Deployments command

The `deployments` command provide a range of sub-commands related to deployments.

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#create" title="Create">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-rocket"></i>
                </div>
                <div class="guide-title">Create</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="#list" title="List">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-list"></i>
                </div>
                <div class="guide-title">List</div>
            </div>
        </a>
    </div>
</div>

## Create

The `create` command is used to create new deployments on elmah.io.

**Usage**

```cmd
> elmahio deployments create --help

Description:
  Create a new deployment

Usage:
  elmahio deployments create [options]

Options:
  --apiKey <apiKey>               An API key with permission to execute the command. If omitted,
                                  the key stored via 'elmahio login' is used.
  --version <version> (REQUIRED)  The version number of this deployment
  --created <created>             When was this deployment created in UTC
  --description <description>     Description of this deployment
  --userName <userName>           The name of the person responsible for creating this deployment
  --userEmail <userEmail>         The email of the person responsible for creating this deployment
  --logId <logId>                 The ID of a log if this deployment is specific to a single log
  --proxyHost <proxyHost>         A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>         A port number for a proxy to use to call elmah.io
  -?, -h, --help                  Show help and usage information
```

**Simple example:**

```cmd
elmahio deployments create --version 1.0.0
```

**Full example:**

```cmd
elmahio deployments create --apiKey API_KEY --version 1.0.0 --created 2022-02-08 --description "My new cool release" --userName "Thomas Ardal" --userEmail "thomas@elmah.io" --logId LOG_ID
```

## List

The `list` command is used to list deployments from elmah.io.

**Usage**

```cmd
> elmahio deployments list --help

Description:
  List recent deployments

Usage:
  elmahio deployments list [options]

Options:
  --apiKey <apiKey>        An API key with permission to execute the command. If omitted,
                           the key stored via 'elmahio login' is used.
  --logId <logId>          Filter deployments to a specific log ID
  --count <count>          Number of deployments to return (max 25) [default: 5]
  --json                   Output results as JSON instead of formatted text
  --proxyHost <proxyHost>  A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>  A port number for a proxy to use to call elmah.io
  -?, -h, --help           Show help and usage information
```

**Simple example:**

```cmd
elmahio deployments list
```

**Full example:**

```cmd
elmahio deployments list --apiKey API_KEY --logId LOG_ID --count 10
```