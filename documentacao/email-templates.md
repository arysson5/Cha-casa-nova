# 📧 Templates de Email para EmailJS

## 🔧 Configuração no EmailJS

### 1. Acesse [EmailJS.com](https://www.emailjs.com/)
### 2. Crie os dois templates abaixo
### 3. Substitua no código:
- `YOUR_SERVICE_ID` → ID do seu serviço
- `template_organizer_notification` → ID do template de notificação
- `template_guest_thanks` → ID do template de agradecimento
- `seu-email@exemplo.com` → Seu email real

---

## 📨 Template 1: Notificação para Organizador
**Template ID:** `template_organizer_notification`

### Subject:
```
🎉 Nova confirmação de presença - {{guest_name}}
```

### Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
    <div style="background: linear-gradient(45deg, #8a2be2, #dda0dd); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">🏠 Chá de Casa Nova</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Nova Confirmação de Presença</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #8a2be2; margin-top: 0;">✅ {{guest_name}} confirmou presença!</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📋 Detalhes da Confirmação:</h3>
            <ul style="color: #666; line-height: 1.6;">
                <li><strong>Nome:</strong> {{guest_name}}</li>
                <li><strong>Email:</strong> {{guest_email}}</li>
                <li><strong>Telefone:</strong> {{guest_phone}}</li>
                <li><strong>Número de pessoas:</strong> {{guest_count}}</li>
                <li><strong>Data da confirmação:</strong> {{confirmation_time}}</li>
            </ul>
        </div>
        
        {{#if guest_message}}
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #4caf50; margin: 20px 0;">
            <h4 style="color: #2e7d32; margin-top: 0;">💌 Mensagem do convidado:</h4>
            <p style="color: #2e7d32; font-style: italic; margin-bottom: 0;">"{{guest_message}}"</p>
        </div>
        {{/if}}
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">📅 Detalhes do Evento:</h4>
            <ul style="color: #856404; margin-bottom: 0;">
                <li><strong>Data:</strong> {{event_date}}</li>
                <li><strong>Horário:</strong> {{event_time}}</li>
                <li><strong>Local:</strong> {{event_location}}</li>
            </ul>
        </div>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>Este email foi enviado automaticamente pelo sistema de convites.</p>
        <p>💜 Chá de Casa Nova - Arysson & Nicole 🍻</p>
    </div>
</div>
```

---

## 🙏 Template 2: Agradecimento para Convidado
**Template ID:** `template_guest_thanks`

### Subject:
```
🎉 Obrigado por confirmar presença - Chá de Casa Nova
```

### Content:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
    <div style="background: linear-gradient(45deg, #8a2be2, #dda0dd); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">🏠 Chá de Casa Nova</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">{{organizer_names}}</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
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
                <li><strong>Número de pessoas:</strong> {{guest_count}}</li>
                <li><strong>Data:</strong> {{event_date}}</li>
                <li><strong>Horário:</strong> {{event_time}}</li>
                <li><strong>Local:</strong> {{event_location}}</li>
            </ul>
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
    
    <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
        <p>Nos vemos em breve! 🏠✨</p>
        <p style="margin: 0;">💜 Chá de Casa Nova - {{organizer_names}} 🍻</p>
    </div>
</div>
```

---

## ⚙️ Configuração Final

### No código `index.html`, substitua:

1. **Linha com `YOUR_SERVICE_ID`** → Seu Service ID do EmailJS
2. **Linha com `seu-email@exemplo.com`** → Seu email real
3. **Linha com `template_organizer_notification`** → ID do template de notificação
4. **Linha com `template_guest_thanks`** → ID do template de agradecimento

### Exemplo final:
```javascript
await emailjs.send('service_abc123', 'template_organizer_notification', organizerData);
await emailjs.send('service_abc123', 'template_guest_thanks', guestData);
```

---

## 🧪 Como Testar

1. Configure os templates no EmailJS
2. Atualize o código com seus IDs
3. Faça uma confirmação de teste
4. Verifique se chegaram os dois emails:
   - ✅ Para você (notificação)
   - ✅ Para o usuário teste (agradecimento)

---

## 📝 Variáveis Disponíveis

### Template do Organizador:
- `{{guest_name}}` - Nome do convidado
- `{{guest_email}}` - Email do convidado  
- `{{guest_phone}}` - Telefone do convidado
- `{{guest_count}}` - Número de pessoas
- `{{guest_message}}` - Mensagem do convidado
- `{{confirmation_time}}` - Data/hora da confirmação
- `{{event_date}}` - Data do evento
- `{{event_time}}` - Horário do evento
- `{{event_location}}` - Local do evento

### Template do Convidado:
- `{{to_name}}` - Nome do convidado
- `{{guest_count}}` - Número de pessoas
- `{{event_date}}` - Data do evento
- `{{event_time}}` - Horário do evento
- `{{event_location}}` - Local do evento
- `{{organizer_names}}` - Nomes dos organizadores 