#!/bin/sh
# reposhield-style project guard (runs on pre-commit and pre-push)
# Protections:
#   A) .gitignore protections
#      A1) removal of any .env ignore entry -> block (secret leak)
#      A2) adding "config.bat" to .gitignore -> block (hidden script trick)
#   B) crypto-miner payload scan on staged config/build files (extended markers)
#   C) whole staged diff scan for core reposhield crypto-miner markers
#      (self-scan avoided: .husky/ guard files are excluded because they must
#      contain the marker list literally)

set -u

RED='\033[0;31m'
NC='\033[0m'

block() {
  printf "${RED}ERROR: reposhield - commit blocked. $1${NC}\n" >&2
  exit 1
}

# ---------------------------------------------------------------
# A) .gitignore protections
# ---------------------------------------------------------------
GITIGNORE_DIFF="$(git diff --cached -- .gitignore 2>/dev/null || true)"

if [ -n "$GITIGNORE_DIFF" ]; then
  # Removed lines (diff deletions) that are not the "---" file header
  REMOVED="$(printf '%s' "$GITIGNORE_DIFF" | grep '^-[^-]' | sed 's/^-[[:space:]]*//' || true)"

  # A1) any removed ignore entry referencing .env files
  if [ -n "$REMOVED" ] && printf '%s' "$REMOVED" | grep -qE '^[^#]*\.env'; then
    block "Removal of .env ignore entry detected in .gitignore."
  fi

  # Added lines (diff insertions) that are not the "+++" file header
  ADDED="$(printf '%s' "$GITIGNORE_DIFF" | grep '^\+[^+]' | sed 's/^\+[[:space:]]*//' || true)"

  # A2) adding config.bat to .gitignore hides a script from being tracked
  if [ -n "$ADDED" ] && printf '%s' "$ADDED" | grep -qiE '(^|[[:space:]])config\.bat([[:space:]]|$)'; then
    block "config.bat added to .gitignore (hidden script trick)."
  fi
fi

# ---------------------------------------------------------------
# B) Crypto-miner payload scan on staged config/build files
# ---------------------------------------------------------------
MARKERS='A9-0078-4|_0x5ba36e|2857687|2667686|1111436|3896884|atob\(|fromCharCode|ETH_RPC_URL|_0xc702|_0x44ceab|eth_getBlockByNumber|child_proc|keepAliveMsecs'
CONFIG_FILES="$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null \
  | grep -iE '\.config\.(js|mjs|cjs|ts|mts|cts)$|(^|/)\.([a-z]+)rc([.-][a-z0-9]+)?$' \
  || true)"

if [ -n "$CONFIG_FILES" ]; then
  for f in $CONFIG_FILES; do
    HIT="$(git diff --cached -- "$f" | grep '^\+[^+]' | sed 's/^\+//' | grep -aE "$MARKERS" | head -1 || true)"
    if [ -n "$HIT" ]; then
      printf 'File: %s\nMatch line: %s\n' "$f" "$(printf '%s' "$HIT" | cut -c1-160)" >&2
      block "Detected crypto-miner payload marker in staged changes."
    fi
  done
fi

# ---------------------------------------------------------------
# C) Core reposhield markers across the entire staged diff
# ---------------------------------------------------------------
CORE_MARKERS='A9-0078-4|_0x5ba36e|2857687|2667686|1111436|3896884'
STAGED_FILES="$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -v '^\.husky/' || true)"
if [ -n "$STAGED_FILES" ]; then
  for f in $STAGED_FILES; do
    HIT="$(git diff --cached -- "$f" | grep '^\+[^+]' | sed 's/^\+//' | grep -aE "$CORE_MARKERS" | head -1 || true)"
    if [ -n "$HIT" ]; then
      printf 'File: %s\nMatch line: %s\n' "$f" "$(printf '%s' "$HIT" | cut -c1-160)" >&2
      block "Detected crypto-miner payload marker in staged changes."
    fi
  done
fi

exit 0