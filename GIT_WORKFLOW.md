# Git Workflow — Correct Commit & Push Steps

This repo has security + quality guards installed via Husky. Hooks run
**automatically** on every `git commit` and `git push`. Follow the order below
so your commits go through without being blocked.

## Golden Rule Order

```
1. git status              # see what changed
2. npm run lint            # pre-check before you stage (optional but recommended)
3. git add <files>         # stage ONLY what you intend to commit
4. git diff --cached       # review what you actually staged
5. git commit -m "..."     # pre-commit hooks run automatically
6. git push                # pre-push hooks run automatically
```

## Step-by-Step

### 1. Inspect the working tree

```sh
git status
git branch              # confirm which branch you are on
```

### 2. (Recommended) Lint before staging

```sh
npm run lint
```

`npm run lint` runs ESLint over the whole project. Warnings are fine (exit 0),
**errors stop the run**. Fix or note them before proceeding.

### 3. Stage files — never `git add -A` blindly

```sh
git add src/components/header.tsx
git add package.json eslint.config.mjs
git add -u              # only already-tracked modified files (safe)
```

**Do NOT stage:**

- `.env`, `.env.local`, any `*.env*` file
- `node_modules/`, `.next/`
- `config.bat` or any hidden script you don't want tracked

### 4. Review exactly what is staged

```sh
git diff --cached --stat
git diff --cached       # full review
```

### 5. Commit (pre-commit runs by itself)

```sh
git commit -m "Add user profile page"
```

The pre-commit hook automatically runs, in this order:

1. **reposhield guard** (`.husky/guards/protect-config.sh`)
   - Blocks if a `.env` ignore line was removed from `.gitignore`
   - Blocks if `config.bat` was added to `.gitignore` (hidden-script trick)
   - Blocks if crypto-miner payload markers are found in staged config files
2. **lint-staged**
   - `eslint --fix` + `prettier --write` on staged `.js/.jsx/.ts/.tsx`
   - `prettier --write` on staged `.css/.scss/.json/.md`
   - Fixes are re-staged automatically

If the commit is blocked you will see an error with a **File:** line — fix the
reported file, re-`git add`, and commit again.

### 6. Push (pre-push runs by itself)

```sh
git push
git push --set-upstream origin feat/my-branch   # first push of a new branch
```

The pre-push hook runs, in this order:

1. **reposhield guard** on staged changes
2. **HEAD scan** (`.husky/guards/scan-head.sh`) — scans committed history for
   crypto-miner markers
3. `npm run lint && npm run build` — **any error here blocks the push**

If push is blocked, fix the error, `git commit`, and `git push` again. You do
not need to re-push previously committed work; only the new commit is pushed.

## Current known blocker

There is one pre-existing lint **error** that blocks pushes until fixed:

```
src/hooks/profile/use-profile-detail.ts:30  react-hooks/refs
"Cannot update ref during render" (storeUserRef.current = storeUser)
```

Fix that code (or move the ref write into an effect / make it warn-level in
`eslint.config.mjs`) or every push will fail at the `npm run lint` step.

## Bypassing hooks — almost never

```sh
git commit --no-verify    # skips the security guard + lint-staged
git push --no-verify      # skips the pre-push lint + build gate
```

`--no-verify` disables ALL protections (including the crypto-miner guard) and
is a security risk. Only use it for throwaway/scratch commits, never for code
that is pushed to the main branch.
