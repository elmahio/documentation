---
title: Sending Messages from elmah.io to Azure Service Bus using SAS Authentication
description: Forward elmah.io messages to Azure Service Bus using SAS authentication. Learn to generate SAS tokens and configure HTTP rules easily.
---

# Sending Messages from elmah.io to Azure Service Bus using SAS Authentication

elmah.io rules support Shared Access Signature (SAS) authentication, making it easy to forward log messages to Azure Service Bus queues. This guide walks you through creating a SAS token for a Service Bus queue and using it in an elmah.io rule to publish messages.

## Step 1: Create a Shared Access Signature (SAS) for a Queue

To authenticate a request to Azure Service Bus using SAS, you need three components:

- The queue URI (like https://NAMESPACE.servicebus.windows.net/QUEUE_NAME)
- The SAS policy name (like elmahio-rule)
- The associated primary key for that policy

You will need to generate a SAS from either C# code or PowerShell:

```csharp
using System;
using System.Net;
using System.Security.Cryptography;
using System.Text;

public static class SasTokenGenerator
{
    public static string GenerateSasToken(string resourceUri, string keyName, string key, TimeSpan ttl)
    {
        var expiry = DateTimeOffset.UtcNow.Add(ttl).ToUnixTimeSeconds();
        string stringToSign = WebUtility.UrlEncode(resourceUri) + "\n" + expiry;
        var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
        var signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));

        return $"SharedAccessSignature sr={WebUtility.UrlEncode(resourceUri)}&sig={WebUtility.UrlEncode(signature)}&se={expiry}&skn={keyName}";
    }
}

// Usage
var token = SasTokenGenerator.GenerateSasToken(
    "https://NAMESPACE.servicebus.windows.net/QUEUE_NAME",
    "elmahio-rule",
    "PRIMARY_KEY",
    TimeSpan.FromDays(365)
);
```

```powershell
function New-ServiceBusSasToken {
    param (
        [string]$ResourceUri,
        [string]$KeyName,
        [string]$Key,
        [int]$ExpiryInSeconds = 31536000
    )
    $Epoch = [Math]::Round((Get-Date -Date (Get-Date "1970-01-01Z")).TotalSeconds) + $ExpiryInSeconds
    $StringToSign = [System.Web.HttpUtility]::UrlEncode($ResourceUri) + "`n" + $Epoch
    $HMAC = New-Object System.Security.Cryptography.HMACSHA256
    $HMAC.Key = [Text.Encoding]::UTF8.GetBytes($Key)
    $Signature = [Convert]::ToBase64String($HMAC.ComputeHash([Text.Encoding]::UTF8.GetBytes($StringToSign)))
    return "SharedAccessSignature sr=$([System.Web.HttpUtility]::UrlEncode($ResourceUri))&sig=$([System.Web.HttpUtility]::UrlEncode($Signature))&se=$Epoch&skn=$KeyName"
}

$token = New-ServiceBusSasToken `
    -ResourceUri "https://NAMESPACE.servicebus.windows.net/QUEUE_NAME" `
    -KeyName "elmahio-rule" `
    -Key "PRIMARY_KEY"
```

Both examples will generate a code valid for 1 year.

## Step 2: Create a Rule in elmah.io

Once you have your SAS token, set up a rule in elmah.io to post messages to your Service Bus queue.

1. Navigate to Rules on the Log Settings page.

2. Click Add rule and configure:

    - If condition: Select 'New Error or Fatal message'
    - Then condition: HTTP request
    - Method: POST
    - URL: https://NAMESPACE.servicebus.windows.net/QUEUE_NAME/messages
    - Content-Type: application/json
    - Body: The JSON you want published to Service Bus
    - Authentication Method: SharedAccessSignature
    - Token: Paste the SAS token generated from the code above

3. Save the rule

elmah.io will now publish messages matching the rule.