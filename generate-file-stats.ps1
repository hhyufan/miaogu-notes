# Generate file statistics PowerShell script

# Set paths
$markdownDir = "public\markdown-files"
$outputFile = "public\file-stats.json"

# Check if directory exists
if (-not (Test-Path $markdownDir)) {
    Write-Error "Markdown directory does not exist: $markdownDir"
    exit 1
}

# Get statistics for all markdown files
$fileStats = @()

Get-ChildItem -Path $markdownDir -Filter "*.md" | ForEach-Object {
    $file = $_
    $fileInfo = @{
        name = $file.Name
        lastWriteTime = $file.LastWriteTime.ToString("yyyy/M/d H:mm:ss")
        length = $file.Length
        path = "markdown-files/$($file.Name)"
    }
    $fileStats += $fileInfo
}

# Convert to JSON and save
$jsonOutput = $fileStats | ConvertTo-Json -Depth 3
$jsonOutput | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "File statistics generated: $outputFile"
Write-Host "Processed $($fileStats.Count) files"