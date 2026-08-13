---
title: "Your posture check fails open and nobody logged it"
summary: "Three ZTNA agents, one unmanaged laptop, and a compliance signal that silently degrades to \"unknown\" — which most policies treat as pass."
date: 2026-08-11
draft: true
tags: ["ZTNA", "Policy"]
---

{{< alert >}}
**Design fixture.** This post exists to exercise every component in the design
system — headings, tables, code, pull quotes, tags, TOC. The technical content is
illustrative scaffolding, not verified research. Replace or delete it before
publishing.
{{< /alert >}}

A device-compliance signal has three states in every ZTNA product I've looked at:
compliant, non-compliant, and unknown. The first two are policy decisions. The
third is a coin flip, and in more than one product it is documented on page 214
of an admin guide nobody reads.

## Reproducing it

The setup is deliberately boring: one unmanaged laptop, one internal resource
behind a ZTNA gateway, and a policy that says *compliant devices may reach the
CRM*. Then you stop the posture service on the endpoint — not uninstall it,
just stop it — and evaluate again.

```console
$ ztna policy eval --id m.hofer --res crm.internal
posture     = unknown
verdict     = allow   # <- no deny rule ever matched
```

The agent is still connected. The tunnel is still up. The identity is still
valid. The only thing that changed is that the posture attribute stopped being
populated, and `unknown` did not match the deny rule, because the deny rule was
written against `non-compliant`.

## Documented versus observed

| Signal state  | Documented | Observed |
| ------------- | ---------- | -------- |
| compliant     | allow      | <span class="dh-allow">allow</span> |
| non-compliant | deny       | <span class="dh-block">deny</span> |
| unknown       | deny       | <span class="dh-stepup">allow</span> |

That third row is the whole post. The vendor documents a deny. The evaluation
produces an allow, and — this is the part that matters — it produces no log line
distinguishable from a normal compliant session.

> The failure isn't that posture broke. It's that "unknown" was never given a
> verdict.

## Why the default is allow

Policy engines are mostly written as an ordered list of match rules with an
implicit action at the end. When you write:

- `if posture == compliant → allow`
- `if posture == non-compliant → deny`

…you have described two of three states. The third falls through to whatever the
implicit terminal action is, and on a gateway whose job is to keep the business
running, that terminal action is very often `allow`.

This is not a bug so much as a design default that survives because it never
generates a support ticket. Fail-closed generates tickets. Fail-open generates
silence.

## The one-line fix

Give `unknown` an explicit verdict, and put it *first*:

```yaml
rules:
  - match: { posture: unknown }      # evaluate before anything else
    action: deny
    log: posture-signal-missing
  - match: { posture: compliant }
    action: allow
  - match: { posture: non-compliant }
    action: deny
```

Then go and check whether your SIEM has ever seen `posture-signal-missing`. If
your answer is "we don't have that field", that is the finding.
