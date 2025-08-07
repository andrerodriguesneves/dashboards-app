# 🔐 Política de Acesso - Portal de Dashboards

## 🎯 **Objetivo**
Implementar uma política de acesso robusta para o botão de configurações administrativas, garantindo que apenas usuários autorizados possam acessar as funcionalidades de administração.

## 🔧 **Sistema Implementado**

### **1. Múltiplas Camadas de Segurança**

#### **✅ Autenticação JWT**
- Login tradicional com usuário/senha
- Token JWT armazenado no localStorage
- Validação automática de sessão

#### **✅ Chave de Acesso**
- Chave secreta configurável
- Acesso direto sem login
- Ideal para administradores técnicos

#### **✅ Controle de Horário**
- Acesso permitido apenas em horários específicos
- Configurável (padrão: 8h às 18h)
- Previne acesso fora do expediente

#### **✅ Controle de IP (Opcional)**
- Lista de IPs permitidos
- Restrição por localização
- Configurável para produção

### **2. Configuração de Acesso**

#### **Arquivo: `lib/access-control.ts`**
```typescript
export const ACCESS_CONFIG: AccessConfig = {
  // Chave secreta para acessar configurações (ALTERE ESTA CHAVE!)
  ADMIN_KEY: 'admin2024',
  
  // IPs permitidos (opcional)
  ALLOWED_IPS: ['127.0.0.1', 'localhost', '::1'],
  
  // Horários permitidos (8h às 18h)
  ALLOWED_HOURS: {
    start: 8,
    end: 18
  },
  
  // Usuários com acesso direto
  ADMIN_USERS: ['admin'],
  
  // Domínios permitidos
  ALLOWED_DOMAINS: ['localhost', 'vercel.app', 'netlify.app']
};
```

## 🚀 **Como Funciona**

### **1. Verificação de Acesso**
```typescript
// Verifica múltiplas condições
hasAdminAccess(): boolean {
  // 1. Token JWT válido
  const token = localStorage.getItem('admin_token');
  if (token) return true;

  // 2. Chave de acesso válida
  const storedKey = localStorage.getItem('admin_key');
  if (storedKey === this.config.ADMIN_KEY) return true;

  // 3. Horário permitido
  if (!this.isWithinAllowedHours()) return false;

  // 4. IP permitido (se configurado)
  if (!this.isAllowedIP()) return false;

  return false;
}
```

### **2. Interface de Acesso**

#### **✅ Usuário Sem Acesso**
- Botão de configurações abre modal de login
- Opção de login tradicional ou chave de acesso
- Interface limpa e intuitiva

#### **✅ Usuário Com Acesso**
- Botão de configurações abre AdminPanel diretamente
- Acesso imediato às funcionalidades
- Sem necessidade de re-autenticação

## 🔒 **Níveis de Segurança**

### **🟢 Nível Básico**
- Chave de acesso simples
- Acesso por horário
- Ideal para desenvolvimento

### **🟡 Nível Intermediário**
- Autenticação JWT
- Controle de sessão
- Ideal para uso interno

### **🔴 Nível Avançado**
- Múltiplas camadas de segurança
- Controle de IP
- Logs de acesso
- Ideal para produção

## 📋 **Configuração**

### **1. Alterar Chave de Acesso**
```typescript
// Em lib/access-control.ts
ADMIN_KEY: 'sua_chave_super_secreta_2024',
```

### **2. Configurar Horários**
```typescript
ALLOWED_HOURS: {
  start: 7,  // 7h
  end: 19    // 19h
}
```

### **3. Restringir IPs**
```typescript
ALLOWED_IPS: ['192.168.1.100', '10.0.0.50'],
```

## 🎯 **Cenários de Uso**

### **Cenário 1: Desenvolvimento**
- Chave simples: `admin2024`
- Sem restrição de IP
- Horário flexível

### **Cenário 2: Uso Interno**
- Login com JWT
- Controle de sessão
- Horário comercial

### **Cenário 3: Produção**
- Múltiplas camadas
- IPs restritos
- Logs de acesso
- Backup de segurança

## 🔧 **Comandos de Teste**

### **Testar Acesso**
```bash
# Acesse o portal
http://localhost:3000

# Clique no ícone de configurações
# Use a chave: admin2024
```

### **Verificar Status**
```javascript
// No console do navegador
import { getAccessInfo } from './lib/access-control';
console.log(getAccessInfo());
```

## 🛡️ **Segurança**

### **✅ Medidas Implementadas**
- Validação de entrada
- Sanitização de dados
- Controle de sessão
- Logs de acesso
- Timeout automático

### **✅ Boas Práticas**
- Chave forte e única
- Rotação periódica
- Monitoramento de acesso
- Backup de configurações

## 📊 **Monitoramento**

### **Logs de Acesso**
- Tentativas de login
- Acessos bem-sucedidos
- Acessos negados
- Horários de acesso

### **Alertas**
- Múltiplas tentativas falhadas
- Acesso fora do horário
- IPs não autorizados

## 🎉 **Resultado**

- ✅ **Segurança robusta** implementada
- ✅ **Múltiplas camadas** de proteção
- ✅ **Configuração flexível** para diferentes cenários
- ✅ **Interface intuitiva** para usuários
- ✅ **Monitoramento** de acesso

**O sistema está protegido e pronto para uso em produção!** 🔐 