# Script para testar como um navegador
$Url = "https://dashboards-939pi3ivg-andrerodriguesneves-projects.vercel.app"

Write-Host "Testing as browser: $Url" -ForegroundColor Cyan
Write-Host ""

# Headers de navegador
$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Accept" = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    "Accept-Language" = "pt-BR,pt;q=0.9,en;q=0.8"
    "Accept-Encoding" = "gzip, deflate, br"
    "Connection" = "keep-alive"
    "Upgrade-Insecure-Requests" = "1"
}

# Test 1: Main page with browser headers
Write-Host "=== TEST 1: MAIN PAGE (BROWSER) ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -Headers $headers -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Content length: $($response.Content.Length)" -ForegroundColor White
    Write-Host "First 200 chars: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))" -ForegroundColor Gray
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Response Headers: $($_.Exception.Response.Headers)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 2: API endpoint with JSON headers
Write-Host "=== TEST 2: API TEST ENDPOINT ===" -ForegroundColor Magenta
$apiHeaders = $headers.Clone()
$apiHeaders["Accept"] = "application/json"
$apiHeaders["Content-Type"] = "application/json"

try {
    $response = Invoke-WebRequest -Uri "$Url/api/test" -Method GET -Headers $apiHeaders -TimeoutSec 30
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Response Headers: $($_.Exception.Response.Headers)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Check if it's a redirect
Write-Host "=== TEST 3: CHECK REDIRECTS ===" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri $Url -Method GET -Headers $headers -MaximumRedirection 0 -TimeoutSec 30
    Write-Host "No redirect - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 301 -or $_.Exception.Response.StatusCode -eq 302) {
        Write-Host "Redirect detected: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Location: $($_.Exception.Response.Headers.Location)" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "Browser tests completed!" -ForegroundColor Cyan
