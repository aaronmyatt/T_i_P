---
timestamp: 2026-01-01T12:00:00Z
name: AWS
description: A collection of notes and learnings about AWS, starting with VPCs and ECS
draft: true
---
# AWS

The behemoth. It has been many years since I needed to dip into AWS seriously. My life has a been a comfortable ride playing with GCP.

Now, however, I face Jeff's beast again and I want to take a more organised approach to learning it. I have a staging environment
to replicate, to make production ready, so let's dive into each of the moving pieces, and build a wee knowledge map to help 
reinforce what we learn.

Let's start with VPCs.

## VPC
https://docs.aws.amazon.com/vpc/
https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html


TF are Subnets?
> A subnet, or subnetwork, is a segmented piece of a larger network. More specifically, subnets are a logical partition of an Internet Protocol (IP) network broken into multiple, smaller network segments. Subnets are often used to divide clients logically or by location to help the network traffic flow better.

So, a VPC is essentially like your home network, if it were hosted on Amazon infrastructure, and infinitely scalable. A VPC simply
describes that network and how "devices" on it communicate.

A VPC is comprised of:
- subnets
- routes
- gateways?

Default VPC:
- Each account start life with a default VPC 
- "an EC2 instance that is launched in a default subnet automatically has access to the internet"
- "each instance that you launch into a nondefault subnet has a private IPv4 address, but no public IPv4 address"
- to "prevent unsolicited inbound connections from the internet, you can use a network address translation (NAT) device"


> Production environment
> For a production environment, we recommend that you select at least two Availability Zones and deploy your AWS resources evenly in each active Availability Zone.

Security Groups
The association between VPCs, Security Groups and each piece of infra has been a point of confusion for me. I suspect it was mainly
an overthinking thing. The general information overload when using (or coming back to) AWS is high, but dipping into the VPC docs
has demystified this quite healthily for me.

> A security group controls the traffic that is allowed to reach and leave the resources that it is associated with. For example, after you associate a security group with an EC2 instance, it controls the inbound and outbound traffic for the instance.
 

CIDR?
https://aws.amazon.com/what-is/cidr/
Classless Inter-Domain Routing (CIDR)

Elastic IPs?

Cool note:
> Network packet loss can be caused by a number of factors, including network flow collisions, lower level (Layer 2) errors, and other network failures. We engineer and operate our networks to minimize packet loss. We measure packet-loss rate (PLR) across the global backbone that connects the AWS Regions. We operate our backbone network to target a p99 of the hourly PLR of less than 0.0001%

## ECS

