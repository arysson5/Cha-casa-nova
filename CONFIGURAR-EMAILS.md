# 🚀 Guia Rápido - Configurar Emails

## 1️⃣ Crie Conta no EmailJS
1. Acesse: [emailjs.com](https://www.emailjs.com/)
2. Crie conta gratuita
3. Conecte seu Gmail/email

## 2️⃣ Crie 2 Templates

### Template 1: `template_organizer_notification`
**Para:** Você receber notificações
**Assunto:** `🎉 Nova confirmação - {{guest_name}}`
**Template:** Copie do arquivo `email-templates.md`

### Template 2: `template_guest_thanks` 
**Para:** Convidado receber agradecimento
**Assunto:** `🎉 Obrigado por confirmar - Chá de Casa Nova`
**Template:** Copie do arquivo `email-templates.md`

## 3️⃣ Configure no Código

No `index.html`, procure e substitua:

```javascript
// Linha ~708 - SEU EMAIL
to_email: "seu-email@exemplo.com", // ← COLOQUE SEU EMAIL AQUI

// Linha ~746 - SERVICE ID  
await emailjs.send('YOUR_SERVICE_ID', // ← COLOQUE SEU SERVICE ID

// Linha ~749 - SERVICE ID
await emailjs.send('YOUR_SERVICE_ID', // ← COLOQUE SEU SERVICE ID

// Linha ~636 - PUBLIC KEY
emailjs.init("YOUR_PUBLIC_KEY"); // ← COLOQUE SUA PUBLIC KEY
```

## 4️⃣ IDs que Você Precisa
- ✅ **Service ID** (ex: `service_abc123`)
- ✅ **Public Key** (ex: `user_xyz789`) 
- ✅ **Template ID 1:** `template_organizer_notification`
- ✅ **Template ID 2:** `template_guest_thanks`

## 5️⃣ Teste
1. Faça uma confirmação de teste
2. Verifique se chegaram 2 emails:
   - ✅ Para você (notificação)
   - ✅ Para o usuário (agradecimento)

---

## 📧 O que Acontece:
1. Usuário confirma presença
2. **Email 1:** Você recebe notificação com dados do convidado
3. **Email 2:** Convidado recebe agradecimento bonito
4. Modal de presentes aparece para o usuário

💜 **Pronto! Sistema completo funcionando!** 