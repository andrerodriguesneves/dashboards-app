# Teste direto para verificar o problema
$Url = "https://dashboards-939pi3ivg-andrerodriguesneves-projects.vercel.app"

Write-Host "Testing direct access: $Url" -ForegroundColor Cyan
Write-Host ""

# Test 1: Try to access the main page directly
Write-Host "=== TEST 1: DIRECT ACCESS ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 30 -MaximumRedirection 0
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content length: $($response.Content.Length)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Response Headers:" -ForegroundColor Red
        $_.Exception.Response.Headers | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    }
}
Write-Host ""

# Test 2: Try with different User-Agent
Write-Host "=== TEST 2: DIFFERENT USER-AGENT ===" -ForegroundColor Magenta
try {
    $headers = @{"User-Agent" = "curl/7.68.0"}
    $response = Invoke-WebRequest -Uri $Url -Method GET -Headers $headers -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content length: $($response.Content.Length)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Try to access a different Vercel project to compare
Write-Host "=== TEST 3: COMPARISON TEST ===" -ForegroundColor Magenta
try {
    $testUrl = "https://vercel.com"
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -TimeoutSec 30
    Write-Host "Vercel.com Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Vercel.com Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Direct tests completed!" -ForegroundColor Cyan
