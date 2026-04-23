---
title: Add MCP Server to Perplexity AI
description: Add the elmah.io MCP server to Perplexity AI using custom connectors. This guide covers OAuth setup and transport configuration for AI-powered logs.
---

# Add MCP Server to Perplexity AI

Perplexity AI supports adding MCP servers through **Connectors**. You will need a paid subscription of Perplexity to add custom connectors.

- Inside Perplexity, click your profile in the lower left corner and click on **All settings**.
- In the left menu, click **Connectors**. This will show the list of available connectors:

![Perplexity available connectors](images/mcp/perplexity-available-connectors.png)

- Click the **+ Custom connector** button and input the following values:

![Perplexity add custom connector](images/mcp/perplexity-add-custom-connector.png)

- Make sure to expand **Advanced**, select **OAuth**, and input a **Client ID** of your choice. Also select **Streamable HTTP** beneath **Transport** and enable the checkmark in **I understand custom connectors can introduce risks**:

![Perplexity add custom connector step 2](images/mcp/perplexity-add-custom-connector-step-2.png)

- Click the **Add** button and search for the new connector:

![Perplexity search connectors](images/mcp/perplexity-seach-connectors.png)

- Click the connector in the search result. A browser window will open, asking you to sign in to elmah.io. When successfully signed in, Perplexity will show a checkmark next to the connector:

![Perplexity connector installed](images/mcp/perplexity-connector-installed.png)

- On the prompt page, make sure to enable the elmah.io connector to allow Perplexity to call the MCP server:

![Perplexity enable connector](images/mcp/perplexity-enable-connector.png)