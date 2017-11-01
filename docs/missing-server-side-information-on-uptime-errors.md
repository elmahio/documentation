# Missing server side information on uptime errorsTo decorate uptime errors with server side error information, you will need a few things:1. The monitored website should be configured to log errors to elmah.io.
2. You will need to use one of the integrations utilizing our version 3 API. Packages using this version of our API, have `3` as major version in the NuGet package.
3. The uptime check needs to be created on the same log as the monitored website.
4. The uptime error needs to be logged after October 2017.