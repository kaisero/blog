---
title: "Why your security stack is moving to the cloud and you should be happy about it"
summary: "A few years ago I couldn’t imagine that a lot of the (network) security controls…"
date: 2021-06-27T17:28:11
tags: ["Archive"]
aliases: ["/2021/why-your-security-stack-is-moving-to-the-cloud-and-you-should-be-happy-about-it"]
---
A few years ago I couldn’t imagine that a lot of the (network) security controls I am familiar with would slowly make way for Software-as-a-Service solutions hosted somewhere in the depths of Amazon AWS, Microsoft Azure or any other Public Cloud provider. A lot of complexity moved away from on-premise environments and security solutions became more accessible, readily available with the push of a button and most importantly without the need to rack hardware, setup and upgrade software appliances and spend days (or rather weeks) configuring a security solution into submission to be somewhat useful in countering attacks.

In this post we will look at how I think SaaS is taking over (network) security and why it’s probably for the best. At the end of the day all we want is to secure our networks. Learning odd platform specifics to troubleshoot obscure software problems should be reduced to the absolute minimum so we can focus on the important stuff – protecting our environment against threats and remediating breaches swiftly.

## Cloud skepsis and network security – when did it become acceptable to go SaaS

Over the last years I was fortunate enough to see the transition from on-premise only network security strategies to hybrid approaches. Starting with NGFW solutions that would utilize cloud services for malware analysis and sandboxing up to companies gladly accepting cloud-first security tools for multi-factor authentication, web filtering, e-mail security and endpoint security. It’s been interesting to see everyone (except mostly government entities) transition into this as-a-service space and I think the real game changer was Microsoft. Skepticism started to fade as more and more companies started using Office365, liberating themselves from on-premise Exchange deployments. Since one of the most important business services was already being consumed from the cloud, people got a lot more approachable when it came to Cloud security and started to consider moving functionality away from their own datacenter and into Public Cloud.

But what exactly is it that we lose by moving our proprietary solutions onto somebody elses computer – do we not lose control of our own tools?!

## Control – Did you ever have control over your Enterprise IT stack?

A fear I’ve encountered and experienced myself in regards to Software-as-a-Service solutions is control. Whenever we give something into somebody elses hands we fear a loss of control of our own destiny. After all what can we do when there’s an outage at the cloud provider or a wrathful employee who decides to wipe all VMs running the services we are consuming (\*cough\* Cisco Webex \*couch\*)?

There’s really nothing you can do about that… No really, just accept it and move on.

Sound horrifying, right? But is that any different to running everything on-premise? If your datacenter burns down and you have no geo-redundant setup in place you are toast. If you employ somebody who wants to wreck havoc and delete all your data and backups you are toast. If you encounter a software bug in a proprietary solution, you are toast as well. You might have some additional troubleshooting capabilities if you are running the equipment yourself, but just like with software running in somebody elses datacenter (aka Cloud) you will need to open a support case with your vendor and escalate up the chain to get your problem resolved.

In my opinion the loss of control is mostly an unneccessary fear, so what is the upside of going down the SaaS route?

## Maintenance – it’s not just about the time you waste

Have you ever looked at the time you wasted resolving platform related problems and not utilizing an expensive security solution? Monitoring for vulnerabilities, patching software, troubleshooting performance problems resulting from the VMware team not wanting to reserve resources for you monolith, etc…

Maintenance tends to use up a lot of our time which we are in return missing to do our actual work. Tuning policies, hunting threats and generating fancy reports for the C-level suite to justify our security budget. SaaS takes this pain away from us and moves the administration, maintenance, scaling and monitoring to our provider, freeing us from work that is of no value to our organization.

I have seen too many unpatched firewalls and security teams wasting their valueable time to do maintenance work so it’s a breath of fresh air to see the shift to SaaS, enabling us to focus on what’s really important.

## Scalability – Grow as you pay

Scaling security solutions is a challenging tasks. Working through datasheets and mapping requirements to the correct hardware/software models is not always easy and can come back to bite you later on in a systems lifecycle when suddenly growth predictions change and you are forced to replace your existing investment with yet another system that is able to handle the new load requirments.

For most SaaS solutions the cost seems to be more predictable. You have a monthly/yearly fee that can mostly be broken down to \$:user:month (i.e. 5\$ for each user every month) and all the technical complexity for scaling the service for our requirements is abstracted away from us.

## Zero Trust & SASE – C-level accelerated innovation brought to you by COVID-19

The buzzwords Zero Trust and Secure Access Service Edge (SASE) haunt each and everyone of us since the first lockdowns hit in 2020 and many office workers had to work from home. The shift away from forcing all employees into the office so micro-managers could justify their existance to monitoring employees 9 to 5 through unneccessary Zoom sessions speed up the adoption of those architectures significantly.

Using Full Tunnel VPN connections to apply network security controls tends to be a bad idea due to latency and bandwidth requirements, so a lot of companies moved security controls away from the corporate network and into the endpoint. By empowering the endpoint with hybrid solutions that not only exist on our clients but also utilize the Public Cloud for heavy lifting like metadata analysis, event correlation and deep packet inspection we are now able to work from anywhere without sacrificing security posture.

## So what’s the catch – Should I jump on the hype train and embrace Security hosted in the Cloud?

To some of you it might sound convincing to pull the plug on your on-premise solutions, pack your things, drink the Kool-Aid and move to the cloud, but before doing so make sure you know what you are signing up for. Not every SaaS product is a viable alternative to your current toolset. Dig deeper into what exactly it is that vendors pitch you and if your requirements are really met. Are you sacrificing stability for convience? Are you sure that \$vendor is able to meet your performance requirements and they are operating a reliable and secure service that indeed increases your security posture?

If the answer to all of those questions is yes, I’d suggest atleast considering the move. SaaS solves a lot of painpoints of on-premise security solutions, especially if your security team is small and time is of the essence.
