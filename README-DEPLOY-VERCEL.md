# 🚀 Guia de Deploy no Vercel

## 📋 Pré-requisitos

1. ✅ Conta no [GitHub](https://github.com)
2. ✅ Conta no [Vercel](https://vercel.com)
3. ✅ Suas credenciais do Google Sheets prontas

## 🔧 Passo a Passo Completo

### **1. Preparar o Repositório GitHub**

```bash
# Inicializar Git (se ainda não foi)
git init

# Adicionar todos os arquivos (exceto config.js que está no .gitignore)
git add .

# Commit inicial
git commit -m "🎁 Projeto Lista de Presentes - Pronto para Vercel"

# Adicionar repositório remoto (substitua pelo seu)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# Enviar para o GitHub
git push -u origin main
```

### **2. Deploy no Vercel**

1. **Conectar GitHub ao Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub
   - Clique em "New Project"
   - Selecione seu repositório

2. **Configurar o Projeto:**
   - **Framework Preset:** Other
   - **Build Command:** `node replace-env-vars.js`
   - **Output Directory:** `.` (ponto)
   - **Install Command:** `npm install` (padrão)

### **3. Configurar Variáveis de Ambiente**

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### 🔑 **Google Sheets API:**
```
GOOGLE_API_KEY = sua_chave_api_aqui
GOOGLE_SPREADSHEET_ID = seu_id_planilha_aqui  
GOOGLE_WEB_APP_URL = sua_url_apps_script_aqui
```

#### 👤 **Administração:**
```
ADMIN_PASSWORD = sua_senha_admin_aqui
```

#### 📍 **Endereço de Entrega:**
```
DELIVERY_STREET = Rua Exemplo, 123 - Bairro
DELIVERY_COMPLEMENT = Apto 45 - Próximo ao mercado  
DELIVERY_CITY = Sua Cidade
DELIVERY_STATE = SP
DELIVERY_ZIP = 12345-678
```

### **4. Deploy e Teste**

1. **Fazer Deploy:**
   - Clique em "Deploy"
   - Aguarde o build terminar

2. **Testar o Site:**
   - Acesse a URL fornecida pelo Vercel
   - Teste as funcionalidades principais
   - Verifique se está carregando os dados da planilha

## 🔄 Atualizações Futuras

### Para fazer mudanças:
```bash
# Fazer suas alterações nos arquivos
git add .
git commit -m "🔧 Atualização: descrição das mudanças"
git push
```

O Vercel redeploya automaticamente a cada push no GitHub!

## 🆘 Solução de Problemas

### ❌ **Erro: "CONFIG is not defined"**
- **Causa:** Variáveis de ambiente não configuradas
- **Solução:** Verificar se todas as variáveis foram adicionadas no Vercel

### ❌ **Erro: "Build failed"**
- **Causa:** Script replace-env-vars.js não executou
- **Solução:** Verificar se package.json está commitado

### ❌ **Dados não carregam da planilha**
- **Causa:** Credenciais do Google incorretas
- **Solução:** Verificar GOOGLE_API_KEY e GOOGLE_SPREADSHEET_ID

## 📱 URLs de Acesso

Após o deploy, seu site estará disponível em:
- **Página Principal:** `https://seu-projeto.vercel.app/`
- **Página Admin:** `https://seu-projeto.vercel.app/admin`

## 🔒 Segurança Garantida

✅ **Chaves de API protegidas** (não aparecem no código público)  
✅ **Senhas seguras** (apenas no Vercel, não no GitHub)  
✅ **Endereço privado** (configurado via variáveis de ambiente)  
✅ **Código público** (sem informações sensíveis)

---

## 📞 Contato e Suporte

Se precisar de ajuda, verifique:
1. Console do navegador (F12)
2. Logs de build no Vercel
3. Configurações de variáveis de ambiente 