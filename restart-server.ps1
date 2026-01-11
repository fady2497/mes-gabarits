# restart-server.ps1
Write-Host "🔄 Redémarrage du serveur backend avec MySQL..." -ForegroundColor Cyan
Write-Host ""

# Chercher et tuer le processus Node.js sur le port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Write-Host "⏹️  Arrêt de l'ancien serveur (PID: $process)..." -ForegroundColor Yellow
    Stop-Process -Id $process -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Serveur arrêté" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun serveur en cours sur le port 5000" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Démarrage du nouveau serveur avec MySQL..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run server"

Write-Host "✅ Serveur redémarré!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Testez l'API MySQL:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/api/orders" -ForegroundColor White
Write-Host ""
