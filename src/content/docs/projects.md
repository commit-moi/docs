---
title: Projects
description: A project is a GitHub milestone — a place for tasks that finish together, with a progress ring instead of a burndown chart.
---

A project is one GitHub milestone inside a space. Tasks assigned to it show a
small project chip after their title, and the project screen groups them by
status with a progress ring in the header.

Use a project when tasks share a finish line: *Move flat*, *Launch the shop*,
*Sail licence*. Use an [area](/tasks-and-areas/#areas) when they share a
category instead.

## Create a project

There is one form, reachable from every nav tier:

- The **+** beside *Projects* in the sidebar.
- The ghost **+** in the collapsed rail, or the *Projects* tile in the mobile
  More sheet.
- <kbd>⌘</kbd> <kbd>K</kbd> → “new project”.

The form asks for an icon, a title, a colour, an optional end date, and a
description. All five land on the milestone:

```yaml
title: Move flat
due_on: 2026-09-30
description: |
  Everything that has to happen before the keys go back.
```

## On the project screen

- **Progress ring** — closed tasks over total tasks. No estimates, no velocity.
- **Composer** — new tasks land in this project by default.
- **Grouped tasks** — Today, Upcoming, Anytime, Someday, then Done.

:::note[One project, one milestone]
No translation layer to trust. Rename it on github.com and it is renamed here.
:::

## Finishing a project

Close the last task and the ring completes. Closing the milestone on GitHub
archives the project here; its tasks stay in your Logbook, exactly as they were.
