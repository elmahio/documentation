---
title: ELMAH and elmah.io differences
description: We are often asked about the difference between ELMAH and elmah.io. The purpose of this article is to answer this and the history behind naming.
---

# ELMAH and elmah.io differences

We receive a lot of questions like these:

- What is the difference between ELMAH and elmah.io?
- I thought ELMAH was free. Why do you suddenly charge?
- My ELMAH SQL Server configuration doesn't work. Why not?

We understand the confusion. The purpose of this article is to give a bit of background on the differences between ELMAH and elmah.io and why they share similar names.

## What is ELMAH?

ELMAH is an error logging framework originally developed by Atif Aziz in 2004 able to log all unhandled exceptions from .NET web applications. Errors can be logged to a variety of destinations through ELMAH's plugin model called error logs. Plugins for XML, SQL Server, MySQL, Elasticsearch, and many more exist. ELMAH automatically collects a lot of information from the HTTP context when logging the error, giving you the possibility to inspect request parameters, cookies, and much more for the failed request. Custom errors can be logged to ELMAH, by manually calling the error log.

## What is elmah.io?

elmah.io is a cloud-based error management system originally developed on top of ELMAH (see history for details). Besides supporting ELMAH, elmah.io also integrates with popular logging frameworks like [log4net](logging-to-elmah-io-from-log4net.md), [NLog](logging-to-elmah-io-from-nlog.md), [Serilog](logging-to-elmah-io-from-serilog.md), and web frameworks like [ASP.NET Core](logging-to-elmah-io-from-aspnet-core.md). elmah.io offers a superior [notification](https://elmah.io/features/notifications/) model to ELMAH, with integrations to mail, Slack, Microsoft Teams, and many others. elmah.io also built a lot of features outside the scope of ELMAH, like a complete [uptime monitoring](https://elmah.io/features/uptime-monitoring/) system.

## Comparison between ELMAH and elmah.io

| Feature | ELMAH | elmah.io |
|---|---|---|
| Error Logging | ✅ | ✅ |
| Self-hosted | ✅ | ❌ |
| Cloud-hosted | ❌ | ✅ |
| Search | ❌ | ✅ |
| New error detection | ❌ | ✅ |
| [Error grouping](https://blog.elmah.io/improved-message-grouping/) | ❌ | ✅ |
| [Issue tracking](https://elmah.io/features/issue-tracking/) | ❌ | ✅ |
| [log4net](https://elmah.io/features/log4net/)/[NLog](https://elmah.io/features/nlog/)/[Serilog](https://elmah.io/features/serilog/) | ❌ | ✅ |
| [Clientside error logging](https://elmah.io/features/clientside-logging/) | ❌ | ✅ |
| [Slack/Teams/HipChat/etc.](https://elmah.io/features/appstore/) | ❌ | ✅ |
| [Deployment tracking](https://elmah.io/features/deployment-tracking/) | ❌ | ✅ |
| [Uptime monitoring](https://elmah.io/features/uptime-monitoring/) | ❌ | ✅ |
| [Heartbeats](https://elmah.io/features/heartbeats/) | ❌ | ✅ |
| [Machine learning](https://elmah.io/features/machine-learning/) | ❌ | ✅ |
| [Discount on popular software](https://elmah.io/goodiebag/) | ❌ | ✅ |

## elmah.io History

So, why name a service elmah.io, when only a minor part of a client integration uses ELMAH? When Thomas Ardal introduced elmah.io back in 2013, the intention was to create a cloud-based error logger for ELMAH. We had some simple search and graphing possibilities, but the platform was meant as an alternative to host your own error logs in SQL Server or similar.

In time, elmah.io grew from being a hobby project to an actual company. During those years, we realized that the potential of the platform exceeded the possibilities with ELMAH in many ways. New features not available in ELMAH have been added constantly. A process that would have been nearly impossible with ELMAH's many storage integrations.

Today, elmah.io is a full error management system for everything from console applications to web apps and serverless code hosted on Azure or AWS. We've built an entire uptime monitoring system, able to monitor not only if your website fails but also if it even responds to requests.

Why not change the name to something else, you may be thinking? That is our wish as well. But changing your SaaS (software-as-a-service) company name isn't exactly easy. We have tried a couple of times, the first time back in 2016. We tried to name the different major features of elmah.io to sea creatures (like Stingray). We failed with the rename and people got confused. In 2017, we started looking at renaming the product again. This time to Unbug. We had learned from our previous mistake and this time silently started changing the name. We quickly realized that the domain change would cause a major risk in regards to SEO (search engine optimization) and confusion.

For now, we are elmah.io. The name is not ideal, but it's a lesson learned for another time :)