# CLI overview

The elmah.io CLI lets you execute common tasks against elmah.io.

## Installing the CLI

The elmah.io CLI can be installed in a number of ways. To set up everything automatically, execute the following script from the command line:

```cmd
dotnet tool install --global Elmah.Io.Cli
```

If you prefer downloading the CLI as a zip you can [download the latest version from GitHub](https://github.com/elmahio/Elmah.Io.Cli/releases). To clone and build the CLI manually, check out instructions below.

## Run the CLI

<div class="guides-boxes row">
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
        <a href="/cli-tail/" title="Tail">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="guide-title">Tail</div>
            </div>
        </a>
    </div>
    <div class="guide-col col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
        <a href="/cli-dataloader/" title="Dataloader">
            <div class="guide-box">
                <div class="guide-image">
                  <i class="fas fa-eye"></i>
                </div>
                <div class="guide-title">Dataloader</div>
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
  --version         Show version information
  -?, -h, --help    Show help and usage information

Commands:
  export      Export log messages from a specified log
  log         Log a message to the specified log
  tail        Tail log messages from a specified log
  dataloader  Load a configurable number of error messages into an elmah.io log
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