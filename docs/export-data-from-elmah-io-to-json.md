# Export data from elmah.io to JSON
|-LogId|<span class="fa fa-check"></span>||The ID of the log you want to export from ([where is my log ID?](https://docs.elmah.io/where-is-my-log-id/)).|
|-Filename||`Export-{ticks}.json`|Name of the output file.|
|-DateFrom||`DateTime.Min`|Date and time in ISO8601 to export messages from.|
|-DateTo||`DateTime.Max`|Date and time in ISO8601 to export messages to.|
|-Query|||A lucene query to filter messages by. See [Query messages using full-text search](https://docs.elmah.io/query-messages-using-full-text-search/) for details.|
|-IncludeHeaders||`false`|Indicates if the output should include headers like cookies and server variables (runs slower).|