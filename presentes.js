// =============================
// CONFIGURAÇÕES GOOGLE SHEETS
// =============================
const GOOGLE_CONFIG = {
    // Google Apps Script (Nova API melhorada)
    webAppUrl: 'https://script.google.com/macros/s/AKfycbxjMP4PkKniGUG4is7f7pwf_sHELCz4zUZMzqZeg5AMOmeqUuvqTW21KSDrn1h1Fh61/exec',

    // Fallback para API Key (somente leitura)
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
let currentUser = null;
let allGifts = [];
let allGuests = [];
let chosenGifts = [];
let isLoggedIn = false;
let useAppsScript = true; // Preferir Apps Script
let hasAppsScript = false; // Controle de disponibilidade

// Imagem placeholder base64 (ícone de presente bonito)
const DEFAULT_GIFT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGOUZBRkIiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ2lmdEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhBMkJFMjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREVBMEREO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDEwMCkiPgogICAgPCEtLSBCYXNlIGRvIHByZXNlbnRlIC0tPgogICAgPHJlY3QgeD0iLTMwIiB5PSItMTUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NSIgZmlsbD0idXJsKCNnaWZ0R3JhZGllbnQpIiByeD0iNCIvPgogICAgPCEtLSBGaXRhIGhvcml6b250YWwgLS0+CiAgICA8cmVjdCB4PSItMzUiIHk9Ii01IiB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIEZpdGEgdmVydGljYWwgLS0+CiAgICA8cmVjdCB4PSItNSIgeT0iLTMwIiB3aWR0aD0iMTAiIGhlaWdodD0iNjAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIExhw6dvIC0tPgogICAgPGVsbGlwc2UgY3g9Ii0xNSIgY3k9Ii0yNSIgcng9IjgiIHJ5PSI1IiBmaWxsPSIjRkZENzAwIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMTUiIGN5PSItMjUiIHJ4PSI4IiByeT0iNSIgZmlsbD0iI0ZGRDcwMCIgdHJhbnNmb3JtPSJyb3RhdGUoMTUpIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODMiIGZvbnQtd2VpZ2h0PSI1MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjI4gU2VtIEltYWdlbTwvdGV4dD4KPC9zdmc+';

// =============================
// INICIALIZAÇÃO
// =============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎁 Sistema de Lista de Presentes Iniciado');
    console.log('📱 DOM carregado, configurando sistema...');

    // Event Listeners
    setupEventListeners();

    // Verificar se usuário já está logado
    checkStoredLogin();

    // Aguardar um pouco para garantir que todos os scripts carregaram
    setTimeout(() => {
        // Inicializar Google API
        if (typeof gapi !== 'undefined') {
            initializeGoogleAPI();
        } else {
            console.warn('⚠️ Google API não carregada, tentando novamente...');
            // Tentar novamente após 2 segundos
            setTimeout(() => {
                if (typeof gapi !== 'undefined') {
                    initializeGoogleAPI();
                } else {
                    console.error('❌ Google API não disponível');
                    showMessage('Erro ao carregar sistema. Recarregue a página.', 'danger');
                }
            }, 2000);
        }
    }, 500);
});

// =============================
// TESTE DA NOVA APPS SCRIPT API
// =============================
async function testAppsScriptForWritingOnly() {
    try {
        console.log('🔍 Testando Nova Apps Script API...');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos

        // Teste com endpoint GET para verificar conectividade
        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?action=test', {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const result = await response.json();
            console.log('📡 Resposta da Nova API:', result);

            if (result.success) {
                hasAppsScript = true;
                useAppsScript = true;
                console.log('✅ Nova Apps Script API disponível para escrita');

                // Mostrar indicador visual de que a nova API está funcionando
                showAppsScriptStatus(true, 'Nova API Ativa');
                return;
            }
        }

        throw new Error('Nova Apps Script API não respondeu corretamente');

    } catch (error) {
        console.log('⚠️ Nova Apps Script API indisponível - usando fallback manual');
        console.log('Detalhes:', error.message);
        hasAppsScript = false;
        useAppsScript = false;

        // Mostrar status de fallback
        showAppsScriptStatus(false, 'API Indisponível');
    }
}

function showAppsScriptStatus(isWorking, message) {
    // Criar indicador discreto no rodapé da página
    let statusDiv = document.getElementById('appsScriptStatus');

    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'appsScriptStatus';
        statusDiv.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0.8;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(statusDiv);

        // Remover após 10 segundos
        setTimeout(() => {
            if (statusDiv && statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 10000);
    }

    if (isWorking) {
        statusDiv.innerHTML = `✅ ${message}`;
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
    } else {
        statusDiv.innerHTML = `⚠️ ${message}`;
        statusDiv.style.backgroundColor = '#fff3cd';
        statusDiv.style.color = '#856404';
        statusDiv.style.border = '1px solid #ffeaa7';
    }
}

// =============================
// CONFIGURAÇÃO DA API DO GOOGLE
// =============================
function initializeGoogleAPI() {
    // Mostrar indicador de que o sistema está carregando
    showSystemStatus('loading');

    gapi.load('client', async() => {
        try {
            await gapi.client.init({
                apiKey: GOOGLE_CONFIG.apiKey,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
            });

            console.log('✅ Google Sheets API inicializada');
            showSystemStatus('ready');

            // Carregar dados iniciais
            if (!isLoggedIn) {
                loadInitialData();
            }

            // Testar Apps Script em background apenas para escrita
            setTimeout(() => {
                testAppsScriptForWritingOnly();
            }, 1000);

        } catch (error) {
            console.error('❌ Erro ao inicializar Google API:', error);
            showSystemStatus('error');
            showMessage('Erro ao conectar com o sistema. Recarregue a página.', 'danger');
        }
    });
}

function showSystemStatus(status) {
    let statusDiv = document.getElementById('systemStatus');

    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'systemStatus';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0.9;
            transition: all 0.3s;
        `;
        document.body.appendChild(statusDiv);
    }

    switch (status) {
        case 'loading':
            statusDiv.innerHTML = '🔄 Carregando sistema...';
            statusDiv.style.backgroundColor = '#cce5ff';
            statusDiv.style.color = '#004085';
            statusDiv.style.border = '1px solid #99d1ff';
            break;

        case 'ready':
            statusDiv.innerHTML = '✅ Sistema pronto';
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.color = '#155724';
            statusDiv.style.border = '1px solid #c3e6cb';

            // Remover após 3 segundos
            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    statusDiv.style.opacity = '0';
                    setTimeout(() => {
                        if (statusDiv && statusDiv.parentNode) {
                            statusDiv.parentNode.removeChild(statusDiv);
                        }
                    }, 300);
                }
            }, 3000);
            break;

        case 'error':
            statusDiv.innerHTML = '❌ Erro no sistema';
            statusDiv.style.backgroundColor = '#f8d7da';
            statusDiv.style.color = '#721c24';
            statusDiv.style.border = '1px solid #f5c6cb';
            break;
    }
}

// =============================
// CARREGAMENTO DE DADOS INICIAL
// =============================
async function loadInitialData() {
    try {
        // Carregar lista de convidados
        await loadGuestsList();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
    }
}

// =============================
// EVENT LISTENERS
// =============================
function setupEventListeners() {
    // Verificar se os elementos existem antes de adicionar event listeners

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.warn('⚠️ Elemento loginForm não encontrado');
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Filters
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    const searchFilter = document.getElementById('searchFilter');
    if (searchFilter) {
        searchFilter.addEventListener('input', applyFilters);
    }

    // Gift selection modal
    const confirmGiftBtn = document.getElementById('confirmGiftBtn');
    if (confirmGiftBtn) {
        confirmGiftBtn.addEventListener('click', confirmGiftSelection);
    }

    // New guest registration modal
    const confirmNewGuestBtn = document.getElementById('confirmNewGuestBtn');
    if (confirmNewGuestBtn) {
        confirmNewGuestBtn.addEventListener('click', handleNewGuestRegistration);
    }

    // New guest form submit (Enter key)
    const newGuestForm = document.getElementById('newGuestForm');
    if (newGuestForm) {
        newGuestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewGuestRegistration();
        });
    }

    // Focus no campo nome quando o modal abrir
    const newGuestModal = document.getElementById('newGuestModal');
    if (newGuestModal) {
        newGuestModal.addEventListener('shown.bs.modal', function() {
            const newGuestName = document.getElementById('newGuestName');
            if (newGuestName) {
                newGuestName.focus();
            }
        });
    }

    console.log('✅ Event listeners configurados');
}

// =============================
// AUTENTICAÇÃO E LOGIN (SIMPLIFICADO)
// =============================
function checkStoredLogin() {
    const storedUser = localStorage.getItem('giftListUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            isLoggedIn = true;
            showGiftsSection();
            loadGiftsData();
        } catch (error) {
            localStorage.removeItem('giftListUser');
        }
    }
}

function proceedWithLogin(email, providedName = null) {
    // Buscar dados do convidado na lista local
    const guest = allGuests.find(g => g.email === email);

    // Login bem-sucedido
    currentUser = {
        email: email,
        name: providedName || (guest ? guest.name : email),
        loginTime: new Date().toISOString()
    };

    // Salvar no localStorage
    localStorage.setItem('giftListUser', JSON.stringify(currentUser));
    isLoggedIn = true;

    showMessage('Login realizado com sucesso! 🎉', 'success');

    // Aguardar um pouco e mostrar a seção de presentes
    setTimeout(() => {
        showGiftsSection();
        loadGiftsData();
    }, 1000);
}

function handleLogout() {
    localStorage.removeItem('giftListUser');
    currentUser = null;
    isLoggedIn = false;

    // Resetar interface - com verificações de segurança
    const loginSection = document.getElementById('loginSection');
    const giftsSection = document.getElementById('giftsSection');
    const userEmail = document.getElementById('userEmail');
    const loginMessage = document.getElementById('loginMessage');

    if (loginSection) loginSection.style.display = 'block';
    if (giftsSection) giftsSection.style.display = 'none';
    if (userEmail) userEmail.value = '';
    if (loginMessage) loginMessage.innerHTML = '';

    showMessage('Logout realizado com sucesso!', 'info');
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('userEmail').value.trim().toLowerCase();
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;

    if (!email) {
        showMessage('Digite seu email para continuar.', 'warning');
        return;
    }

    // Loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';

    try {
        // Verificar se o email existe na lista de convidados
        const isValidGuest = await verifyGuestEmail(email);

        if (isValidGuest) {
            proceedWithLogin(email);
        } else {
            showNewGuestModal(email);
        }

    } catch (error) {
        console.error('Erro no login:', error);

        // Tratamento de erros específicos
        if (error.message.includes('Sistema carregando')) {
            showMessage('⏳ Sistema ainda carregando... Aguarde alguns segundos e tente novamente.', 'warning');
        } else if (error.message.includes('API não está disponível')) {
            showMessage('🔄 Conectando com o sistema... Tente novamente em alguns segundos.', 'info');
        } else {
            showMessage('❌ Erro ao conectar. Verifique sua internet e tente novamente.', 'danger');
        }
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
    }
}

async function verifyGuestEmail(email) {
    try {
        // Verificar se a API está disponível
        if (!gapi || !gapi.client || !gapi.client.sheets) {
            console.log('⏳ Aguardando Google Sheets API estar pronta...');
            await waitForGoogleAPI();
        }

        // Se ainda não carregou os convidados, carregar agora
        if (allGuests.length === 0) {
            await loadGuestsList();
        }

        return allGuests.some(guest => guest.email === email);

    } catch (error) {
        console.error('Erro ao verificar email:', error);
        throw error;
    }
}

async function loadGiftsData() {
    try {
        showLoadingGifts(true);

        // Verificar se a API está disponível
        if (!gapi || !gapi.client || !gapi.client.sheets) {
            console.log('⏳ Aguardando Google Sheets API para carregar dados...');
            await waitForGoogleAPI();
        }

        // Limpar dados anteriores para evitar cache problemático
        console.log('🧹 Limpando dados anteriores...');
        allGifts = [];
        chosenGifts = [];

        // Carregar todas as informações necessárias
        await Promise.all([
            loadGiftsList(),
            loadChosenGifts()
        ]);

        // Atualizar interface
        updateUserStatus();
        updateStatistics();
        displayGifts();

    } catch (error) {
        console.error('Erro ao carregar dados dos presentes:', error);
        showMessage('Erro ao carregar lista de presentes.', 'danger');
    } finally {
        showLoadingGifts(false);
    }
}

function waitForGoogleAPI() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // 15 segundos (500ms * 30)

        const checkAPI = () => {
            attempts++;

            if (gapi && gapi.client && gapi.client.sheets) {
                console.log('✅ Google Sheets API pronta');
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Timeout aguardando Google Sheets API');
                reject(new Error('Sistema carregando... Tente novamente em alguns segundos.'));
            } else {
                console.log(`⏳ Aguardando API... (${attempts}/${maxAttempts})`);
                setTimeout(checkAPI, 500);
            }
        };

        checkAPI();
    });
}

async function loadGuestsList() {
    try {
        // Verificação adicional de segurança
        if (!gapi || !gapi.client || !gapi.client.sheets) {
            throw new Error('Google Sheets API não está disponível');
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
            range: GOOGLE_CONFIG.sheets.convidados
        });

        const rows = response.result.values || [];
        allGuests = rows.slice(1).map(row => ({
            name: row[0] || '',
            email: (row[1] || '').toLowerCase(),
            count: row[2] || '1'
        })).filter(guest => guest.name && guest.email);

        console.log(`✅ ${allGuests.length} convidados carregados`);

    } catch (error) {
        console.error('Erro ao carregar lista de convidados:', error);
        throw error;
    }
}

async function loadGiftsList() {
    try {
        // Verificação adicional de segurança
        if (!gapi || !gapi.client || !gapi.client.sheets) {
            throw new Error('Google Sheets API não está disponível');
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
            range: GOOGLE_CONFIG.sheets.presentes
        });

        const rows = response.result.values || [];
        allGifts = rows.slice(1).map((row, index) => ({
            id: index + 1,
            name: row[0] || '',
            url: row[1] || '',
            price: row[2] || '',
            imageUrl: row[3] || DEFAULT_GIFT_IMAGE
        })).filter(gift => gift.name);

        console.log(`✅ ${allGifts.length} presentes carregados`);

    } catch (error) {
        console.error('Erro ao carregar lista de presentes:', error);
        throw error;
    }
}

async function loadChosenGifts() {
    try {
        // Verificação adicional de segurança
        if (!gapi || !gapi.client || !gapi.client.sheets) {
            throw new Error('Google Sheets API não está disponível');
        }

        console.log('📊 Carregando presentes escolhidos...');

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
            range: GOOGLE_CONFIG.sheets.escolhidos
        });

        console.log('📊 Resposta da API para escolhidos:', response);

        const rows = response.result.values || [];
        console.log('📊 Linhas brutas da planilha Escolhidos:', rows);

        // Limpar array anterior
        chosenGifts = [];

        // Se não há dados ou só há cabeçalho
        if (rows.length <= 1) {
            console.log('✅ Planilha Escolhidos vazia - nenhum presente foi escolhido');
            chosenGifts = [];
            return;
        }

        // Processar dados (pular primeira linha que é cabeçalho)
        const dataRows = rows.slice(1);
        console.log('📊 Linhas de dados (sem cabeçalho):', dataRows);

        chosenGifts = dataRows
            .filter(row => {
                // Filtrar apenas linhas que têm pelo menos email e presente
                const hasEmail = row[0] && row[0].trim() !== '';
                const hasGift = row[2] && row[2].trim() !== '';
                return hasEmail && hasGift;
            })
            .map(row => ({
                guestEmail: (row[0] || '').toLowerCase().trim(),
                guestName: (row[1] || '').trim(),
                giftName: (row[2] || '').trim()
            }));

        console.log(`✅ ${chosenGifts.length} presentes escolhidos carregados:`, chosenGifts);

        // Debug adicional para o usuário atual
        if (currentUser && currentUser.email) {
            const userChoice = chosenGifts.find(choice => choice.guestEmail === currentUser.email);
            console.log(`🔍 Escolha do usuário ${currentUser.email}:`, userChoice || 'Nenhuma');
        }

    } catch (error) {
        console.error('Erro ao carregar presentes escolhidos:', error);
        // Em caso de erro, garantir que o array esteja vazio
        chosenGifts = [];
        throw error;
    }
}

// =============================
// VERIFICAÇÃO E VALIDAÇÃO (CORRIGIDAS)
// =============================
function getGuestName(email) {
    const guest = allGuests.find(g => g.email === email);
    return guest ? guest.name : email;
}

function isGiftChosen(giftName) {
    return chosenGifts.some(chosen => chosen.giftName === giftName);
}

function getUserChosenGift() {
    if (!currentUser || !currentUser.email) {
        console.log('🔍 getUserChosenGift: Usuário não logado');
        return null;
    }

    if (!chosenGifts || chosenGifts.length === 0) {
        console.log('🔍 getUserChosenGift: Lista de escolhidos vazia');
        return null;
    }

    const userChoice = chosenGifts.find(chosen => chosen.guestEmail === currentUser.email);
    console.log('🔍 getUserChosenGift para', currentUser.email, ':', userChoice || 'Nenhuma escolha encontrada');

    return userChoice || null; // Garantir que retorna null se não encontrar
}

function hasUserChosenGift() {
    const userChoice = getUserChosenGift();
    const hasChosen = !!userChoice; // Converte para boolean (null, undefined, false viram false)
    console.log('🔍 hasUserChosenGift - userChoice:', userChoice, 'hasChosen:', hasChosen);
    return hasChosen;
}

// =============================
// INTERFACE - SEÇÕES
// =============================
function showGiftsSection() {
    const loginSection = document.getElementById('loginSection');
    const giftsSection = document.getElementById('giftsSection');
    const userName = document.getElementById('userName');

    if (loginSection) loginSection.style.display = 'none';
    if (giftsSection) giftsSection.style.display = 'block';
    if (userName) userName.textContent = currentUser.name || currentUser.email;
}

function showLoadingGifts(show) {
    const loadingElement = document.getElementById('loadingGifts');
    const giftsGrid = document.getElementById('giftsGrid');

    if (show) {
        if (loadingElement) loadingElement.style.display = 'block';
        if (giftsGrid) {
            giftsGrid.innerHTML = '<div id="loadingGifts" class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div><p class="mt-2">Carregando lista de presentes...</p></div>';
        }
    } else {
        if (loadingElement) loadingElement.style.display = 'none';
    }
}

// =============================
// INTERFACE - STATUS DO USUÁRIO
// =============================
function updateUserStatus() {
    const statusDiv = document.getElementById('userStatus');
    const userChosenGift = getUserChosenGift();

    if (userChosenGift) {
        statusDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <strong>Você já escolheu seu presente!</strong><br>
                <strong>Presente:</strong> ${userChosenGift.giftName}
            </div>
        `;
    } else {
        statusDiv.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-gift"></i>
                <strong>Você ainda não escolheu seu presente!</strong><br>
                Navegue pela lista abaixo e escolha o presente que deseja dar para o casal.
            </div>
        `;
    }
}

// =============================
// INTERFACE - ESTATÍSTICAS
// =============================
function updateStatistics() {
    const totalGifts = allGifts.length;
    const chosenCount = chosenGifts.length;
    const availableCount = totalGifts - chosenCount;
    const completionRate = totalGifts > 0 ? Math.round((chosenCount / totalGifts) * 100) : 0;

    // Atualizar números
    document.getElementById('totalGifts').textContent = totalGifts;
    document.getElementById('availableGifts').textContent = availableCount;
    document.getElementById('chosenGifts').textContent = chosenCount;
    document.getElementById('completionRate').textContent = completionRate + '%';

    // Atualizar barra de progresso
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = completionRate + '%';
    progressBar.textContent = completionRate + '%';

    // Colorir barra de progresso
    progressBar.className = 'progress-bar';
    if (completionRate >= 75) {
        progressBar.classList.add('bg-success');
    } else if (completionRate >= 50) {
        progressBar.classList.add('bg-warning');
    } else {
        progressBar.classList.add('bg-info');
    }
}

// =============================
// INTERFACE - EXIBIÇÃO DOS PRESENTES
// =============================
function displayGifts(filteredGifts = null) {
    const giftsGrid = document.getElementById('giftsGrid');
    const giftsToShow = filteredGifts || allGifts;

    if (!giftsGrid) {
        console.warn('⚠️ Elemento giftsGrid não encontrado');
        return;
    }

    if (giftsToShow.length === 0) {
        giftsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">Nenhum presente encontrado</h4>
                <p class="text-muted">Tente ajustar os filtros ou busca.</p>
            </div>
        `;
        return;
    }

    // Debug: Verificar dados do usuário
    console.log('🔍 DisplayGifts - Usuário atual:', currentUser);
    console.log('🔍 DisplayGifts - Presentes escolhidos:', chosenGifts);
    console.log('🔍 DisplayGifts - Total de presentes:', giftsToShow.length);

    const userChosenGift = getUserChosenGift();
    const userHasChosen = hasUserChosenGift();

    console.log('🔍 DisplayGifts - Presente do usuário:', userChosenGift);
    console.log('🔍 DisplayGifts - Usuário já escolheu?', userHasChosen);

    giftsGrid.innerHTML = giftsToShow.map(gift => {
                // Verificações claras e separadas
                const isChosenByAnyone = isGiftChosen(gift.name);
                const isChosenByCurrentUser = userChosenGift && userChosenGift.giftName === gift.name;
                const userCanChoose = !userHasChosen && !isChosenByAnyone;

                // Debug para cada presente
                console.log(`🔍 Presente "${gift.name}":`, {
                    isChosenByAnyone,
                    isChosenByCurrentUser,
                    userCanChoose,
                    userHasChosen
                });

                let cardClass = 'gift-card';
                let indicator = '';
                let actionButton = '';

                if (isChosenByCurrentUser) {
                    // O usuário atual escolheu este presente
                    cardClass += ' user-chosen';
                    indicator = '<div class="chosen-indicator user-chosen-indicator">🎁 Sua Escolha</div>';
                    actionButton = `
                        <button class="btn-choose btn-unselect" onclick="unselectGift('${gift.name}')">
                            🗑️ Desmarcar
                        </button>
                    `;
                } else if (isChosenByAnyone) {
                    // Outro usuário escolheu este presente
                    cardClass += ' chosen';
                    indicator = '<div class="chosen-indicator">😊 Já Escolhido</div>';
                    actionButton = '<button class="btn-choose" disabled>❌ Não Disponível</button>';
                } else if (userCanChoose) {
                    // Usuário pode escolher este presente
                    actionButton = `<button class="btn-choose" onclick="selectGift('${gift.name}')">🎁 Escolher Este</button>`;
                } else if (userHasChosen) {
                    // Usuário já escolheu outro presente - opção de trocar
                    actionButton = `<button class="btn-choose btn-switch" onclick="selectGift('${gift.name}')">🔄 Trocar por Este</button>`;
                } else {
                    // Fallback
                    actionButton = '<button class="btn-choose" disabled>✋ Indisponível</button>';
                }

                return `
            <div class="${cardClass}" data-status="${isChosenByAnyone ? 'escolhido' : 'disponivel'}">
                ${indicator}
                <img src="${gift.imageUrl}" alt="${gift.name}" class="gift-image" onerror="this.src='${DEFAULT_GIFT_IMAGE}'">
                <div class="gift-content">
                    <h5 class="gift-name">${gift.name}</h5>
                    ${gift.price ? `<p class="gift-price"><strong>💰 ${gift.price}</strong></p>` : ''}
                    
                    <div class="gift-status">
                        <span class="status-badge ${isChosenByAnyone ? 'status-chosen' : 'status-available'}">
                            ${isChosenByAnyone ? '🎁 Já Escolhido' : '✅ Disponível'}
                        </span>
                    </div>
                    
                    <div class="gift-actions">
                        ${actionButton}
                    </div>
                    
                    ${gift.url ? `
                        <div class="gift-link">
                            <a href="${gift.url}" target="_blank" rel="noopener">
                                <i class="fas fa-external-link-alt"></i> Ver/Comprar Online
                            </a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    console.log('✅ DisplayGifts concluído');
}

// =============================
// SELEÇÃO DE PRESENTES (ATUALIZADA)
// =============================
function selectGift(giftName) {
    const gift = allGifts.find(g => g.name === giftName);
    if (!gift) return;
    
    const userHasChosenAlready = hasUserChosenGift();
    const isGiftAlreadyChosen = isGiftChosen(giftName);
    
    // Se presente já foi escolhido por outro usuário
    if (isGiftAlreadyChosen) {
        showMessage('Este presente já foi escolhido por outro convidado.', 'warning');
        return;
    }
    
    // Se usuário já tem uma escolha, mostrar modal de troca
    if (userHasChosenAlready) {
        const currentChoice = getUserChosenGift();
        showSwitchGiftModal(currentChoice.giftName, gift);
        return;
    }
    
    // Primeira escolha normal
    showGiftModal(gift);
}

function unselectGift(giftName) {
    const userChoice = getUserChosenGift();
    
    if (!userChoice || userChoice.giftName !== giftName) {
        showMessage('Erro: Este não é seu presente escolhido.', 'danger');
        return;
    }
    
    // Mostrar modal de confirmação de desmarcação
    showUnselectModal(giftName);
}

function showSwitchGiftModal(currentGiftName, newGift) {
    // Criar modal dinâmico para troca
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="fas fa-exchange-alt"></i> Trocar Presente?
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="text-center">
                                <h6 class="text-muted">Presente Atual</h6>
                                <div class="border rounded p-3 bg-light">
                                    <i class="fas fa-gift fa-2x text-secondary mb-2"></i>
                                    <h5>${currentGiftName}</h5>
                                    <small class="text-muted">Sua escolha atual</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="text-center">
                                <h6 class="text-muted">Novo Presente</h6>
                                <div class="border rounded p-3 bg-primary bg-opacity-10">
                                    <img src="${newGift.imageUrl}" alt="${newGift.name}" 
                                         class="img-fluid rounded mb-2" style="max-height: 80px;"
                                         onerror="this.src='${DEFAULT_GIFT_IMAGE}'">
                                    <h5>${newGift.name}</h5>
                                    ${newGift.price ? `<p class="text-muted mb-0">💰 ${newGift.price}</p>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alert alert-warning mt-3">
                        <i class="fas fa-exclamation-triangle"></i>
                        <strong>Atenção:</strong> Ao confirmar, sua escolha atual será removida e substituída pelo novo presente.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-warning" onclick="confirmSwitchGift('${newGift.name}')">
                        <i class="fas fa-exchange-alt"></i> Confirmar Troca
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Cleanup quando modal fechar
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function showUnselectModal(giftName) {
    // Criar modal dinâmico para desmarcação
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-trash-alt"></i> Desmarcar Presente?
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <i class="fas fa-question-circle fa-3x text-warning mb-3"></i>
                        <h5>Tem certeza?</h5>
                        <p>Você está prestes a desmarcar:</p>
                        <div class="border rounded p-3 bg-light">
                            <h6><strong>${giftName}</strong></h6>
                        </div>
                        <p class="text-muted mt-3">
                            Esta ação fará com que o presente volte a ficar disponível para outros convidados.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-danger" onclick="confirmUnselectGift('${giftName}')">
                        <i class="fas fa-trash-alt"></i> Sim, Desmarcar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Cleanup quando modal fechar
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

async function confirmSwitchGift(newGiftName) {
    const newGift = allGifts.find(g => g.name === newGiftName);
    if (!newGift) return;
    
    try {
        console.log('🔄 Iniciando troca de presente para:', newGiftName);
        
        // Fechar modal atual
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
        
        // Executar troca
        await switchGiftChoice(newGift);
        
        // Atualizar dados locais
        const currentUserChoice = chosenGifts.find(choice => choice.guestEmail === currentUser.email);
        if (currentUserChoice) {
            currentUserChoice.giftName = newGift.name;
        }
        
        // Atualizar interface
        updateUserStatus();
        updateStatistics();
        displayGifts();
        
        // Mostrar modal de sucesso
        showSuccessModal(newGift, 'trocado');
        
    } catch (error) {
        console.error('Erro ao trocar presente:', error);
        showMessage('❌ Erro ao trocar presente: ' + error.message, 'danger');
    }
}

async function confirmUnselectGift(giftName) {
    try {
        console.log('🗑️ Iniciando desmarcação do presente:', giftName);
        
        // Fechar modal atual
        const modal = document.querySelector('.modal.show');
        if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
        
        // Executar desmarcação
        await unselectGiftChoice(giftName);
        
        // Remover dos dados locais
        chosenGifts = chosenGifts.filter(choice => choice.guestEmail !== currentUser.email);
        
        // Atualizar interface
        updateUserStatus();
        updateStatistics();
        displayGifts();
        
        showMessage('✅ Presente desmarcado com sucesso! Agora você pode escolher outro.', 'success');
        
    } catch (error) {
        console.error('Erro ao desmarcar presente:', error);
        showMessage('❌ Erro ao desmarcar presente: ' + error.message, 'danger');
    }
}

// =============================
// FILTROS E BUSCA
// =============================
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchText = document.getElementById('searchFilter').value.toLowerCase().trim();
    
    let filteredGifts = allGifts.filter(gift => {
        // Filtro de status
        let statusMatch = true;
        if (statusFilter === 'disponivel') {
            statusMatch = !isGiftChosen(gift.name);
        } else if (statusFilter === 'escolhido') {
            statusMatch = isGiftChosen(gift.name);
        }
        
        // Filtro de busca
        const searchMatch = !searchText || 
            gift.name.toLowerCase().includes(searchText) ||
            (gift.price && gift.price.toLowerCase().includes(searchText));
        
        return statusMatch && searchMatch;
    });
    
    displayGifts(filteredGifts);
}

// =============================
// UTILITÁRIOS
// =============================
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('loginMessage');
    
    if (!messageDiv) {
        console.warn('⚠️ Elemento loginMessage não encontrado para mostrar:', message);
        return;
    }
    
    const alertClass = `alert alert-${type}`;
    
    messageDiv.innerHTML = `
        <div class="${alertClass}">
            <i class="fas fa-${getMessageIcon(type)}"></i> ${message}
        </div>
    `;
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        if (messageDiv) {
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

// =============================
// FUNÇÕES UTILITÁRIAS GLOBAIS (ATUALIZADAS)
// =============================
window.selectGift = selectGift;
window.unselectGift = unselectGift;
window.confirmGiftSelection = confirmGiftSelection;
window.confirmSwitchGift = confirmSwitchGift;
window.confirmUnselectGift = confirmUnselectGift;

// =============================
// TRATAMENTO DE ERROS
// =============================
window.addEventListener('error', function(e) {
    console.error('Erro global capturado:', e.error);
});

// =============================
// DEBUG (Remover em produção)
// =============================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugGifts = {
        currentUser,
        allGifts,
        allGuests,
        chosenGifts,
        GOOGLE_CONFIG,
        // Funções de debug
        forceReload: forceReloadData,
        checkUserChoice: () => {
            console.log('🔍 Debug - Usuario atual:', currentUser);
            console.log('🔍 Debug - Presentes escolhidos:', chosenGifts);
            console.log('🔍 Debug - Usuario já escolheu?', hasUserChosenGift());
            console.log('🔍 Debug - Escolha do usuario:', getUserChosenGift());
            
            // Teste específico do bug
            const userChoice = getUserChosenGift();
            console.log('🔍 Teste do bug:');
            console.log('  - userChoice:', userChoice);
            console.log('  - typeof userChoice:', typeof userChoice);
            console.log('  - userChoice === null:', userChoice === null);
            console.log('  - userChoice === undefined:', userChoice === undefined);
            console.log('  - !!userChoice:', !!userChoice);
        },
        clearData: () => {
            allGifts = [];
            allGuests = [];
            chosenGifts = [];
            console.log('🧹 Dados limpos');
        },
        // Novos comandos para a Nova API
        testNewAPI: async () => {
            console.log('🧪 Testando Nova API...');
            await testAppsScriptForWritingOnly();
        },
        loadViaNewAPI: loadDataViaAppsScript
    };
    console.log('🔍 Modo debug ativo. Use window.debugGifts para inspecionar dados.');
    console.log('🔍 Comandos disponíveis:');
    console.log('  - window.debugGifts.checkUserChoice() // Verificar escolha do usuário');
    console.log('  - window.debugGifts.forceReload() // Recarregar todos os dados');
    console.log('  - window.debugGifts.clearData() // Limpar dados locais');
    console.log('  - window.debugGifts.testNewAPI() // Testar Nova Apps Script API');
    console.log('  - window.debugGifts.loadViaNewAPI() // Carregar dados via Nova API');
    console.log('  - window.loadViaNewAPI() // Comando global para carregar via Nova API');
}

async function addNewGuestWithCount(name, email, count) {
    try {
        if (useAppsScript && hasAppsScript) {
            // Cadastrar via Apps Script
            await addGuestViaAppsScript(name, email, count);
        } else {
            // Cadastrar via Google Sheets API (pode falhar)
            await addGuestViaApi(name, email, count);
        }
        
        // Atualizar lista local de convidados
        allGuests.push({
            name: name,
            email: email.toLowerCase(),
            count: count || '1'
        });
        
        console.log('✅ Novo convidado cadastrado com sucesso');
        
    } catch (error) {
        console.error('Erro ao cadastrar convidado:', error);
        throw error;
    }
}

async function addGuestViaAppsScript(name, email, count) {
    try {
        console.log('📡 Adicionando convidado via Nova Apps Script API (GET)...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos
        
        // Usar GET com query parameters para evitar CORS completamente
        const params = new URLSearchParams({
            action: 'addGuest',
            name: name,
            email: email,
            count: count || '1'
        });

        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (addGuest):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao cadastrar convidado na Nova API');
        }

        console.log('✅ Convidado adicionado com sucesso via Nova API:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao adicionar convidado');
        }
        
        console.error('❌ Erro ao adicionar convidado via Nova API:', error);
        throw new Error(`Nova API falhou ao adicionar convidado: ${error.message}`);
    }
}

async function addGuestViaApi(name, email, count) {
    try {
        const guestData = [
            name,
            email,
            count || '1'
        ];
        
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
            range: GOOGLE_CONFIG.sheets.convidados,
            valueInputOption: 'RAW',
            resource: {
                values: [guestData]
            }
        });
        
    } catch (error) {
        console.error('Erro ao cadastrar via API:', error);
        
        // Tratamento específico para erro 401
        if (error.status === 401) {
            throw new Error(`🔒 Erro de Permissão: Não foi possível cadastrar automaticamente.

Peça ao organizador para adicionar seu email na lista de convidados.

Email: ${email}
Nome: ${name}`);
        }
        
        throw error;
    }
}

function showNewGuestModal(email) {
    // Preencher email no modal
    document.getElementById('newGuestEmail').value = email;
    document.getElementById('newGuestName').value = '';
    document.getElementById('newGuestCount').value = '1';
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('newGuestModal'));
    modal.show();
}

async function handleNewGuestRegistration() {
    const name = document.getElementById('newGuestName').value.trim();
    const email = document.getElementById('newGuestEmail').value.trim().toLowerCase();
    const count = document.getElementById('newGuestCount').value;
    
    const confirmBtn = document.getElementById('confirmNewGuestBtn');
    const originalText = confirmBtn.innerHTML;
    
    if (!name) {
        showMessage('Nome é obrigatório para cadastro.', 'warning');
        return;
    }
    
    try {
        // Loading state
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        
        // Cadastrar novo convidado
        await addNewGuestWithCount(name, email, count);
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newGuestModal'));
        modal.hide();
        
        showMessage('Cadastrado com sucesso! Bem-vindo! 🎉', 'success');
        
        // Proceder com login
        setTimeout(() => {
            proceedWithLogin(email, name);
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao cadastrar convidado:', error);
        showMessage('Erro ao cadastrar. Tente novamente.', 'danger');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }
}

async function showManualSaveInstructions(gift) {
    console.log('📋 Mostrando instruções de salvamento manual para:', gift.name);
    
    // Atualizar dados localmente para que o usuário veja sua escolha
    const choiceData = {
        guestEmail: currentUser.email,
        guestName: currentUser.name,
        giftName: gift.name
    };
    
    // Adicionar à lista local (se não estiver já)
    const existingChoice = chosenGifts.find(c => c.guestEmail === currentUser.email);
    if (!existingChoice) {
        chosenGifts.push(choiceData);
    }
    
    // Mostrar modal com instruções
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="fas fa-exclamation-triangle"></i> Salvamento Manual Necessário
                    </h5>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        <strong>✅ Sua escolha foi registrada localmente!</strong><br>
                        Para garantir que seja salva definitivamente, copie as informações abaixo e envie para os organizadores:
                    </div>
                    
                    <div class="bg-light p-3 rounded border">
                        <h6><i class="fas fa-copy"></i> Dados para copiar:</h6>
                        <div class="font-monospace" id="copyData">
👤 Nome: ${currentUser.name}
📧 Email: ${currentUser.email}
🎁 Presente: ${gift.name}
${gift.price ? `💰 Preço: ${gift.price}` : ''}
📅 Data: ${new Date().toLocaleString('pt-BR')}
                        </div>
                        <button class="btn btn-outline-primary btn-sm mt-2" onclick="copyToClipboard()">
                            <i class="fas fa-copy"></i> Copiar Dados
                        </button>
                    </div>
                    
                    <div class="mt-3 text-muted">
                        <p>
                            <i class="fas fa-info-circle"></i>
                            <strong>O que aconteceu?</strong> O sistema automático não conseguiu salvar sua escolha, 
                            mas ela está registrada localmente. Os organizadores vão atualizar a planilha assim que receberem seus dados.
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">
                        <i class="fas fa-check"></i> Entendi, vou enviar os dados
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Função para copiar dados
    window.copyToClipboard = function() {
        const text = document.getElementById('copyData').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target.closest('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    };
    
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
        delete window.copyToClipboard;
    });
}

// Função para forçar recarregamento completo
async function forceReloadData() {
    console.log('🔄 Forçando recarregamento completo dos dados...');
    
    // Limpar TODOS os dados
    allGifts = [];
    allGuests = [];
    chosenGifts = [];
    
    try {
        // Recarregar tudo
        await Promise.all([
            loadGuestsList(),
            loadGiftsList(), 
            loadChosenGifts()
        ]);
        
        // Atualizar interface se estiver logado
        if (isLoggedIn) {
            updateUserStatus();
            updateStatistics();
            displayGifts();
        }
        
        console.log('✅ Recarregamento completo concluído');
        
    } catch (error) {
        console.error('❌ Erro no recarregamento forçado:', error);
    }
}

// Função opcional para carregar dados via Nova API (para debug)
async function loadDataViaAppsScript() {
    try {
        console.log('📡 Carregando dados via Nova Apps Script API...');
        
        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?action=getData', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Dados da Nova API:', result);

        if (result.success && result.data) {
            console.log('✅ Dados carregados via Nova API:');
            console.log('  - Convidados:', result.data.convidados?.length || 0);
            console.log('  - Presentes:', result.data.presentes?.length || 0);
            console.log('  - Escolhidos:', result.data.escolhidos?.length || 0);
            return result.data;
        }

        throw new Error('Nova API não retornou dados válidos');

    } catch (error) {
        console.error('❌ Erro ao carregar dados via Nova API:', error);
        throw error;
    }
}

// Disponibilizar globalmente para debug
window.loadViaNewAPI = loadDataViaAppsScript;

function showGiftModal(gift) {
    // Preencher dados do modal
    document.getElementById('modalGiftImage').src = gift.imageUrl;
    document.getElementById('modalGiftImage').alt = gift.name;
    document.getElementById('modalGiftName').textContent = gift.name;
    document.getElementById('modalGiftCategory').textContent = gift.price ? `💰 ${gift.price}` : '';
    document.getElementById('modalGiftDescription').textContent = `Você confirma a escolha deste presente?`;
    
    // Link de sugestão
    const linkDiv = document.getElementById('modalGiftLink');
    if (gift.url) {
        linkDiv.innerHTML = `
            <a href="${gift.url}" target="_blank" class="btn btn-outline-primary" rel="noopener">
                <i class="fas fa-external-link-alt"></i> Ver/Comprar Online
            </a>
        `;
    } else {
        linkDiv.innerHTML = '';
    }
    
    // Configurar botão de confirmação
    const confirmBtn = document.getElementById('confirmGiftBtn');
    confirmBtn.onclick = () => confirmGiftSelection(gift.name);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('giftModal'));
    modal.show();
}

async function confirmGiftSelection(giftName = null) {
    // Se chamado do botão do modal, pegar o giftName do modal
    if (!giftName) {
        const giftNameElement = document.getElementById('modalGiftName').textContent;
        giftName = giftNameElement;
    }
    
    if (!giftName) return;
    
    const gift = allGifts.find(g => g.name === giftName);
    if (!gift) return;
    
    const confirmBtn = document.getElementById('confirmGiftBtn');
    const originalText = confirmBtn.innerHTML;
    
    try {
        // Loading state
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirmando...';
        
        // Salvar escolha na planilha
        await saveGiftChoice(gift);
        
        // Atualizar dados locais
        const choiceData = {
            guestEmail: currentUser.email,
            guestName: currentUser.name,
            giftName: gift.name
        };
        
        chosenGifts.push(choiceData);
        
        // Fechar modal atual
        const modal = bootstrap.Modal.getInstance(document.getElementById('giftModal'));
        modal.hide();
        
        // Atualizar interface
        updateUserStatus();
        updateStatistics();
        displayGifts();
        
        // Mostrar modal de sucesso
        showSuccessModal(gift);
        
    } catch (error) {
        console.error('Erro ao confirmar presente:', error);
        showMessage('Erro ao confirmar presente. Tente novamente.', 'danger');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }
}

async function saveGiftChoice(gift) {
    try {
        console.log(`💾 Salvando escolha: ${gift.name} para ${currentUser.email}`);
        
        // 1. PRIMEIRA TENTATIVA: Apps Script (preferencial)
        if (hasAppsScript) {
            try {
                console.log('📡 Tentando salvar via Apps Script...');
                await saveChoiceViaAppsScript(gift);
                console.log('✅ Salvo com sucesso via Apps Script!');
                return;
            } catch (appsScriptError) {
                console.warn('⚠️ Apps Script falhou:', appsScriptError.message);
                hasAppsScript = false; // Marcar como indisponível
            }
        }
        
        // 2. SEGUNDA TENTATIVA: Google Sheets API (vai falhar, mas tentamos)
        try {
            console.log('📡 Tentando salvar via Google Sheets API...');
            await saveChoiceViaApi(gift);
            console.log('✅ Salvo com sucesso via API!');
            return;
        } catch (apiError) {
            console.warn('⚠️ Google Sheets API falhou:', apiError.message);
        }
        
        // 3. FALLBACK: Salvamento manual
        console.log('📋 Usando fallback de salvamento manual');
        await showManualSaveInstructions(gift);
        
    } catch (error) {
        console.error('❌ Erro geral ao salvar:', error);
        await showManualSaveInstructions(gift);
    }
}

async function saveChoiceViaAppsScript(gift) {
    try {
        console.log('📡 Salvando escolha via Nova Apps Script API (GET)...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        // Usar GET com query parameters para evitar CORS completamente
        const params = new URLSearchParams({
            action: 'chooseGift',
            guestEmail: currentUser.email,
            guestName: currentUser.name,
            giftName: gift.name
        });

        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (chooseGift):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao escolher presente na Nova API');
        }

        console.log('✅ Presente escolhido com sucesso via Nova API:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao escolher presente');
        }
        
        console.error('❌ Erro ao escolher presente via Nova API:', error);
        throw new Error(`Nova API falhou ao escolher presente: ${error.message}`);
    }
}

async function saveChoiceViaApi(gift) {
    try {
        const choiceData = [
            currentUser.email,
            currentUser.name,
            gift.name
        ];
        
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_CONFIG.spreadsheetId,
            range: GOOGLE_CONFIG.sheets.escolhidos,
            valueInputOption: 'RAW',
            resource: {
                values: [choiceData]
            }
        });
        
        console.log('✅ API salvou com sucesso:', response);
        
    } catch (error) {
        console.error('❌ Erro detalhado na API:', error);
        
        // Tratamento específico para erro 401 (sem permissão)
        if (error.status === 401) {
            throw new Error('API sem permissão de escrita (erro 401)');
        }
        
        // Outros erros da API
        throw new Error(`Google Sheets API falhou: ${error.message}`);
    }
}

function showSuccessModal(gift, action = 'escolhido') {
    // Atualizar conteúdo do modal de sucesso
    const actionText = action === 'trocado' ? 'Presente Trocado!' : 'Presente Escolhido!';
    const icon = action === 'trocado' ? '🔄' : '🎁';
    
    document.getElementById('chosenGiftInfo').innerHTML = `
        <div class="text-center">
            <div style="font-size: 2rem; margin: 15px 0;">${icon}</div>
            <h5>${gift.name}</h5>
            ${gift.price ? `<p class="text-muted">💰 ${gift.price}</p>` : ''}
        </div>
    `;
    
    // Atualizar título se for troca
    if (action === 'trocado') {
        document.querySelector('#successModal .modal-title').innerHTML = `
            <i class="fas fa-exchange-alt"></i> ${actionText}
        `;
    }
    
    // Mostrar modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// =============================
// NOVAS FUNÇÕES PARA TROCA E DESMARCAÇÃO
// =============================

async function switchGiftChoice(newGift) {
    try {
        console.log(`🔄 Trocando presente para: ${newGift.name}`);
        
        // 1. PRIMEIRA TENTATIVA: Apps Script
        if (hasAppsScript) {
            try {
                await switchGiftViaAppsScript(newGift);
                console.log('✅ Troca realizada via Apps Script!');
                return;
            } catch (appsScriptError) {
                console.warn('⚠️ Apps Script falhou para troca:', appsScriptError.message);
                hasAppsScript = false;
            }
        }
        
        // 2. FALLBACK: Instruções manuais
        console.log('📋 Usando troca manual');
        await showManualSwitchInstructions(newGift);
        
    } catch (error) {
        console.error('❌ Erro geral ao trocar:', error);
        throw error;
    }
}

async function unselectGiftChoice(giftName) {
    try {
        console.log(`🗑️ Desmarcando presente: ${giftName}`);
        
        // 1. PRIMEIRA TENTATIVA: Apps Script
        if (hasAppsScript) {
            try {
                await unselectGiftViaAppsScript(giftName);
                console.log('✅ Desmarcação realizada via Apps Script!');
                return;
            } catch (appsScriptError) {
                console.warn('⚠️ Apps Script falhou para desmarcação:', appsScriptError.message);
                hasAppsScript = false;
            }
        }
        
        // 2. FALLBACK: Instruções manuais
        console.log('📋 Usando desmarcação manual');
        await showManualUnselectInstructions(giftName);
        
    } catch (error) {
        console.error('❌ Erro geral ao desmarcar:', error);
        throw error;
    }
}

async function switchGiftViaAppsScript(newGift) {
    try {
        console.log('📡 Trocando presente via Nova Apps Script API (GET)...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const params = new URLSearchParams({
            action: 'switchGift',
            guestEmail: currentUser.email,
            guestName: currentUser.name,
            newGiftName: newGift.name
        });

        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (switchGift):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao trocar presente na Nova API');
        }

        console.log('✅ Presente trocado com sucesso via Nova API:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao trocar presente');
        }
        
        console.error('❌ Erro ao trocar presente via Nova API:', error);
        throw new Error(`Nova API falhou ao trocar presente: ${error.message}`);
    }
}

async function unselectGiftViaAppsScript(giftName) {
    try {
        console.log('📡 Desmarcando presente via Nova Apps Script API (GET)...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const params = new URLSearchParams({
            action: 'unselectGift',
            guestEmail: currentUser.email,
            giftName: giftName
        });

        const response = await fetch(GOOGLE_CONFIG.webAppUrl + '?' + params.toString(), {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Nova API HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📡 Resposta da Nova API (unselectGift):', result);

        if (!result.success) {
            throw new Error(result.error || result.message || 'Erro ao desmarcar presente na Nova API');
        }

        console.log('✅ Presente desmarcado com sucesso via Nova API:', result);

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Nova API timeout ao desmarcar presente');
        }
        
        console.error('❌ Erro ao desmarcar presente via Nova API:', error);
        throw new Error(`Nova API falhou ao desmarcar presente: ${error.message}`);
    }
}

function showManualSwitchInstructions(newGift) {
    const currentChoice = getUserChosenGift();
    
    showMessage(`
        ✅ Troca registrada localmente!<br>
        <strong>Antes:</strong> ${currentChoice.giftName}<br>
        <strong>Depois:</strong> ${newGift.name}<br>
        <em>Notifique os organizadores sobre a troca.</em>
    `, 'warning');
}

function showManualUnselectInstructions(giftName) {
    showMessage(`
        ✅ Desmarcação registrada localmente!<br>
        <strong>Presente:</strong> ${giftName}<br>
        <em>Notifique os organizadores sobre a desmarcação.</em>
    `, 'warning');
}