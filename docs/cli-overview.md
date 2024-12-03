---
title: CLI overview - Automate repeating tasks with the elmah.io CLI
description: Learn about the elmah.io CLI and how you can use it to automate common tasks from the command line. Export, tail, load test data, and more.
---

# CLI overview

The elmah.io CLI lets you execute common tasks against elmah.io.

## Installing the CLI

!!! note
    The elmah.io CLI requires <a href="https://dotnet.microsoft.com/en-us/download/dotnet/6.0" target="_blank" rel="noopener noreferrer">.NET 6 <span class="far fa-external-link"></span></a> or newer installed.

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

<div class="guides-boxes row">
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-clear/" title="Clear">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-trash"></i>
                </div>
                <div class="guide-title">Clear</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-dataloader/" title="Dataloader">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-import"></i>
                </div>
                <div class="guide-title">Dataloader</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-deployment/" title="Deployment">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-rocket"></i>
                </div>
                <div class="guide-title">Deployment</div>
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
        <a href="/cli-export/" title="Export">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-export"></i>
                </div>
                <div class="guide-title">Export</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-import/" title="Import">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-import"></i>
                </div>
                <div class="guide-title">Import</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-log/" title="Log">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-file-plus"></i>
                </div>
                <div class="guide-title">Log</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-sourcemap/" title="Sourcemap">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fab fa-js"></i>
                </div>
                <div class="guide-title">Sourcemap</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-tail/" title="Tail">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="guide-title">Tail</div>
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
elmahio:
  CLI for executing various actions against elmah.io

Usage:
  elmahio [options] [command]

Options:
  --nologo        Doesn't display the startup banner or the copyright message
  --version       Show version information
  -?, -h, --help  Show help and usage information

Commands:
  clear       Delete one or more messages from a log
  dataloader  Load 50 log messages into the specified log
  deployment  Create a new deployment
  diagnose    Diagnose potential problems with an elmah.io installation
  export      Export log messages from a specified log
  import      Import log messages to a specified log
  log         Log a message to the specified log
  sourcemap   Upload a source map and minified JavaScript
  tail        Tail log messages from a specified log
```

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