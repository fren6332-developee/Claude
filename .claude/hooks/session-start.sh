#!/bin/bash
set -euo pipefail

# Only relevant on Claude Code on the web / remote environments, where each
# session may start from a fresh container that doesn't have the plugin yet.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Both commands are idempotent no-ops if already installed at user scope.
claude plugin marketplace add obra/superpowers-marketplace
claude plugin install superpowers@superpowers-marketplace

claude plugin marketplace add affaan-m/everything-claude-code
claude plugin install ecc@ecc

claude plugin marketplace add ruvnet/ruflo
for p in ruflo-core ruflo-swarm ruflo-loop-workers ruflo-security-audit \
  ruflo-rag-memory ruflo-testgen ruflo-docs ruflo-autopilot \
  ruflo-intelligence ruflo-agentdb ruflo-aidefence ruflo-browser \
  ruflo-jujutsu ruflo-agent ruflo-workflows ruflo-daa ruflo-ruvllm \
  ruflo-rvf ruflo-plugin-creator ruflo-goals ruflo-adr ruflo-cost-tracker \
  ruflo-ddd ruflo-federation ruflo-graph-intelligence ruflo-iot-cognitum \
  ruflo-knowledge-graph ruflo-market-data ruflo-migrations \
  ruflo-neural-trader ruflo-observability ruflo-ruvector ruflo-sparc \
  ruflo-metaharness ruflo-arena; do
  claude plugin install "${p}@ruflo"
done

claude plugin marketplace add nexu-io/open-design
claude plugin install open-design@open-design

claude plugin marketplace add kepano/obsidian-skills
claude plugin install obsidian@obsidian-skills

claude plugin marketplace add multica-ai/andrej-karpathy-skills
claude plugin install andrej-karpathy-skills@karpathy-skills

claude plugin marketplace add Piebald-AI/claude-code-lsps
claude plugin install pyright@claude-code-lsps
# The plugin only wires up LSP config; the actual language server binary
# still needs to be on PATH.
command -v pyright-langserver >/dev/null 2>&1 || npm install -g pyright

claude plugin marketplace add anthropics/claude-code
claude plugin install frontend-design@claude-code-plugins

claude plugin marketplace add ComposioHQ/awesome-claude-plugins
claude plugin install connect-apps@awesome-claude-plugins
# Installing connect-apps only wires up the plugin's /setup command; it does
# NOT configure auth. Run `/setup` yourself to link a Composio API key.

claude plugin marketplace add timescale/pg-aiguide
claude plugin install pg@aiguide

claude plugin marketplace add pbakaus/impeccable
claude plugin install impeccable@impeccable

claude plugin marketplace add upstash/context7
claude plugin install context7@context7-marketplace

claude plugin marketplace add thedotmack/claude-mem
claude plugin install claude-mem@thedotmack
