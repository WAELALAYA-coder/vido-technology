window.VIDO_LESSONS = [
  {
    "id": "windows-server-ad",
    "topic": "Windows Server & AD",
    "icon": "🗂️",
    "sources": [
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "Fachinformatikerausbildungsverordnung (FIAusbV 2020)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/4739986/0068666cf941a051b01c1e6b65a1d8f5/fachinformatiker-vo-2020-data.pdf"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      },
      {
        "label": "Microsoft Learn – Active Directory Domain Services overview",
        "url": "https://learn.microsoft.com/de-de/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview"
      },
      {
        "label": "Microsoft Learn – Windows Server DNS",
        "url": "https://learn.microsoft.com/de-de/training/modules/implement-windows-server-dns/"
      },
      {
        "label": "Microsoft Learn – Manage AD DS with PowerShell cmdlets",
        "url": "https://learn.microsoft.com/de-de/training/modules/manage-active-directory-domain-services-use-powershell-cmdlets/"
      }
    ],
    "de": {
      "title": "Windows Server & Active Directory",
      "summary": "Zentrale Benutzer-, Computer- und Rechteverwaltung in einer Windows-Domäne.",
      "sections": [
        {
          "heading": "1. Grundidee",
          "body": "Active Directory Domain Services (AD DS) ist ein Verzeichnisdienst. Er speichert Informationen zu Benutzern, Gruppen, Computern und anderen Netzwerkobjekten. Ein Unternehmen kann damit viele Windows-Geräte zentral verwalten."
        },
        {
          "heading": "2. Wichtige Bausteine",
          "body": "Ein Domain Controller stellt AD DS bereit. Eine Domain bildet den zentral verwalteten Bereich. Organizational Units (OU) strukturieren Objekte. Gruppen erleichtern die Rechtevergabe. Group Policy Objects (GPO) verteilen Einstellungen für Benutzer und Computer."
        },
        {
          "heading": "3. DNS und Anmeldung",
          "body": "DNS ist für Active Directory wichtig: Clients suchen über DNS-Einträge nach Domänendiensten und Domain Controllern. Bei einer Anmeldung wird die Identität geprüft. Ein DNS-Fehler kann deshalb so aussehen, als wäre die Domäne nicht erreichbar."
        },
        {
          "heading": "4. Administration",
          "body": "Verwaltung erfolgt über Active Directory Users and Computers, Server Manager oder PowerShell. Beispiele sind Get-ADUser zum Lesen eines Benutzerobjekts und New-ADGroup zum Erstellen einer Gruppe. Änderungen müssen dokumentiert und mit passenden Rechten durchgeführt werden."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Eine Firma hat 25 Mitarbeiter. Du legst eine OU „Support“ an, erstellst die Gruppe „GG_Support“ und fügst die passenden Benutzer hinzu. Eine GPO setzt eine gemeinsame Bildschirmsperre. Die Rechte gibst du der Gruppe statt jedem Benutzer einzeln.",
        "code": "Get-ADUser -Identity wael\nNew-ADGroup -Name \"GG_Support\" -GroupScope Global -GroupCategory Security"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Erkläre den Unterschied zwischen Domain und Workgroup.",
          "Warum muss ein Domänenclient den DNS-Server erreichen?",
          "Nenne einen Vorteil von Gruppen gegenüber Einzelberechtigungen."
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Die Themen passen zur Administration und zum Betrieb von IT-Systemen sowie zu Installation, Konfiguration und IT-Sicherheit. In der Prüfung zählt nicht nur die Definition: Begründe auch, warum DNS, Gruppen und eine saubere Rechtevergabe wichtig sind."
      },
      "terms": [
        {
          "term": "Domain Controller",
          "meaning": "Domänencontroller",
          "definition": "Server, der AD DS bereitstellt."
        },
        {
          "term": "OU",
          "meaning": "Organisationseinheit",
          "definition": "Container zur Strukturierung von Verzeichnisobjekten."
        },
        {
          "term": "GPO",
          "meaning": "Gruppenrichtlinienobjekt",
          "definition": "Zentrale Richtlinien für Benutzer und Computer."
        },
        {
          "term": "DNS",
          "meaning": "Domain Name System",
          "definition": "Löst Namen auf und hilft Clients, Domänendienste zu finden."
        }
      ]
    },
    "en": {
      "title": "Windows Server & Active Directory",
      "summary": "Central management of users, computers and permissions in a Windows domain.",
      "sections": [
        {
          "heading": "1. Core idea",
          "body": "Active Directory Domain Services (AD DS) is a directory service. It stores information about users, groups, computers and other network objects. An organization can use it to manage many Windows devices centrally."
        },
        {
          "heading": "2. Main components",
          "body": "A domain controller runs AD DS. A domain is the centrally managed boundary. Organizational Units (OUs) structure objects. Groups simplify permission assignment. Group Policy Objects (GPOs) apply settings to users and computers."
        },
        {
          "heading": "3. DNS and sign-in",
          "body": "DNS is important for Active Directory: clients use DNS records to locate domain services and domain controllers. During sign-in, the identity is verified. A DNS problem can therefore look like a domain connectivity failure."
        },
        {
          "heading": "4. Administration",
          "body": "Administration uses Active Directory Users and Computers, Server Manager or PowerShell. Examples include Get-ADUser to read a user object and New-ADGroup to create a group. Changes must be documented and performed with appropriate permissions."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "A company has 25 employees. You create an OU named Support, create a GG_Support group and add the correct users. A GPO applies a common screen-lock setting. Assign permissions to the group rather than to each user individually.",
        "code": "Get-ADUser -Identity wael\nNew-ADGroup -Name \"GG_Support\" -GroupScope Global -GroupCategory Security"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Explain the difference between a domain and a workgroup.",
          "Why must a domain client be able to reach DNS?",
          "Give one advantage of groups over individual permissions."
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "These topics support IT-system administration, operation, installation, configuration and security. In an exam, do more than define terms: explain why DNS, groups and controlled permissions matter."
      },
      "terms": [
        {
          "term": "Domain Controller",
          "meaning": "Domain controller",
          "definition": "A server that provides AD DS."
        },
        {
          "term": "OU",
          "meaning": "Organizational Unit",
          "definition": "A container used to structure directory objects."
        },
        {
          "term": "GPO",
          "meaning": "Group Policy Object",
          "definition": "Central policies for users and computers."
        },
        {
          "term": "DNS",
          "meaning": "Domain Name System",
          "definition": "Resolves names and helps clients locate domain services."
        }
      ]
    },
    "ar": {
      "title": "Windows Server وActive Directory",
      "summary": "إدارة مركزية للمستخدمين والأجهزة والصلاحيات ضمن Windows Domain.",
      "sections": [
        {
          "heading": "1. الفكرة الأساسية",
          "body": "‏Active Directory Domain Services أو AD DS هي خدمة دليل تخزن معلومات المستخدمين والمجموعات وأجهزة الكمبيوتر وعناصر الشبكة. تستخدمها الشركة لإدارة عدد كبير من أجهزة Windows من مكان مركزي."
        },
        {
          "heading": "2. المكوّنات المهمة",
          "body": "يشغّل Domain Controller خدمة AD DS. يشكّل Domain نطاق الإدارة المركزية. تنظّم Organizational Units أو OU العناصر. تساعد Groups في توزيع الصلاحيات. وتطبّق Group Policy Objects أو GPO إعدادات موحدة على المستخدمين والأجهزة."
        },
        {
          "heading": "3. علاقة DNS بتسجيل الدخول",
          "body": "يحتاج Active Directory إلى DNS حتى يجد جهاز المستخدم خدمات الدومين وDomain Controller. أثناء تسجيل الدخول يتم التحقق من هوية المستخدم. لذلك قد يؤدي عطل DNS إلى ظهور مشكلة وكأن الدومين غير متصل."
        },
        {
          "heading": "4. الإدارة العملية",
          "body": "يمكن الإدارة عبر Active Directory Users and Computers أو Server Manager أو PowerShell. مثال: Get-ADUser لقراءة معلومات مستخدم وNew-ADGroup لإنشاء مجموعة. يجب توثيق التغييرات واستخدام الصلاحيات المناسبة."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "شركة فيها 25 موظفاً. تنشئ OU باسم Support، ثم مجموعة GG_Support وتضيف إليها المستخدمين المناسبين. تنشئ GPO لتطبيق قفل الشاشة. تمنح الصلاحيات للمجموعة بدلاً من ضبط كل مستخدم بشكل منفصل.",
        "code": "Get-ADUser -Identity wael\nNew-ADGroup -Name \"GG_Support\" -GroupScope Global -GroupCategory Security"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اشرح الفرق بين Domain وWorkgroup.",
          "لماذا يجب أن يصل جهاز الدومين إلى DNS؟",
          "اذكر فائدة استخدام Groups بدلاً من منح الصلاحيات لكل مستخدم منفرداً."
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "تدعم هذه الموضوعات مجال إدارة وتشغيل أنظمة IT وتركيبها وتهيئتها وتأمينها. في الامتحان لا تكتفِ بالتعريف؛ اشرح لماذا DNS والمجموعات وتوزيع الصلاحيات المنضبط أمور مهمة."
      },
      "terms": [
        {
          "term": "Domain Controller",
          "meaning": "خادم الدومين",
          "definition": "خادم يقدم خدمة AD DS."
        },
        {
          "term": "OU",
          "meaning": "وحدة تنظيمية",
          "definition": "حاوية لتنظيم عناصر Active Directory."
        },
        {
          "term": "GPO",
          "meaning": "كائن سياسة المجموعة",
          "definition": "سياسات مركزية للمستخدمين والأجهزة."
        },
        {
          "term": "DNS",
          "meaning": "نظام أسماء النطاقات",
          "definition": "يحوّل الأسماء ويساعد الأجهزة على إيجاد خدمات الدومين."
        }
      ]
    }
  },
  {
    "id": "linux-admin",
    "topic": "Linux Administration",
    "icon": "🐧",
    "sources": [
      {
        "label": "Ubuntu Server documentation",
        "url": "https://ubuntu.com/server/docs/"
      },
      {
        "label": "Ubuntu Server – Security",
        "url": "https://ubuntu.com/server/docs/how-to/security/"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "Linux-Server administrieren",
      "summary": "Dateisystem, Benutzer, Rechte, Dienste, Pakete und Protokolle sicher verwalten.",
      "sections": [
        {
          "heading": "1. Linux-Grundlagen",
          "body": "Linux ist ein Betriebssystemkern. Distributionen wie Ubuntu Server verbinden den Kernel mit Werkzeugen und Paketverwaltung. Viele Server werden über eine Shell administriert. Du solltest Pfade, Benutzer, Gruppen und Dienste verstehen."
        },
        {
          "heading": "2. Dateisystem und Rechte",
          "body": "Wichtige Verzeichnisse sind /etc für Konfiguration, /var/log für Protokolle, /home für Benutzerdateien und /root für das Home-Verzeichnis von root. Rechte bestehen aus Lesen (r=4), Schreiben (w=2) und Ausführen (x=1) für Besitzer, Gruppe und andere."
        },
        {
          "heading": "3. Dienste und Pakete",
          "body": "systemd verwaltet viele Dienste. systemctl status ssh zeigt den Zustand des SSH-Dienstes. journalctl -u ssh zeigt passende Journal-Einträge. apt update aktualisiert Paketlisten; apt upgrade installiert verfügbare Aktualisierungen."
        },
        {
          "heading": "4. Sicherer Betrieb",
          "body": "Nutze sudo nur für Aufgaben, die erhöhte Rechte benötigen. Arbeite möglichst nicht dauerhaft als root. Halte Pakete aktuell, beschränke SSH-Zugriffe, verwende Schlüssel und prüfe Logs bei Fehlern. Ändere Konfigurationsdateien kontrolliert."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Ein Ubuntu-Server stellt eine interne Webanwendung bereit. Du prüfst zuerst den Dienststatus, kontrollierst danach die Logs und erst dann änderst du die Konfiguration. Nach einer Änderung testest du den Dienst erneut.",
        "code": "sudo systemctl status nginx\nsudo journalctl -u nginx --since today\nsudo systemctl reload nginx"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Was ist der Unterschied zwischen /etc und /var/log?",
          "Welche Rechte bedeutet chmod 750?",
          "Welche zwei Befehle nutzt du, um Dienststatus und Dienstprotokoll zu prüfen?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Wichtige Kompetenzen sind Betrieb, Administration, Fehleranalyse und IT-Sicherheit. Beschreibe bei einer Störung die Reihenfolge: Status prüfen, Logs lesen, Ursache eingrenzen, kontrolliert ändern und Ergebnis dokumentieren."
      },
      "terms": [
        {
          "term": "Shell",
          "meaning": "واجهة الأوامر",
          "definition": "Umgebung zur Eingabe von Befehlen."
        },
        {
          "term": "sudo",
          "meaning": "تنفيذ بصلاحيات أعلى",
          "definition": "Führt erlaubte Befehle mit erhöhten Rechten aus."
        },
        {
          "term": "systemd",
          "meaning": "مدير الخدمات",
          "definition": "Startet und verwaltet Systemdienste."
        },
        {
          "term": "journalctl",
          "meaning": "عارض السجلات",
          "definition": "Liest Meldungen aus dem systemd-Journal."
        }
      ]
    },
    "en": {
      "title": "Linux server administration",
      "summary": "Manage filesystems, users, permissions, services, packages and logs safely.",
      "sections": [
        {
          "heading": "1. Linux basics",
          "body": "Linux is an operating-system kernel. Distributions such as Ubuntu Server combine the kernel with tools and package management. Many servers are administered through a shell. You should understand paths, users, groups and services."
        },
        {
          "heading": "2. Filesystem and permissions",
          "body": "Important directories include /etc for configuration, /var/log for logs, /home for user files and /root for the root user's home directory. Permissions use read (r=4), write (w=2) and execute (x=1) for owner, group and others."
        },
        {
          "heading": "3. Services and packages",
          "body": "systemd manages many services. systemctl status ssh shows the SSH service state. journalctl -u ssh shows related journal entries. apt update refreshes package lists; apt upgrade installs available updates."
        },
        {
          "heading": "4. Secure operation",
          "body": "Use sudo only when elevated rights are needed. Avoid working as root all the time. Keep packages updated, restrict SSH access, use keys and inspect logs when failures occur. Change configuration files in a controlled way."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "An Ubuntu server hosts an internal web application. First check the service state, then inspect its logs, and only then change the configuration. Test the service again after the change.",
        "code": "sudo systemctl status nginx\nsudo journalctl -u nginx --since today\nsudo systemctl reload nginx"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "What is the difference between /etc and /var/log?",
          "Which permissions does chmod 750 represent?",
          "Which two commands check a service's state and logs?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Important skills include operation, administration, troubleshooting and IT security. During an incident, explain the sequence: check status, read logs, isolate the cause, make a controlled change and document the result."
      },
      "terms": [
        {
          "term": "Shell",
          "meaning": "Command-line interface",
          "definition": "An environment for entering commands."
        },
        {
          "term": "sudo",
          "meaning": "Elevated execution",
          "definition": "Runs permitted commands with elevated privileges."
        },
        {
          "term": "systemd",
          "meaning": "Service manager",
          "definition": "Starts and manages system services."
        },
        {
          "term": "journalctl",
          "meaning": "Log viewer",
          "definition": "Reads messages from the systemd journal."
        }
      ]
    },
    "ar": {
      "title": "إدارة خوادم Linux",
      "summary": "إدارة الملفات والمستخدمين والصلاحيات والخدمات والحزم والسجلات بأمان.",
      "sections": [
        {
          "heading": "1. أساسيات Linux",
          "body": "Linux هو نواة نظام تشغيل. توزيعات مثل Ubuntu Server تجمع النواة مع الأدوات ومدير الحزم. تتم إدارة كثير من الخوادم عن طريق Shell. من المهم فهم المسارات والمستخدمين والمجموعات والخدمات."
        },
        {
          "heading": "2. نظام الملفات والصلاحيات",
          "body": "المجلد /etc يحتوي إعدادات النظام، و/var/log يحتوي السجلات، و/home يحتوي ملفات المستخدمين، و/root هو مجلد المستخدم root. الصلاحيات: قراءة r=4، كتابة w=2، تنفيذ x=1، وتُحدد للمالك والمجموعة والآخرين."
        },
        {
          "heading": "3. الخدمات والحزم",
          "body": "يدير systemd كثيراً من الخدمات. يعرض systemctl status ssh حالة خدمة SSH. ويعرض journalctl -u ssh سجلاتها. يقوم apt update بتحديث قوائم الحزم، بينما apt upgrade يثبت التحديثات المتاحة."
        },
        {
          "heading": "4. التشغيل الآمن",
          "body": "استخدم sudo فقط عند الحاجة إلى صلاحيات مرتفعة، ولا تعمل دائماً كمستخدم root. حدّث الحزم، وقيّد الوصول إلى SSH، واستخدم المفاتيح، وافحص السجلات عند حدوث مشكلة. غيّر ملفات الإعداد بطريقة منظمة."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "خادم Ubuntu يشغّل تطبيق ويب داخلياً. افحص أولاً حالة الخدمة، ثم اقرأ السجلات، وبعدها فقط عدّل الإعدادات. بعد التغيير اختبر الخدمة من جديد.",
        "code": "sudo systemctl status nginx\nsudo journalctl -u nginx --since today\nsudo systemctl reload nginx"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "ما الفرق بين /etc و/var/log؟",
          "ما الصلاحيات التي تعنيها chmod 750؟",
          "ما الأمران اللذان تستخدمهما لفحص حالة الخدمة وسجلاتها؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "من المهارات المهمة تشغيل الأنظمة وإدارتها وتحليل الأعطال وأمن المعلومات. عند شرح عطل، اذكر الترتيب: فحص الحالة، قراءة السجلات، تحديد السبب، تغيير مضبوط، ثم توثيق النتيجة."
      },
      "terms": [
        {
          "term": "Shell",
          "meaning": "واجهة سطر الأوامر",
          "definition": "بيئة لإدخال الأوامر."
        },
        {
          "term": "sudo",
          "meaning": "تنفيذ بصلاحيات مرتفعة",
          "definition": "يشغّل الأوامر المسموح بها بصلاحيات إضافية."
        },
        {
          "term": "systemd",
          "meaning": "مدير الخدمات",
          "definition": "يشغّل خدمات النظام ويديرها."
        },
        {
          "term": "journalctl",
          "meaning": "عارض السجلات",
          "definition": "يقرأ رسائل systemd Journal."
        }
      ]
    }
  },
  {
    "id": "powershell-bash",
    "topic": "PowerShell & Bash",
    "icon": "⌨️",
    "sources": [
      {
        "label": "Microsoft Learn – Windows commands and shells",
        "url": "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands"
      },
      {
        "label": "Microsoft Learn – Manage AD DS with PowerShell cmdlets",
        "url": "https://learn.microsoft.com/de-de/training/modules/manage-active-directory-domain-services-use-powershell-cmdlets/"
      },
      {
        "label": "Ubuntu Server documentation",
        "url": "https://ubuntu.com/server/docs/"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      }
    ],
    "de": {
      "title": "PowerShell & Bash für Administratoren",
      "summary": "Wiederkehrende Verwaltungsaufgaben mit Shell-Befehlen und kleinen Skripten automatisieren.",
      "sections": [
        {
          "heading": "1. Shell und Cmdlets",
          "body": "PowerShell ist eine Shell und Skriptsprache. Cmdlets folgen oft dem Muster Verb-Noun, zum Beispiel Get-Service. Mit Get-Help liest du die Hilfe und mit Get-Command findest du verfügbare Befehle."
        },
        {
          "heading": "2. Die PowerShell-Pipeline",
          "body": "Die Pipeline verbindet Befehle mit dem Zeichen |. PowerShell übergibt dabei strukturierte Objekte mit Eigenschaften. Where-Object filtert Objekte, Select-Object wählt Eigenschaften aus und Sort-Object sortiert Ergebnisse."
        },
        {
          "heading": "3. Bash-Grundbefehle",
          "body": "Unter Linux helfen pwd, ls, cd und grep bei der täglichen Arbeit. > leitet Ausgaben in eine Datei um und überschreibt sie normalerweise. >> hängt Ausgaben an. Prüfe vor dem Ausführen, wohin Ausgaben geschrieben werden."
        },
        {
          "heading": "4. Sorgfältig automatisieren",
          "body": "Beginne mit lesenden Befehlen. Teste Skripte zuerst in einer Testumgebung. Nutze aussagekräftige Variablennamen, prüfe Fehler und protokolliere wichtige Änderungen. Vermeide destruktive Befehle ohne klare Kontrolle."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Du möchtest unter Windows nur laufende Dienste anzeigen. Die Pipeline filtert die Service-Objekte nach ihrem Status.",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'}\nGet-NetIPConfiguration"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Warum ist PowerShells Pipeline mehr als eine einfache Textweiterleitung?",
          "Welches Cmdlet zeigt die Hilfe?",
          "Was ist der Unterschied zwischen > und >> in Bash?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Automatisierung spart Zeit und macht Abläufe reproduzierbar. Erkläre aber auch Risiken: falsche Filter, zu hohe Rechte, fehlende Fehlerbehandlung und nicht dokumentierte Änderungen."
      },
      "terms": [
        {
          "term": "Cmdlet",
          "meaning": "أمر PowerShell",
          "definition": "Befehl mit Verb-Noun-Namensmuster."
        },
        {
          "term": "Pipeline",
          "meaning": "خط أنابيب الأوامر",
          "definition": "Verbindet Befehle zur Weitergabe von Objekten."
        },
        {
          "term": "Variable",
          "meaning": "متغير",
          "definition": "Speichert einen Wert für die weitere Verarbeitung."
        },
        {
          "term": "Script",
          "meaning": "سكريبت",
          "definition": "Datei mit mehreren automatisierten Befehlen."
        }
      ]
    },
    "en": {
      "title": "PowerShell & Bash for administrators",
      "summary": "Automate recurring administration tasks with shell commands and small scripts.",
      "sections": [
        {
          "heading": "1. Shell and cmdlets",
          "body": "PowerShell is a shell and scripting language. Cmdlets often follow the Verb-Noun pattern, for example Get-Service. Use Get-Help to read help and Get-Command to find available commands."
        },
        {
          "heading": "2. The PowerShell pipeline",
          "body": "The pipeline connects commands with the | symbol. PowerShell passes structured objects with properties. Where-Object filters objects, Select-Object selects properties and Sort-Object sorts results."
        },
        {
          "heading": "3. Bash essentials",
          "body": "On Linux, pwd, ls, cd and grep help with daily work. > redirects output to a file and normally overwrites it. >> appends output. Check the destination before running a command."
        },
        {
          "heading": "4. Automate carefully",
          "body": "Start with read-only commands. Test scripts in a lab first. Use clear variable names, check errors and log important changes. Avoid destructive commands without careful review."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "You want to display only running Windows services. The pipeline filters service objects by their status.",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'}\nGet-NetIPConfiguration"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Why is the PowerShell pipeline more than simple text forwarding?",
          "Which cmdlet displays help?",
          "What is the difference between > and >> in Bash?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Automation saves time and makes processes repeatable. Also explain the risks: incorrect filters, excessive privileges, missing error handling and undocumented changes."
      },
      "terms": [
        {
          "term": "Cmdlet",
          "meaning": "PowerShell command",
          "definition": "A command that often follows a Verb-Noun pattern."
        },
        {
          "term": "Pipeline",
          "meaning": "Command pipeline",
          "definition": "Connects commands and passes objects."
        },
        {
          "term": "Variable",
          "meaning": "Variable",
          "definition": "Stores a value for later processing."
        },
        {
          "term": "Script",
          "meaning": "Script",
          "definition": "A file containing multiple automated commands."
        }
      ]
    },
    "ar": {
      "title": "PowerShell وBash للمسؤولين",
      "summary": "أتمتة مهام الإدارة المتكررة باستخدام الأوامر والسكريبتات الصغيرة.",
      "sections": [
        {
          "heading": "1. Shell وCmdlets",
          "body": "PowerShell هي واجهة أوامر ولغة سكريبت. غالباً تتبع Cmdlets نمط Verb-Noun مثل Get-Service. استخدم Get-Help لقراءة المساعدة وGet-Command للعثور على الأوامر المتاحة."
        },
        {
          "heading": "2. PowerShell Pipeline",
          "body": "تربط Pipeline الأوامر باستخدام الرمز |. تمرر PowerShell كائنات منظمة لها خصائص، وليس نصاً فقط. يقوم Where-Object بالتصفية وSelect-Object باختيار الخصائص وSort-Object بالترتيب."
        },
        {
          "heading": "3. أساسيات Bash",
          "body": "في Linux تساعد أوامر pwd وls وcd وgrep في العمل اليومي. يوجه الرمز > الخرج إلى ملف ويستبدل محتواه عادةً، بينما يضيف >> الخرج إلى نهاية الملف. افحص المسار قبل تنفيذ الأمر."
        },
        {
          "heading": "4. أتمتة بحذر",
          "body": "ابدأ بالأوامر التي تقرأ المعلومات فقط. اختبر السكريبت في بيئة تجريبية. استخدم أسماء متغيرات واضحة، وافحص الأخطاء، وسجّل التغييرات المهمة. لا تستخدم أوامر مدمرة دون مراجعة."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "تريد عرض خدمات Windows التي تعمل فقط. تقوم Pipeline بتصفية كائنات الخدمات حسب الحالة.",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'}\nGet-NetIPConfiguration"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "لماذا تعتبر PowerShell Pipeline أكثر من مجرد نقل نص؟",
          "أي Cmdlet يعرض المساعدة؟",
          "ما الفرق بين > و >> في Bash؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "توفر الأتمتة الوقت وتجعل الخطوات قابلة للتكرار. اشرح أيضاً المخاطر: فلتر خاطئ، صلاحيات زائدة، غياب معالجة الأخطاء أو عدم توثيق التغييرات."
      },
      "terms": [
        {
          "term": "Cmdlet",
          "meaning": "أمر PowerShell",
          "definition": "أمر يتبع غالباً نمط Verb-Noun."
        },
        {
          "term": "Pipeline",
          "meaning": "سلسلة أوامر",
          "definition": "تربط الأوامر وتنقل بينها كائنات."
        },
        {
          "term": "Variable",
          "meaning": "متغير",
          "definition": "يخزن قيمة لاستخدامها لاحقاً."
        },
        {
          "term": "Script",
          "meaning": "سكريبت",
          "definition": "ملف يحتوي عدة أوامر مؤتمتة."
        }
      ]
    }
  },
  {
    "id": "virtualization-hyperv",
    "topic": "Virtualization & Hyper-V",
    "icon": "🖥️",
    "sources": [
      {
        "label": "Microsoft Learn – Hyper-V overview",
        "url": "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/overview"
      },
      {
        "label": "Microsoft Learn – Install Hyper-V",
        "url": "https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/get-started/install-hyper-v"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "Virtualisierung und Hyper-V",
      "summary": "Virtuelle Maschinen, Hypervisoren, virtuelle Switches und Checkpoints verstehen.",
      "sections": [
        {
          "heading": "1. Was ist Virtualisierung?",
          "body": "Virtualisierung teilt die Ressourcen eines physischen Hosts auf mehrere virtuelle Maschinen auf. Jede VM erhält virtuelle CPU-, RAM-, Speicher- und Netzwerkressourcen und kann ein eigenes Gastbetriebssystem ausführen."
        },
        {
          "heading": "2. Hypervisor und VM",
          "body": "Ein Hypervisor verwaltet die virtuellen Maschinen. Hyper-V ist Microsofts Virtualisierungslösung und verwendet eine Typ-1-Architektur. Der Host stellt Hardware-Ressourcen bereit, die VM führt das Gastbetriebssystem aus."
        },
        {
          "heading": "3. Virtuelle Switches",
          "body": "Ein externer Switch verbindet VMs mit dem physischen Netzwerk. Ein interner Switch verbindet VMs untereinander und mit dem Host. Ein privater Switch verbindet nur VMs auf demselben Host."
        },
        {
          "heading": "4. Speicher und Checkpoints",
          "body": "Virtuelle Festplatten werden zum Beispiel als VHDX gespeichert. Checkpoints helfen, einen früheren VM-Zustand wiederherzustellen. Sie ersetzen kein unabhängiges Backup: Die VM-Daten müssen zusätzlich gesichert und die Wiederherstellung getestet werden."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Du testest Windows Server in einer VM. Für Internetzugriff verwendest du einen externen virtuellen Switch. Für ein isoliertes Lab verwendest du einen privaten Switch. Vor größeren Änderungen planst du eine geeignete Sicherung.",
        "code": "Get-VM\nGet-VMSwitch\nGet-VMNetworkAdapter -VMName \"Test-Server\""
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Unterscheide externen, internen und privaten vSwitch.",
          "Warum ist ein Checkpoint kein vollständiges Backup?",
          "Nenne drei Ressourcen, die ein Host einer VM bereitstellt."
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Virtualisierung unterstützt die Planung und Realisierung von IT-Systemen. Begründe die Auswahl anhand von Isolation, Ressourcenbedarf, Netzwerkzugriff, Verfügbarkeit und Wiederherstellung."
      },
      "terms": [
        {
          "term": "Hypervisor",
          "meaning": "مدير الآلات الافتراضية",
          "definition": "Schicht, die virtuelle Maschinen ausführt und verwaltet."
        },
        {
          "term": "Host",
          "meaning": "الجهاز المضيف",
          "definition": "Physischer Computer, der VMs bereitstellt."
        },
        {
          "term": "Guest OS",
          "meaning": "نظام التشغيل الضيف",
          "definition": "Betriebssystem innerhalb einer VM."
        },
        {
          "term": "VHDX",
          "meaning": "قرص افتراضي",
          "definition": "Dateiformat für virtuelle Hyper-V-Festplatten."
        }
      ]
    },
    "en": {
      "title": "Virtualization and Hyper-V",
      "summary": "Understand virtual machines, hypervisors, virtual switches and checkpoints.",
      "sections": [
        {
          "heading": "1. What is virtualization?",
          "body": "Virtualization divides the resources of a physical host among multiple virtual machines. Each VM receives virtual CPU, RAM, storage and network resources and can run its own guest operating system."
        },
        {
          "heading": "2. Hypervisor and VM",
          "body": "A hypervisor manages virtual machines. Hyper-V is Microsoft's virtualization solution and uses a type-1 architecture. The host provides hardware resources while the VM runs its guest operating system."
        },
        {
          "heading": "3. Virtual switches",
          "body": "An external switch connects VMs to the physical network. An internal switch connects VMs to each other and to the host. A private switch connects only VMs on the same host."
        },
        {
          "heading": "4. Storage and checkpoints",
          "body": "Virtual disks can be stored as VHDX files. Checkpoints help return a VM to an earlier state. They do not replace independent backups: VM data must also be backed up and recovery must be tested."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "You test Windows Server in a VM. Use an external virtual switch for internet access and a private switch for an isolated lab. Plan a suitable backup before major changes.",
        "code": "Get-VM\nGet-VMSwitch\nGet-VMNetworkAdapter -VMName \"Test-Server\""
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Compare external, internal and private virtual switches.",
          "Why is a checkpoint not a full backup?",
          "Name three resources a host provides to a VM."
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Virtualization supports IT-system design and implementation. Justify a choice using isolation, resource requirements, network access, availability and recovery."
      },
      "terms": [
        {
          "term": "Hypervisor",
          "meaning": "Virtual machine monitor",
          "definition": "The layer that runs and manages virtual machines."
        },
        {
          "term": "Host",
          "meaning": "Host machine",
          "definition": "The physical computer that provides VMs."
        },
        {
          "term": "Guest OS",
          "meaning": "Guest operating system",
          "definition": "The operating system inside a VM."
        },
        {
          "term": "VHDX",
          "meaning": "Virtual disk",
          "definition": "File format for Hyper-V virtual disks."
        }
      ]
    },
    "ar": {
      "title": "Virtualisierung وHyper-V",
      "summary": "فهم الآلات الافتراضية وHypervisor وVirtual Switch وCheckpoints.",
      "sections": [
        {
          "heading": "1. ما هي Virtualisierung؟",
          "body": "تقسم Virtualisierung موارد جهاز Host الفيزيائي على عدة Virtual Machines. تحصل كل VM على موارد CPU وRAM وتخزين وشبكة افتراضية، ويمكنها تشغيل نظام تشغيل Guest خاص بها."
        },
        {
          "heading": "2. Hypervisor وVM",
          "body": "يدير Hypervisor الآلات الافتراضية. Hyper-V هو حل Microsoft ويستخدم بنية من النوع الأول Type 1. يوفر Host موارد العتاد، بينما تشغّل VM نظام التشغيل الضيف."
        },
        {
          "heading": "3. أنواع Virtual Switch",
          "body": "يربط External Switch الآلات الافتراضية بالشبكة الفيزيائية. يربط Internal Switch الآلات الافتراضية ببعضها وبـ Host. أما Private Switch فيسمح بالاتصال بين VMs الموجودة على Host نفسه فقط."
        },
        {
          "heading": "4. الأقراص وCheckpoints",
          "body": "يمكن حفظ الأقراص الافتراضية بتنسيق VHDX. تساعد Checkpoints على الرجوع إلى حالة سابقة للآلة الافتراضية، لكنها لا تستبدل Backup مستقلاً. يجب نسخ بيانات VM احتياطياً واختبار الاستعادة."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "تختبر Windows Server داخل VM. تستخدم External Switch للاتصال بالإنترنت، وPrivate Switch لمختبر معزول. خطط لنسخة احتياطية مناسبة قبل التغييرات الكبيرة.",
        "code": "Get-VM\nGet-VMSwitch\nGet-VMNetworkAdapter -VMName \"Test-Server\""
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اشرح الفرق بين External وInternal وPrivate vSwitch.",
          "لماذا لا يعتبر Checkpoint نسخة Backup كاملة؟",
          "اذكر ثلاثة موارد يوفرها Host للـ VM."
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "تدعم Virtualisierung تخطيط أنظمة IT وتنفيذها. برر اختيارك بحسب العزل والموارد والاتصال الشبكي والتوافر وإمكانية الاستعادة."
      },
      "terms": [
        {
          "term": "Hypervisor",
          "meaning": "مدير الآلات الافتراضية",
          "definition": "طبقة تشغّل الآلات الافتراضية وتديرها."
        },
        {
          "term": "Host",
          "meaning": "الجهاز المضيف",
          "definition": "الكمبيوتر الفيزيائي الذي يوفر موارد VMs."
        },
        {
          "term": "Guest OS",
          "meaning": "نظام التشغيل الضيف",
          "definition": "نظام التشغيل داخل VM."
        },
        {
          "term": "VHDX",
          "meaning": "قرص افتراضي",
          "definition": "تنسيق ملفات أقراص Hyper-V الافتراضية."
        }
      ]
    }
  },
  {
    "id": "docker-containers",
    "topic": "Docker & Containers",
    "icon": "🐳",
    "sources": [
      {
        "label": "Docker Docs – Get started with Docker",
        "url": "https://docs.docker.com/get-started/"
      },
      {
        "label": "Docker Docs – Docker architecture overview",
        "url": "https://docs.docker.com/get-started/docker-overview/"
      },
      {
        "label": "Docker Docs – Docker Compose",
        "url": "https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-docker-compose/"
      },
      {
        "label": "Docker Docs – Volumes",
        "url": "https://docs.docker.com/engine/storage/volumes/"
      },
      {
        "label": "Docker Docs – Networking overview",
        "url": "https://docs.docker.com/engine/network/"
      },
      {
        "label": "Docker Docs – Rootless mode",
        "url": "https://docs.docker.com/engine/security/rootless/"
      }
    ],
    "de": {
      "title": "Docker und Container",
      "summary": "Images, Container, Volumes, Netzwerke und Docker Compose im Alltag nutzen.",
      "sections": [
        {
          "heading": "1. Image und Container",
          "body": "Ein Image ist die Vorlage mit Anwendung und benötigten Dateien. Ein Container ist eine gestartete, isolierte Instanz eines Images. Mehrere Container können dieselbe Image-Vorlage verwenden."
        },
        {
          "heading": "2. Daten speichern",
          "body": "Daten in der beschreibbaren Container-Schicht gehen beim Entfernen des Containers verloren. Ein Volume speichert Daten unabhängig vom Container. Ein Bind Mount verbindet einen Ordner des Hosts mit einem Pfad im Container."
        },
        {
          "heading": "3. Netzwerke und Ports",
          "body": "Container können über Docker-Netzwerke miteinander sprechen. Benutzerdefinierte Bridge-Netzwerke ermöglichen Namensauflösung zwischen Containern. Eine Portfreigabe wie 8080:80 verbindet Host-Port 8080 mit Container-Port 80."
        },
        {
          "heading": "4. Compose und Sicherheit",
          "body": "Docker Compose beschreibt mehrere Services in einer YAML-Datei und startet sie gemeinsam. Für den Betrieb sind Logs, Healthchecks, begrenzte Rechte, aktuelle Images und ein sicherer Umgang mit Secrets wichtig."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Eine Webanwendung und eine Datenbank laufen in getrennten Containern. Compose verbindet beide über ein internes Netzwerk. Die Datenbank speichert ihre Daten in einem Volume, damit sie Container-Neustarts überstehen.",
        "code": "docker compose up -d\ndocker ps\ndocker logs vido-app\ndocker volume ls"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Erkläre Image und Container in einem Satz.",
          "Warum speichert eine Datenbank ihre Daten in einem Volume?",
          "Was bedeutet die Portzuordnung 8080:80?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Containerisierung ist ein mögliches Mittel zur Realisierung von IT-Systemen. Erkläre Architektur, Netzwerktrennung, dauerhafte Daten, Rechte und Wiederherstellung. Unterscheide Container von vollständigen virtuellen Maschinen."
      },
      "terms": [
        {
          "term": "Image",
          "meaning": "صورة جاهزة",
          "definition": "Vorlage, aus der ein Container erstellt wird."
        },
        {
          "term": "Container",
          "meaning": "حاوية",
          "definition": "Laufende isolierte Instanz eines Images."
        },
        {
          "term": "Volume",
          "meaning": "مساحة تخزين",
          "definition": "Persistenter Docker-Datenspeicher."
        },
        {
          "term": "Compose",
          "meaning": "إدارة عدة خدمات",
          "definition": "Definiert und startet mehrere Services gemeinsam."
        }
      ]
    },
    "en": {
      "title": "Docker and containers",
      "summary": "Use images, containers, volumes, networks and Docker Compose in daily operations.",
      "sections": [
        {
          "heading": "1. Image and container",
          "body": "An image is a template containing an application and its required files. A container is a started, isolated instance of an image. Multiple containers can use the same image template."
        },
        {
          "heading": "2. Persisting data",
          "body": "Data in a container's writable layer is lost when the container is removed. A volume stores data independently of the container. A bind mount connects a host directory to a path inside the container."
        },
        {
          "heading": "3. Networks and ports",
          "body": "Containers communicate through Docker networks. User-defined bridge networks provide name resolution between containers. A port mapping such as 8080:80 connects host port 8080 to container port 80."
        },
        {
          "heading": "4. Compose and security",
          "body": "Docker Compose describes multiple services in one YAML file and starts them together. Operations require logs, health checks, limited privileges, updated images and safe handling of secrets."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "A web application and a database run in separate containers. Compose connects them through an internal network. The database stores data in a volume so data survives container recreation.",
        "code": "docker compose up -d\ndocker ps\ndocker logs vido-app\ndocker volume ls"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Explain image and container in one sentence.",
          "Why should a database store its data in a volume?",
          "What does the port mapping 8080:80 mean?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Containerization can be used to implement IT systems. Explain architecture, network separation, persistent data, permissions and recovery. Distinguish containers from full virtual machines."
      },
      "terms": [
        {
          "term": "Image",
          "meaning": "Image template",
          "definition": "A template used to create containers."
        },
        {
          "term": "Container",
          "meaning": "Container",
          "definition": "A running isolated instance of an image."
        },
        {
          "term": "Volume",
          "meaning": "Persistent storage",
          "definition": "Docker-managed persistent data store."
        },
        {
          "term": "Compose",
          "meaning": "Multi-service management",
          "definition": "Defines and starts multiple services together."
        }
      ]
    },
    "ar": {
      "title": "Docker وContainers",
      "summary": "استخدام Images وContainers وVolumes والشبكات وDocker Compose في العمل اليومي.",
      "sections": [
        {
          "heading": "1. الفرق بين Image وContainer",
          "body": "Image هي قالب يحتوي التطبيق والملفات المطلوبة. أما Container فهو نسخة تشغيل معزولة من Image. يمكن تشغيل عدة Containers من نفس القالب."
        },
        {
          "heading": "2. حفظ البيانات",
          "body": "البيانات الموجودة في طبقة الكتابة الخاصة بـ Container تضيع عند حذف الحاوية. أما Volume فيحفظ البيانات بشكل مستقل. ويربط Bind Mount مجلداً من Host بمسار داخل Container."
        },
        {
          "heading": "3. الشبكات والمنافذ",
          "body": "تتواصل الحاويات عبر Docker Networks. تسمح User-defined Bridge Networks بحل أسماء الحاويات تلقائياً. ربط 8080:80 يعني أن Host Port 8080 يتصل بـ Container Port 80."
        },
        {
          "heading": "4. Compose والأمان",
          "body": "يصف Docker Compose عدة Services في ملف YAML ويشغّلها معاً. يحتاج التشغيل إلى مراجعة Logs وHealthchecks وتقييد الصلاحيات وتحديث Images وحماية Secrets."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "يعمل تطبيق الويب وقاعدة البيانات في Containerين منفصلين. يربط Compose بينهما عبر شبكة داخلية. تحفظ قاعدة البيانات بياناتها في Volume حتى تبقى بعد إعادة إنشاء Container.",
        "code": "docker compose up -d\ndocker ps\ndocker logs vido-app\ndocker volume ls"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اشرح الفرق بين Image وContainer بجملة واحدة.",
          "لماذا تحفظ قاعدة البيانات معلوماتها في Volume؟",
          "ماذا يعني ربط المنفذ 8080:80؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "يمكن استخدام Containerization لتنفيذ أنظمة IT. اشرح البنية وعزل الشبكة واستمرارية البيانات والصلاحيات والاستعادة. وميّز بين Container والآلة الافتراضية الكاملة."
      },
      "terms": [
        {
          "term": "Image",
          "meaning": "قالب جاهز",
          "definition": "قالب يتم إنشاء Container منه."
        },
        {
          "term": "Container",
          "meaning": "حاوية",
          "definition": "نسخة تشغيل معزولة من Image."
        },
        {
          "term": "Volume",
          "meaning": "تخزين دائم",
          "definition": "آلية تخزين بيانات Docker بشكل مستمر."
        },
        {
          "term": "Compose",
          "meaning": "إدارة عدة خدمات",
          "definition": "يعرّف عدة Services ويشغّلها معاً."
        }
      ]
    }
  },
  {
    "id": "it-security",
    "topic": "IT Security",
    "icon": "🔐",
    "sources": [
      {
        "label": "BSI – IT-Grundschutz-Kompendium, Edition 2023",
        "url": "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Grundschutz/IT-GS-Kompendium/IT_Grundschutz_Kompendium_Edition2023.pdf?__blob=publicationFile&v=4"
      },
      {
        "label": "Ubuntu Server – Security",
        "url": "https://ubuntu.com/server/docs/how-to/security/"
      },
      {
        "label": "Microsoft Learn – Shared responsibility in the cloud",
        "url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "IT-Sicherheit im Betrieb",
      "summary": "Schutzziele, Zugriffe, MFA, Verschlüsselung, Updates und Netzwerkschutz.",
      "sections": [
        {
          "heading": "1. Die CIA-Schutzziele",
          "body": "Vertraulichkeit schützt Daten vor unbefugtem Lesen. Integrität schützt vor unbemerkter oder unzulässiger Veränderung. Verfügbarkeit bedeutet, dass Systeme und Informationen bei Bedarf nutzbar sind."
        },
        {
          "heading": "2. Identitäten und Rechte",
          "body": "Das Prinzip Least Privilege gibt Benutzern nur die Rechte, die sie benötigen. MFA kombiniert unterschiedliche Nachweise, zum Beispiel Passwort und Sicherheitsschlüssel. Konten müssen bei Rollenwechsel oder Austritt angepasst oder deaktiviert werden."
        },
        {
          "heading": "3. Netzwerk und Verschlüsselung",
          "body": "Firewalls erlauben oder blockieren Verkehr anhand von Regeln. Netzsegmentierung begrenzt unnötige Verbindungen. TLS schützt Daten während der Übertragung. Verschlüsselung gespeicherter Daten schützt bei Verlust eines Datenträgers."
        },
        {
          "heading": "4. Sicherer Betrieb",
          "body": "Patch Management plant Sicherheitsupdates. Phishing versucht, Benutzer zur Preisgabe vertraulicher Daten zu bewegen. Protokolle, Backups, Wiederherstellungstests und klare Zuständigkeiten gehören zu einem mehrschichtigen Schutz."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Ein Mitarbeiter benötigt Zugriff auf einen Dateiordner. Du vergibst Leserechte an die passende Gruppe, aktivierst MFA und dokumentierst die Freigabe. Nicht benötigte Administratorrechte bleiben deaktiviert.",
        "code": "Prüfen: Wer braucht Zugriff?\nBegrenzen: Nur notwendige Gruppenrechte\nAbsichern: MFA + Updates + Protokollierung"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Nenne die drei CIA-Schutzziele.",
          "Warum ist MFA stärker als nur ein Passwort?",
          "Welche Aufgabe hat eine Firewall?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "IT-Sicherheit und Datenschutz sind in der Ausbildungsordnung ausdrücklich verankert. Begründe Maßnahmen anhand von Risiko, Schutzbedarf, Aufwand und Auswirkungen auf den Betrieb."
      },
      "terms": [
        {
          "term": "Confidentiality",
          "meaning": "Vertraulichkeit",
          "definition": "Schützt Daten vor unbefugter Einsicht."
        },
        {
          "term": "Integrity",
          "meaning": "Integrität",
          "definition": "Schützt die Richtigkeit und Unverändertheit von Daten."
        },
        {
          "term": "MFA",
          "meaning": "Mehr-Faktor-Authentifizierung",
          "definition": "Kombiniert zwei oder mehr unterschiedliche Faktoren."
        },
        {
          "term": "Patch Management",
          "meaning": "تحديثات الأمان",
          "definition": "Plant und steuert Softwareupdates zur Risikominderung."
        }
      ]
    },
    "en": {
      "title": "IT security in operations",
      "summary": "Security objectives, access control, MFA, encryption, updates and network protection.",
      "sections": [
        {
          "heading": "1. CIA security objectives",
          "body": "Confidentiality protects data from unauthorized reading. Integrity protects against improper or undetected changes. Availability means systems and information can be used when needed."
        },
        {
          "heading": "2. Identities and permissions",
          "body": "Least privilege gives users only the permissions they need. MFA combines different proofs, such as a password and a security key. Accounts must be adjusted or disabled when roles change or staff leave."
        },
        {
          "heading": "3. Networks and encryption",
          "body": "Firewalls allow or block traffic based on rules. Network segmentation limits unnecessary connections. TLS protects data in transit. Encryption of stored data helps protect it if media are lost."
        },
        {
          "heading": "4. Secure operations",
          "body": "Patch management plans security updates. Phishing attempts to trick users into disclosing sensitive information. Logs, backups, recovery tests and clear responsibilities are part of layered protection."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "An employee needs access to a shared folder. You grant read permissions to the correct group, enable MFA and document the access. Unneeded administrator rights remain disabled.",
        "code": "Check: Who needs access?\nLimit: Only required group permissions\nProtect: MFA + updates + logging"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Name the three CIA security objectives.",
          "Why is MFA stronger than a password alone?",
          "What does a firewall do?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "IT security and data protection are explicit parts of the training regulation. Justify measures using risk, protection requirements, effort and operational impact."
      },
      "terms": [
        {
          "term": "Confidentiality",
          "meaning": "Confidentiality",
          "definition": "Protects data from unauthorized disclosure."
        },
        {
          "term": "Integrity",
          "meaning": "Integrity",
          "definition": "Protects correctness and prevents improper changes."
        },
        {
          "term": "MFA",
          "meaning": "Multi-factor authentication",
          "definition": "Combines two or more different factors."
        },
        {
          "term": "Patch Management",
          "meaning": "Security updates",
          "definition": "Plans and controls software updates to reduce risk."
        }
      ]
    },
    "ar": {
      "title": "أمن المعلومات IT Security",
      "summary": "أهداف الحماية والصلاحيات وMFA والتشفير والتحديثات وحماية الشبكة.",
      "sections": [
        {
          "heading": "1. أهداف CIA",
          "body": "تعني Vertraulichkeit السرية، أي منع غير المخولين من قراءة البيانات. وتعني Integrität سلامة البيانات من التغيير غير المصرح به. أما Verfügbarkeit فتعني توفر النظام والبيانات عند الحاجة."
        },
        {
          "heading": "2. الهويات والصلاحيات",
          "body": "يعطي مبدأ Least Privilege كل مستخدم الصلاحيات التي يحتاجها فقط. تجمع MFA بين عوامل مختلفة مثل كلمة المرور ومفتاح أمان. يجب تعديل الحسابات أو تعطيلها عند تغيير وظيفة الموظف أو مغادرته."
        },
        {
          "heading": "3. الشبكة والتشفير",
          "body": "تسمح Firewall بحركة الشبكة أو تمنعها حسب القواعد. ويحد Network Segmentation من الاتصالات غير الضرورية. يحمي TLS البيانات أثناء انتقالها، ويحمي التشفير البيانات المخزنة عند فقدان وسيط التخزين."
        },
        {
          "heading": "4. التشغيل الآمن",
          "body": "ينظم Patch Management تثبيت تحديثات الأمان. يحاول Phishing خداع المستخدم للحصول على بيانات سرية. وتعد Logs والنسخ الاحتياطية واختبارات الاستعادة وتحديد المسؤوليات أجزاء من الحماية متعددة الطبقات."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "يحتاج موظف إلى الوصول إلى مجلد مشترك. تمنحه صلاحية القراءة عبر المجموعة المناسبة، وتفعّل MFA، وتوثق منح الوصول. لا تمنحه صلاحيات Administrator إذا لم يحتجها.",
        "code": "تحقق: من يحتاج الوصول؟\nقلّل: امنح صلاحيات المجموعة الضرورية فقط\nاحمِ: MFA + تحديثات + سجلات"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اذكر أهداف الحماية الثلاثة CIA.",
          "لماذا تعد MFA أقوى من كلمة مرور وحدها؟",
          "ما وظيفة Firewall؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "أمن المعلومات وحماية البيانات جزء صريح من لائحة التدريب. برر الإجراءات بحسب الخطر ومستوى الحماية المطلوب والجهد وتأثيرها على العمل."
      },
      "terms": [
        {
          "term": "Confidentiality",
          "meaning": "السرية",
          "definition": "تحمي البيانات من الاطلاع غير المصرح به."
        },
        {
          "term": "Integrity",
          "meaning": "سلامة البيانات",
          "definition": "تحمي صحة البيانات من التغيير غير المصرح به."
        },
        {
          "term": "MFA",
          "meaning": "المصادقة متعددة العوامل",
          "definition": "تجمع عاملين مختلفين أو أكثر."
        },
        {
          "term": "Patch Management",
          "meaning": "إدارة تحديثات الأمان",
          "definition": "تنظم تحديث البرامج لتقليل المخاطر."
        }
      ]
    }
  },
  {
    "id": "backup-recovery",
    "topic": "Backup & Recovery",
    "icon": "💾",
    "sources": [
      {
        "label": "BSI – IT-Grundschutz-Kompendium, Edition 2023",
        "url": "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Grundschutz/IT-GS-Kompendium/IT_Grundschutz_Kompendium_Edition2023.pdf?__blob=publicationFile&v=4"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "Backup und Disaster Recovery",
      "summary": "Sicherungsarten, 3-2-1, RPO, RTO und getestete Wiederherstellung.",
      "sections": [
        {
          "heading": "1. Sicherungsarten",
          "body": "Ein Vollbackup kopiert alle ausgewählten Daten. Ein inkrementelles Backup sichert Änderungen seit der letzten Sicherung. Ein differentielles Backup enthält Änderungen seit dem letzten Vollbackup. Die Wiederherstellung benötigt je nach Verfahren unterschiedliche Sicherungssätze."
        },
        {
          "heading": "2. 3-2-1-Strategie",
          "body": "Die 3-2-1-Regel empfiehlt drei Datenkopien, auf zwei unterschiedlichen Medientypen und eine Kopie außer Haus. Ergänzend sind getrennte Zugangsdaten, Verschlüsselung und unveränderbare Sicherungen sinnvoll."
        },
        {
          "heading": "3. RPO und RTO",
          "body": "RPO beschreibt, wie viel Datenverlust zeitlich maximal akzeptabel ist. RTO beschreibt, wie lange die Wiederherstellung eines Dienstes höchstens dauern soll. Beide Werte müssen aus den Geschäftsanforderungen abgeleitet werden."
        },
        {
          "heading": "4. Wiederherstellung testen",
          "body": "Ein Backup ist erst dann verlässlich, wenn die Wiederherstellung funktioniert. Plane die Reihenfolge der Systeme, dokumentiere Schritte und teste regelmäßig. Prüfe auch, ob die Daten vollständig und in angemessener Zeit zurückkommen."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Ein Fileserver darf höchstens vier Stunden Daten verlieren und muss in sechs Stunden wieder verfügbar sein. Daraus ergeben sich RPO 4 Stunden und RTO 6 Stunden. Du planst Sicherungen und testest einen Restore.",
        "code": "RPO = maximal tolerierter Datenverlust\nRTO = Zielzeit bis der Dienst wieder läuft\nRestore-Test = Nachweis, dass die Sicherung nutzbar ist"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Erkläre inkrementell und differentiell.",
          "Was ist der Unterschied zwischen RPO und RTO?",
          "Warum reicht ein grüner Backup-Job allein nicht aus?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Datensicherung gehört zum Betrieb von IT-Systemen und Speicherlösungen. In einer Aufgabe solltest du Anforderungen, Sicherungsart, Aufbewahrung, Schutz, Wiederherstellungsreihenfolge und Restore-Test begründen."
      },
      "terms": [
        {
          "term": "Full Backup",
          "meaning": "Vollbackup",
          "definition": "Sichert alle ausgewählten Daten."
        },
        {
          "term": "RPO",
          "meaning": "Recovery Point Objective",
          "definition": "Maximal tolerierter Datenverlust als Zeitwert."
        },
        {
          "term": "RTO",
          "meaning": "Recovery Time Objective",
          "definition": "Zielwert für die Wiederherstellungsdauer."
        },
        {
          "term": "Immutable",
          "meaning": "Unveränderbar",
          "definition": "Sicherung kann innerhalb der Schutzfrist nicht verändert oder gelöscht werden."
        }
      ]
    },
    "en": {
      "title": "Backup and disaster recovery",
      "summary": "Backup types, the 3-2-1 strategy, RPO, RTO and tested recovery.",
      "sections": [
        {
          "heading": "1. Backup types",
          "body": "A full backup copies all selected data. An incremental backup copies changes since the previous backup. A differential backup contains changes since the last full backup. Recovery requires different sets depending on the method."
        },
        {
          "heading": "2. The 3-2-1 strategy",
          "body": "The 3-2-1 rule recommends three copies of data, on two different media types, with one copy off-site. Separate credentials, encryption and immutable backups are useful additional controls."
        },
        {
          "heading": "3. RPO and RTO",
          "body": "RPO describes the maximum acceptable amount of data loss measured in time. RTO describes the maximum target time to restore a service. Both values should come from business requirements."
        },
        {
          "heading": "4. Test recovery",
          "body": "A backup is reliable only when restoration works. Plan the recovery order, document the steps and test regularly. Check that data return completely and within an acceptable time."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "A file server may lose no more than four hours of data and must be available again within six hours. This gives an RPO of four hours and an RTO of six hours. You plan the backups and test a restore.",
        "code": "RPO = maximum tolerable data loss\nRTO = target time until service is running again\nRestore test = proof that the backup is usable"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Explain the difference between incremental and differential backups.",
          "What is the difference between RPO and RTO?",
          "Why is a successful backup job alone not enough?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Backup belongs to IT operations and storage solutions. In an exam, justify requirements, backup type, retention, protection, restore order and recovery testing."
      },
      "terms": [
        {
          "term": "Full Backup",
          "meaning": "Full backup",
          "definition": "Copies all selected data."
        },
        {
          "term": "RPO",
          "meaning": "Recovery Point Objective",
          "definition": "Maximum tolerable data loss measured in time."
        },
        {
          "term": "RTO",
          "meaning": "Recovery Time Objective",
          "definition": "Target duration for restoring a service."
        },
        {
          "term": "Immutable",
          "meaning": "Immutable",
          "definition": "A backup that cannot be changed or deleted during its protection period."
        }
      ]
    },
    "ar": {
      "title": "Backup والتعافي من الكوارث",
      "summary": "أنواع النسخ الاحتياطي وقاعدة 3-2-1 وRPO وRTO واختبار الاستعادة.",
      "sections": [
        {
          "heading": "1. أنواع النسخ الاحتياطي",
          "body": "ينسخ Vollbackup كل البيانات المحددة. ينسخ Inkrementell التغييرات منذ آخر عملية نسخ. أما Differenziell فيحتوي على التغييرات منذ آخر Vollbackup. تختلف خطوات الاستعادة بحسب طريقة النسخ."
        },
        {
          "heading": "2. قاعدة 3-2-1",
          "body": "توصي قاعدة 3-2-1 بثلاث نسخ من البيانات على نوعين مختلفين من وسائط التخزين، مع نسخة واحدة خارج الموقع. من المفيد أيضاً استخدام بيانات دخول منفصلة وتشفير ونسخ غير قابلة للتعديل."
        },
        {
          "heading": "3. الفرق بين RPO وRTO",
          "body": "يحدد RPO أقصى مقدار مقبول لفقدان البيانات بوحدة الزمن. ويحدد RTO الوقت المستهدف الأقصى لإعادة الخدمة إلى العمل. يجب تحديد القيمتين بحسب حاجة الشركة."
        },
        {
          "heading": "4. اختبار الاستعادة",
          "body": "لا يمكن الوثوق بالنسخة الاحتياطية إلا بعد نجاح استعادة فعلية. خطط لترتيب إعادة الأنظمة، ووثق الخطوات، واختبر بانتظام. تحقق من عودة البيانات كاملة وضمن وقت مقبول."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "يسمح خادم الملفات بفقدان بيانات لمدة أربع ساعات كحد أقصى، ويجب أن يعود للعمل خلال ست ساعات. إذن RPO يساوي 4 ساعات وRTO يساوي 6 ساعات. تخطط النسخ وتجرب Restore فعلياً.",
        "code": "RPO = أقصى فقدان بيانات مقبول\nRTO = الوقت المستهدف حتى عودة الخدمة\nRestore-Test = إثبات أن النسخة قابلة للاستعادة"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اشرح الفرق بين Inkrementell وDifferenziell.",
          "ما الفرق بين RPO وRTO؟",
          "لماذا لا تكفي رسالة نجاح مهمة Backup وحدها؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "النسخ الاحتياطي جزء من تشغيل أنظمة IT وحلول التخزين. في الامتحان برر متطلبات النسخ ونوعه ومدة الاحتفاظ والحماية وترتيب الاستعادة واختبار Restore."
      },
      "terms": [
        {
          "term": "Full Backup",
          "meaning": "نسخة كاملة",
          "definition": "تنسخ جميع البيانات المحددة."
        },
        {
          "term": "RPO",
          "meaning": "هدف نقطة الاستعادة",
          "definition": "أقصى مقدار زمني مقبول لفقدان البيانات."
        },
        {
          "term": "RTO",
          "meaning": "هدف زمن الاستعادة",
          "definition": "الوقت المستهدف لإعادة الخدمة."
        },
        {
          "term": "Immutable",
          "meaning": "غير قابل للتعديل",
          "definition": "نسخة لا يمكن تغييرها أو حذفها خلال فترة الحماية."
        }
      ]
    }
  },
  {
    "id": "sql-databases",
    "topic": "SQL & Databases",
    "icon": "🗄️",
    "sources": [
      {
        "label": "PostgreSQL – Tutorial",
        "url": "https://www.postgresql.org/docs/current/tutorial.html"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "Relationale Datenbanken und SQL",
      "summary": "Tabellen, Schlüssel, Abfragen, Verknüpfungen und sichere Transaktionen.",
      "sections": [
        {
          "heading": "1. Relationale Datenbank",
          "body": "Eine relationale Datenbank organisiert Informationen in Tabellen. Eine Zeile ist ein Datensatz, eine Spalte ist ein Attribut. Tabellen können über Schlüssel miteinander verbunden werden."
        },
        {
          "heading": "2. Primary und Foreign Key",
          "body": "Ein Primary Key identifiziert jede Zeile eindeutig. Ein Foreign Key verweist auf einen Schlüssel in einer anderen oder derselben Tabelle. So werden Beziehungen zwischen Daten hergestellt und referenzielle Integrität unterstützt."
        },
        {
          "heading": "3. SQL-Abfragen",
          "body": "SELECT liest Daten. WHERE filtert Zeilen. ORDER BY sortiert. JOIN verbindet passende Datensätze aus mehreren Tabellen. Verwende bei Änderungen immer eine klare Bedingung und prüfe zuerst, welche Zeilen betroffen sind."
        },
        {
          "heading": "4. Transaktionen und Sicherheit",
          "body": "Eine Transaktion fasst mehrere Schritte zusammen. ACID steht für Atomicity, Consistency, Isolation und Durability. COMMIT bestätigt Änderungen, ROLLBACK macht nicht bestätigte Änderungen rückgängig. Vermeide SQL-Befehle ohne notwendige WHERE-Bedingung."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Du möchtest die E-Mail-Adressen aktiver Benutzer anzeigen. Eine Abfrage liest nur die benötigten Spalten und filtert den Status.",
        "code": "SELECT email\nFROM users\nWHERE status = 'active'\nORDER BY email;"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Was ist der Unterschied zwischen Primary Key und Foreign Key?",
          "Was macht WHERE?",
          "Warum ist DELETE ohne WHERE gefährlich?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Grundlagen von Datenbanken können bei Systemadministration und Anwendungsbetrieb vorkommen. Erkläre Tabellenbeziehungen, Schlüssel, einfache SQL-Abfragen und den Zweck von Transaktionen."
      },
      "terms": [
        {
          "term": "Primary Key",
          "meaning": "المفتاح الأساسي",
          "definition": "Identifiziert einen Datensatz eindeutig."
        },
        {
          "term": "Foreign Key",
          "meaning": "المفتاح الخارجي",
          "definition": "Stellt eine Beziehung zu einem Schlüssel her."
        },
        {
          "term": "JOIN",
          "meaning": "ربط الجداول",
          "definition": "Verbindet passende Zeilen aus mehreren Tabellen."
        },
        {
          "term": "Transaction",
          "meaning": "معاملة",
          "definition": "Zusammengehörige Datenbankoperationen als Einheit."
        }
      ]
    },
    "en": {
      "title": "Relational databases and SQL",
      "summary": "Tables, keys, queries, joins and safe transactions.",
      "sections": [
        {
          "heading": "1. Relational database",
          "body": "A relational database organizes information in tables. A row is a record and a column is an attribute. Tables can be connected through keys."
        },
        {
          "heading": "2. Primary and foreign keys",
          "body": "A primary key uniquely identifies every row. A foreign key references a key in another or the same table. This creates relationships and supports referential integrity."
        },
        {
          "heading": "3. SQL queries",
          "body": "SELECT retrieves data. WHERE filters rows. ORDER BY sorts. JOIN combines matching records from multiple tables. When changing data, always use a clear condition and check which rows will be affected."
        },
        {
          "heading": "4. Transactions and safety",
          "body": "A transaction groups multiple steps. ACID means Atomicity, Consistency, Isolation and Durability. COMMIT confirms changes; ROLLBACK reverses uncommitted changes. Avoid SQL modification commands without a necessary WHERE condition."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "You want to display email addresses of active users. The query reads only the required column and filters by status.",
        "code": "SELECT email\nFROM users\nWHERE status = 'active'\nORDER BY email;"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "What is the difference between a primary key and a foreign key?",
          "What does WHERE do?",
          "Why can DELETE without WHERE be dangerous?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Database basics can be relevant to system administration and application operations. Explain table relationships, keys, simple SQL queries and the purpose of transactions."
      },
      "terms": [
        {
          "term": "Primary Key",
          "meaning": "Primary key",
          "definition": "Uniquely identifies a record."
        },
        {
          "term": "Foreign Key",
          "meaning": "Foreign key",
          "definition": "Creates a reference to another key."
        },
        {
          "term": "JOIN",
          "meaning": "Join tables",
          "definition": "Combines matching rows from multiple tables."
        },
        {
          "term": "Transaction",
          "meaning": "Transaction",
          "definition": "A group of related database operations treated as one unit."
        }
      ]
    },
    "ar": {
      "title": "قواعد البيانات العلائقية وSQL",
      "summary": "الجداول والمفاتيح والاستعلامات والربط والمعاملات الآمنة.",
      "sections": [
        {
          "heading": "1. قاعدة البيانات العلائقية",
          "body": "تنظم قاعدة البيانات العلائقية المعلومات ضمن جداول. يمثل Row سجلاً واحداً، وتمثل Column خاصية أو حقلاً. يمكن ربط الجداول باستخدام المفاتيح."
        },
        {
          "heading": "2. Primary Key وForeign Key",
          "body": "يحدد Primary Key كل صف بشكل فريد. ويشير Foreign Key إلى مفتاح في جدول آخر أو في الجدول نفسه. بهذه الطريقة يتم إنشاء العلاقات بين البيانات والحفاظ على سلامتها المرجعية."
        },
        {
          "heading": "3. استعلامات SQL",
          "body": "تستخدم SELECT لقراءة البيانات، وWHERE لتصفية الصفوف، وORDER BY للترتيب. يربط JOIN السجلات المتطابقة من عدة جداول. عند تعديل البيانات استخدم شرطاً واضحاً وتحقق أولاً من الصفوف المتأثرة."
        },
        {
          "heading": "4. Transactions والأمان",
          "body": "تجمع Transaction عدة خطوات كوحدة واحدة. تعني ACID: Atomicity وConsistency وIsolation وDurability. يثبت COMMIT التغييرات، بينما يعيد ROLLBACK التغييرات غير المثبتة. تجنب أوامر التعديل دون شرط WHERE عند الحاجة."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "تريد عرض عناوين البريد للمستخدمين النشطين فقط. يقرأ الاستعلام العمود المطلوب ويصفّي حسب الحالة.",
        "code": "SELECT email\nFROM users\nWHERE status = 'active'\nORDER BY email;"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "ما الفرق بين Primary Key وForeign Key؟",
          "ما وظيفة WHERE؟",
          "لماذا يمكن أن يكون DELETE دون WHERE خطيراً؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "قد تظهر أساسيات قواعد البيانات ضمن إدارة الأنظمة وتشغيل التطبيقات. اشرح العلاقات بين الجداول والمفاتيح واستعلامات SQL البسيطة وفائدة Transactions."
      },
      "terms": [
        {
          "term": "Primary Key",
          "meaning": "المفتاح الأساسي",
          "definition": "يحدد السجل بشكل فريد."
        },
        {
          "term": "Foreign Key",
          "meaning": "المفتاح الخارجي",
          "definition": "ينشئ مرجعاً إلى مفتاح آخر."
        },
        {
          "term": "JOIN",
          "meaning": "ربط الجداول",
          "definition": "يجمع الصفوف المتطابقة من عدة جداول."
        },
        {
          "term": "Transaction",
          "meaning": "معاملة",
          "definition": "مجموعة عمليات مترابطة تُعامل كوحدة واحدة."
        }
      ]
    }
  },
  {
    "id": "cloud-hybrid",
    "topic": "Cloud & Hybrid",
    "icon": "☁️",
    "sources": [
      {
        "label": "Microsoft Learn – Shared responsibility in the cloud",
        "url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility"
      },
      {
        "label": "Microsoft Learn – Availability Zones",
        "url": "https://learn.microsoft.com/en-us/azure/availability-zones/az-overview"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "Fachinformatikerausbildungsverordnung (FIAusbV 2020)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/4739986/0068666cf941a051b01c1e6b65a1d8f5/fachinformatiker-vo-2020-data.pdf"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "Cloud Computing und hybride IT",
      "summary": "IaaS, PaaS, SaaS, Shared Responsibility, Skalierung und Verfügbarkeit.",
      "sections": [
        {
          "heading": "1. Service-Modelle",
          "body": "IaaS stellt grundlegende Infrastruktur wie virtuelle Maschinen, Speicher und Netzwerke bereit. Bei PaaS nutzt du eine verwaltete Plattform für Anwendungen. SaaS liefert eine fertige Anwendung über das Netzwerk."
        },
        {
          "heading": "2. Shared Responsibility",
          "body": "Verantwortung wird zwischen Kunde und Anbieter geteilt. Bei IaaS verwaltest du typischerweise Betriebssysteme und Anwendungen. Bei PaaS übernimmt der Anbieter mehr Plattformbetrieb. Bei SaaS nutzt du die fertige Anwendung. Daten und Identitäten bleiben wichtige Kundenverantwortungen."
        },
        {
          "heading": "3. Public, Private und Hybrid",
          "body": "Eine Public Cloud wird vom Anbieter für mehrere Kunden bereitgestellt. Eine Private Cloud ist einer Organisation vorbehalten. Eine Hybrid Cloud verbindet lokale Infrastruktur mit Cloud-Diensten. Die Verbindung muss sicher geplant werden."
        },
        {
          "heading": "4. Skalierung und Verfügbarkeit",
          "body": "Horizontal Scaling fügt weitere Instanzen hinzu. Vertical Scaling erhöht Ressourcen einer Instanz. Regionen und Availability Zones unterstützen geografische Verteilung und Ausfallsicherheit. Hohe Verfügbarkeit ersetzt jedoch kein Backup."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Eine Firma betreibt Active Directory lokal und nutzt einen Cloud-Dienst für E-Mail. Identitäten, Synchronisierung, MFA, Datenzugriff und Notfallzugriff müssen gemeinsam geplant werden.",
        "code": "IaaS: VM + Netzwerk + Speicher\nPaaS: verwaltete Laufzeitplattform\nSaaS: fertige Anwendung"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Ordne VM-Hosting, App-Plattform und fertige Webmail IaaS, PaaS oder SaaS zu.",
          "Welche Verantwortung bleibt beim Kunden?",
          "Unterscheide horizontale und vertikale Skalierung."
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Bei der Auswahl einer Cloud-Lösung zählen Anforderungen, Kosten, Datenschutz, Sicherheit, Verfügbarkeit, Datenstandort und Zuständigkeiten. Begründe das Modell für den konkreten Kundenbedarf."
      },
      "terms": [
        {
          "term": "IaaS",
          "meaning": "Infrastructure as a Service",
          "definition": "Bereitstellung grundlegender IT-Infrastruktur."
        },
        {
          "term": "PaaS",
          "meaning": "Platform as a Service",
          "definition": "Verwaltete Plattform zum Bereitstellen von Anwendungen."
        },
        {
          "term": "SaaS",
          "meaning": "Software as a Service",
          "definition": "Fertige Software, die als Dienst genutzt wird."
        },
        {
          "term": "Hybrid Cloud",
          "meaning": "سحابة هجينة",
          "definition": "Verbindung lokaler IT mit Cloud-Diensten."
        }
      ]
    },
    "en": {
      "title": "Cloud computing and hybrid IT",
      "summary": "IaaS, PaaS, SaaS, shared responsibility, scaling and availability.",
      "sections": [
        {
          "heading": "1. Service models",
          "body": "IaaS provides basic infrastructure such as virtual machines, storage and networks. PaaS provides a managed platform for applications. SaaS delivers a ready-to-use application over a network."
        },
        {
          "heading": "2. Shared responsibility",
          "body": "Responsibilities are shared between the customer and provider. With IaaS, you typically manage operating systems and applications. With PaaS, the provider manages more of the platform. With SaaS, you use the finished application. Data and identities remain important customer responsibilities."
        },
        {
          "heading": "3. Public, private and hybrid",
          "body": "A public cloud is provided by a vendor for multiple customers. A private cloud is reserved for one organization. A hybrid cloud connects on-premises infrastructure with cloud services. The connection must be planned securely."
        },
        {
          "heading": "4. Scaling and availability",
          "body": "Horizontal scaling adds more instances. Vertical scaling increases the resources of one instance. Regions and availability zones support geographic distribution and resilience. High availability does not replace backup."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "A company runs Active Directory on-premises and uses a cloud email service. Identities, synchronization, MFA, data access and emergency access must be planned together.",
        "code": "IaaS: VM + network + storage\nPaaS: managed application platform\nSaaS: ready-to-use application"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Classify VM hosting, an app platform and webmail as IaaS, PaaS or SaaS.",
          "Which responsibility remains with the customer?",
          "Compare horizontal and vertical scaling."
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Choosing a cloud solution requires requirements analysis, costs, data protection, security, availability, data location and clear responsibilities. Justify the model for the customer's needs."
      },
      "terms": [
        {
          "term": "IaaS",
          "meaning": "Infrastructure as a Service",
          "definition": "Provision of basic IT infrastructure."
        },
        {
          "term": "PaaS",
          "meaning": "Platform as a Service",
          "definition": "Managed platform for deploying applications."
        },
        {
          "term": "SaaS",
          "meaning": "Software as a Service",
          "definition": "Ready-to-use software delivered as a service."
        },
        {
          "term": "Hybrid Cloud",
          "meaning": "Hybrid cloud",
          "definition": "Connects on-premises IT with cloud services."
        }
      ]
    },
    "ar": {
      "title": "Cloud Computing والبنية الهجينة",
      "summary": "فهم IaaS وPaaS وSaaS والمسؤولية المشتركة والتوسع والتوافر.",
      "sections": [
        {
          "heading": "1. نماذج الخدمات",
          "body": "يوفر IaaS البنية الأساسية مثل Virtual Machines والتخزين والشبكات. يوفر PaaS منصة مُدارة لتشغيل التطبيقات. أما SaaS فيقدم تطبيقاً جاهزاً للاستخدام عبر الشبكة."
        },
        {
          "heading": "2. Shared Responsibility",
          "body": "تتوزع المسؤوليات بين العميل ومزود السحابة. في IaaS تدير عادة نظام التشغيل والتطبيقات. وفي PaaS يدير المزود جزءاً أكبر من المنصة. وفي SaaS تستخدم التطبيق الجاهز. تبقى البيانات والهويات من مسؤوليات العميل المهمة."
        },
        {
          "heading": "3. Public وPrivate وHybrid Cloud",
          "body": "توفر Public Cloud خدمات لعدة عملاء من المزود. تكون Private Cloud مخصصة لمؤسسة واحدة. وتجمع Hybrid Cloud بين البنية المحلية وخدمات السحابة. يجب تخطيط الربط بينها بشكل آمن."
        },
        {
          "heading": "4. Scaling وAvailability",
          "body": "يزيد Horizontal Scaling عدد النسخ أو الخوادم. أما Vertical Scaling فيزيد موارد نسخة واحدة. تساعد Regions وAvailability Zones على التوزيع الجغرافي وتحمل الأعطال. لكن High Availability لا تستبدل Backup."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "تدير شركة Active Directory محلياً وتستخدم خدمة بريد سحابية. يجب تخطيط الهويات والمزامنة وMFA والوصول إلى البيانات والوصول عند الطوارئ معاً.",
        "code": "IaaS: VM + Network + Storage\nPaaS: منصة تطبيق مُدارة\nSaaS: تطبيق جاهز للاستخدام"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "صنّف استضافة VM ومنصة تطبيق وبريد ويب إلى IaaS أو PaaS أو SaaS.",
          "ما المسؤولية التي تبقى على العميل؟",
          "اشرح الفرق بين Horizontal وVertical Scaling."
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "يتطلب اختيار حل Cloud تحليل الاحتياجات والتكاليف وحماية البيانات والأمان والتوافر ومكان تخزين البيانات وتحديد المسؤوليات. برر النموذج المناسب لحاجة العميل."
      },
      "terms": [
        {
          "term": "IaaS",
          "meaning": "البنية التحتية كخدمة",
          "definition": "توفير موارد البنية التحتية الأساسية."
        },
        {
          "term": "PaaS",
          "meaning": "المنصة كخدمة",
          "definition": "منصة مُدارة لنشر التطبيقات."
        },
        {
          "term": "SaaS",
          "meaning": "البرمجيات كخدمة",
          "definition": "برنامج جاهز يتم استخدامه كخدمة."
        },
        {
          "term": "Hybrid Cloud",
          "meaning": "السحابة الهجينة",
          "definition": "تربط أنظمة الشركة المحلية بخدمات السحابة."
        }
      ]
    }
  },
  {
    "id": "it-operations",
    "topic": "IT Service & Operations",
    "icon": "🧰",
    "sources": [
      {
        "label": "Atlassian – Incident Management Handbook",
        "url": "https://www.atlassian.com/incident-management/handbook"
      },
      {
        "label": "Atlassian – ITSM documentation",
        "url": "https://support.atlassian.com/jira-service-management-cloud/docs/discover-it-service-management-itsm/"
      },
      {
        "label": "BIBB – Umsetzungshilfe Fachinformatiker/Fachinformatikerin",
        "url": "https://www.bibb.de/dienst/publikationen/de/16661"
      },
      {
        "label": "IHK Berlin – Leitfaden Fachinformatiker Systemintegration (2026)",
        "url": "https://www.ihk.de/blueprint/servlet/resource/blob/6957958/fd54ae065bc407cd8fc092c654af9a96/leitfaden-fi-systemintegration-data.pdf"
      }
    ],
    "de": {
      "title": "IT-Service-Management und IT-Betrieb",
      "summary": "Incidents, Problems, Changes, SLA, Tickets, Monitoring und Dokumentation.",
      "sections": [
        {
          "heading": "1. Incident und Problem",
          "body": "Ein Incident ist eine Störung oder Qualitätsminderung eines IT-Services. Das Ziel ist die schnelle Wiederherstellung. Problem Management sucht die grundlegende Ursache, damit ähnliche Störungen nicht immer wieder auftreten."
        },
        {
          "heading": "2. Changes kontrollieren",
          "body": "Ein Change ist eine kontrollierte Änderung an einem Service oder einer Komponente. Bewerte Auswirkungen und Risiken, plane einen Termin, hole notwendige Freigaben ein, erstelle einen Rückfallplan und dokumentiere das Ergebnis."
        },
        {
          "heading": "3. Tickets und SLA",
          "body": "Ein Ticket dokumentiert Anfrage, Zeitpunkt, Auswirkung, Dringlichkeit, Zuständigkeit und Status. Ein Service Level Agreement (SLA) beschreibt vereinbarte Serviceziele, zum Beispiel Reaktions- oder Wiederherstellungszeiten."
        },
        {
          "heading": "4. Monitoring und Dokumentation",
          "body": "Monitoring beobachtet Systeme und Messwerte. Logs enthalten Ereignisse; Metriken sind Zahlenwerte wie CPU-Auslastung oder Antwortzeit. Eine aktuelle Dokumentation beschreibt Netzwerk, IP-Adressen, Systeme, Abhängigkeiten und Änderungen."
        }
      ],
      "example": {
        "heading": "Praxisbeispiel",
        "body": "Mehrere Benutzer können sich nicht anmelden. Du eröffnest ein Incident-Ticket, prüfst DNS und Domain Controller, hältst Zeitpunkte und Ergebnisse fest und stellst den Dienst wieder her. Danach untersuchst du die Ursache als Problem.",
        "code": "Ticket: Auswirkung + Dringlichkeit + Zeit\nDiagnose: Logs + Monitoring + Abhängigkeiten\nAbschluss: Lösung + Ursache + Dokumentation"
      },
      "practice": {
        "heading": "Mini-Übung",
        "steps": [
          "Erkläre den Unterschied zwischen Incident und Problem.",
          "Welche Informationen gehören in ein gutes Ticket?",
          "Warum braucht ein Change einen Rückfallplan?"
        ]
      },
      "exam": {
        "heading": "IHK-Bezug",
        "text": "Arbeitsaufträge sollen geplant, durchgeführt, kontrolliert und dokumentiert werden. Übe, Entscheidungen gegenüber Kunden zu erklären und Ergebnisse nachvollziehbar zu protokollieren."
      },
      "terms": [
        {
          "term": "Incident",
          "meaning": "حادث أو عطل",
          "definition": "Ereignis, das einen IT-Service stört."
        },
        {
          "term": "Problem",
          "meaning": "المشكلة الجذرية",
          "definition": "Untersuchung der Ursache von Incidents."
        },
        {
          "term": "SLA",
          "meaning": "اتفاقية مستوى الخدمة",
          "definition": "Vereinbarte messbare Serviceziele."
        },
        {
          "term": "CMDB",
          "meaning": "قاعدة بيانات التكوين",
          "definition": "Speichert Configuration Items und ihre Beziehungen."
        }
      ]
    },
    "en": {
      "title": "IT service management and operations",
      "summary": "Incidents, problems, changes, SLAs, tickets, monitoring and documentation.",
      "sections": [
        {
          "heading": "1. Incident and problem",
          "body": "An incident is a disruption or reduction in the quality of an IT service. The goal is to restore the service quickly. Problem management investigates the underlying cause so similar incidents do not keep recurring."
        },
        {
          "heading": "2. Control changes",
          "body": "A change is a controlled modification to a service or component. Assess impact and risk, schedule it, obtain required approvals, prepare a rollback plan and document the result."
        },
        {
          "heading": "3. Tickets and SLAs",
          "body": "A ticket records the request, time, impact, urgency, owner and status. A Service Level Agreement (SLA) describes agreed service targets, such as response or restoration times."
        },
        {
          "heading": "4. Monitoring and documentation",
          "body": "Monitoring observes systems and measurements. Logs contain events; metrics are numeric values such as CPU utilization or response time. Current documentation describes networks, IP addresses, systems, dependencies and changes."
        }
      ],
      "example": {
        "heading": "Practical example",
        "body": "Several users cannot sign in. You open an incident ticket, check DNS and domain controllers, record times and findings, and restore service. Afterwards, investigate the root cause as a problem.",
        "code": "Ticket: impact + urgency + time\nDiagnosis: logs + monitoring + dependencies\nClosure: fix + cause + documentation"
      },
      "practice": {
        "heading": "Quick practice",
        "steps": [
          "Explain the difference between an incident and a problem.",
          "Which details belong in a good ticket?",
          "Why does a change need a rollback plan?"
        ]
      },
      "exam": {
        "heading": "IHK focus",
        "text": "Work tasks should be planned, performed, checked and documented. Practice explaining decisions to customers and recording results so others can understand them."
      },
      "terms": [
        {
          "term": "Incident",
          "meaning": "Incident",
          "definition": "An event that disrupts an IT service."
        },
        {
          "term": "Problem",
          "meaning": "Problem",
          "definition": "Investigation of the underlying cause of incidents."
        },
        {
          "term": "SLA",
          "meaning": "Service Level Agreement",
          "definition": "Agreed measurable service targets."
        },
        {
          "term": "CMDB",
          "meaning": "Configuration Management Database",
          "definition": "Stores configuration items and their relationships."
        }
      ]
    },
    "ar": {
      "title": "إدارة خدمات IT وتشغيل الأنظمة",
      "summary": "Incidents وProblems وChanges وSLA وTickets وMonitoring والتوثيق.",
      "sections": [
        {
          "heading": "1. الفرق بين Incident وProblem",
          "body": "Incident هو عطل أو تراجع في جودة خدمة IT، والهدف هو إعادة الخدمة بسرعة. أما Problem Management فيبحث عن السبب الجذري كي لا تتكرر الأعطال نفسها باستمرار."
        },
        {
          "heading": "2. إدارة Changes",
          "body": "Change هو تعديل منظم على خدمة أو مكوّن. قيّم التأثير والخطر، وحدد موعداً، واحصل على الموافقات اللازمة، وجهّز خطة رجوع Rollback، ثم وثّق النتيجة."
        },
        {
          "heading": "3. Tickets وSLA",
          "body": "يوثق Ticket الطلب والوقت والتأثير والاستعجال والمسؤول والحالة. وتصف Service Level Agreement أو SLA أهداف الخدمة المتفق عليها مثل زمن الاستجابة أو زمن إعادة الخدمة."
        },
        {
          "heading": "4. Monitoring والتوثيق",
          "body": "يراقب Monitoring الأنظمة والقياسات. تحتوي Logs على الأحداث، بينما Metriken هي قيم رقمية مثل استخدام CPU أو زمن الاستجابة. يجب أن يشرح التوثيق الشبكة وعناوين IP والأنظمة والاعتماديات والتغييرات."
        }
      ],
      "example": {
        "heading": "مثال عملي",
        "body": "عدة مستخدمين لا يستطيعون تسجيل الدخول. تفتح Incident-Ticket، وتفحص DNS وDomain Controller، وتسجل الأوقات والنتائج، ثم تعيد الخدمة. بعد ذلك تبحث عن السبب الجذري كـ Problem.",
        "code": "Ticket: التأثير + الاستعجال + الوقت\nالتشخيص: Logs + Monitoring + الاعتماديات\nالإغلاق: الحل + السبب + التوثيق"
      },
      "practice": {
        "heading": "تدريب قصير",
        "steps": [
          "اشرح الفرق بين Incident وProblem.",
          "ما المعلومات التي يجب أن يحتويها Ticket جيد؟",
          "لماذا يحتاج Change إلى خطة Rollback؟"
        ]
      },
      "exam": {
        "heading": "الارتباط بامتحان IHK",
        "text": "يجب تخطيط مهام العمل وتنفيذها وفحصها وتوثيقها. تدرب على شرح قراراتك للعميل وتسجيل النتائج بشكل يستطيع شخص آخر فهمه."
      },
      "terms": [
        {
          "term": "Incident",
          "meaning": "حادث أو عطل",
          "definition": "حدث يؤثر على خدمة IT."
        },
        {
          "term": "Problem",
          "meaning": "المشكلة الجذرية",
          "definition": "البحث عن السبب الأساسي للحوادث."
        },
        {
          "term": "SLA",
          "meaning": "اتفاقية مستوى الخدمة",
          "definition": "أهداف خدمة قابلة للقياس ومتفق عليها."
        },
        {
          "term": "CMDB",
          "meaning": "قاعدة بيانات إدارة التكوين",
          "definition": "تخزن عناصر التكوين والعلاقات بينها."
        }
      ]
    }
  }
];
