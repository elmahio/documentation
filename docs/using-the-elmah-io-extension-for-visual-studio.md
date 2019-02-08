# Using the elmah.io extension for Visual Studio

Being able to focus on .NET developers makes it possible to do all kinds of cool things. Like building an elmah.io extension for Visual Studio. That's exactly what we've done and here's how to use it.

## Installation

[Download the elmah.io extension](https://marketplace.visualstudio.com/items?itemName=ThomasArdal.elmahio) from the Visual Studio Marketplace.

> Don't use the Extensions and Updates feature inside Visual Studio, since Visual Studio 2015 causes a problem with installing extensions in previous versions.

Double/click the downloaded VSIX and enable elmah.io in the versions of Visual Studio of your choice. The extension supports Visual Studio 2012, 2013 and 2015.

## Usage

Inside Visual Studio navigate to View | Other Windows | elmah.io or simply search for elmah.io in the Quick Launcher (<kbd>Ctrl</kbd> + <kbd>Q</kbd>).

You'll see the elmah.io window somewhere:

![elmah.io windows in Visual Studio](/images/elmah_io_vs1.png)

Click the sign in button in the top left corner. Log in using the same provider that you're using on the website:

![Sign in window](/images/elmah_io_vs2.png)

Once logged in, the list of logs is populated with all of your logs defined at elmah.io. Select a log and click the search icon:

![Browse a log inside Visual Studio](/images/elmah_io_vs3.png)

To inspect a single message, double-click it and the message details window will open:

![Message details](/images/elmah_io_vs4.png)

The toolbar in the top provides a couple of options: View the message on elmah.io, hide the message and delete the message.
