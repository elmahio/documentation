---
title: Search query examples for every field
description: Copy-ready search queries for every searchable field on elmah.io log messages, including how to match text, keyword, boolean, number, and date fields and how to combine them with AND, OR, and NOT.
---

# Search query examples for every field

This page shows how to query every searchable field on an elmah.io log message. Queries use Lucene query syntax, the same syntax as the search field on the elmah.io UI and the `query` parameter of the API, CLI, and MCP server. For an introduction to searching, see [Query messages using full-text search](query-messages-using-full-text-search.md).

## Rules for writing queries

- Only the fields on this page exist. Field names are case-sensitive and written in camelCase, like `hostName` and `statusCode`.
- There is no `@timestamp` field. The time of a message is in `time`. A query on a field that does not exist is not an error. It returns no messages.
- Always write `AND` or `OR` between conditions. A space between two conditions can be read as `OR`, so don't rely on it.
- Write boolean values in lowercase: `isNew:true`, not `isNew:True`.
- Wrap values containing spaces in double quotes: `message:"connection refused"`.
- The special characters `+ - = && || > < ! ( ) { } [ ] ^ " ~ * ? : \ /` must be escaped with a backslash when they are part of a value. A forward slash at the start of a value must always be escaped, as in `url:\/api\/*`. Alternatively, wrap the value in double quotes.

## Combining conditions

Use `AND`, `OR`, and `NOT` (or `&&`, `||`, and `-`) to combine conditions. Both forms behave the same:

```
severity:Error AND statusCode:500
severity:Error && statusCode:500
```

```
severity:Error OR severity:Fatal
severity:Error || severity:Fatal
```

```
severity:Error AND NOT statusCode:404
severity:Error AND -statusCode:404
```

Use parentheses to group conditions:

```
(country:DK OR country:SE) AND severity:Error
```

Match one of several values of the same field by putting them in parentheses:

```
severity:(Error OR Fatal)
statusCode:(404 OR 500)
```

Find messages where a field has any value, or no value:

```
_exists_:user
NOT _exists_:user
```

## How to match each kind of field

Fields come in a few kinds, and the kind decides how a value is matched.

| Kind | Fields | How values are matched |
| --- | --- | --- |
| Text with `.raw` | `applicationName`, `browser`, `category`, `hostName`, `message`, `method`, `os`, `remoteAddr`, `source`, `type`, `user`, `userAgent`, `version` | Searching the field itself matches words and ignores case. Searching `field.raw` matches the whole value exactly. |
| Text only | `detail` | Matches words and ignores case. There is no `.raw`. |
| Keyword | `country`, `severity`, `url`, `domain`, `correlationId`, `hash`, `assignedTo`, `messageTemplate` | Matches the whole value, and case matters. There is no `.raw`. |
| Boolean | `hidden`, `isNew`, `isFixed`, `isBurst`, `isUptime`, `isHeartbeat`, `isSpike`, `isBot`, `isBotSuggestion` | `true` or `false`, in lowercase. |
| Number | `statusCode` | Exact numbers and ranges. |
| Date | `time` | Exact dates, ranges, and relative dates like `now-24h`. |

Values in `.raw` fields are only indexed up to a maximum length: 256 characters for `applicationName`, `user`, and `version`, 512 for `category`, `source`, `type`, and `userAgent`, and 4096 for `message`. A longer value is not found by a `.raw` query, but is still found by a query on the field itself.

Use the field itself (like `hostName:web*`) when you want to find words or parts of a value. Use `.raw` (like `hostName.raw:"web-01"`) when you want an exact match. For values containing dots, like namespaces and exception types, prefer `.raw`, since searching the field itself splits the value into parts and matches more than intended.

## Text fields with .raw

### applicationName

```
applicationName:checkout
applicationName.raw:"Checkout API"
applicationName:checkout AND severity:Error
```

### browser

Values are lowercase: `chrome`, `safari`, `edge`, `firefox`, `opera`, `ie`, and `other`.

```
browser:chrome
browser:firefox OR browser:edge
NOT browser:chrome
```

### category

Typically the logger name from a logging framework, like a class name with namespace.

```
category.raw:"MyApp.Controllers.OrderController"
category.raw:MyApp.Controllers.*
NOT category.raw:MyApp.Controllers.*
```

### hostName

```
hostName:web-*
hostName:web-01 OR hostName:web-02
hostName.raw:"web-01"
hostName:web-* AND severity:Error
```

### message

The title of the log message.

```
message:timeout
message:"connection refused"
message:timeout OR message:refused
message:time*
message.raw:"The operation has timed out."
```

### method

The HTTP method.

```
method:POST
method:POST OR method:PUT
NOT method:GET
```

### os

Values are lowercase: `ios`, `windows`, `android`, `macos`, `linux`, and `other`.

```
os:windows
os:android OR os:ios
```

### remoteAddr

The IP address of the user.

```
remoteAddr:192.168.0.1
remoteAddr:192.168.0.*
NOT remoteAddr:192.168.0.*
```

### source

The source of the code logging the message, often an assembly name.

```
source:System.Data*
source.raw:"System.Data.SqlClient"
```

### type

The type of the message. For errors, this is typically the exception type.

```
type.raw:System.NullReferenceException
type.raw:System.*Exception
type.raw:System.NullReferenceException OR type.raw:System.ArgumentNullException
```

### user

The user causing the message.

```
user:thomas@example.com
user.raw:"thomas@example.com"
user:thomas*
_exists_:user
```

### userAgent

```
userAgent:googlebot
userAgent:googlebot OR userAgent:bingbot
userAgent.raw:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36"
```

### version

```
version:1.2.3
version.raw:"1.2.3"
version:1.2.*
NOT version.raw:"1.2.3"
```

## Text field without .raw

### detail

The longer description of a message, like a stack trace. Matches words and ignores case.

```
detail:NullReferenceException
detail:"at MyApp.Services.OrderService"
detail:timeout AND detail:database
```

## Keyword fields

Keyword fields match the whole value and are case-sensitive. Use wildcards to match part of a value.

### assignedTo

```
assignedTo:USER_ID
_exists_:assignedTo
```

### correlationId

```
correlationId:"0HMVB1T2JQ5A3:00000001"
```

### country

Use the uppercase ISO 3166 two-letter code. `country:dk` doesn't match, but `country:DK` does.

```
country:DK
country:DK OR country:SE
NOT country:US
```

### domain

```
domain:example.com
domain:*.example.com
```

### hash

The unique hash of a log message.

```
hash:HASH_VALUE
```

### messageTemplate

The title template used by structured logging frameworks.

```
messageTemplate:"User {user} failed to log in"
messageTemplate:*failed*
```

### severity

The value is case-sensitive: `Verbose`, `Debug`, `Information`, `Warning`, `Error`, and `Fatal`. `severity:error` doesn't match, but `severity:Error` does.

```
severity:Error
severity:(Error OR Fatal)
severity:Error OR severity:Fatal
NOT severity:Information
```

### url

The URL of the request. A forward slash at the start must be escaped, or the value wrapped in quotes.

```
url:"/api/orders"
url:\/api\/orders*
url:\/api\/*
url:*checkout
NOT url:\/api\/*
```

## Boolean fields

Booleans are `true` or `false` in lowercase.

```
isNew:true
isFixed:false
isBurst:true
isBot:false
isBotSuggestion:true
isUptime:true
isHeartbeat:true
isSpike:true
hidden:true
```

Combine booleans with other fields:

```
isNew:true AND severity:Error
isFixed:false AND isBot:false AND severity:(Error OR Fatal)
isNew:true AND hostName:web-*
```

## Number field

### statusCode

`statusCode` is a number. Use `:` for an exact value and brackets or comparison operators for ranges.

```
statusCode:404
statusCode:(404 OR 500)
statusCode:[400 TO 499]
statusCode:[500 TO 599]
statusCode:>=500
statusCode:>499
NOT statusCode:404
```

## Date field

### time

`time` is the UTC date and time of the message. Dates use the ISO 8601 format.

Messages within a time frame:

```
time:[2026-11-01 TO 2026-11-05]
time:[2026-11-01T08:00:00Z TO 2026-11-01T17:00:00Z]
```

Messages from a point in time and onward, or before one:

```
time:>=2026-11-01
time:<2026-11-01
time:[2026-11-01 TO *]
```

Relative time frames use `now` together with a duration. `h` is hours, `d` is days, `w` is weeks, and `M` is months:

```
time:[now-24h TO now]
time:[now-7d TO now]
time:[now-1M TO now]
```

Round to the start of the day with `/d`:

```
time:[now-1d/d TO now/d]
```

The search page on elmah.io also has a date range selector. When you only need a time frame, use the selector and keep the query for everything else.

## Combining fields

New errors in a time frame on several hosts:

```
isNew:true AND severity:Error AND time:[now-24h TO now] AND hostName:web-*
```

Server errors from a specific host in a given week:

```
statusCode:[500 TO 599] AND hostName.raw:"web-01" AND time:[2026-11-02 TO 2026-11-08]
```

404 errors not caused by bots:

```
statusCode:404 AND isBot:false AND isBotSuggestion:false
```

Errors from either of two versions, excluding a URL path:

```
severity:Error AND version:(1.2.3 OR 1.2.4) AND NOT url:\/health*
```

Messages from Chrome or Firefox users in Denmark or Sweden:

```
(browser:chrome OR browser:firefox) AND (country:DK OR country:SE)
```

Messages with a user but no assigned owner:

```
_exists_:user AND NOT _exists_:assignedTo
```

## Custom data

Custom data is searchable when the variable name starts with `X-ELMAHIO-SEARCH-`. The prefix is replaced with `data.`, so a variable named `X-ELMAHIO-SEARCH-author` is queried like this:

```
data.author:"Walter Sobchak"
```

For details, see [How to search custom data](how-to-search-custom-data.md).

## Common mistakes

The fields below don't exist. Use the field on the right instead.

| Don't use | Use |
| --- | --- |
| `@timestamp`, `timestamp`, `date` | `time` |
| `host`, `hostname`, `server` | `hostName` |
| `level`, `logLevel` | `severity` |
| `title`, `summary` | `message` |
| `exception`, `exceptionType` | `type` |
| `stackTrace`, `stacktrace` | `detail` |
| `status`, `httpStatus` | `statusCode` |
| `ip`, `clientIp` | `remoteAddr` |
| `app`, `application` | `applicationName` |
| `path`, `uri` | `url` |
| `agent` | `userAgent` |

## Notifications

To be notified when new messages match a query, create a rule using the same query. See [Creating Rules to Perform Actions on Messages](creating-rules-to-perform-actions-on-messages.md).
