---
title: Using the REST API
description: Utilize the elmah.io REST API to log messages to elmah.io from any framework. We provide a range of options but creating on yourself is easy.
---

# Using the REST API

[TOC]

Under the hood, everything related to communicating with elmah.io happens through our REST API. In this article, we will present the possibilities of using the API in a use case-driven approach. For a detailed reference of the various endpoints, visit the [API V3 documentation](https://api.elmah.io/swagger/index.html).

## Security

Security is implemented using API keys ([Where is my API key?](https://docs.elmah.io/where-is-my-api-key/)). When creating a new organization, a default API key is automatically created.

You can create new keys and revoke an existing key if you suspect that the key has been compromised. The API key acts as a secret and should not be available to people outside your team/organization.

All requests to the elmah.io API needs the API key as either an HTTP header or query string parameter named `api_key` like this:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">GET</span><span>https://api.elmah.io/v3/messages/LOG_ID?api_key=MY_API_KEY</span></code></pre>

## Messages

### Creating messages

Before doing anything, we will need some messages to play with. The `Create Message` endpoint does just that. To create a simple message, POST to:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">POST</span><span>https://api.elmah.io/v3/messages/LOG_ID</span></code></pre>

with a JSON body:

```json
{
    "title": "This is a test message"
}
```

(replace `LOG_ID` with your log ID):

The `title` field is the only required field on a message, but fields for specifying severity, timestamp, etc. are there. For more information, check out the [documentation](https://api.elmah.io/swagger/index.html).

If everything where successful, the API returns an HTTP status code of `201` and a location to where to fetch the new message. If the endpoint fails, the response will contain a description of what went wrong. Forgetting to set `Content-Length`, `Content-Type` and similar, will result in an invalid request.

### Getting a message

In the example above, the API returned the URL for getting the newly created message:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">GET</span><span>https://api.elmah.io/v3/messages/LOG_ID/81C7C282C9FDAEA3</span></code></pre>

By making a GET request to this URL, we get back the message details:

```json
{
  "id": "99CDEA3D6A631F09",
  "title": "This is a test message",
  "dateTime": "2016-07-03T14:25:46.087857Z",
  "severity": "Information"
}
```

As shown in the returned body, elmah.io automatically inserted some missing fields like a timestamp and a severity. If no severity is specified during creating, a message is treated as information.

### Searching messages

For the demo, we have inserted a couple of additional messages, which leads us to the next endpoint: searching messages. The search endpoint shares the root path with the get message endpoint but only takes a log ID. The simplest possible configuration queries the API for a list of the 15 most recent messages by calling:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">GET</span><span>https://api.elmah.io/v3/messages/LOG_ID</span></code></pre>

The response body looks like this:

```json
{
  "messages": [
    {
      "id": "81C7C282C9FDAEA3",
      "title": "This is another test message",
      "dateTime": "2016-07-03T14:31:45.053851Z",
      "severity": "Information"
    },
    {
      "id": "99CDEA3D6A631F09",
      "title": "This is a test message",
      "dateTime": "2016-07-03T14:25:46.087857Z",
      "severity": "Information"
    },
    // ...
  ],
  "total": 42
}
```

For simplicity, the response has been simplified by not showing all of the results. The important thing to notice here is the list of `messages` and the `total` count. `messages` contain 15 messages, which is the default page size in the search endpoint. To increase the number of returned messages, set the `pagesize` parameter in the URL (max 100 messages per request). The `total` count tells you if more messages are matching your search. To select messages from the next page, use the `pageindex` parameter (or use the `searchAfter` property as shown later).

Returning all messages may be fine, but being able to search by terms is even more fun. To search, use the `query`, `from`, and `to` parameters as shown here:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">GET</span><span>https://api.elmah.io/v3/messages/LOG_ID?query=another</span></code></pre>

Searching for `another` will return the following response:

```json
{
  "messages": [
    {
      "id": "81C7C282C9FDAEA3",
      "title": "This is another test message",
      "dateTime": "2016-07-03T14:25:46.087857Z",
      "severity": "Information"
    }
  ],
  "total": 1
}
```

Now only `81C7C282C9FDAEA3` shows up since that message contains the text `another` in the `title` field. Like specifying the `query` parameter, you can limit the number of messages using the `from`, `to`, and `pageSize` parameters.

There is a limitation of using the `pageSize` and `pageIndex` parameters. The data is stored in Elasticsearch which doesn't allow pagination in more than 10,000 documents. If you need to fetch more than 10,000 documents from your log, we recommend breaking this up into weekly, daily, or hourly jobs instead of changing your job to fetch more than 10,000 messages. In case this is not possible, you can switch from using the `pageIndex` parameter to `searchAfter`. Each search result will return a value in the `searchAfter` property:

```json
{
  "messages": [
    // ...
  ],
  "searchAfter": "1694180633270",
  "total": 42
}
```

To fetch the next list of messages you can provide the search endpoint with the value of `searchAfter`:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">GET</span><span>https://api.elmah.io/v3/messages/LOG_ID?searchAfter=1694180633270</span></code></pre>

You will need to use the same set of parameters in `query`, `from`, and `to` as in the previous request for this to work.

### Deleting a message

When fixing the bug causing an error logged at elmah.io, you may want to delete the error. Deleting a single error is as easy as fetching it. Create a DELETE request to the errors unique URL:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">DELETE</span><span>https://api.elmah.io/v3/messages/LOG_ID/81C7C282C9FDAEA3</span></code></pre>

When successfully deleted, the delete endpoint returns an HTTP status code of `200`.

### Deleting messages

Deleting messages one by one can be tedious work. To delete multiple errors, you can utilize the Delete Messages endpoint by creating a DELETE request to:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">DELETE</span><span>https://api.elmah.io/v3/messages/LOG_ID</span></code></pre>

The request **must** contain a body with at least a query:

```json
{
    "query": "test"
}
```

An option for deleting messages by date range is available as well. Check out the API documentation for details.

### Hiding a message

Depending on your use case, you may want to hide a message, rather than delete it. Hidden messages are shown as default through neither the UI nor the REST API. But you will be able to search for them by enabling the `Hidden` checkbox on the UI.

To hide a message, use the `_hide` endpoint like this:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">POST</span><span>https://api.elmah.io/v3/messages/LOG_ID/99CDEA3D6A631F09/_hide</span></code></pre>

If successful, the endpoint returns an HTTP status code of `200`.

### Fixing a message

When you have fixed a bug in your code, it's a good idea to mark any instances of this error in elmah.io as fixed. This gives a better overview of what to fix and ensures that you are notified if the error happens again.

To mark a message as fixed, use the `_fix` endpoint like this:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">POST</span><span>https://api.elmah.io/v3/messages/LOG_ID/99CDEA3D6A631F09/_fix</span></code></pre>

If successful, the endpoint returns an HTTP status code of `200`. This will mark a single message as fixed. In case you want to mark all instances of this message as fixe, include the `markAllAsFixed` parameter:

<pre class="request-method"><code class="nohighlight"><span class="badge badge-secondary mr-2">POST</span><span>https://api.elmah.io/v3/messages/LOG_ID/99CDEA3D6A631F09/_fix?markAllAsFixed=true</span></code></pre>