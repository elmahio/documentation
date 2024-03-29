---
title: Diagnose potential problems with an elmah.io installation
description: Learn about the diagnose CLI command and how you can use it to find potential problems with an elmah.io installation.
---

# Diagnose potential problems with an elmah.io installation

The `diagnose` command can be run in the root folder of an elmah.io installation to find potential problems with the configuration.

## Usage

```cmd
> elmahio diagnose --help

Description:
  Diagnose potential problems with an elmah.io installation

Usage:
  elmahio diagnose [options]

Options:
  --directory <directory>  The root directory to check [default: C:\test]
  --verbose                Output verbose diagnostics to help debug problems [default: False]
  -?, -h, --help           Show help and usage information
```

## Examples

**Simple:**

```cmd
elmahio diagnose --directory c:\projects\my-project
```

**Full:**

```cmd
elmahio diagnose --directory c:\projects\my-project --verbose
```