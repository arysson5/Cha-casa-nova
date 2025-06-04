# 📧 Template Unificado - EmailJS

## 🔧 Configuração no EmailJS

### 1. Crie um NOVO Template
- **Template ID:** `template_unified`
- **Name:** Template Unificado - Chá de Casa Nova

### 2. Configuração de Destinatários
No EmailJS, configure os emails de destino como:
- **To Email:** `{{to_email}}` (email do convidado)
- **Reply To:** `{{cc_email1}}` (organizador principal)
- **CC:** `{{cc_email1}},{{cc_email2}}` (os dois organizadores)

### 3. Subject:
```
🎉 Confirmação de Presença - Chá de Casa Nova {{organizer_names}}
```

### 4. Content (HTML):
```html
<div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
    <!-- Header -->
    <div style="background: linear-gradient(45deg, #8a2be2, #dda0dd); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">🏠 Chá de Casa Nova</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">{{organizer_names}}</p>
    </div>
    
    <!-- Agradecimento para o Convidado -->
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h2 style="color: #8a2be2; margin-top: 0;">Olá, {{to_name}}! 💜</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
            <strong>Que alegria receber sua confirmação!</strong> 🎉
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Estamos muito felizes em saber que você estará conosco para celebrar este momento tão especial. 
            Sua presença fará toda a diferença em nosso chá de casa nova!
        </p>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 25px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">✅ Confirmação Registrada:</h3>
            <ul style="color: #2e7d32; line-height: 1.6; margin-bottom: 0;">
                <li><strong>Nome:</strong> {{guest_name}}</li>
                <li><strong>Email:</strong> {{guest_email}}</li>
                <li><strong>Telefone:</strong> {{guest_phone}}</li>
                <li><strong>Número de pessoas:</strong> {{guest_count}}</li>
                <li><strong>Data:</strong> {{event_date}}</li>
                <li><strong>Horário:</strong> {{event_time}}</li>
                <li><strong>Local:</strong> {{event_location}}</li>
                <li><strong>Confirmado em:</strong> {{confirmation_time}}</li>
            </ul>
        </div>
        
        <!-- Mensagem do Convidado (se houver) -->
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; margin: 25px 0;">
            <h3 style="color: #e65100; margin-top: 0;">💌 Mensagem Especial:</h3>
            <p style="color: #e65100; font-style: italic; margin-bottom: 0; font-size: 16px; line-height: 1.6;">
                "{{guest_message}}"
            </p>
        </div>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 25px 0;">
            <h3 style="color: #856404; margin-top: 0;">🍻 Lembrete Importante:</h3>
            <p style="color: #856404; margin-bottom: 0; font-weight: 600;">
                Não esqueça de trazer sua bebida preferida! Assim nossa festa ficará ainda mais especial! 🥤🍺🥂
            </p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 25px 0;">
            <h3 style="color: #1565c0; margin-top: 0;">🎁 Lista de Presentes:</h3>
            <p style="color: #1565c0; margin-bottom: 15px;">
                Se quiser nos ajudar a mobiliar nossa nova casa, temos uma lista de presentes especial:
            </p>
            <a href="https://aryenick.meuchadepanela.com.br/#/" 
               style="background: #2196f3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                🎁 Ver Lista de Presentes
            </a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">
            Mal podemos esperar para te ver e celebrar juntos! 💕
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Com muito carinho,<br>
            <strong>{{organizer_names}}</strong> 💜
        </p>
    </div>
    
    <!-- Informações para os Organizadores -->
    <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; border: 2px dashed #8a2be2; margin: 20px 0;">
        <h3 style="color: #8a2be2; margin-top: 0; text-align: center;">📋 Resumo da Confirmação (Para Organizadores)</h3>
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p style="margin: 5px 0; color: #666;"><strong>Convidado:</strong> {{guest_name}}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Email:</strong> {{guest_email}}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Telefone:</strong> {{guest_phone}}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Pessoas:</strong> {{guest_count}}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Confirmado em:</strong> {{confirmation_time}}</p>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>Nos vemos em breve! 🏠✨</p>
        <p style="margin: 0;">💜 Chá de Casa Nova - {{organizer_names}} 🍻</p>
    </div>
</div>
```

---

## ⚙️ Como Configurar no EmailJS:

### Passo 1: Criar Template
1. Acesse [EmailJS Dashboard](https://dashboard.emailjs.com/admin)
2. Vá em "Email Templates"
3. Clique "Create New Template"
4. Nome: `Template Unificado - Chá de Casa Nova`
5. Template ID: `template_unified`

### Passo 2: Configurar Destinatários
Na seção "Settings" do template:

**To email:** 
```
{{to_email}}
```

**CC (carbon copy):**
```
{{cc_email1}},{{cc_email2}}
```

**Reply To:**
```
{{cc_email1}}
```

### Passo 3: Testar
Use o arquivo `test-email.html` atualizado para testar o envio.

---

## 🎯 Resultado:
- ✅ **1 email** enviado por confirmação
- ✅ Vai para o **convidado** (destinatário principal)
- ✅ **Cópia** para ambos organizadores
- ✅ **Mensagem do convidado** incluída
- ✅ Informações completas para todos
- ✅ Seção especial para organizadores 