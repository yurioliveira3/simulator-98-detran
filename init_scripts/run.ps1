$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptDir ".."
Set-Location $projectDir

Write-Host "Iniciando servidor em http://localhost:8080 ..." -ForegroundColor Cyan

$process = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", "8080" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

Start-Process "http://localhost:8080"

Write-Host "Servidor rodando! Pressione Ctrl+C para parar." -ForegroundColor Green

try {
    Wait-Process -Id $process.Id -ErrorAction Stop
} finally {
    Stop-Process -Id $process.Id -ErrorAction SilentlyContinue
}
