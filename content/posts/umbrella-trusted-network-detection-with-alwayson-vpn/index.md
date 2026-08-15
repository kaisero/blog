---
title: "Umbrella Trusted Network Detection with AlwaysOn VPN"
summary: "In a recent Cisco Umbrella trial I ran into an interesting usecase which prompted me…"
date: 2021-04-30T14:56:08
tags: ["Archive"]
aliases: ["/2021/umbrella-trusted-network-detection-with-alwayson-vpn"]
---
In a recent Cisco Umbrella trial I ran into an interesting usecase which prompted me to look deeper into the Umbrella roaming clients Trusted Network Detection feature. My customer was using an existing NGFW solution for content filtering, tls decryption and security intelligence for protecting their users within the company network and only wanted to use the Umbrella Roaming Client for off-network protection.

Sounds like a very straight forward setup – just use the Trusted Network Detection feature to check if the client is currently within the company network and back off – right? Well, yes, but things got a bit more complicated since remote-worker were always connected to their AlwaysOn VPN service which got me thinking – how do I determine if a client is in the local network using the roaming client if it’s always connected to the company network using VPN?

Before we go into the details let’s do a quick recap on Trusted Network Detection

## Trusted Network Detection

TND is a feature to disable the roaming client on your corporate network by querying for an A or AAAA record that resolves to a either a RFC-1918 (A record) or RFC-4193 (AAAA record) ip address. Basically what happens when the roaming client starts up is that it checks its configuration file (customer_network_probe.flag) and tries to resolve the dns record within that configuration file to determine if it is currently connected to the company network. If the dns record can be resolved to a private ip address the roaming client knows that it is within company premises and backs-off, leaving DNS resolution to the local DNS servers .

### So how do I configure this Trusted Network Detection?

As for Q1 2021 you cannot enable TND yourself since the feature only exists within the Umbrella backend. If you want to utilize TND for disabling your roaming client you will need to open a case with <umbrella-support@cisco.com>, tell them the DNS record you want to use for TND detection (e.g. tnd.example.local) and they will configure it for you. Your roaming clients will automatically synchronise with the cloud, download the TND configuration and create a file named **customer_network_probe.flag** with the DNS record that will be used for probing.

{{< alert >}}
**Tip**

If you want to enable TND for testing just create the **customer_network_probe.flag** file yourself, put the desired domain into the file and **restart** the roaming client

**Roaming client\**
Windows: %ProgramData\OpenDNS\ERC\\\
MacOS:  /Library/Application Support/OpenDNS Roaming Client/\
\
**AnyConnect**\
Windows: %ProgramData%\Cisco\Cisco AnyConnect Secure Mobility Client\Umbrella\data\\\
MacOS: /opt/cisco/anyconnect/Umbrella/data/\

To restart the roaming client checkout the following guide:\
<https://support.umbrella.com/hc/en-us/articles/230561067-Umbrella-Roaming-Client-Manually-Disabling-or-Restarting->
{{< /alert >}}

### But what if I am always connected via VPN?!

And this is were everything got a little bit tricky. In the specific setup that I encountered, remote workers were always connected to the company network using a third party vpn solution, hence they could always resolve the record that should determine if they are off-network or not.

To resolve the problem we were looking for a way to differentiate vpn clients from workstations that were directly connected to the company network. The only differentiator for us was the ip addresses. We knew that vpn clients would always connect to the network using the vpn ip pool, which was the crucial information we used to implement a policy to resolve our issue.

### Microsoft Query Resolution Policies to the rescue

Like many enterprise environments our customer was using Microsoft DNS Servers for internal name resolution. After digging a bit into various configuration options we found a feature added in **Windows Server 2016** which allowed us to define query resolution policies. Using those capabilities we were able to build a policy that would block dns resolution of the probing record based on a queriers ip address.

I created a short powershell script that would cause the DNS server to responds with A **NXDOMAIN** response whenever a vpn client (198.18.1.0/24) would query for the resource

``` powershell
Import-Module DnsServer

Add-DnsServerClientSubnet -Name "VPN-NETWORK" -IPv4Subnet 198.18.1.0/24 -PassThru

Add-DnsServerQueryResolutionPolicy -Name "BlockFromVPN" -Action IGNORE -ClientSubnet "EQ,VPN-NETWORK" -FQDN "EQ,tnd.example.local" -PassThru
```

{{< alert >}}
The policy had to be created on both DNS Servers seperately. The configuration is not replicated automagically, so make sure the DNS policy is added on all your relevant DNS servers
{{< /alert >}}

Using the query resoluton policy we were able to successfully implement a mechanism that we could use to determine if somebody was indeed directly connected to the corporate network or not. Coupled with TND remote workers would always utilize Umbrella security mechanisms (and content filtering) but use the existing on-premise security controls whenever they were physically in the office.
