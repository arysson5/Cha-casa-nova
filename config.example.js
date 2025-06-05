// =============================
// ARQUIVO DE EXEMPLO - CONFIGURAÇÃO SEGURA
// =============================

// 📋 INSTRUÇÕES DE USO:
// 1. Copie este arquivo para 'config.js'
// 2. Substitua os valores de exemplo pelos seus dados reais
// 3. O arquivo config.js está no .gitignore e não será commitado

const CONFIG = {
    // Google Sheets API
    google: {
        // 🔑 Sua chave de API do Google Sheets
        apiKey: 'INSIRA_SUA_API_KEY_AQUI',

        // 📊 ID da sua planilha do Google Sheets
        spreadsheetId: 'INSIRA_SEU_SPREADSHEET_ID_AQUI',

        // 🔗 URL do seu Google Apps Script (Web App)
        webAppUrl: 'INSIRA_SUA_WEB_APP_URL_AQUI',

        // Configuração das abas da planilha (geralmente não precisa alterar)
        sheets: {
            convidados: 'convidados!A1:C200',
            presentes: 'Presentes!A1:D200',
            escolhidos: 'Escolhidos!A1:C200'
        }
    },

    // Configurações de administração
    admin: {
        // 🔐 Senha para acessar o painel administrativo
        password: 'INSIRA_SUA_SENHA_ADMIN_AQUI',

        // ⏱️ Timeout para requisições (em milissegundos)
        timeout: 15000
    },

    // Endereço para entrega de presentes
    delivery: {
        address: {
            street: 'Sua Rua, Número - Bairro',
            complement: 'Complemento (Bloco, Apt, etc)',
            city: 'Sua Cidade - Estado',
            zipCode: '00000-000'
        }
    }
};

// Tornar disponível globalmente
window.CONFIG = CONFIG;