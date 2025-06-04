// =============================
// CONFIGURAÇÕES GOOGLE APPS SCRIPT
// =============================
const ADMIN_CONFIG = {
    // URL do Google Apps Script (Nova API melhorada)
    webAppUrl: 'https://script.google.com/macros/s/AKfycbx_DSOIhw0uz2LcQTSarIQbEbscovu6WGza6Bua4IsqN5o99rFKJnncqmlm0zVek2Ej/exec',

    // Configurações de acesso
    adminPassword: 'admin123', // Altere para uma senha mais segura

    // Timeout para requisições
    timeout: 15000, // 15 segundos

    // Configuração de fallback para API Key (caso Apps Script falhe)
    apiKey: 'AIzaSyBW98wPFQdj5DscddMnWNG3TBQptj69uPI',
    spreadsheetId: '1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y',

    // Abas da planilha (limitadas a 200 linhas para performance)
    sheets: {
        convidados: 'convidados!A1:C200', // Nome, Email, Quantidade
        presentes: 'Presentes!A1:D200', // Nome, URL, Preço, Foto
        escolhidos: 'Escolhidos!A1:C200' // Email, Nome, Presente
    }
};

// =============================
// VARIÁVEIS GLOBAIS
// =============================
let adminLoggedIn = false;
let adminGifts = [];
let adminGuests = [];
let adminChosenGifts = [];
let editingGiftId = null;
let hasAppsScript = false; // Controle se Apps Script está funcionando
let useAppsScript = true; // Preferir Apps Script quando disponível

// Imagem placeholder base64 (ícone de presente bonito)
const DEFAULT_GIFT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGOUZBRkIiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ2lmdEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhBMkJFMjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREVBMEREO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDEwMCkiPgogICAgPCEtLSBCYXNlIGRvIHByZXNlbnRlIC0tPgogICAgPHJlY3QgeD0iLTMwIiB5PSItMTUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NSIgZmlsbD0idXJsKCNnaWZ0R3JhZGllbnQpIiByeD0iNCIvPgogICAgPCEtLSBGaXRhIGhvcml6b250YWwgLS0+CiAgICA8cmVjdCB4PSItMzUiIHk9Ii01IiB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIEZpdGEgdmVydGljYWwgLS0+CiAgICA8cmVjdCB4PSItNSIgeT0iLTMwIiB3aWR0aD0iMTAiIGhlaWdodD0iNjAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIExhw6dvIC0tPgogICAgPGVsbGlwc2UgY3g9Ii0xNSIgY3k9Ii0yNSIgcng9IjgiIHJ5PSI1IiBmaWxsPSIjRkZENzAwIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMTUiIGN5PSItMjUiIHJ4PSI4IiByeT0iNSIgZmlsbD0iI0ZGRDcwMCIgdHJhbnNmb3JtPSJyb3RhdGUoMTUpIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODMiIGZvbnQtd2VpZ2h0PSI1MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjI4gU2VtIEltYWdlbTwvdGV4dD4KPC9zdmc+';

// =============================
// INICIALIZAÇÃO
// =============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Sistema Admin de Presentes Iniciado');

    // Event Listeners
    setupAdminEventListeners();

    // Inicializar Google API sempre (para leitura)
    initializeGoogleAPI();

    // Testar Apps Script (apenas para escrita)
    testAppsScriptConnection();

    // Verificar se admin já está logado
    checkAdminStoredLogin();
});

// =============================
// VERIFICAÇÃO DA NOVA APPS SCRIPT API
// =============================
async function testAppsScriptConnection() {
    try {
        console.log('🔍 Testando conexão com Nova Apps Script API...');

        // Usar GET para evitar problemas de CORS com preflight
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout

        const response = await fetch(ADMIN_CONFIG.webAppUrl + '?action=test', {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API:', result);

        if (result.success) {
            console.log('✅ Nova Apps Script API conectada com sucesso');
            hasAppsScript = true;
            useAppsScript = true;
            showAppsScriptSuccess();
        } else {
            throw new Error(result.error || 'Resposta inválida da Nova API');
        }

    } catch (error) {
        console.error('❌ Nova Apps Script API não disponível:', error);
        hasAppsScript = false;
        useAppsScript = false;

        // Fallback para Google Sheets API
        console.log('🔄 Tentando fallback para Google Sheets API...');
        initializeGoogleAPI();
    }
}

function showAppsScriptSuccess() {
    const alertDiv = document.querySelector('.alert-warning');
    if (alertDiv) {
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>✅ Nova Apps Script API Conectada com Sucesso!</strong><br>
            O sistema está funcionando com total capacidade de escrita na planilha usando a API melhorada.
            <br><br>
            <small>
                <i class="fas fa-info-circle"></i> 
                <strong>Status:</strong> Salvamento automático ativo | 
                <strong>Versão:</strong> Nova API 2.0
            </small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }
}

// =============================
// CONFIGURAÇÃO DA API DO GOOGLE (FALLBACK)
// =============================
function initializeGoogleAPI() {
    gapi.load('client', async() => {
        try {
            await gapi.client.init({
                apiKey: ADMIN_CONFIG.apiKey,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
            });

            console.log('✅ Google Sheets API inicializada como fallback');
            showApiFallbackWarning();

        } catch (error) {
            console.error('❌ Erro ao inicializar Google API:', error);
            showApiError();
        }
    });
}

function showApiFallbackWarning() {
    const alertDiv = document.querySelector('.alert-warning');
    if (alertDiv) {
        alertDiv.className = 'alert alert-warning alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>⚠️ Usando Modo Fallback (Somente Leitura)</strong><br>
            O Apps Script não está acessível. Sistema funcionando em modo de leitura apenas.
            <br><br>
            <strong>Para ativar escrita:</strong> Verifique se o Apps Script foi publicado como "Web app" público
            <br>
            <small>
                <i class="fas fa-link"></i> 
                <a href="${ADMIN_CONFIG.webAppUrl}" target="_blank" class="alert-link">
                   Testar Apps Script diretamente
                </a>
            </small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }
}

function showApiError() {
    const alertDiv = document.querySelector('.alert-warning');
    if (alertDiv) {
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            <i class="fas fa-times-circle"></i>
            <strong>❌ Erro de Conexão</strong><br>
            Não foi possível conectar nem com Apps Script nem com Google Sheets API.
            <br><br>
            <strong>Verifique:</strong> Conexão com internet e configurações de firewall
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    }
}

// =============================
// COMUNICAÇÃO COM NOVA APPS SCRIPT API
// =============================
async function callAppsScript(action, data) {
    if (!hasAppsScript) {
        throw new Error('Nova Apps Script API não configurada');
    }

    try {
        console.log(`📡 Chamando Nova API - Ação: ${action} (GET)`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), ADMIN_CONFIG.timeout);

        // Usar GET com query parameters para evitar CORS completamente
        const params = new URLSearchParams();
        params.append('action', action);

        // Adicionar dados extras
        Object.keys(data).forEach(key => {
            if (typeof data[key] === 'object' && data[key] !== null) {
                // Para objetos, adicionar propriedades individuais
                Object.keys(data[key]).forEach(subKey => {
                    params.append(subKey, data[key][subKey]);
                });
            } else {
                params.append(key, data[key]);
            }
        });

        const response = await fetch(ADMIN_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`📡 Resposta da Nova API (${action}):`, result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro desconhecido na Nova API');
        }

        return result;

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout');
        }

        console.error('❌ Erro na chamada da Nova Apps Script API:', error);
        throw new Error(`Nova API falhou: ${error.message}`);
    }
}

// =============================
// EVENT LISTENERS
// =============================
function setupAdminEventListeners() {
    // Login admin
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);

    // Formulário de presentes
    document.getElementById('giftForm').addEventListener('submit', handleAddGift);

    // Filtros admin
    document.getElementById('adminStatusFilter').addEventListener('change', applyAdminFilters);
    document.getElementById('adminSearchFilter').addEventListener('input', applyAdminFilters);
}

// =============================
// AUTENTICAÇÃO ADMIN
// =============================
function checkAdminStoredLogin() {
    const storedAdmin = localStorage.getItem('adminLoggedIn');
    if (storedAdmin === 'true') {
        adminLoggedIn = true;
        showAdminPanel();
        loadAdminData();
    }
}

function handleAdminLogin(e) {
    e.preventDefault();

    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('adminLoginBtn');
    const originalText = loginBtn.innerHTML;

    // Verificar senha
    if (password === ADMIN_CONFIG.adminPassword) {
        // Login bem-sucedido
        adminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');

        loginBtn.innerHTML = '<i class="fas fa-check"></i> Acesso Liberado!';
        loginBtn.classList.remove('btn-primary');
        loginBtn.classList.add('btn-success');

        setTimeout(() => {
            showAdminPanel();
            loadAdminData();
        }, 1000);

    } else {
        showAdminMessage('Senha incorreta!', 'danger');
        loginBtn.innerHTML = '<i class="fas fa-times"></i> Senha Incorreta';
        loginBtn.classList.remove('btn-primary');
        loginBtn.classList.add('btn-danger');

        setTimeout(() => {
            loginBtn.innerHTML = originalText;
            loginBtn.classList.remove('btn-danger');
            loginBtn.classList.add('btn-primary');
        }, 2000);
    }
}

function showAdminPanel() {
    document.getElementById('adminLoginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// =============================
// CARREGAMENTO DE DADOS ADMIN
// =============================
async function loadAdminData() {
    try {
        showLoadingState(true);

        // Sempre usar Google Sheets API para leitura
        console.log('📖 Carregando dados admin via Google Sheets API...');
        await loadDataViaApi();

        // Atualizar estatísticas
        updateAdminStatistics();

        // Exibir listas
        displayAdminGifts();
        displayChosenGifts();
        displayGuestsList();

    } catch (error) {
        console.error('Erro ao carregar dados admin:', error);
        showAdminMessage('Erro ao carregar dados: ' + error.message, 'danger');
    } finally {
        showLoadingState(false);
    }
}

async function loadDataViaApi() {
    try {
        // Aguardar a API estar pronta
        if (!gapi.client || !gapi.client.sheets) {
            console.log('⏳ Aguardando Google Sheets API...');
            await waitForGoogleAPI();
        }

        // Carregar todas as informações necessárias em paralelo
        await Promise.all([
            loadAdminGiftsList(),
            loadAdminGuestsList(),
            loadAdminChosenGifts()
        ]);

        console.log(`✅ Admin dados carregados: ${adminGifts.length} presentes, ${adminGuests.length} convidados, ${adminChosenGifts.length} escolhidos`);

    } catch (error) {
        console.error('❌ Erro ao carregar via API:', error);
        throw error;
    }
}

function waitForGoogleAPI() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos

        const checkAPI = () => {
            attempts++;

            if (gapi.client && gapi.client.sheets) {
                resolve();
            } else if (attempts >= maxAttempts) {
                reject(new Error('Timeout aguardando Google Sheets API'));
            } else {
                setTimeout(checkAPI, 500);
            }
        };

        checkAPI();
    });
}

async function loadAdminGiftsList() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ADMIN_CONFIG.spreadsheetId,
            range: ADMIN_CONFIG.sheets.presentes
        });

        const rows = response.result.values || [];
        adminGifts = rows.slice(1).map((row, index) => ({
            id: index + 1,
            name: row[0] || '',
            url: row[1] || '',
            price: row[2] || '',
            imageUrl: row[3] || DEFAULT_GIFT_IMAGE
        })).filter(gift => gift.name);

        console.log(`✅ ${adminGifts.length} presentes carregados (Admin)`);

    } catch (error) {
        console.error('Erro ao carregar presentes (Admin):', error);
        throw error;
    }
}

async function loadAdminGuestsList() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ADMIN_CONFIG.spreadsheetId,
            range: ADMIN_CONFIG.sheets.convidados
        });

        const rows = response.result.values || [];
        adminGuests = rows.slice(1).map(row => ({
            name: row[0] || '',
            email: (row[1] || '').toLowerCase(),
            count: row[2] || '1' // Padrão 1 se estiver vazio
        })).filter(guest => guest.name && guest.email); // Só incluir convidados com nome e email

        console.log(`✅ ${adminGuests.length} convidados carregados (Admin)`);

    } catch (error) {
        console.error('Erro ao carregar convidados (Admin):', error);
        throw error;
    }
}

async function loadAdminChosenGifts() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ADMIN_CONFIG.spreadsheetId,
            range: ADMIN_CONFIG.sheets.escolhidos
        });

        const rows = response.result.values || [];
        adminChosenGifts = rows.slice(1).map(row => ({
            guestEmail: (row[0] || '').toLowerCase(),
            guestName: row[1] || '',
            giftName: row[2] || ''
        }));

        console.log(`✅ ${adminChosenGifts.length} presentes escolhidos carregados (Admin)`);

    } catch (error) {
        console.error('Erro ao carregar presentes escolhidos (Admin):', error);
        throw error;
    }
}

function processLoadedData(data) {
    // Processar convidados
    adminGuests = (data.convidados || []).map(row => ({
        name: row[0] || '',
        email: (row[1] || '').toLowerCase(),
        count: row[2] || '1'
    })).filter(guest => guest.name && guest.email);

    // Processar presentes
    adminGifts = (data.presentes || []).map((row, index) => ({
        id: index + 1,
        name: row[0] || '',
        url: row[1] || '',
        price: row[2] || '',
        imageUrl: row[3] || DEFAULT_GIFT_IMAGE
    })).filter(gift => gift.name);

    // Processar escolhidos
    adminChosenGifts = (data.escolhidos || []).map(row => ({
        guestEmail: (row[0] || '').toLowerCase(),
        guestName: row[1] || '',
        giftName: row[2] || ''
    }));

    console.log(`✅ Dados processados: ${adminGuests.length} convidados, ${adminGifts.length} presentes, ${adminChosenGifts.length} escolhidos`);
}

// =============================
// GERENCIAMENTO DE PRESENTES (CORREÇÕES)
// =============================
function editGift(giftId) {
    const gift = adminGifts.find(g => g.id === giftId);
    if (!gift) {
        console.warn('Presente não encontrado:', giftId);
        return;
    }

    console.log('✏️ Editando presente:', gift);

    // Preencher formulário do modal com dados do presente
    document.getElementById('editGiftId').value = gift.id;
    document.getElementById('editGiftName').value = gift.name;
    document.getElementById('editGiftUrl').value = gift.url || '';
    document.getElementById('editGiftPrice').value = gift.price || '';
    document.getElementById('editGiftImageUrl').value = gift.imageUrl === DEFAULT_GIFT_IMAGE ? '' : gift.imageUrl;

    // Mostrar modal de edição
    const editModal = new bootstrap.Modal(document.getElementById('editGiftModal'));
    editModal.show();

    showAdminMessage('Modal de edição aberto. Altere os campos e clique em "Salvar Alterações".', 'info');
}

async function updateGift() {
    const giftId = parseInt(document.getElementById('editGiftId').value);
    const giftData = {
        name: document.getElementById('editGiftName').value.trim(),
        url: document.getElementById('editGiftUrl').value.trim(),
        price: document.getElementById('editGiftPrice').value.trim(),
        imageUrl: document.getElementById('editGiftImageUrl').value.trim() || DEFAULT_GIFT_IMAGE
    };

    // Validar dados obrigatórios
    if (!giftData.name) {
        showAdminMessage('Nome é obrigatório!', 'danger');
        return;
    }

    try {
        // Atualizar localmente
        const giftIndex = adminGifts.findIndex(g => g.id === giftId);
        if (giftIndex !== -1) {
            adminGifts[giftIndex] = {
                ...adminGifts[giftIndex],
                ...giftData
            };

            // Fechar modal
            const editModal = bootstrap.Modal.getInstance(document.getElementById('editGiftModal'));
            editModal.hide();

            // Atualizar display
            displayAdminGifts();
            showAdminMessage('✅ Presente editado com sucesso! Para salvar permanentemente, atualize na planilha.', 'success');

            console.log('✅ Presente atualizado localmente:', adminGifts[giftIndex]);
        }

    } catch (error) {
        console.error('Erro ao atualizar presente:', error);
        showAdminMessage('❌ Erro ao atualizar presente: ' + error.message, 'danger');
    }
}

function deleteGift(giftId) {
    const gift = adminGifts.find(g => g.id === giftId);
    if (!gift) {
        console.warn('Presente não encontrado para exclusão:', giftId);
        return;
    }

    // Verificar se o presente foi escolhido
    const isChosen = adminChosenGifts.some(chosen => chosen.giftName === gift.name);

    let confirmMessage = `Tem certeza que deseja excluir o presente "${gift.name}"?`;
    if (isChosen) {
        const chosenData = adminChosenGifts.find(chosen => chosen.giftName === gift.name);
        confirmMessage += `\n\n⚠️ ATENÇÃO: Este presente foi escolhido por ${chosenData.guestName}!`;
        confirmMessage += '\n\nA exclusão também removerá a escolha deste convidado.';
    }

    if (confirm(confirmMessage)) {
        deleteGiftFromSheet(gift);
    }
}

async function deleteGiftFromSheet(gift) {
    try {
        console.log('🗑️ Iniciando exclusão do presente:', gift.name);

        // 1. TENTAR APPS SCRIPT PRIMEIRO
        if (useAppsScript && hasAppsScript) {
            try {
                await deleteGiftViaAppsScript(gift);
                showAdminMessage('🗑️ Presente excluído com sucesso via Apps Script!', 'success');

                // Recarregar dados
                await loadAdminData();
                return;

            } catch (appsScriptError) {
                console.warn('⚠️ Apps Script falhou para exclusão:', appsScriptError.message);
                hasAppsScript = false; // Marcar como indisponível
            }
        }

        // 2. FALLBACK: EXCLUSÃO LOCAL + INSTRUÇÕES MANUAIS
        console.log('📋 Usando exclusão local + instruções manuais');

        // Remover localmente
        const giftIndex = adminGifts.findIndex(g => g.id === gift.id);
        if (giftIndex !== -1) {
            adminGifts.splice(giftIndex, 1);
        }

        // Remover escolhas relacionadas
        const removedChoices = adminChosenGifts.filter(chosen => chosen.giftName === gift.name);
        adminChosenGifts = adminChosenGifts.filter(chosen => chosen.giftName !== gift.name);

        // Atualizar interface
        updateAdminStatistics();
        displayAdminGifts();
        displayChosenGifts();

        // Mostrar instruções manuais
        showManualDeleteInstructions(gift, removedChoices);

    } catch (error) {
        console.error('❌ Erro ao excluir presente:', error);
        showAdminMessage('❌ Erro ao excluir presente: ' + error.message, 'danger');
    }
}

async function deleteGiftViaAppsScript(gift) {
    try {
        console.log('📡 Excluindo presente via Nova Apps Script API (GET)...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), ADMIN_CONFIG.timeout);

        // Usar GET com query parameters
        const params = new URLSearchParams({
            action: 'deleteGift',
            giftName: gift.name
        });

        const response = await fetch(ADMIN_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (deleteGift):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao excluir presente na Nova API');
        }

        console.log('✅ Presente excluído via Nova Apps Script API:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao excluir presente');
        }

        console.error('❌ Erro ao excluir via Nova Apps Script API:', error);
        throw new Error(`Nova API falhou ao excluir: ${error.message}`);
    }
}

function showManualDeleteInstructions(gift, removedChoices) {
    const instructions = `
        <div class="alert alert-warning alert-dismissible fade show">
            <h5><i class="fas fa-trash-alt"></i> 🗑️ Excluir Manualmente na Planilha</h5>
            
            <p><strong>✅ Presente removido localmente!</strong><br>
            Para excluir definitivamente, faça as alterações manuais na planilha:</p>
            
            <div class="manual-data bg-light p-3 rounded mt-3">
                <h6>📝 Ações necessárias:</h6>
                
                <div class="mb-3">
                    <strong>1. Excluir na aba "Presentes":</strong><br>
                    <code>Localizar linha: ${gift.name}</code><br>
                    <small class="text-muted">Apagar toda a linha contendo este presente</small>
                </div>
                
                ${removedChoices.length > 0 ? `
                    <div class="mb-3">
                        <strong>2. Excluir na aba "Escolhidos":</strong><br>
                        ${removedChoices.map(choice => 
                            `<code>Linha: ${choice.guestEmail} | ${choice.giftName}</code><br>`
                        ).join('')}
                        <small class="text-muted">Apagar estas linhas de escolhas</small>
                    </div>
                ` : ''}
            </div>
            
            <div class="mt-3">
                <a href="https://docs.google.com/spreadsheets/d/${ADMIN_CONFIG.spreadsheetId}" target="_blank" class="btn btn-success btn-sm me-2">
                   <i class="fas fa-external-link-alt"></i> Abrir Planilha
                </a>
                <button class="btn btn-primary btn-sm" onclick="loadAdminData()">
                   <i class="fas fa-refresh"></i> Recarregar Dados
                </button>
            </div>
            
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Mostrar instruções na área de mensagens
    const messageDiv = document.getElementById('adminLoginMessage');
    messageDiv.innerHTML = instructions;

    console.log('📋 Instruções de exclusão manual exibidas para:', gift.name);
}

// =============================
// GERENCIAMENTO DE PRESENTES
// =============================
async function handleAddGift(e) {
    e.preventDefault();

    const saveBtn = document.getElementById('saveGiftBtn');
    const originalText = saveBtn.innerHTML;

    try {
        const giftData = {
            name: document.getElementById('giftName').value.trim(),
            url: document.getElementById('giftUrl').value.trim(),
            price: document.getElementById('giftPrice').value.trim(),
            imageUrl: document.getElementById('giftImageUrl').value.trim() || DEFAULT_GIFT_IMAGE
        };

        // Validar dados obrigatórios
        if (!giftData.name) {
            throw new Error('Nome é obrigatório!');
        }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        if (editingGiftId) {
            // Modo edição - atualizar localmente
            const giftIndex = adminGifts.findIndex(g => g.id === editingGiftId);
            if (giftIndex !== -1) {
                adminGifts[giftIndex] = {
                    ...adminGifts[giftIndex],
                    ...giftData
                };
                displayAdminGifts();
                showAdminMessage('✅ Presente editado localmente! Para salvar permanentemente, edite na planilha.', 'info');
            }
        } else {
            // Modo adição - sempre tentar Apps Script primeiro
            if (useAppsScript && hasAppsScript) {
                console.log('💾 Salvando via Apps Script...');
                await saveGiftViaAppsScript(giftData);
                showAdminMessage('🎉 Presente adicionado com sucesso via Apps Script!', 'success');

                // Recarregar dados
                await loadAdminData();

            } else {
                // Apps Script não disponível - instruções manuais
                console.log('📋 Apps Script indisponível, mostrando instruções manuais');
                showManualAddInstructions(giftData);

                // Não dar erro, apenas informar
                showAdminMessage('⚠️ Apps Script não disponível. Use as instruções para adicionar manualmente.', 'warning');
            }
        }

        // Limpar formulário
        resetGiftForm();

    } catch (error) {
        console.error('❌ Erro ao salvar presente:', error);
        showAdminMessage('❌ ' + (error.message || 'Erro ao salvar presente.'), 'danger');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

async function saveGiftViaAppsScript(giftData) {
    try {
        console.log('📡 Salvando presente via Nova Apps Script API (GET)...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), ADMIN_CONFIG.timeout);

        // Usar GET com query parameters para evitar CORS completamente
        const params = new URLSearchParams({
            action: 'addGift',
            name: giftData.name || '',
            url: giftData.url || '',
            price: giftData.price || '',
            imageUrl: giftData.imageUrl || ''
        });

        const response = await fetch(ADMIN_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (addGift):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao salvar presente na Nova API');
        }

        console.log('✅ Presente salvo via Nova Apps Script API com sucesso:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao salvar presente');
        }

        console.error('❌ Erro ao salvar via Nova Apps Script API:', error);
        throw new Error(`Nova API falhou: ${error.message}`);
    }
}

function showManualAddInstructions(giftData) {
    const instructions = `
        <div class="alert alert-warning alert-dismissible fade show">
            <h5><i class="fas fa-info-circle"></i> 📋 Adicionar Manualmente na Planilha</h5>
            
            <p><strong>⚠️ Sistema em Modo Somente Leitura</strong><br>
            A Google Sheets API não permite escrita com chave pública.</p>
            
            <div class="manual-data bg-light p-3 rounded mt-3">
                <h6>📝 Dados para copiar:</h6>
                <div class="row">
                    <div class="col-md-6">
                        <strong>Nome:</strong> <code>${giftData.name}</code><br>
                        <strong>URL:</strong> <code>${giftData.url || '(vazio)'}</code>
                    </div>
                    <div class="col-md-6">
                        <strong>Preço:</strong> <code>${giftData.price || '(vazio)'}</code><br>
                        <strong>Foto:</strong> <code>${giftData.imageUrl === DEFAULT_GIFT_IMAGE ? '(usar padrão)' : 'Link da imagem'}</code>
                    </div>
                </div>
            </div>
            
            <div class="mt-3">
                <a href="https://docs.google.com/spreadsheets/d/${ADMIN_CONFIG.spreadsheetId}" target="_blank" class="btn btn-success btn-sm me-2">
                   <i class="fas fa-external-link-alt"></i> Abrir Planilha
                </a>
                <button class="btn btn-primary btn-sm" onclick="showAppsScriptFullInstructions()">
                   <i class="fas fa-cog"></i> Configurar Apps Script
                </button>
            </div>
            
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Mostrar instruções na área de mensagens
    const messageDiv = document.getElementById('adminLoginMessage');
    messageDiv.innerHTML = instructions;

    console.log('📋 Instruções manuais exibidas para:', giftData);
}

function resetGiftForm() {
    document.getElementById('giftForm').reset();
    editingGiftId = null;

    // Restaurar texto do botão
    const saveBtn = document.getElementById('saveGiftBtn');
    saveBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Presente';
}

// =============================
// INSTRUÇÕES COMPLETAS
// =============================
function showAppsScriptFullInstructions() {
    // [Similar ao anterior, mas focado em Apps Script]
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'appsScriptInstructionsModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-code"></i> Configurar Google Apps Script
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <strong>🎯 O que é o Google Apps Script?</strong><br>
                        É um serviço gratuito do Google que permite criar APIs personalizadas para suas planilhas.
                        Com ele, você pode salvar dados diretamente do site na planilha.
                    </div>
                    
                    <h6><i class="fas fa-list-ol"></i> Passo a Passo:</h6>
                    <ol class="manual-steps">
                        <li><strong>1. Abrir Apps Script:</strong><br>
                            Acesse: <a href="https://script.google.com" target="_blank">script.google.com</a>
                        </li>
                        
                        <li><strong>2. Criar Projeto:</strong><br>
                            Clique em "Novo projeto"
                        </li>
                        
                        <li><strong>3. Colar o Código:</strong><br>
                            Abra o arquivo <code>google-apps-script.js</code> e copie todo o conteúdo<br>
                            Cole no editor do Apps Script
                        </li>
                        
                        <li><strong>4. Salvar:</strong><br>
                            Ctrl+S e dê um nome ao projeto (ex: "API-Presentes")
                        </li>
                        
                        <li><strong>5. Publicar:</strong><br>
                            Clique em <strong>"Implementar"</strong> → <strong>"Nova implementação"</strong><br>
                            Tipo: <strong>"Web app"</strong><br>
                            Executar como: <strong>"Eu"</strong><br>
                            Acesso: <strong>"Qualquer pessoa"</strong>
                        </li>
                        
                        <li><strong>6. Copiar URL:</strong><br>
                            Copie a URL gerada (algo como https://script.google.com/macros/s/ABCD.../exec)
                        </li>
                        
                        <li><strong>7. Configurar aqui:</strong><br>
                            Cole a URL na linha 8 do arquivo <code>admin-presentes-apps-script.js</code>
                        </li>
                        
                        <li><strong>8. Testar:</strong><br>
                            Recarregue esta página e teste adicionar um presente
                        </li>
                    </ol>
                    
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        <strong>Vantagens:</strong> Funciona 100%, sem limitações, totalmente gratuito!
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="https://script.google.com" target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> Abrir Apps Script
                    </a>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i> Fechar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

// =============================
// DEMAIS FUNÇÕES (IGUAIS AO ORIGINAL)
// =============================

// [Incluir todas as outras funções do admin original: 
// updateAdminStatistics, displayAdminGifts, displayChosenGifts, 
// displayGuestsList, applyAdminFilters, showAdminMessage, etc.]

function updateAdminStatistics() {
    const totalGifts = adminGifts.length;
    const chosenCount = adminChosenGifts.length;
    const totalGuests = adminGuests.length;
    const completionRate = totalGifts > 0 ? Math.round((chosenCount / totalGifts) * 100) : 0;

    document.getElementById('totalAdminGifts').textContent = totalGifts;
    document.getElementById('chosenAdminGifts').textContent = chosenCount;
    document.getElementById('totalGuests').textContent = totalGuests;
    document.getElementById('completionPercent').textContent = completionRate + '%';
}

function displayAdminGifts(filteredGifts = null) {
    const giftsContainer = document.getElementById('adminGiftsList');
    const giftsToShow = filteredGifts || adminGifts;

    if (giftsToShow.length === 0) {
        giftsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Nenhum presente encontrado</h5>
                <p class="text-muted">Adicione presentes ou configure o Apps Script.</p>
            </div>
        `;
        return;
    }

    giftsContainer.innerHTML = giftsToShow.map(gift => {
                const isChosen = adminChosenGifts.some(chosen => chosen.giftName === gift.name);
                const chosenData = adminChosenGifts.find(chosen => chosen.giftName === gift.name);

                return `
            <div class="admin-gift-item ${isChosen ? 'chosen' : ''}" data-status="${isChosen ? 'escolhido' : 'disponivel'}">
                <div class="gift-status-indicator ${isChosen ? 'status-chosen' : 'status-available'}">
                    ${isChosen ? '🎁 Escolhido' : '✅ Disponível'}
                </div>
                
                <div class="gift-item-header">
                    <div>
                        <h5 class="gift-item-title">${gift.name}</h5>
                        ${gift.price ? `<span class="gift-item-category">💰 ${gift.price}</span>` : ''}
                    </div>
                    <div class="gift-item-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="editGift(${gift.id})" title="Editar presente">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteGift(${gift.id})" title="Excluir presente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="gift-item-content">
                    <img src="${gift.imageUrl}" alt="${gift.name}" class="gift-item-image" onerror="this.src='${DEFAULT_GIFT_IMAGE}'">
                    <div class="gift-item-details">
                        <div class="gift-item-meta">
                            ${gift.url ? '<span><i class="fas fa-link"></i> Link disponível</span>' : ''}
                            ${isChosen ? `<span><i class="fas fa-user"></i> ${chosenData.guestName}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function displayChosenGifts() {
    const chosenContainer = document.getElementById('chosenGiftsList');

    if (adminChosenGifts.length === 0) {
        chosenContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-gift fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Nenhum presente escolhido ainda</h5>
                <p class="text-muted">Os presentes escolhidos aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    chosenContainer.innerHTML = adminChosenGifts.map(chosen => {
        const gift = adminGifts.find(g => g.name === chosen.giftName);
        const guestInitial = chosen.guestName.charAt(0).toUpperCase();

        return `
            <div class="chosen-gift-item">
                <div class="chosen-gift-header">
                    <h5 class="chosen-gift-name">${chosen.giftName}</h5>
                    ${gift && gift.price ? `<span class="chosen-gift-date">💰 ${gift.price}</span>` : ''}
                </div>
                
                <div class="chosen-guest-info">
                    <div class="guest-avatar">${guestInitial}</div>
                    <div class="guest-details">
                        <h6>${chosen.guestName}</h6>
                        <small>${chosen.guestEmail}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function displayGuestsList() {
    const guestsContainer = document.getElementById('guestsList');

    if (adminGuests.length === 0) {
        guestsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Nenhum convidado encontrado</h5>
                <p class="text-muted">Verifique a configuração do Apps Script.</p>
            </div>
        `;
        return;
    }

    guestsContainer.innerHTML = adminGuests.map(guest => {
        const hasGift = adminChosenGifts.some(chosen => chosen.guestEmail === guest.email);
        const chosenGift = adminChosenGifts.find(chosen => chosen.guestEmail === guest.email);

        return `
            <div class="guest-item">
                <div class="guest-item-header">
                    <h5 class="guest-name">${guest.name}</h5>
                    <span class="guest-status ${hasGift ? 'has-gift' : 'no-gift'}">
                        ${hasGift ? '🎁 Escolheu' : '⏳ Pendente'}
                    </span>
                </div>
                
                <div class="guest-details">
                    <p><i class="fas fa-envelope"></i> ${guest.email}</p>
                    <p><i class="fas fa-users"></i> ${guest.count} pessoa(s)</p>
                    ${hasGift ? `<p><i class="fas fa-gift"></i> <strong>Presente:</strong> ${chosenGift.giftName}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function applyAdminFilters() {
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const searchText = document.getElementById('adminSearchFilter').value.toLowerCase().trim();

    let filteredGifts = adminGifts.filter(gift => {
        let statusMatch = true;
        if (statusFilter === 'disponivel') {
            statusMatch = !adminChosenGifts.some(chosen => chosen.giftName === gift.name);
        } else if (statusFilter === 'escolhido') {
            statusMatch = adminChosenGifts.some(chosen => chosen.giftName === gift.name);
        }

        const searchMatch = !searchText ||
            gift.name.toLowerCase().includes(searchText) ||
            (gift.price && gift.price.toLowerCase().includes(searchText));

        return statusMatch && searchMatch;
    });

    displayAdminGifts(filteredGifts);
}

function exportChosenGifts() {
    if (adminChosenGifts.length === 0) {
        showAdminMessage('Nenhum presente escolhido para exportar.', 'warning');
        return;
    }

    const csvData = [
        ['Nome do Convidado', 'Email', 'Nome do Presente', 'Preço'],
        ...adminChosenGifts.map(chosen => {
            const gift = adminGifts.find(g => g.name === chosen.giftName);
            return [
                chosen.guestName,
                chosen.guestEmail,
                chosen.giftName,
                gift ? gift.price : ''
            ];
        })
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `presentes_escolhidos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAdminMessage('Lista exportada com sucesso! 📁', 'success');
}

function showAdminMessage(message, type = 'info') {
    const messageDiv = document.getElementById('adminLoginMessage');
    const alertClass = `alert alert-${type}`;

    messageDiv.innerHTML = `
        <div class="${alertClass}">
            <i class="fas fa-${getMessageIcon(type)}"></i> ${message}
        </div>
    `;

    setTimeout(() => {
        if (messageDiv.innerHTML.includes(message)) {
            messageDiv.innerHTML = '';
        }
    }, 5000);
}

function getMessageIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showLoadingState(show) {
    const loadingElements = document.querySelectorAll('.spinner-border');
    loadingElements.forEach(el => {
        el.style.display = show ? 'inline-block' : 'none';
    });
}

// =============================
// FUNÇÕES GLOBAIS ATUALIZADAS
// =============================
window.loadAdminData = loadAdminData;
window.resetGiftForm = resetGiftForm;
window.exportChosenGifts = exportChosenGifts;
window.showAppsScriptFullInstructions = showAppsScriptFullInstructions;
window.editGift = editGift;
window.updateGift = updateGift;
window.deleteGift = deleteGift;