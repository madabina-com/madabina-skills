---
name: madabina-platform
description: Help merchants and developers understand Madabina platform capabilities, choose the right integration, and work safely with stores, products, orders, customers, and analytics.
license: MIT
metadata:
  author: Madabina
  version: "0.1.0"
---

# Madabina platform

Use this skill when a user wants to understand or automate Madabina merchant-platform workflows.

## Orient the request

- Madabina is a multilingual commerce platform for merchants. A merchant can have stores; verify which store is selected before describing or changing store data.
- For a human using the web console, explain the relevant dashboard or merchant workflow and ask for missing business choices.
- For a programmatic REST integration, use the `madabina-api` skill and the merchant REST API.
- For an AI assistant integrating tools/resources over Model Context Protocol, use `madabina-mcp` and the Streamable HTTP MCP endpoint.
- For designing or reviewing Madabina-branded visuals, use `madabina-brand` and its visual identity reference.
- Do not claim a capability exists merely because it would be useful. Check the current API documentation or ask the user to confirm the feature is enabled for their account.

## Safe operation

- Treat order, customer, stock, visibility, and store information as private tenant data. Do not expose it outside the authorized user's request.
- Prefer read operations before proposing a change. Summarize the target store, record, and effect before destructive actions; obtain explicit user approval before deleting products or orders.
- Do not invent prices, inventory, customer details, delivery terms, or order status. Ask for missing values.
- Never put passwords, bearer tokens, refresh tokens, OAuth codes, client secrets, or signing keys in prompts, source control, logs, or examples.
- Keep personal data to the minimum needed for the requested task.

## Language

Madabina supports French, English, and Arabic. Match the user's language and preserve the requested language when editing localized product content. For Arabic, preserve right-to-left text and do not transliterate names unless asked.

## References

- [Platform overview](references/platform-overview.md)
- [Integration selection](references/integrations.md)
