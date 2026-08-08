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

`.mcp.json` also registers [samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp),
a local MCP server that lets Claude control DaVinci Resolve (timeline editing,
color grading, Fusion, rendering/export). Like the Premiere Pro MCP above, it
only works on a machine that has DaVinci Resolve 18.5+ installed and running
(Studio edition required for the external scripting API; the free edition
uses a more limited in-app bridge) — it cannot run in a headless/remote
session.

To set it up on your own machine:

```bash
git clone https://github.com/samuelgursky/davinci-resolve-mcp.git
cd davinci-resolve-mcp
python3 -m venv .venv && ./.venv/bin/python -m pip install -r requirements.txt
./.venv/bin/python install.py   # or: npx davinci-resolve-mcp setup
```

Requires Python 3.10–3.12 (3.13/3.14 work but may hit compatibility issues on
older Resolve builds) and `ffmpeg` on `PATH`; `numpy`, `librosa`,
`openai-whisper`, and `opencv-python` unlock optional features.

The server also needs Resolve's scripting environment on the environment
variables in `.mcp.json`'s `davinci-resolve` entry — update the placeholder
paths for your OS, e.g. on macOS:

```
RESOLVE_SCRIPT_API=/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting
RESOLVE_SCRIPT_LIB=/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Libraries/Fusion/fusionscript.so
PYTHONPATH=/Library/Application Support/Blackmagic Design/DaVinci Resolve/Developer/Scripting/Modules
```

(Windows: scripting lives under `%PROGRAMDATA%\Blackmagic Design\DaVinci Resolve\Support\Developer\Scripting`
and `fusionscript.dll` under the Resolve install dir. Linux: under `/opt/resolve/...`.)

Once configured, launch Claude Code from the `davinci-resolve-mcp` directory
so the relative `command`/`args` paths in `.mcp.json` resolve — or update
them to absolute paths if you clone it elsewhere.
