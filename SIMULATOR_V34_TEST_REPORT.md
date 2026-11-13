# VIDO Technology V34 – Simulator Test Report

## Functional test results

| Area | Test | Result |
|---|---|---|
| DHCP | Client obtains an address, mask, gateway, and DNS from a DHCP pool | PASS |
| DHCP Relay | PC in VLAN 10 receives `192.168.10.2` from a DHCP server in VLAN 100 through `ip helper-address 192.168.100.2` | PASS |
| ACL | Inbound standard ACL denies `192.168.10.0/24`; packet is blocked | PASS |
| ACL | A separate permit ACL allows the routed ping | PASS |
| NAT/PAT | Inside `192.168.10.10` is recorded as translated to outside `10.0.0.1` for a routed ICMP ping | PASS |
| Static routing | Two routers forward traffic when forward and return routes are present | PASS |
| Static routing | Removing the return route blocks the ping | PASS |
| STP | Three-switch triangle selects a root and blocks one redundant link | PASS |
| Mobile layout | 390 px viewport reports 390 px document width (no horizontal overflow) | PASS |
| JavaScript | All 8 non-empty inline script blocks pass `node --check` | PASS |
| Project audit | 300 questions; 230 unique IDs | PASS |
| Git whitespace | `git diff --check` | PASS |

## Test cleanup

Temporary simulator devices, links, leases, ACLs, NAT translations, and test VLANs were removed from the local session state after testing. The simulator was reloaded and confirmed to contain zero temporary devices, links, and DHCP leases, with only default VLAN 1.

## Scope and limitations

The network simulator is educational. It does not transmit real network packets or implement full Cisco IOS, IEEE 802.1D/RSTP convergence, extended ACLs, or production NAT. The detailed limits are documented in `README_CISCO_SIMULATOR.md`.

## Repository hygiene

`.env`, local key files, temporary extracted scripts, `node_modules`, and local backup folders remain excluded from Git. No production deployment configuration, credentials, accounts, or database volumes were changed.