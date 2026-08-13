---
title: "Every SASE rollout stalls at decryption"
summary: "The steering works, the tunnels come up, and then someone asks which traffic you're allowed to open — and the project stops for a quarter."
date: 2026-07-22
draft: true
tags: ["SASE", "NetSec"]
---

{{< alert >}}
**Design fixture.** Illustrative scaffolding for design validation, not verified
research. Replace or delete before publishing.
{{< /alert >}}

The technical part of a SASE migration is not usually the hard part. Tunnels come
up. Traffic steers. The part that consumes a quarter is the decryption policy,
because it is the first point where the security architecture has to survive
contact with the works council, the legal team, and a list of applications that
pin their own certificates.

## The three buckets

Everything ends up in one of three buckets, and the project's timeline is decided
by how quickly you can sort applications into them:

1. **Decrypt.** General web traffic, unsanctioned SaaS, anything you need to
   inspect for data movement.
2. **Cannot decrypt.** Certificate pinning, mutual TLS, client software that
   ships its own trust store.
3. **Must not decrypt.** Banking, health, works-council-protected categories,
   and anything your jurisdiction treats as privileged.

Bucket 2 is a technical exercise. Bucket 3 is a legal one, and it is the one that
blocks, because nobody will sign it off in a meeting.

## Make the bypass list the deliverable

The mistake is treating the bypass list as an exception to the policy. It *is*
the policy — it's the artefact legal and the works council actually review, and
it is the thing that determines coverage.

```text
decrypt-bypass:
  - category: financial-services     # must not
  - category: health-and-medicine    # must not
  - app: <pinned-client-app>         # cannot
```

Write it first, get it signed, and derive the decrypt rule as the inverse. A
project that starts from "decrypt everything, then handle complaints" spends its
time in escalation instead of rollout.

> Coverage is not how much traffic you decrypt. It's how much of what you chose
> not to decrypt you can still see something about.

## What to keep when you cannot open the traffic

Bypassed does not mean blind. You still have SNI, JA4, destination reputation,
volume and timing. It is a weaker signal, and it is enough to notice that a host
in the "must not decrypt" bucket is moving a hundred times its usual volume at
03:00. Decide up front what you will alert on for bypassed traffic, or bucket 3
quietly becomes an unmonitored tunnel out of the network.
