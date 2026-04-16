@echo off
REM ========================================
REM HH Asia Tyre - Production Package Creator
REM Creates a clean ZIP file for deployment
REM ========================================

echo.
echo ========================================
echo  HH Asia Tyre - Package Creator
echo ========================================
echo.

REM Set variables
set PACKAGE_NAME=HH_Asia_Tyre_System_v1.0
set SOURCE_DIR=%~dp0
set OUTPUT_DIR=%USERPROFILE%\Desktop
set ZIP_FILE=%OUTPUT_DIR%\%PACKAGE_NAME%.zip

echo Source: %SOURCE_DIR%
echo Output: %ZIP_FILE%
echo.

REM Check if PowerShell is available
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PowerShell is required but not found.
    pause
    exit /b 1
)

echo Creating production package...
echo.

REM Create ZIP using PowerShell
powershell -Command ^
    "$sourcePath = '%SOURCE_DIR%';" ^
    "$zipPath = '%ZIP_FILE%';" ^
    "$exclude = @('.git', 'node_modules', 'dist', '.env', '*.log', 'test-results', 'screenshots');" ^
    "$tempDir = Join-Path $env:TEMP 'HHAsiaTyre_Temp';" ^
    "" ^
    "Write-Host 'Preparing files...' -ForegroundColor Cyan;" ^
    "" ^
    "if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force };" ^
    "New-Item -ItemType Directory -Path $tempDir -Force | Out-Null;" ^
    "" ^
    "Get-ChildItem -Path $sourcePath -Recurse |" ^
    "    Where-Object {" ^
    "        $excludePath = $_.FullName;" ^
    "        $shouldExclude = $false;" ^
    "        foreach ($ex in $exclude) {" ^
    "            if ($excludePath -match [regex]::Escape($ex)) {" ^
    "                $shouldExclude = $true;" ^
    "                break;" ^
    "            }" ^
    "        }" ^
    "        return -not $shouldExclude;" ^
    "    } |" ^
    "    ForEach-Object {" ^
    "        $relativePath = $_.FullName.Substring($sourcePath.Length);" ^
    "        $destPath = Join-Path $tempDir $relativePath;" ^
    "        if ($_.PSIsContainer) {" ^
    "            if (-not (Test-Path $destPath)) {" ^
    "                New-Item -ItemType Directory -Path $destPath -Force | Out-Null;" ^
    "            }" ^
    "        } else {" ^
    "            $destDir = Split-Path $destPath -Parent;" ^
    "            if (-not (Test-Path $destDir)) {" ^
    "                New-Item -ItemType Directory -Path $destDir -Force | Out-Null;" ^
    "            }" ^
    "            Copy-Item $_.FullName -Destination $destPath -Force;" ^
    "        }" ^
    "    };" ^
    "" ^
    "Write-Host 'Creating ZIP archive...' -ForegroundColor Cyan;" ^
    "Compress-Archive -Path (Join-Path $tempDir '\*') -DestinationPath $zipPath -Force;" ^
    "" ^
    "Remove-Item $tempDir -Recurse -Force;" ^
    "" ^
    "$fileSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2);" ^
    "Write-Host 'Package created successfully!' -ForegroundColor Green;" ^
    "Write-Host \"File: $zipPath\" -ForegroundColor Yellow;" ^
    "Write-Host \"Size: $fileSize MB\" -ForegroundColor Yellow;"

echo.
echo ========================================
echo  Package created successfully!
echo ========================================
echo.
echo Included in package:
echo   ✓ Source code (src/)
echo   ✓ Public assets (public/)
echo   ✓ Configuration files
echo   ✓ Documentation
echo   ✓ Database scripts
echo   ✓ Setup instructions
echo.
echo Excluded from package:
echo   ✗ .git directory
echo   ✗ node_modules (install with npm install)
echo   ✗ dist (build with npm run build)
echo   ✗ .env file (create from .env.example)
echo   ✗ Test results and screenshots
echo.
echo Next steps:
echo   1. Extract the ZIP file
echo   2. Open folder in terminal
echo   3. Run: npm install
echo   4. Run: cp .env.example .env
echo   5. Edit .env with your Supabase credentials
echo   6. Run: npm run dev
echo   7. Open: http://localhost:5173
echo.
pause
