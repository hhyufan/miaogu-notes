@echo off
echo Updating file statistics for deployment...
echo (Only updates file-stats.json, preserves existing summaries)
powershell.exe -ExecutionPolicy Bypass -File "generate-file-stats.ps1"
if %errorlevel% neq 0 (
    echo Error: Failed to generate file statistics
    pause
    exit /b 1
)
echo.
echo File statistics updated successfully!
echo Updated: public/file-stats.json
echo.
echo Next steps:
echo 1. Review the updated file-stats.json
echo 2. Commit and push changes to Git
echo 3. Deploy to Vercel
echo.
pause