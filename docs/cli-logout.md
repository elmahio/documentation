---
title: Log out of elmah.io from the CLI
description: Learn about how to use the logout command to remove the currently stored API key from your machine using the CLI.
---

# Logout command

The `logout` command is used to remove any privately stored API key saved as part of the [`login`](/cli-login/) command.

**Usage**

```cmd
> elmahio logout --help

Description:
  Remove the locally stored elmah.io API key

Usage:
  elmahio logout [options]

Options:
  -?, -h, --help  Show help and usage information
```

**Example**

```cmd
elmahio logout
```