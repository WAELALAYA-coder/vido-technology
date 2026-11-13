# VIDO Technology – Cisco Network Lab (V34)

## Overview

V34 extends the educational Cisco-style network simulator with DHCP Server, DHCP Relay, standard IPv4 ACLs, NAT/PAT overload, static routing, and a simplified Spanning Tree model. Use the **CLI** tab after adding devices and connecting their links in the topology.

## Quick CLI workflow

```text
device Router-1
enable
configure terminal
```

Use `?` in the CLI for the current command list. `device <id>` selects an existing device from the topology; the simulator does not create devices from CLI commands.

## DHCP Server

On a Server device:

```text
ip dhcp excluded-address 192.168.30.1 192.168.30.10
ip dhcp pool OFFICE
 network 192.168.30.0 255.255.255.0
 client-vlan 30
 default-router 192.168.30.1
 dns-server 1.1.1.1
end
```

Select a PC or Server as the source and use **Obtain IPv4 via DHCP**. The simulator models Discover, Offer, Request, and Acknowledgement, then records a lease. Available inspection commands include `show ip dhcp pool` and `show ip dhcp binding`.

## DHCP Relay

On the router subinterface serving the client VLAN:

```text
interface g0/0.10
encapsulation dot1Q 10
ip address 192.168.10.1 255.255.255.0
ip helper-address 192.168.100.2
no shutdown
```

The DHCP server can be in another VLAN. Its pool must specify the client network and `client-vlan 10`; the router must have an active subinterface for the server VLAN, and the switch trunk must carry both VLANs. Inspect with `show ip dhcp relay`.

## Standard IPv4 ACL

```text
access-list 10 deny 192.168.10.0 0.0.0.255
access-list 10 permit any
interface g0/0.10
ip access-group 10 in
```

Supported standard ACL forms are `any`, `host <IPv4>`, and `<network> <wildcard-mask>`. Rules are evaluated in order; unmatched traffic is denied (implicit deny). ACLs are configured per router. Inspect with `show access-lists`.

## NAT Overload (PAT)

```text
access-list 1 permit 192.168.10.0 0.0.0.255
interface g0/0.10
ip nat inside
exit
interface g0/1
ip address 10.0.0.1 255.255.255.252
ip nat outside
exit
ip nat inside source list 1 interface g0/1 overload
```

The simulator records an ICMP translation when a routed ping leaves an inside interface and matches the NAT ACL. Inspect using `show ip nat translations` and `show ip nat statistics`.

## Static routing

```text
ip route 192.168.20.0 255.255.255.0 10.0.0.2
show ip route
```

For two-way host communication, configure the required forward and return routes and ensure next hops are reachable through active routed interfaces.

## STP

Connect multiple switches in a redundant topology and run:

```text
show spanning-tree
```

The simulator chooses a deterministic root from switch IDs and blocks redundant switch-to-switch links to create a loop-free spanning tree.

## Important simulation limits

This is a learning model, not Cisco IOS, Packet Tracer, or a physical network emulator. It does not send real Ethernet/IP packets. DHCP/DHCP Relay and NAT are modeled state transitions; NAT translation display is currently demonstrated for ICMP ping. ACL support is limited to standard IPv4 source ACLs. STP uses a deterministic spanning-tree calculation and does not implement BPDU exchange, timers, bridge priorities, or full IEEE 802.1D/RSTP convergence. Switch port labels are simulator link positions, not physical Cisco interface identities.

## Hinweise auf Deutsch

- DHCP verteilt IPv4-Adressen automatisch; DHCP Relay leitet Client-Anfragen an einen DHCP-Server in einem anderen VLAN weiter.
- Eine Standard-ACL erlaubt oder sperrt IPv4-Quelladressen. Die Regeln werden der Reihe nach geprüft; am Ende gilt `implicit deny`.
- NAT Overload (PAT) übersetzt mehrere interne Quelladressen über die IP-Adresse des Outside-Interfaces.
- Statisches Routing benötigt einen passenden Hin- und Rückweg.
- STP blockiert redundante Switch-Verbindungen, damit keine Layer-2-Schleife entsteht.

Die Funktionen sind bewusst als Lernsimulation umgesetzt. Sie ersetzen keine echte Cisco-Hardware oder vollständige IOS-Konfiguration.