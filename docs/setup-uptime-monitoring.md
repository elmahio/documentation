---
title: Set Up Uptime Monitoring
description: elmah.io Uptime Monitoring is the perfect companion for error logging. Learn about how to configure multi-region uptime checks in elmah.io.
---

# Set Up Uptime Monitoring

[TOC]

elmah.io Uptime Monitoring is the perfect companion for error logging. When your websites log errors, you are notified through elmah.io. But in the case where your website doesn't even respond to web requests, you will need something else to tell you that something is wrong. This is where Uptime Monitoring comes in. When set up, uptime monitoring automatically pings your websites from 5 different locations every 5 minutes.

For a complete overview of the possibilities with uptime monitoring, watch this video tutorial:

<a class="video-box" data-fancybox="" href="https://www.youtube.com/watch?v=EZ9iNfB9Blw&amp;autoplay=1&amp;rel=0" title="uptime-monitoring">
  <img class="no-lightbox" src="../images/tour/uptime-monitoring.jpg" alt="uptime-monitoring" />
  <i class="fad fa-play-circle"></i>
</a>

## Uptime checks

Uptime checks are automatic HTTP requests that you may already know from Azure, Pingdom, or a similar service. Uptime checks are created from the Uptime tab, directly on each log:

![Uptime checks](images/uptime-checks.png)

## SSL certificate expiration checks

Expiring SSL certificates cause errors in your user's browser. If you ever tried forgetting to renew an SSL certificate, you know how many problems it can cause. With the SSL check option available when creating a new uptime check, elmah.io automatically validates your SSL certificates daily.

When your SSL certificate is up for renewal, we start notifying you through the error logs.

## Domain name expiration checks

Much like SSL checks, Domain name expiration checks, will notify you through your log when your domain names are about to expire. To enable this feature, enable the *Domain Expiration* toggle when creating a new uptime check.

## Lighthouse checks

When enabling Lighthouse on an uptime check, we will generate Lighthouse results every night and include them on the history tab. Lighthouse is a popular tool for improving websites by running through a range of checks spread across multiple categories like performance and accessibility.

## Canonical checks

Canonical checks are a range of checks implemented by us. It checks the URL of the uptime checks by running through a range of different best practices. Examples are HTTP to HTTPS redirect, correct use of redirect status code, and more checks.