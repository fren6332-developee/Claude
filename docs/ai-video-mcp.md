# AI Video MCP Servers for Claude Code

Two kinds of MCP servers matter here, and the difference decides what works on
**iOS**:

- **Hosted/remote** servers (a cloud `https://` URL, OAuth or API key) — work
  from anywhere, **including the Claude app on iOS** and the web. Use these for
  a default.
- **Local** servers (`127.0.0.1` / stdio, runs on your machine) — need a
  desktop/Mac with the app running. **They do not work from iOS.**
  [Palmier Pro](./palmier-pro-mcp.md) is local + macOS-only, so it's a Mac-only
  editor, not an iOS option.

## Default for iOS: Higgsfield (set up)

[Higgsfield MCP](https://higgsfield.ai/mcp) is hosted, so it works on iOS/web,
and exposes ~30+ image/video models (Kling, Veo, Seedance, Minimax/Hailuo, Flux)
through one endpoint with OAuth login — no API key to manage.

**Endpoint:** `https://mcp.higgsfield.ai/mcp` · **Transport:** HTTP · **Auth:** OAuth

### Desktop / Claude Code CLI

```bash
claude mcp add --transport http --scope user higgsfield https://mcp.higgsfield.ai/mcp
```

First time you use a Higgsfield tool, Claude Code opens a browser to sign into
your Higgsfield account. `--scope user` makes it the default in every project.
Run `/mcp` in a session to see its tools or trigger the login.

### iOS / Claude app (web & mobile)

The `claude mcp add` CLI is for desktop. On iOS you add a hosted MCP as a
**connector** inside the app: **Settings → Connectors → Add custom connector →**
paste `https://mcp.higgsfield.ai/mcp`, then complete the Higgsfield OAuth login.
Once added to your account it follows you across the iOS and web apps.

## Also a default: HeyGen (set up)

[HeyGen MCP](https://www.heygen.com/model-context-protocol) is hosted (iOS-OK)
and specializes in **avatar + synthetic-voice "talking head"** videos — scripting,
avatar selection, voice, and rendering using your HeyGen plan.

**Endpoint:** `https://mcp.heygen.com/mcp/v1/` · **Transport:** HTTP · **Auth:** OAuth

### Desktop / Claude Code CLI

```bash
claude mcp add --transport http --scope user heygen https://mcp.heygen.com/mcp/v1/
```

### iOS / Claude app

**Settings → Connectors → Add custom connector →** paste
`https://mcp.heygen.com/mcp/v1/`, then complete the HeyGen OAuth login.

> Use **Higgsfield** for general text/image-to-video across many models, and
> **HeyGen** when you want a presenter/avatar speaking a script.

## Other hosted options (all iOS-friendly)

| Server | Best for |
|---|---|
| [Runway connector](https://www.theslidefactory.com/post/generate-ai-videos-directly-in-claude-how-the-runway-mcp-changes-creative-production) | Polished image/video generation, official Runway models |
| Pexo | Auto-routes each shot to the best model; full pipeline (music, lip-sync) |
| Reap MCP | Clip/caption/dub existing videos (e.g. YouTube → shorts) |

## Quick reference

| Server | Type | Works on iOS | Role |
|---|---|---|---|
| Higgsfield | Hosted (OAuth) | ✅ | **Default** — many models, generation |
| HeyGen | Hosted (OAuth) | ✅ | **Default** — avatar / talking-head videos |
| Runway / Pexo / Reap | Hosted | ✅ | Specialized generation/editing |
| Palmier Pro | Local (macOS) | ❌ | Mac-only timeline editor |
