// =============================
// CONFIGURAÇÃO PARA VERCEL
// =============================
// Este arquivo é usado quando o projeto roda no Vercel

// Função para detectar se está rodando no Vercel
function isVercel() {
    return window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('vercel.com') ||
        (window.location.hostname !== 'localhost' &&
            window.location.hostname !== '127.0.0.1' &&
            window.location.hostname !== '');
}

// Configuração para VERCEL (com valores reais - será substituído no build)
const CONFIG_VERCEL = {
    google: {
        // Valores que serão injetados durante o build do Vercel
        apiKey: 'AIzaSyBW98wPFQdj5DscddMnWNG3TBQptj69uPI',
        spreadsheetId: '1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbxjMP4PkKniGUG4is7f7pwf_sHELCz4zUZMzqZeg5AMOmeqUuvqTW21KSDrn1h1Fh61/exec',

        sheets: {
            convidados: 'convidados!A1:C200',
            presentes: 'presentes!A1:F200'
        }
    },

    admin: {
        password: 'admin123'
    },

    delivery: {
        address: {
            street: 'R. Canes, 159 - Jardim dos Veleiros',
            complement: '',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '04858-010'
        }
    }
};

// Sistema inteligente de configuração
if (typeof CONFIG === 'undefined') {
    if (isVercel()) {
        // No Vercel, usar as configurações já com os valores corretos
        window.CONFIG = CONFIG_VERCEL;
        console.log('🚀 Modo Vercel detectado - usando configuração fixa');
        console.log('📊 Spreadsheet ID:', CONFIG_VERCEL.google.spreadsheetId);
        console.log('🔑 API Key configured:', CONFIG_VERCEL.google.apiKey ? '✅' : '❌');
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