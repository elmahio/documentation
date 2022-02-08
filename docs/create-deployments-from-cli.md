---
title: Create deployments from the elmah.io CLI
description: TODO
---

# Create deployments from the elmah.io CLI

Deployments can be easily created from either the command-line or a build server using the elmah.io CLI. There's a help page dedicated to the [deployment](https://docs.elmah.io/cli-deployment/) command but here's a quick recap.

If not already installed, start by installing the elmah.io CLI:

```cmd
dotnet tool install --global Elmah.Io.Cli
```

Then, create a new deployment using the `deployment` command:

```cmd
elmahio deployment --apiKey API_KEY --version 1.0.0
```

In case you are calling the CLI from a build server, you may want to exclude the elmah.io logo and copyright message using the `--nologo` parameter to reduce log output and to avoid cluttering the build output:

```cmd
elmahio deployment --nologo --apiKey API_KEY --version 1.0.0
```