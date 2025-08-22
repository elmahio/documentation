---
title: How can I search or create rules using RegEx query
description: Learn about the possibilities of using regular expressions (RegEx) when search or creating rules on elmah.io
---

# How can I search or create rules using RegEx query

The short answer is: you can't. elmah.io currently does not support RegEx in the full-text query fields on Log Search and when creating rules. Full-text search is based on Lucene Query Language which supports a limited form of wildcards (* and ?) and fuzzy matching (~), but not arbitrary regular expressions.