---
title: Troubleshooting
description: When GitHub is unreachable, a write fails, or something looks out of date — what the app does, and what you can do.
---

Almost everything that can go wrong here is a network or permission problem
between your browser and GitHub. Your data is never the casualty: if a write
fails, the change rolls back and says so.

## A task row is dimmed and pulsing

The task is saved locally and its write to GitHub is still in flight. It will
settle in a second or two. Nothing to do.

## A task row shows a red cloud

The write failed. The row keeps your text and retries; if it can't succeed,
you'll get a toast with **Retry**. Nothing is lost, and nothing is silently
dropped.

:::caution[If it keeps failing]
Check whether github.com is reachable, then reload. A failed write is always a
transport problem — the task itself is valid.
:::

## “Can't reach GitHub right now”

A calm banner, and everything you type is queued. Your data is safe. When the
connection returns, the queue drains in order.

## “Reconnect your GitHub account”

The OAuth grant expired or was revoked. Choose **Yes, please** to sign in
again. Nothing was deleted — the app simply lost permission to read your
repositories.

## Rate limits

GitHub allows a fixed number of requests an hour. Heavy bulk edits can reach it;
the app tells you when, waits, and continues. It does not lose your edits.

## A space is missing

The repository was renamed, transferred or deleted on github.com. Rename it
back and it reappears — the repository *is* the space, so the app follows it,
never the other way round.

## Something looks out of date

Reload. The app reads from GitHub, so a reload is the whole cache-clearing
story. If a value is wrong after that, it is wrong in the repository, and you
can see exactly what it says.

:::note
Nothing lives behind our UI that you can't see on github.com — which also makes
this list short.
:::

## Still stuck

Open an issue in [commit-moi/app](https://github.com/commit-moi/app/issues).
Include what you did, what happened, and the repository name if it's relevant —
never a token.
