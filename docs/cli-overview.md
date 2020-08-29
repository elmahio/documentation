# CLI overview

The elmah.io CLI lets you execute common tasks against elmah.io. The tool is currently in beta and something you need to clone from GitHub and build manually. We plan to release binaries for Windows, Linux, and Mac at some point.

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
</div>

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

## Run the CLI

Binaries are available in the `/src/Elmah.Io.Cli/bin/Debug/netcoreapp3.1` folder. Run the CLI to get help:

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
  export    Export log messages from a specified log
  log       Log a message to the specified log
```