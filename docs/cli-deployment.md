---
title: Create a deployment from the CLI
description: Learn about the deployment CLI command and how you can use it to create new deployments on elmah.io. Automate your deployment monitoring.
---

# Create a deployment from the CLI

The `deployment` command is used to create new deployments on elmah.io.

## Usage

```cmd
> elmahio deployment --help

Description:
  Create a new deployment

Usage:
  elmahio deployment [options]

Options:
  --apiKey <apiKey> (REQUIRED)    An API key with permission to execute the command
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

## Examples

**Simple:**

```cmd
elmahio deployment --apiKey API_KEY --version 1.0.0
```

**Full:**

```cmd
elmahio deployment --apiKey API_KEY --version 1.0.0 --created 2022-02-08 --description "My new cool release" --userName "Thomas Ardal" --userEmail "thomas@elmah.io" --logId LOG_ID
```