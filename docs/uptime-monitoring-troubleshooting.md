---
title: Uptime Monitoring Troubleshooting
description: TODO
---

# Uptime Monitoring Troubleshooting

## Cloudflare Super Bot Fight Mode disallow the elmah.io uptime user-agent

We have tried to get Cloudflare to adobt the elmah.io Uptime user-agent as an allowed bot. This is not possible since bots need to come from a fixed set of IPs which is not the case when hosting on Microsoft Azure.

To allow the elmah.io Uptime user-agent you can create a new firewall rule. To do so go to *Security* | *WAF* and select the *Custom rules* tab. Click the *Create rule* button and input the following values:

Rule name: Allow elmah.io uptime bot

If incoming requests match...: User-Agent contains elmahio-uptimebot/

Then take action...: Skip All Super Bot Fight Mode Rules