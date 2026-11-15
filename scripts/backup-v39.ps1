$ErrorActionPreference = 'Stop'
$Project = Split-Path -Parent $PSScriptRoot
$BackupRoot = 'C:\Users\waela\Documents\VIDO_Backups'
$Timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$BackupDir = Join-Path $BackupRoot "V39_DAILY_$Timestamp"
$LogFile = Join-Path $BackupRoot 'vido-v39-backup.log'
$RemoteDump = "/tmp/vido_v39_$Timestamp.dump"
$ContainerId = $null

function Write-Log([string]$Message) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
    Add-Content -LiteralPath $LogFile -Value $line
    Write-Output $line
}

try {
    if (-not (Test-Path -LiteralPath (Join-Path $Project '.env'))) {
        throw '.env file is missing; backup stopped.'
    }
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    Set-Location $Project

    docker info *> $null
    if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop is not running.' }

    $ContainerId = (docker compose --env-file .env ps -q postgres).Trim()
    if ($LASTEXITCODE -ne 0 -or -not $ContainerId) {
        throw 'V39 PostgreSQL container is not running.'
    }

    docker exec $ContainerId pg_dump -U vido_user -d vido -Fc -f $RemoteDump
    if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL dump creation failed.' }

    $DumpPath = Join-Path $BackupDir 'vido_v39_database.dump'
    docker cp "$($ContainerId):$RemoteDump" $DumpPath
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $DumpPath)) {
        throw 'Copying PostgreSQL dump to the backup folder failed.'
    }

    docker exec $ContainerId pg_restore --list $RemoteDump *> $null
    if ($LASTEXITCODE -ne 0) { throw 'PostgreSQL dump verification failed.' }

    $Snapshot = Join-Path $BackupDir 'source'
    New-Item -ItemType Directory -Path $Snapshot -Force | Out-Null
    & robocopy $Project $Snapshot /E /COPY:DAT /DCOPY:DAT /R:1 /W:1 /XD .git node_modules /XF .env | Out-Null
    if ($LASTEXITCODE -ge 8) { throw 'Source snapshot copy failed.' }

    $ZipPath = Join-Path $BackupDir 'VIDO_V39_Source.zip'
    Compress-Archive -Path (Join-Path $Snapshot '*') -DestinationPath $ZipPath -CompressionLevel Optimal
    if (-not (Test-Path -LiteralPath $ZipPath)) { throw 'Source ZIP was not created.' }
    Remove-Item -LiteralPath $Snapshot -Recurse -Force

    $Zip = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
    try {
        $EntryCount = $Zip.Entries.Count
        if ($EntryCount -lt 50) { throw 'Source ZIP verification found too few files.' }
    } finally {
        $Zip.Dispose()
    }

    $DumpHash = (Get-FileHash -LiteralPath $DumpPath -Algorithm SHA256).Hash
    $ZipHash = (Get-FileHash -LiteralPath $ZipPath -Algorithm SHA256).Hash
    $Manifest = @(
        'VIDO Technology V39 automatic backup'
        "Created: $(Get-Date -Format o)"
        "Project: $Project"
        "Git HEAD: $((git rev-parse --short HEAD).Trim())"
        "Source archive entries: $EntryCount"
        'Database: PostgreSQL custom-format dump; pg_restore --list passed'
        "Database SHA256: $DumpHash"
        "Source ZIP SHA256: $ZipHash"
        'Secrets: .env intentionally excluded; keep local credentials securely'
        'Docker volumes: not modified'
        'No Git commit or push is performed by this backup task'
    )
    Set-Content -LiteralPath (Join-Path $BackupDir 'BACKUP_INFO.txt') -Value $Manifest -Encoding UTF8

    Write-Log "SUCCESS: V39 source and database backup verified at $BackupDir"

    $OldBackups = Get-ChildItem -LiteralPath $BackupRoot -Directory -Filter 'V39_DAILY_*' |
        Sort-Object LastWriteTime -Descending |
        Select-Object -Skip 14
    foreach ($Old in $OldBackups) {
        Remove-Item -LiteralPath $Old.FullName -Recurse -Force
        Write-Log "ROTATION: removed old V39 backup $($Old.Name)"
    }
}
catch {
    Write-Log "ERROR: $($_.Exception.Message)"
    exit 1
}
finally {
    if ($ContainerId) {
        docker exec $ContainerId rm -f $RemoteDump *> $null
    }
}
