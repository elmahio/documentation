---
title: Authentication on elmah.io
description: Learn all about how authentication on elmah.io works. Using API keys and permissions you can control log, deployment and log message access.
---

# Authentication

All of our integrations communicates with the elmah.io API. In order to request endpoints on the API, each client will need to provide a valid API key. API keys are available on the Organization Settings view, as well as on the *Install* tab on the Log Settings screen. We wrote a guide to help you find your API key here: [Where is my API key?](/where-is-my-api-key/). A default API key is created when you create your organization, but new keys can be added, keys revoked, and more.

Sending the API key to the elmah.io API, is typically handled by the `Elmah.Io.Client` NuGet package. All integrations have a dependency to this package, which means that it will be automatically installed through NuGet. How you provide your API key depends on the integration you are installing. Some integrations expect the API key in a config file, while others, accept the key in C#. For details about how to provide the API key for each integration, click the various installation guides in the left menu.

Besides a unique string representing an API key, each key can have a set of permissions. As default, API keys only have the *Write Messages* permission, which means that the key cannot be used to read data from your logs. In 99% of all scenarios, you will browse through errors using the elmah.io UI, which will require you to sign in using username/password or one of the supported social providers. In the case you want to enable one of the native UIs provided by different integrations (like the `/elmah.axd` endpoint part of the `ELMAH` package) or you are building a third-party integration to elmah.io, you will need to assign additional permissions to your API key. For details about API key permissions, check out [How to configure API key permissions](/how-to-configure-api-key-permissions/).