# Generate file statistics PowerShell script
# This script only generates file-stats.json

# Set paths
$markdownDir = "public\markdown-files"
$fileStatsOutput = "public\file-stats.json"

# Check if directory exists
if (-not (Test-Path $markdownDir)) {
    Write-Error "Markdown directory does not exist: $markdownDir"
    exit 1
}

Write-Host "Generating file statistics..."

# Generate file statistics
$fileStats = @()

# Get all markdown files recursively (only files starting with number and dash)
Get-ChildItem -Path $markdownDir -Filter "*.md" -Recurse | Where-Object {
    $_.Name -match "^\d+-"
} | ForEach-Object {
    $file = $_
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    
    # File stats
    $fileInfo = @{
        name = $file.Name
        lastWriteTime = $file.LastWriteTime.ToString("yyyy/M/d H:mm:ss")
        length = $file.Length
        path = $relativePath
    }
    $fileStats += $fileInfo
}



# Convert to JSON and save
Write-Host "Saving file statistics..."
$fileStats | ConvertTo-Json -Depth 3 | Out-File -FilePath $fileStatsOutput -Encoding UTF8

Write-Host "File statistics generation completed!"
Write-Host "Processed $($fileStats.Count) files"
Write-Host "Generated file: $fileStatsOutput"
Write-Host "Ready for deployment!"