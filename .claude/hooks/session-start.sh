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
