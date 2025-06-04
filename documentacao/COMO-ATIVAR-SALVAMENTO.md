# 🔧 Como Ativar o Salvamento na Planilha

## 🎯 **Problema Atual**
Sua API Key do Google Sheets **só permite leitura**, não escrita. Para salvar dados (presentes, escolhas) diretamente do site, você precisa de uma solução diferente.

## ✅ **SOLUÇÃO RECOMENDADA: Google Apps Script**

### 🏆 **Por que usar Apps Script?**
- ✅ **100% Gratuito**
- ✅ **Sem limitações de escrita**
- ✅ **Funciona perfeitamente**
- ✅ **Criado pelo próprio Google**
- ✅ **Não precisa configurar OAuth**

---

## 📋 **Passo a Passo Completo**

### **1. Criar o Google Apps Script**

#### 1.1. Acessar o Apps Script
- Vá para: **https://script.google.com**
- Faça login com sua conta Google
- Clique em **"Novo projeto"**

#### 1.2. Copiar o Código
- Abra o arquivo `google-apps-script.js` (que criei para você)
- **Copie TODO o conteúdo** (Ctrl+A, Ctrl+C)
- **Cole no editor** do Apps Script (substitua o código padrão)

#### 1.3. Configurar a Planilha ID
Na linha 15 do Apps Script, já está configurado:
```javascript
const SPREADSHEET_ID = '1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y';
```

#### 1.4. Salvar o Projeto
- **Ctrl+S** ou clique no ícone de salvar
- Nomeie o projeto: `"API-Presentes-Chá"`

### **2. Publicar como Web App**

#### 2.1. Implementar
- Clique em **"Implementar"** (botão azul no topo)
- Selecione **"Nova implementação"**

#### 2.2. Configurar Implementação
- **Tipo:** `Web app`
- **Executar como:** `Eu (seu email)`
- **Quem tem acesso:** `Qualquer pessoa`

#### 2.3. Autorizar
- Clique **"Implementar"**
- Aparecerá tela de autorização → **"Análise avançada"**
- **"Ir para API-Presentes-Chá (não seguro)"**
- **"Permitir"**

#### 2.4. Copiar URL
- Copie a **URL da implementação**
- Será algo como: `https://script.google.com/macros/s/ABCD1234567890/exec`

### **3. Configurar no seu Site**

#### 3.1. Editar arquivo JavaScript
- Abra `admin-presentes-apps-script.js`
- Na **linha 8**, substitua:
```javascript
webAppUrl: 'COLE_AQUI_A_URL_DO_SEU_APPS_SCRIPT',
```

Por:
```javascript
webAppUrl: 'https://script.google.com/macros/s/SUAURLAQUI/exec',
```

#### 3.2. Usar o novo arquivo
- Substitua `admin-presentes.js` por `admin-presentes-apps-script.js`
- Ou renomeie o arquivo

#### 3.3. Atualizar HTML (se necessário)
Se estiver usando o arquivo com nome diferente, atualize o HTML:
```html
<script src="admin-presentes-apps-script.js"></script>
```

### **4. Testar o Sistema**

#### 4.1. Primeira execução
- Abra `admin-presentes.html`
- Faça login com senha: `admin123`
- O sistema irá **testar automaticamente** a conexão

#### 4.2. Se tudo estiver certo
- ✅ Aparecerá: **"Google Apps Script conectado com sucesso"**
- ✅ Você poderá **adicionar presentes** e eles serão salvos na planilha
- ✅ Os convidados poderão **escolher presentes** normalmente

#### 4.3. Se houver erro
- ❌ Verifique se a URL está correta
- ❌ Confirme se o Apps Script foi publicado como "Web app"
- ❌ Teste acessar a URL diretamente no navegador

---

## 🛠️ **Outras Soluções (Alternativas)**

### **Opção 2: OAuth2 (Mais Complexo)**
```javascript
// Requer configuração de OAuth2
// Mais complexo, mas permite uso direto da API
// Necessário criar projeto no Google Cloud Console
```

### **Opção 3: Serviços Terceiros**
- **Zapier:** Conecta formulários web à planilhas
- **Make.com:** Similar ao Zapier
- **Formulários Google:** Redirect para Google Forms

### **Opção 4: Backend Próprio**
- Criar servidor Node.js/PHP
- Usar service account do Google
- Hospedar em Heroku/Vercel

---

## 🎯 **Resumo do Fluxo**

### **Antes (só leitura):**
```
Site → API Key → Google Sheets (❌ só lê)
```

### **Depois (com Apps Script):**
```
Site → Google Apps Script → Google Sheets (✅ lê e escreve)
```

---

## 📞 **Troubleshooting**

### **Erro: "Google Apps Script não configurado"**
- Verifique se a URL foi colada corretamente
- Confirme se contém `/exec` no final

### **Erro 403: Forbidden**
- O Apps Script não foi publicado como "Web app"
- Ou não foi configurado para "Qualquer pessoa"

### **Erro: "Planilha não encontrada"**
- Confirme se o SPREADSHEET_ID está correto
- Verifique se você tem acesso à planilha

### **Apps Script não salva**
- Confirme se as abas existem: `convidados`, `Presentes`, `Escolhidos`
- O Apps Script cria as abas automaticamente se não existirem

---

## ✨ **Benefícios do Apps Script**

1. **🆓 Completamente Gratuito**
2. **🔐 Seguro** (roda nos servidores Google)
3. **⚡ Rápido** (latência baixa)
4. **🔄 Automático** (cria abas se não existirem)
5. **📊 Validação** (previne duplicação de escolhas)
6. **🛡️ Robusto** (tratamento de erros integrado)

---

## 🎉 **Resultado Final**

Após configurar, seu sistema terá:
- ✅ **Leitura** da planilha (funciona)
- ✅ **Escrita** na planilha (vai funcionar!)
- ✅ **Adição de presentes** pelo admin
- ✅ **Escolha de presentes** pelos convidados
- ✅ **Cadastro automático** de novos convidados
- ✅ **Estatísticas em tempo real**

**Dificuldade:** 🟢 Fácil (10-15 minutos)
**Custo:** 🆓 Gratuito
**Resultado:** 🎯 100% Funcional 