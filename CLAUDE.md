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

## DaVinci Resolve MCP (local desktop only)

`.mcp.json` also registers [lordhoell/davinci-resolve-mcp](https://github.com/lordhoell/davinci-resolve-mcp),
a local MCP server that lets Claude control DaVinci Resolve (440+ tools:
timeline editing, color grading, Fusion node wiring, rendering/export). It
also ships a Claude Code skill covering object registry patterns, workflow
recipes, and render configuration. Like the Premiere Pro MCP above, it only
works on a machine that has DaVinci Resolve or Studio 19.0+ installed and
running — it cannot run in a headless/remote session.

To set it up on your own machine:

```bash
git clone https://github.com/lordhoell/davinci-resolve-mcp.git
cd davinci-resolve-mcp
pip install -e ".[dev]"
```

Requires Python 3.10+. The `davinci-resolve-mcp` console command (matching
the `command` in this repo's `.mcp.json`) needs to be on `PATH` — that's
automatic with the `pip install -e` above, or use `pipx install
davinci-resolve-mcp` / the `uvx davinci-resolve-mcp` alternative if you'd
rather not install it into your environment.

`RESOLVE_SCRIPT_API` and `RESOLVE_SCRIPT_LIB` (Resolve's scripting paths) are
auto-detected on Windows, macOS, and Linux — only set them manually in
`.mcp.json`'s `env` if auto-detection fails for your install.

To also get the bundled skill in Claude Code, copy
`skill/davinci-resolve-mcp/` from the cloned repo into your skills folder
(e.g. `~/.claude/skills/`).
