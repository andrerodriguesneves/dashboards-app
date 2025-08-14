# Script simples para testar o projeto no Vercel
$Url = "https://dashboards-939pi3ivg-andrerodriguesneves-projects.vercel.app"

Write-Host "Testing project: $Url" -ForegroundColor Cyan
Write-Host ""

# Test 1: Main page
Write-Host "=== TEST 1: MAIN PAGE ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content length: $($response.Content.Length)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Test endpoint
Write-Host "=== TEST 2: TEST ENDPOINT ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/test" -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Debug endpoint
Write-Host "=== TEST 3: DEBUG ENDPOINT ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/debug" -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Initialize database
Write-Host "=== TEST 4: INITIALIZE DATABASE ===" -ForegroundColor Magenta
try {
    $body = '{"action": "init_database"}'
    $headers = @{"Content-Type" = "application/json"}
    $response = Invoke-WebRequest -Uri "$Url/api/debug" -Method POST -Body $body -Headers $headers -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Test write
Write-Host "=== TEST 5: TEST WRITE ===" -ForegroundColor Magenta
try {
    $body = '{"action": "test_write"}'
    $headers = @{"Content-Type" = "application/json"}
    $response = Invoke-WebRequest -Uri "$Url/api/debug" -Method POST -Body $body -Headers $headers -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "Tests completed!" -ForegroundColor Cyan
