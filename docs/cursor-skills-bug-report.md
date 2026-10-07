# Bug report: personal skills never reach agents running in a dev container

## Summary

Personal skills saved on the host Mac in `~/.cursor/skills/` are never available to Cursor agents running inside this project's dev container. The agent only receives Cursor's 25 built-in skills. Sync Skills for Cloud Agents does not deliver the files either. When the user asks for a skill, the agent searches the container, finds nothing, and reports the skill as missing, even though the user created it and earlier chats on the Mac used it.

This has happened across many sessions, window reloads, and repeated re-creations of the same skill.

## Environment

| Item | Value |
|---|---|
| Host | macOS, user home `/Users/sahith` |
| Project on host | `/Users/sahith/Desktop/SahithB/music-hub` |
| Agent runtime | Linux dev container (Docker Desktop, kernel `6.12.76-linuxkit`), user `root` |
| Container home | `/root` |
| Project mount | `/workspace` (virtiofs share of the project folder only) |
| Cursor server build | `2dac2428994fe34f12658d9ecad1541b98db2c00` |
| Agent CLI | `2026.10.01-e373342` |

## Affected skills

- `repo-recap`, invoked as `/repo-recap`
- `repo-summary`, invoked as `/repo-summary`

Both were written by the chat "Repository recap skill" (`ec45cfac-065e-44e2-b457-0bf76203e916`) to:

- `/Users/sahith/.cursor/skills/repo-recap/SKILL.md`
- `/Users/sahith/.cursor/skills/repo-summary/SKILL.md`

The chat "Repository summary" (`211ab71e-35ae-453f-b389-6cc495340415`) ran on the Mac and followed the skill successfully.

## Steps to reproduce

1. On the Mac, create a personal skill at `~/.cursor/skills/<name>/SKILL.md`.
2. Turn on Settings → Agents → Context and Tools → **Sync Skills for Cloud Agents**.
3. Open the project with **Reopen in Container** (the project's `.devcontainer`).
4. Start a new agent chat and invoke the skill, or ask the agent to find it.

## Expected

Per Cursor's documentation ("Use personal skills with Cloud Agents"), the skill should be available to the agent. Either the local `~/.cursor/skills` folder is read, or the synced copy is placed in the agent's skill roots.

## Actual

- The agent's skill list at startup contains only the built-in skills (`skillCount: 25`, all under `/root/.cursor/skills-cursor`).
- `/root/.cursor/skills`, `/workspace/.cursor/skills`, `/root/.agents/skills`, `/root/.claude/skills`, and `/.cursor` do not exist.
- The user's synced agent store is mounted but empty:
  `/root/.local/state/cursor/agent-stores/cursor_agent_stores/u298017920/files`
  The environment advertises it as `CURSOR_AGENT_STORE_SHARED_PATHS={"user":{"path":".../u298017920/files","readOnly":false}}`.
- Reloading the window does not change the result.

## Root cause analysis

### 1. The loader only reads the container's filesystem

The agent extension (`extensions/cursor-agent-exec/dist/main.js`) builds skill roots from fixed paths under the home directory and the workspace:

- built-in: `<home>/.cursor/skills-cursor`
- user: `<home>/.cursor/skills`, `<home>/.agents/skills`, plus third-party `.claude`, `.codex`, `.grok`
- project: the same subfolders under the workspace root

In the container `<home>` is `/root`. The Mac's `/Users/sahith/.cursor/skills` is not mounted, so the user root is an empty path. The dev container setup does not bridge the host's personal skills into the container, and nothing in the product does it automatically.

### 2. Sync Skills cannot read its own setting in the dev container

The synced-skills root is only added when a gate resolves to enabled. The gate calls `aiserver.v1.AgentStoreService` / `GetEffectiveUserAgentStoreSkillsSettings` through `connectTransport`. In this container that call fails with:

```
skills sync setting read failed: No Connect transport provider registered
```

Because the read fails, the result is "indeterminate". The code then retries on a 5s/15s/30s/60s schedule and never enables the root. The toggle in Settings has no effect inside the container.

### 3. The store sync goes passive and never downloads

Earlier sessions logged the user store sync failing three times with `deadline_exceeded`. It then dropped its write lock and went passive. After that it stopped pulling. `u298017920/files` has stayed empty since it was created on Sep 18.

### 4. The failure is silent

None of this is shown to the user. The Settings toggle still reads as on, the skill picker shows no error, and the agent is not told that a configured skill source failed. The agent can only report "skill not found". The user hears that as the agent being unable to search.

## Why the agent kept failing

- The agent searched the container's filesystem, which by construction cannot contain the files.
- It did not search past conversations first. Those were the only place that recorded the skill's real name and path. The name the user remembered (`repo-recaper`) did not match the real name (`repo-recap`).
- It tried to create new empty skill folders and symlinks in the container. That changes nothing, because the problem is missing files, not a missing directory.
- It cannot repair the transport or force the sync from inside an agent session.

## Workaround applied in this repo

`.devcontainer/docker-compose.yml` now bind-mounts the host's personal skills into the container:

```yaml
  web:
    volumes:
      - ${HOME}/.cursor/skills:/root/.cursor/skills
```

`${HOME}` is resolved by Docker Compose on the Mac, so the mount source is `/Users/sahith/.cursor/skills`. Writes go both ways: skills created inside the container are saved on the Mac.

`.devcontainer/devcontainer.json` also adds `postStartCommand` to link `/.cursor` to `/root/.cursor`.

This takes effect after **Dev Containers: Rebuild Container**. A window reload does not recreate the container.

## Requested fixes

1. **Dev containers and remote environments:** forward or mount the host's `~/.cursor/skills` automatically, the way the extension already forwards built-in skills.
2. **Sync Skills transport:** register the Connect transport in the remote extension host so `GetEffectiveUserAgentStoreSkillsSettings` succeeds there.
3. **Sync recovery:** a store that goes passive after `deadline_exceeded` should keep retrying and resume pulling. It should not stay passive until the next start.
4. **Visibility:** show the user when a skill source fails ("Personal skills unavailable in this container: sync setting could not be read"). Include that status in the agent's context too, so the agent can report the real cause instead of "not found".
5. **Docs:** document that personal skills are not available in dev containers or SSH remotes unless synced or mounted, and say how to verify the sync.
