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
