# ⚡ Comandos Rápidos para Deploy

## 🚀 **EXECUTE ESTES COMANDOS AGORA:**

```bash
# 1. Verificar status do Git
git status

# 2. Adicionar todos os arquivos (exceto config.js que está protegido)
git add .

# 3. Fazer commit
git commit -m "🎁 Sistema pronto para Vercel - Chaves protegidas"

# 4. Criar repositório no GitHub (faça pelo site)
# Vá em: https://github.com/new

# 5. Conectar ao repositório (SUBSTITUA pela sua URL)
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 6. Enviar para o GitHub
git push -u origin main
```

## 🔗 **PRÓXIMOS PASSOS NO VERCEL:**

1. **Acesse:** https://vercel.com
2. **Login** com GitHub
3. **New Project** → Selecione seu repositório
4. **Configure:**
   - Framework: `Other`
   - Build Command: `node replace-env-vars.js`
   - Output Directory: `.`

## 🔑 **VARIÁVEIS DE AMBIENTE NO VERCEL:**

```
GOOGLE_API_KEY = SUA_CHAVE_API_REAL
GOOGLE_SPREADSHEET_ID = SEU_ID_PLANILHA_REAL
GOOGLE_WEB_APP_URL = SUA_URL_APPS_SCRIPT_REAL
ADMIN_PASSWORD = SUA_SENHA_ADMIN
DELIVERY_STREET = SEU_ENDEREÇO_COMPLETO
DELIVERY_COMPLEMENT = COMPLEMENTO_DO_ENDEREÇO
DELIVERY_CITY = SUA_CIDADE
DELIVERY_STATE = SEU_ESTADO
DELIVERY_ZIP = SEU_CEP
```

## ✅ **RESULTADO:**
- ✅ Site funcionando online
- ✅ Chaves de API protegidas  
- ✅ Código público sem dados sensíveis
- ✅ Deploy automático a cada mudança 