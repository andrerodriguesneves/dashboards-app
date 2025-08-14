# Script para testar endpoint de health check
$Url = "https://dashboards-939pi3ivg-andrerodriguesneves-projects.vercel.app"

Write-Host "Testing health endpoint: $Url" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health endpoint
Write-Host "=== TEST 1: HEALTH ENDPOINT ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/health" -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: Health endpoint POST
Write-Host "=== TEST 2: HEALTH ENDPOINT POST ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/health" -Method POST -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "Health tests completed!" -ForegroundColor Cyan
