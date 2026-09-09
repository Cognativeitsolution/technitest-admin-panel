#!/bin/sh
# reposhield-style pre-push guard: scans the committed HEAD tree for payload
# markers so a push cannot smuggle a crypto-miner through a bypassed commit.

set -u

RED='\033[0;31m'
NC='\033[0m'

block() {
  printf "${RED}ERROR: reposhield - push blocked. $1${NC}\n" >&2
  exit 1
}

# Core reposhield markers across the entire committed tree.
# .husky/ guard files are excluded: they must contain the marker list
# literally, so their own definitions would always self-match.
CORE_MARKERS='A9-0078-4|_0x5ba36e|2857687|2667686|1111436|3896884'
HIT="$(git grep -anE "$CORE_MARKERS" HEAD 2>/dev/null \
  | sed 's/^[^:]*://' \
  | grep -v '^\.husky/' \
  | head -1 || true)"
if [ -n "$HIT" ]; then
  FILE="$(printf '%s' "$HIT" | cut -d: -f1)"
  printf 'File: %s\nMatch line: %.160s\n' "$FILE" "$(printf '%s' "$HIT" | cut -d: -f2-)" >&2
  block "Crypto-miner payload present in committed files (HEAD): $FILE"
fi

# Extended markers restricted to committed config/build files (avoids false
# positives from legitimate atob()/fromCharCode usage in application code)
MARKERS='A9-0078-4|_0x5ba36e|2857687|2667686|1111436|3896884|atob\(|fromCharCode|ETH_RPC_URL|_0xc702|_0x44ceab|eth_getBlockByNumber|child_proc|keepAliveMsecs'
CONFIG_FILES="$(git ls-tree -r --name-only HEAD 2>/dev/null \
  | grep -iE '\.config\.(js|mjs|cjs|ts|mts|cts)$|(^|/)\.([a-z]+)rc([.-][a-z0-9]+)?$' \
  || true)"

if [ -n "$CONFIG_FILES" ]; then
  for f in $CONFIG_FILES; do
    HIT="$(git show "HEAD:$f" 2>/dev/null | grep -aE "$MARKERS" | head -1 || true)"
    if [ -n "$HIT" ]; then
      printf 'File: %s\nMatch line: %s\n' "$f" "$(printf '%s' "$HIT" | cut -c1-160)" >&2
      block "Crypto-miner payload marker in committed config: $f"
    fi
  done
fi

exit 0