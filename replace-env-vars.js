// =============================
// SCRIPT PARA SUBSTITUIR VARIÁVEIS DE AMBIENTE NO VERCEL
// =============================
// Este script roda durante o build no Vercel

const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando substituição de variáveis de ambiente...');

// Arquivo a ser processado
const configFile = path.join(__dirname, 'config-vercel.js');

try {
    // Ler o arquivo
    let content = fs.readFileSync(configFile, 'utf8');

    // Mapeamento de placeholders para variáveis de ambiente
    const replacements = {
        'GOOGLE_API_KEY_PLACEHOLDER': process.env.GOOGLE_API_KEY || '',
        'GOOGLE_SPREADSHEET_ID_PLACEHOLDER': process.env.GOOGLE_SPREADSHEET_ID || '',
        'GOOGLE_WEB_APP_URL_PLACEHOLDER': process.env.GOOGLE_WEB_APP_URL || '',
        'ADMIN_PASSWORD_PLACEHOLDER': process.env.ADMIN_PASSWORD || 'admin123',
        'DELIVERY_STREET_PLACEHOLDER': process.env.DELIVERY_STREET || '',
        'DELIVERY_COMPLEMENT_PLACEHOLDER': process.env.DELIVERY_COMPLEMENT || '',
        'DELIVERY_CITY_PLACEHOLDER': process.env.DELIVERY_CITY || '',
        'DELIVERY_STATE_PLACEHOLDER': process.env.DELIVERY_STATE || '',
        'DELIVERY_ZIP_PLACEHOLDER': process.env.DELIVERY_ZIP || ''
    };

    // Substituir placeholders
    for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(placeholder, 'g'), value);
    }

    // Salvar arquivo processado
    fs.writeFileSync(configFile, content);

    console.log('✅ Variáveis de ambiente substituídas com sucesso!');
    console.log('📁 Arquivo processado:', configFile);

    // Log das variáveis (sem revelar valores sensíveis)
    Object.keys(replacements).forEach(key => {
        const envKey = key.replace('_PLACEHOLDER', '');
        const hasValue = process.env[envKey.replace('DELIVERY_', 'DELIVERY_')] ? '✅' : '❌';
        console.log(`${hasValue} ${envKey}`);
    });

} catch (error) {
    console.error('❌ Erro ao processar variáveis de ambiente:', error);
    process.exit(1);
}