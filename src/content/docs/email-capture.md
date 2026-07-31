---
title: Email capture
description: Forward anything to assistant@commit.moi and it lands in the right space, as a task, with the mail as context.
---

Some things arrive as email. Forward them to **assistant@commit.moi** and they
become tasks — routed to the space they belong to, with the original message
kept as the task's notes.

## How to use it

Forward, or send directly, from the address on your GitHub account. Subject
becomes the title; body becomes the notes.

```txt
To: assistant@commit.moi
Subject: Renew the bike insurance before 14 Aug

Policy number 44-8812. Quote attached.
```

That arrives as a task titled *Renew the bike insurance before 14 Aug*, due
**14 August**, in your tasks space.

## Routing

The assistant reads the mail and picks the space:

| Looks like | Lands in |
| --- | --- |
| A thing to do | your tasks space |
| A recipe | your cookbook space |
| A note to keep | your notes space |
| A receipt or amount | your finance space |

If you only have one space, everything lands there. If a guess is wrong, move
the task — one drag, or the space picker in Task Detail.

:::caution[Send from an address we recognise]
Mail from an address that isn't on your GitHub account is dropped without
reply. That is deliberate: an open inbox on your task list would be an open
door.
:::

## What we keep

The mail is turned into an issue in your repository and then discarded. We
don't archive your inbox, and there is no copy on our side — there is nowhere
to keep one.

:::note
Our privacy policy is short because our database is empty.
:::
