---

title: Frequently Asked Questions

description: Common questions about availability, security, setup, payments, plans, and integrations.

---



\# Frequently Asked Questions



\## Is elmah.io highly available?

Yes. The service runs on Azure with multi-datacenter redundancy. Data is stored in clustered backends for resilience.



\## Is elmah.io secure?

Yes. HTTPS in transit only. Operational security is reviewed with external specialists. Never share API keys or log IDs. See https://elmah.io/security/ for details.



\## Which frameworks and languages are supported?

elmah.io support mosts web and logg frameworks. Official integrations exist for log4net, NLog, Serilog, Microsoft.Extensions.Logging, ASP.NET Core, JavaScript, and more. Other languages can send logs via the REST API.



\## Can I browse errors without opening the web app?

Yes. Options include rules that email or call webhooks, install an app for Microsoft Teams, Slack, and more, the Visual Studio extension, and the public REST API.



\## My log is noisy. How do I regain control?

Hide or delete individual errors, clear the log from settings, and use Ignore Filters or Business Rules to suppress known noise.



\## What is the difference between ELMAH and elmah.io?

ELMAH is the original open-source error logging library for .NET. elmah.io is a hosted logging and monitoring platform that integrates with ELMAH and many other frameworks.



\## Is elmah.io built by the ELMAH maintainers?

No. Different teams. Collaboration exists on open-source components where relevant.



\## Is elmah.io open source?

The core platform and websites are closed-source. Client libraries and several components are open-sourced. Contributions to other OSS projects are ongoing.



\## The API key and Log ID dialog did not show during install in ASP.NET. Why?

Likely causes: existing `<errorlog>` config already present, or PowerShell execution policy blocked the NuGet `install.ps1`. Run Visual Studio as admin or adjust ExecutionPolicy.



\## Can I try elmah.io for free?

Yes. 21-day free trial. No credit card required.



\## Can I upgrade or downgrade later?

Yes. Upgrades prorate the difference. Downgrades take effect at the next billing cycle.



\## Do you offer refunds?

Yes. Full refund within 14 days. Outside that window, subscriptions are prepaid and non-refundable for the remaining period. See https://elmah.io/legal/refund-policy/.



\## What currency do you charge in?

USD. Taxes may apply depending on country.



\## Do you support invoicing and alternative payments?

Manual invoices are available on annual Business+ and Enterprise plans. Card payments always produce downloadable/emailed invoices. Check support for wire transfer, PayPal, or checks on eligible plans.



\## Do you provide custom plans?

Yes. Contact support to tailor limits, compliance, or procurement needs.



\## Does it take much to get started?

No. Install a NuGet package and configure a key. Typical setup takes a few minutes.



\## What is the difference between applications and messages?

Messages are individual log entries. Applications are containers used to group messages.



\## Why is elmah.io cheaper than some alternatives?

Focus on .NET and targeted features reduces scope and cost versus multi-language platforms.



\## How do I cancel?

Cancel anytime from organization settings. Access continues until the end of the paid period.



\## Where can I ask other questions?

Open chat in the app or contact support. Responses come from developers.

