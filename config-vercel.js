// =============================
// CONFIGURAÇÃO PARA VERCEL
// =============================
// Este arquivo é usado quando o projeto roda no Vercel
// As variáveis de ambiente são injetadas automaticamente

// Função para detectar se está rodando no Vercel
function isVercel() {
    return window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('vercel.com') ||
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';
}

// Configuração para Vercel (usando variáveis de ambiente)
const CONFIG_VERCEL = {
    google: {
        // No Vercel, estas variáveis são definidas no painel do Vercel
        apiKey: 'GOOGLE_API_KEY_PLACEHOLDER',
        spreadsheetId: 'GOOGLE_SPREADSHEET_ID_PLACEHOLDER',
        webAppUrl: 'GOOGLE_WEB_APP_URL_PLACEHOLDER',

        sheets: {
            convidados: 'convidados!A1:C200',
            presentes: 'presentes!A1:F200'
        }
    },

    admin: {
        password: 'ADMIN_PASSWORD_PLACEHOLDER'
    },

    delivery: {
        address: {
            street: 'DELIVERY_STREET_PLACEHOLDER',
            complement: 'DELIVERY_COMPLEMENT_PLACEHOLDER',
            city: 'DELIVERY_CITY_PLACEHOLDER',
            state: 'DELIVERY_STATE_PLACEHOLDER',
            zipCode: 'DELIVERY_ZIP_PLACEHOLDER'
        }
    }
};

// Sistema inteligente de configuração
if (typeof CONFIG === 'undefined') {
    if (isVercel()) {
        // No Vercel, usar as configurações com placeholders que serão substituídos
        window.CONFIG = CONFIG_VERCEL;
        console.log('🚀 Modo Vercel detectado - usando variáveis de ambiente');
    } else {
        // Localmente, tentar carregar config.js
        console.warn('⚠️ Config.js não encontrado e não está no Vercel');
        console.warn('📋 Copie config.example.js para config.js para desenvolvimento local');

        // Fallback para desenvolvimento sem config.js
        window.CONFIG = CONFIG_VERCEL;
    }
} else {
    console.log('✅ Config.js local carregado com sucesso');
}