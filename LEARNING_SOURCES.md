# VIDO Technology — Learning Sources

Review date: 13 November 2026  
Content build: V37  
Scope: Fachinformatiker/in für Systemintegration (FiSi), IHK-oriented foundations and practical system administration.

## Curriculum basis

- [BIBB — Umsetzungshilfe zum Ausbildungsberuf Fachinformatiker/Fachinformatikerin](https://www.bibb.de/dienst/publikationen/de/16661) — official implementation support for the training regulation, competence profile and practical learning situations.
- [IHK Berlin — Leitfaden Fachinformatiker Systemintegration (2026)](https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf) — current chamber-specific guidance for examination structure and project work. Examination details can differ by chamber and must be checked against the relevant IHK.
- [Fachinformatikerausbildungsverordnung (FIAusbV)](https://www.ihk.de/blueprint/servlet/resource/blob/4739986/0068666cf941a051b01c1e6b65a1d8f5/fachinformatiker-vo-2020-data.pdf) — regulatory basis for the training occupations and examination areas.

## New V37 lesson mapping

| VIDO lesson | Main references |
|---|---|
| Windows Server & Active Directory | [Microsoft Learn — AD DS overview](https://learn.microsoft.com/de-de/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview), [Microsoft Learn — Windows Server DNS](https://learn.microsoft.com/de-de/training/modules/implement-windows-server-dns/), [Microsoft Learn — AD DS PowerShell](https://learn.microsoft.com/de-de/training/modules/manage-active-directory-domain-services-use-powershell-cmdlets/) |
| Linux administration | [Ubuntu Server documentation](https://ubuntu.com/server/docs/), [Ubuntu Server security](https://ubuntu.com/server/docs/how-to/security/) |
| PowerShell & Bash | [Microsoft Learn — Windows commands and shells](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands), [Microsoft Learn — AD DS PowerShell](https://learn.microsoft.com/de-de/training/modules/manage-active-directory-domain-services-use-powershell-cmdlets/), [Ubuntu Server documentation](https://ubuntu.com/server/docs/) |
| Virtualization & Hyper-V | [Microsoft Learn — Hyper-V overview](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/overview), [Microsoft Learn — Install Hyper-V](https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/install-hyper-v) |
| Docker & containers | [Docker — Get started](https://docs.docker.com/get-started/), [Docker architecture](https://docs.docker.com/get-started/docker-overview/), [Docker Compose](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/), [Docker volumes](https://docs.docker.com/engine/storage/volumes/), [Docker networking](https://docs.docker.com/engine/network/), [Rootless mode](https://docs.docker.com/engine/security/rootless/) |
| IT security | [BSI — IT-Grundschutz-Kompendium, Edition 2023](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Grundschutz/IT-GS-Kompendium/IT_Grundschutz_Kompendium_Edition2023.pdf?__blob=publicationFile&v=4), [Ubuntu Server security](https://ubuntu.com/server/docs/how-to/security/) |
| Backup & recovery | [BSI — IT-Grundschutz-Kompendium, Edition 2023](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Grundschutz/IT-GS-Kompendium/IT_Grundschutz_Kompendium_Edition2023.pdf?__blob=publicationFile&v=4) — planning, protection, recovery order and restore testing |
| SQL & databases | [PostgreSQL — Tutorial](https://www.postgresql.org/docs/current/tutorial.html) |
| Cloud & hybrid | [Microsoft Learn — Shared responsibility](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), [Microsoft Learn — Availability Zones](https://learn.microsoft.com/en-us/azure/availability-zones/az-overview) |
| IT service & operations | [Atlassian — Incident Management Handbook](https://www.atlassian.com/incident-management/handbook), [Atlassian — ITSM overview](https://support.atlassian.com/jira-service-management-cloud/docs/discover-it-service-management-itsm/) |

## Content methodology and limits

- The lessons are original summaries written for VIDO Technology. They paraphrase concepts and link to the underlying documentation; they do not reproduce full source pages.
- Each lesson has German, English and Arabic explanations, a practical example, three review prompts, an IHK-oriented note, a glossary and source links.
- The 100 new questions are original review questions mapped ten per new skill. They are not official IHK examination questions and must not be presented as such.
- Product interfaces and command syntax can change. Always use the linked vendor documentation for current behavior, supported versions and production configuration.
- The IHK source is chamber-specific guidance, not a universal guarantee of the exact structure of every candidate's examination. Check the responsible chamber's current notices.

## Maintenance

When a source moves or a command changes, update the lesson and its question set together. Run `npm test` and review the GitHub Actions workflow before merging a content release.
