# Palmier Pro — AI Video Editing in Claude Code

[Palmier Pro](https://www.palmier.io/) is a native macOS video editor built for
AI agents. While the app is open it exposes a local **MCP server** at
`http://127.0.0.1:19789/mcp`, which lets Claude Code (and Claude Desktop, Codex,
Cursor) read your timeline, add/trim/reorder clips, and generate footage from a
text prompt — all from chat.

## Make it your default (all projects)

Run this once on your Mac so Palmier Pro is available in **every** Claude Code
project (`-s user` registers it at user scope, the "default" across projects):

```bash
claude mcp add --transport http -s user palmier-pro http://127.0.0.1:19789/mcp
```

Verify it:

```bash
claude mcp list
```

> The server shows **Failed to connect** until the Palmier Pro app is open —
> the MCP endpoint only exists while the app is running.

## Project-scoped alternative

This repo also ships a checked-in [`.mcp.json`](../.mcp.json) so the server is
offered automatically to anyone who opens Claude Code in this project. Approve
it when Claude Code prompts on first use.

```json
{
  "mcpServers": {
    "palmier-pro": {
      "type": "http",
      "url": "http://127.0.0.1:19789/mcp"
    }
  }
}
```

## Requirements

- macOS 26 (Tahoe) or later — Palmier Pro is macOS-only.
- The Palmier Pro app installed and **open**. Download it from
  [palmier.io](https://www.palmier.io/).
- The editor + MCP server are open source (GPLv3); only the generative AI
  pipeline is paid (Pro $29/mo, Max $69/mo at launch). Connectivity and
  non-generative editing are free.

## Typical workflow

1. Open Palmier Pro and import your clips.
2. Open Claude Code (the MCP connects automatically).
3. Describe the edit in chat — e.g. *"trim the silence at the start, then
   generate a 3-second establishing shot of a sunrise and put it first."*
   Claude reads the timeline and makes the changes in the app.
