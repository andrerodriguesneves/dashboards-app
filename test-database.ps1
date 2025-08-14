# Script para testar o problema de gravação de dados
$Url = "https://dashboards-939pi3ivg-andrerodriguesneves-projects.vercel.app"

Write-Host "Testing database functionality: $Url" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if main page loads
Write-Host "=== TEST 1: MAIN PAGE ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Page loads successfully" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Try to access categories endpoint
Write-Host "=== TEST 2: CATEGORIES ENDPOINT ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/categories" -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Try to access dashboards endpoint
Write-Host "=== TEST 3: DASHBOARDS ENDPOINT ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "$Url/api/dashboards" -Method GET -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Try to add a category
Write-Host "=== TEST 4: ADD CATEGORY ===" -ForegroundColor Magenta
try {
    $body = '{"name": "Test Category"}'
    $headers = @{"Content-Type" = "application/json"}
    $response = Invoke-WebRequest -Uri "$Url/api/categories" -Method POST -Body $body -Headers $headers -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "Database tests completed!" -ForegroundColor Cyan
