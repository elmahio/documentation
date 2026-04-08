---
title: CLI overview - Automate repeating tasks with the elmah.io CLI
description: Learn about the elmah.io CLI and how you can use it to automate common tasks from the command line. Export, tail, load test data, and more.
---

# CLI overview

The elmah.io CLI lets you execute common tasks against elmah.io.

## Installing the CLI

!!! note
    The elmah.io CLI requires <a href="https://dotnet.microsoft.com/en-us/download/dotnet/10.0" target="_blank" rel="noopener noreferrer">.NET 10 <span class="far fa-external-link"></span></a> or newer installed.

The elmah.io CLI can be installed in several ways. To set up everything automatically, execute the following script from the command line:

```cmd
dotnet tool install --global Elmah.Io.Cli
```

or make sure to run on the latest version if you already have the CLI installed:

```cmd
dotnet tool update --global Elmah.Io.Cli
```

If you prefer downloading the CLI as a zip you can [download the latest version from GitHub](https://github.com/elmahio/Elmah.Io.Cli/releases). To clone and build the CLI manually, check out the instructions below.

## Run the CLI

The CLI supports a range of root commands. Some commands execute an action directly while others open up for a range of sub-commands related to the root command.

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-login/" title="Login">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-sign-in"></i>
                </div>
                <div class="guide-title">Login</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-logout/" title="Logout">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-sign-out"></i>
                </div>
                <div class="guide-title">Logout</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-deployments/" title="Deployments">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-rocket"></i>
                </div>
                <div class="guide-title">Deployments</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-diagnose/" title="Diagnose">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-stethoscope"></i>
                </div>
                <div class="guide-title">Diagnose</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-logs/" title="Logs">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-trash"></i>
                </div>
                <div class="guide-title">Logs</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-messages/" title="Messages">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-copy"></i>
                </div>
                <div class="guide-title">Messages</div>
            </div>
        </a>
    </div>
</div>

Run the CLI to get help:

```cmd
elmahio --help
```

Help similar to this is outputted to the console:

```cmd
Description:
  CLI for executing various actions against elmah.io

Usage:
  elmahio [command] [options]

Options:
  --nologo        Doesn't display the startup banner or the copyright message
  -?, -h, --help  Show help and usage information
  --version       Show version information

Commands:
  login        Authenticate with elmah.io and store your API key locally
  logout       Remove the locally stored elmah.io API key
  deployments  Work with deployments
  diagnose     Diagnose potential problems with an elmah.io installation
  logs         Work with logs
  messages     Work with log messages
```

<small class="text-muted">(deprecated commands have been left out for better overview)</small>

## Cloning the CLI

Create a new folder and `git clone` the repository:

```cmd
git clone https://github.com/elmahio/Elmah.Io.Cli.git
```

## Building the CLI

Navigate to the root repository of the code and execute the following command:

```cmd
dotnet build
```