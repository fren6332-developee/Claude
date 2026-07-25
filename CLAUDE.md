# Claude configuration for this repository

This repo pins a set of Claude Code plugins and skills in `.claude/settings.json`
(marketplaces + enabled plugins) and `.claude/skills/`. New Claude sessions in this
repo will offer to install them automatically.

## gstack (recommended)

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted workflows.
Install it for the best experience:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Skills like /qa, /ship, /review, /investigate, and /browse become available after install.
Use /browse for all web browsing. Use ~/.claude/skills/gstack/... for gstack file paths.

## Premiere Pro MCP (local desktop only)

`.mcp.json` registers [ayushozha/AdobePremiereProMCP](https://github.com/ayushozha/AdobePremiereProMCP),
a local MCP server that lets Claude control Adobe Premiere Pro (1,027 tools:
timeline editing, color grading, audio mixing, effects, export). It only works
on a machine that has Premiere Pro 2020+ installed and running — it cannot run
in a headless/remote session.

To set it up on your own machine:

```bash
git clone https://github.com/ayushozha/AdobePremiereProMCP.git
cd AdobePremiereProMCP
cp .env.example .env
just install && just proto && just build && just test
just install-panel   # installs the Premiere Pro extension panel
```

Requires Go 1.22+, Rust 1.77+, Python 3.12+, Node.js 20+, `just`, `buf`, and
FFmpeg. Once built, the server binary at `./go-orchestrator/bin/server` matches
the path in this repo's `.mcp.json`, so Claude Code picks it up automatically
next time you launch it from the `AdobePremiereProMCP` directory — or update
the `command` path in `.mcp.json` if you clone it elsewhere.
