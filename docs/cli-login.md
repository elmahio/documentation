---
title: Login with your API key from the CLI
description: Learn about how to log into elmah.io with your API key. Use the login command to avoid having to specify the key on sub-sequent commands.
---

# Login command

The `login` command is used to store an elmah.io API key locally. Sub-sequent commands will use the privately stored API key instead of requiring an `--apiKey` option. If specified, the `--proxyHost` and `--proxyPort` options are only used to test the API key on this command and will need to be specified again when running other commands.

## Using an environment variable instead

For CI pipelines and other non-interactive scenarios, you can skip `login` entirely by setting the `ELMAHIO_API_KEY` environment variable. All commands fall back to it when `--apiKey` isn't specified and no key has been stored locally:

```cmd
set ELMAHIO_API_KEY=API_KEY
elmahio logs list
```

Precedence is `--apiKey` > `ELMAHIO_API_KEY` > the key stored via `login`.

**Usage**

```cmd
> elmahio login --help

Description:
  Authenticate with elmah.io and store your API key locally

Usage:
  elmahio login [options]

Options:
  --apiKey <apiKey>        An API key with permission to execute commands
  --proxyHost <proxyHost>  A hostname or IP for a proxy to use to call elmah.io
  --proxyPort <proxyPort>  A port number for a proxy to use to call elmah.io
  -?, -h, --help           Show help and usage information
```

**Example**

```cmd
elmahio login --apiKey API_KEY
```