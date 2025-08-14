# Script PowerShell para testar o projeto no Vercel
param(
    [string]$Url = "https://dashboards-app-git-main-andrerodriguesneves-projects.vercel.app"
)

Write-Host "🧪 Testando projeto no Vercel: $Url" -ForegroundColor Cyan
Write-Host ""

# Função para fazer requisição com tratamento de erro
function Test-Endpoint {
    param([string]$Endpoint, [string]$Method = "GET", [string]$Body = "")
    
    try {
        $uri = "$Url$Endpoint"
        Write-Host "🔍 Testando: $uri" -ForegroundColor Yellow
        
        $headers = @{
            "Content-Type" = "application/json"
            "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        
        if ($Method -eq "POST" -and $Body) {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -Body $Body -TimeoutSec 30
        } else {
            $response = Invoke-WebRequest -Uri $uri -Method $Method -Headers $headers -TimeoutSec 30
        }
        
        Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "📄 Resposta: $($response.Content)" -ForegroundColor White
        return $response
        
    } catch {
        Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        }
        return $null
    }
    Write-Host ""
}

# Teste 1: Página principal
Write-Host "=== TESTE 1: PÁGINA PRINCIPAL ===" -ForegroundColor Magenta
Test-Endpoint "/"

# Teste 2: Endpoint de teste
Write-Host "=== TESTE 2: ENDPOINT DE TESTE ===" -ForegroundColor Magenta
Test-Endpoint "/api/test"

# Teste 3: Endpoint de debug
Write-Host "=== TESTE 3: ENDPOINT DE DEBUG ===" -ForegroundColor Magenta
Test-Endpoint "/api/debug"

# Teste 4: Inicializar banco
Write-Host "=== TESTE 4: INICIALIZAR BANCO ===" -ForegroundColor Magenta
$initBody = '{"action": "init_database"}'
Test-Endpoint "/api/debug" "POST" $initBody

# Teste 5: Testar gravação
Write-Host "=== TESTE 5: TESTAR GRAVAÇÃO ===" -ForegroundColor Magenta
$writeBody = '{"action": "test_write"}'
Test-Endpoint "/api/debug" "POST" $writeBody

Write-Host "🎯 Testes concluídos!" -ForegroundColor Cyan
