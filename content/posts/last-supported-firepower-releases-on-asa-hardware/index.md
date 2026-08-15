---
title: "Last supported software releases on Firepower hardware"
summary: "It has been nearly seven years since Cisco aquired Sourcefire in 2013. What followed were…"
date: 2021-04-09T08:20:49
tags: ["Archive"]
aliases: ["/2021/last-supported-firepower-releases-on-asa-hardware"]
---
It has been nearly seven years since Cisco aquired Sourcefire in 2013. What followed were a few years of figuring out on how to marry the existing Sourcefire IPS solution with Cisco ASA software, which resulted in the release of Firepower Threat Defense in 2016.

Fast forward to 2021 we are seeing the first generations of Firepower Management Centers and Firepower 4100/9300 appliances going End-of-Sale and with that their last supported major software releases being announced.

| Model                 | Replacement                 | ASA  | FTD |
|-----------------------|-----------------------------|------|-----|
| Firepower 7000        | Firepower 1140/1150/2000    | N/A  | 6.4 |
| Firepower 8000        | Firepower 9300 (SM40/48/56) | N/A  | 6.4 |
| Firepower 4120        | Firepower 4125              | 9.16 | 7.1 |
| Firepower 4140        | Firepower 4145              | 9.16 | 7.1 |
| Firepower 4150        | Firepower 4155              | 9.16 | 7.1 |
| Firepower 9300 (SM24) | Firepower 9300 (SM40)       | 9.16 | 7.1 |
| Firepower 9300 (SM36) | Firepower 9300 (SM48)       | 9.16 | 7.1 |
| Firepower 9300 (SM44) | Firepower 9300 (SM56)       | 9.16 | 7.1 |

| Model    | Replacement | FPS | FTD |
|----------|-------------|-----|-----|
| FMC 1000 | FMC 1600    | 7.0 | 7.0 |
| FMC 2500 | FMC 2600    | 7.0 | 7.0 |
| FMC 4500 | FMC 4600    | 7.0 | 7.0 |

## What does this mean to me?

If you are running any of the specified hardware appliances you will be capped at a certain software release. Keep in mind that you will only receive new features and functionality up to the specified software releases, your existing Firepower Management Center might become a bottle neck to your newer hardware appliances if not replaced with a newer hardware revision.
