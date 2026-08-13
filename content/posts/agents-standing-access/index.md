---
title: "Agents with standing access are just service accounts"
summary: "We spent fifteen years killing standing credentials, then handed a fresh set to something that can be talked into using them."
date: 2026-08-04
draft: true
tags: ["AI Security", "Identity"]
---

{{< alert >}}
**Design fixture.** Illustrative scaffolding for design validation, not verified
research. Replace or delete before publishing.
{{< /alert >}}

The interesting thing about an AI agent with a long-lived API token is that we
already know exactly how this goes. It is a service account. We have a decade of
incident reports about service accounts. The only genuinely new property is that
this one takes instructions from untrusted text.

## What is actually new

Very little, and it matters to be precise about which little:

- **Not new:** over-scoped credentials, no expiry, shared across environments,
  invisible to the joiner-mover-leaver process.
- **Not new:** a non-human principal that no one owns and no one can safely
  disable.
- **New:** the control path and the data path are the same channel. A document
  the agent reads can change what the agent does with its credential.

That last point is the whole threat model. Everything else is hygiene we already
failed at once.

## Scope it like a service account, then assume it is confused

Treat the token as compromised-by-persuasion rather than compromised-by-theft.
The mitigations diverge:

| Assumption        | Control that helps                    |
| ----------------- | ------------------------------------- |
| Token stolen      | Rotation, binding, network ACLs       |
| Token *misused*   | Per-action authorisation, human step-up |

Rotation does nothing against an agent that was convinced to make a legitimate,
authorised, catastrophic call. You need the authorisation decision to happen at
the point of action, with the agent's *current* task as an input — not once at
token issue.

> A credential that can be talked into acting is not a credential problem. It's
> an authorisation-granularity problem wearing a credential's clothes.

## A starting position

Give the agent an identity that expires in minutes, scope it to one task, and
make anything irreversible require a second principal. That is not an AI control.
It is what we should have done for service accounts, finally forced on us by
something that fails loudly enough to be worth fixing.
