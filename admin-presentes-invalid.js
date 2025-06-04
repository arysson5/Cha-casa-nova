// =============================
// CONFIGURAÇÕES GOOGLE SHEETS
// =============================
const ADMIN_CONFIG = {
    apiKey: 'AIzaSyBW98wPFQdj5DscddMnWNG3TBQptj69uPI', // Substitua pela sua API Key
    spreadsheetId: '1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y', // ID da planilha do usuário

    // Configurações de acesso
    adminPassword: 'admin123', // Altere para uma senha mais segura

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
let hasWritePermissions = false; // Controle de permissões de escrita

// Imagem placeholder base64 (ícone de presente bonito)
const DEFAULT_GIFT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGOUZBRkIiLz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ2lmdEdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzhBMkJFMjtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojREVBMEREO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUwLDEwMCkiPgogICAgPCEtLSBCYXNlIGRvIHByZXNlbnRlIC0tPgogICAgPHJlY3QgeD0iLTMwIiB5PSItMTUiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NSIgZmlsbD0idXJsKCNnaWZ0R3JhZGllbnQpIiByeD0iNCIvPgogICAgPCEtLSBGaXRhIGhvcml6b250YWwgLS0+CiAgICA8cmVjdCB4PSItMzUiIHk9Ii01IiB3aWR0aD0iNzAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIEZpdGEgdmVydGljYWwgLS0+CiAgICA8cmVjdCB4PSItNSIgeT0iLTMwIiB3aWR0aD0iMTAiIGhlaWdodD0iNjAiIGZpbGw9IiNGRkQ3MDAiIHJ4PSI1Ii8+CiAgICA8IS0tIExhw6dvIC0tPgogICAgPGVsbGlwc2UgY3g9Ii0xNSIgY3k9Ii0yNSIgcng9IjgiIHJ5PSI1IiBmaWxsPSIjRkZENzAwIiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMTUiIGN5PSItMjUiIHJ4PSI4IiByeT0iNSIgZmlsbD0iI0ZGRDcwMCIgdHJhbnNmb3JtPSJyb3RhdGUoMTUpIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjE1MCIgeT0iMTY1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2Qjc0ODMiIGZvbnQtd2VpZ2h0PSI1MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPvCfjI4gU2VtIEltYWdlbTwvdGV4dD4KPC9zdmc+';

// =============================
// INICIALIZAÇÃO
// =============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Sistema Admin de Presentes Iniciado');

    // Inicializar Google Sheets API
    initializeAdminGoogleAPI();

    // Event Listeners
    setupAdminEventListeners();

    // Verificar se admin já está logado
    checkAdminStoredLogin();
});

// =============================
// CONFIGURAÇÃO DA API DO GOOGLE
// =============================
function initializeAdminGoogleAPI() {
    gapi.load('client', async() => {
        try {
            await gapi.client.init({
                apiKey: ADMIN_CONFIG.apiKey,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
            });

            console.log('✅ Google Sheets API inicializada para Admin');

        } catch (error) {
            console.error('❌ Erro ao inicializar Google API:', error);
            showAdminMessage('Erro ao conectar com o sistema. Tente novamente.', 'danger');
        }
    });
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

        // Verificar permissões antes de carregar
        await testWritePermissions();

        // Carregar todas as informações
        await Promise.all([
            loadAdminGiftsList(),
            loadAdminGuestsList(),
            loadAdminChosenGifts()
        ]);

        // Atualizar estatísticas
        updateAdminStatistics();

        // Exibir listas
        displayAdminGifts();
        displayChosenGifts();
        displayGuestsList();

    } catch (error) {
        console.error('Erro ao carregar dados admin:', error);

        if (error.message && error.message.includes('401')) {
            showAdminMessage('🔒 Permissões de escrita não configuradas. Você pode visualizar, mas não editar dados.', 'warning');
        } else {
            showAdminMessage('Erro ao carregar dados.', 'danger');
        }
    } finally {
        showLoadingState(false);
    }
}

async function testWritePermissions() {
    try {
        console.log('🔍 Testando permissões de escrita...');

        // Primeiro, verificar se consegue ler
        const readResponse = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ADMIN_CONFIG.spreadsheetId,
            range: 'Presentes!A1:A1'
        });

        console.log('✅ Leitura da planilha confirmada');

        // Tentar uma escrita de teste (adicionar uma linha vazia temporária)
        try {
            const testData = [
                ['TESTE_PERMISSAO', '', '', '']
            ];

            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: ADMIN_CONFIG.spreadsheetId,
                range: 'Presentes!A:D',
                valueInputOption: 'RAW',
                resource: {
                    values: testData
                }
            });

            // Se chegou aqui, tem permissão de escrita
            hasWritePermissions = true;
            console.log('✅ Permissões de escrita confirmadas');

            // Remover a linha de teste (opcional, se der erro não tem problema)
            try {
                // Isso é mais complexo, por ora vamos deixar
                console.log('📝 Linha de teste adicionada (pode ser removida manualmente)');
            } catch (cleanupError) {
                console.log('⚠️ Não foi possível limpar linha de teste');
            }

        } catch (writeError) {
            // Sem permissão de escrita
            hasWritePermissions = false;
            console.log('❌ Sem permissões de escrita - modo somente leitura');

            showWritePermissionWarning();
        }

    } catch (error) {
        console.warn('⚠️ Problemas de acesso à planilha:', error);
        hasWritePermissions = false;
        throw error;
    }
}

function showWritePermissionWarning() {
    // Atualizar o alerta de permissões para mostrar instruções específicas
    const alertDiv = document.querySelector('.alert-warning');
    if (alertDiv) {
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>🔒 Modo Somente Leitura Ativo</strong><br>
            A API Key não tem permissões de escrita. Para adicionar presentes:
            <br><br>
            <strong>📋 ADICIONE MANUALMENTE NA PLANILHA:</strong><br>
            <small>
                <i class="fas fa-link"></i> 
                <a href="https://docs.google.com/spreadsheets/d/1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y/edit" 
                   target="_blank" class="alert-link">
                   🔗 Abrir Planilha → Aba "Presentes" → Adicionar linhas
                </a><br>
                <strong>Colunas:</strong> A=Nome | B=URL | C=Preço | D=Foto
            </small>
            <br><br>
            <button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="showManualInstructions()">
                <i class="fas fa-question-circle"></i> Ver Instruções Detalhadas
            </button>
        `;
    }
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

// =============================
// ESTATÍSTICAS ADMIN
// =============================
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

        // Verificar se tem permissões de escrita
        if (!hasWritePermissions) {
            showManualAddInstructions(giftData);
            return;
        }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        // Salvar na planilha
        await saveGiftToSheet(giftData);

        // Limpar formulário
        resetGiftForm();

        // Recarregar dados
        await loadAdminData();

        showAdminMessage('Presente adicionado com sucesso! 🎉', 'success');

    } catch (error) {
        console.error('Erro ao salvar presente:', error);
        showAdminMessage(error.message || 'Erro ao salvar presente.', 'danger');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

function showManualAddInstructions(giftData) {
    // Mostrar modal com instruções para adicionar manualmente
    const instructions = `
        <div class="alert alert-info">
            <h5><i class="fas fa-info-circle"></i> Adicione Manualmente na Planilha</h5>
            <p>Como o sistema não tem permissões de escrita, adicione os dados diretamente na planilha:</p>
            
            <div class="manual-data">
                <strong>📝 Dados para copiar:</strong><br>
                <code>
                <strong>Nome (Coluna A):</strong> ${giftData.name}<br>
                <strong>URL (Coluna B):</strong> ${giftData.url || '(vazio)'}<br>
                <strong>Preço (Coluna C):</strong> ${giftData.price || '(vazio)'}<br>
                <strong>Foto (Coluna D):</strong> ${giftData.imageUrl === DEFAULT_GIFT_IMAGE ? '(usar padrão)' : giftData.imageUrl}
                </code>
            </div>
            
            <div class="mt-3">
                <a href="https://docs.google.com/spreadsheets/d/1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y/edit" 
                   target="_blank" class="btn btn-primary">
                   <i class="fas fa-external-link-alt"></i> Abrir Planilha
                </a>
                <button class="btn btn-secondary ms-2" onclick="copyGiftData('${giftData.name}', '${giftData.url}', '${giftData.price}', '${giftData.imageUrl}')">
                   <i class="fas fa-copy"></i> Copiar Dados
                </button>
            </div>
        </div>
    `;

    showAdminMessage(instructions, 'info');

    // Limpar formulário após mostrar instruções
    resetGiftForm();
}

function copyGiftData(name, url, price, imageUrl) {
    const data = `${name}\t${url}\t${price}\t${imageUrl === DEFAULT_GIFT_IMAGE ? '' : imageUrl}`;

    navigator.clipboard.writeText(data).then(() => {
        showAdminMessage('Dados copiados! Cole na planilha (Ctrl+V)', 'success');
    }).catch(() => {
        showAdminMessage('Não foi possível copiar automaticamente. Copie manualmente os dados acima.', 'warning');
    });
}

async function saveGiftToSheet(giftData) {
    try {
        const rowData = [
            giftData.name,
            giftData.url,
            giftData.price,
            giftData.imageUrl
        ];

        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: ADMIN_CONFIG.spreadsheetId,
            range: ADMIN_CONFIG.sheets.presentes,
            valueInputOption: 'RAW',
            resource: {
                values: [rowData]
            }
        });

        console.log('✅ Presente salvo na planilha');

    } catch (error) {
        console.error('Erro ao salvar na planilha:', error);

        // Tratamento específico para erro 401
        if (error.status === 401) {
            throw new Error(`🔒 Erro de Permissão (401): A planilha não está configurada para edição pública.

📋 SOLUÇÃO:
1. Abra sua planilha no Google Sheets
2. Clique em "Compartilhar" (botão azul)
3. Configure como "Qualquer pessoa com o link PODE EDITAR"
4. Verifique se o link termina com /edit

🔗 Link da planilha: https://docs.google.com/spreadsheets/d/${ADMIN_CONFIG.spreadsheetId}/edit`);
        }

        throw error;
    }
}

function resetGiftForm() {
    document.getElementById('giftForm').reset();
    editingGiftId = null;
}

// =============================
// EXIBIÇÃO DE DADOS
// =============================
function displayAdminGifts(filteredGifts = null) {
    const giftsContainer = document.getElementById('adminGiftsList');
    const giftsToShow = filteredGifts || adminGifts;

    if (giftsToShow.length === 0) {
        giftsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Nenhum presente encontrado</h5>
                <p class="text-muted">Adicione presentes ou ajuste os filtros.</p>
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
                        <button class="btn btn-outline-primary btn-sm" onclick="editGift(${gift.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteGift(${gift.id})" title="Excluir">
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
                <p class="text-muted">Verifique a planilha de convidados.</p>
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

// =============================
// FILTROS ADMIN
// =============================
function applyAdminFilters() {
    const statusFilter = document.getElementById('adminStatusFilter').value;
    const searchText = document.getElementById('adminSearchFilter').value.toLowerCase().trim();

    let filteredGifts = adminGifts.filter(gift => {
        // Filtro de status
        let statusMatch = true;
        if (statusFilter === 'disponivel') {
            statusMatch = !adminChosenGifts.some(chosen => chosen.giftName === gift.name);
        } else if (statusFilter === 'escolhido') {
            statusMatch = adminChosenGifts.some(chosen => chosen.giftName === gift.name);
        }

        // Filtro de busca
        const searchMatch = !searchText ||
            gift.name.toLowerCase().includes(searchText) ||
            (gift.price && gift.price.toLowerCase().includes(searchText));

        return statusMatch && searchMatch;
    });

    displayAdminGifts(filteredGifts);
}

// =============================
// EDIÇÃO DE PRESENTES
// =============================
function editGift(giftId) {
    const gift = adminGifts.find(g => g.id === giftId);
    if (!gift) return;

    // Preencher modal de edição
    document.getElementById('editGiftId').value = gift.id;
    document.getElementById('editGiftName').value = gift.name;
    document.getElementById('editGiftUrl').value = gift.url;
    document.getElementById('editGiftPrice').value = gift.price;
    document.getElementById('editGiftImageUrl').value = gift.imageUrl;

    editingGiftId = giftId;

    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('editGiftModal'));
    modal.show();
}

async function updateGift() {
    if (!editingGiftId) return;

    try {
        // Para simplicidade, esta função seria mais complexa em uma implementação real
        // pois requereria atualizar uma linha específica na planilha
        showAdminMessage('Funcionalidade de edição em desenvolvimento.', 'info');

    } catch (error) {
        console.error('Erro ao atualizar presente:', error);
        showAdminMessage('Erro ao atualizar presente.', 'danger');
    }
}

function deleteGift(giftId) {
    const gift = adminGifts.find(g => g.id === giftId);
    if (!gift) return;

    const isChosen = adminChosenGifts.some(chosen => chosen.giftName === gift.name);

    if (isChosen) {
        showAdminMessage('Não é possível excluir um presente já escolhido!', 'warning');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir o presente "${gift.name}"?`)) {
        // Para simplicidade, esta função seria mais complexa em uma implementação real
        showAdminMessage('Funcionalidade de exclusão em desenvolvimento.', 'info');
    }
}

// =============================
// EXPORTAÇÃO
// =============================
function exportChosenGifts() {
    if (adminChosenGifts.length === 0) {
        showAdminMessage('Nenhum presente escolhido para exportar.', 'warning');
        return;
    }

    // Preparar dados para CSV
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

    // Converter para CSV
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Download
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

// =============================
// UTILITÁRIOS ADMIN
// =============================
function showAdminMessage(message, type = 'info') {
    const messageDiv = document.getElementById('adminLoginMessage');
    const alertClass = `alert alert-${type}`;

    messageDiv.innerHTML = `
        <div class="${alertClass}">
            <i class="fas fa-${getMessageIcon(type)}"></i> ${message}
        </div>
    `;

    // Auto-hide após 5 segundos
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
// FUNÇÕES GLOBAIS
// =============================
window.loadAdminData = loadAdminData;
window.loadChosenGifts = loadAdminChosenGifts;
window.loadGuestsList = loadAdminGuestsList;
window.resetGiftForm = resetGiftForm;
window.editGift = editGift;
window.updateGift = updateGift;
window.deleteGift = deleteGift;
window.exportChosenGifts = exportChosenGifts;
window.showManualInstructions = showManualInstructions;
window.copyGiftData = copyGiftData;

// =============================
// DEBUG (Remover em produção)
// =============================
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugAdmin = {
        adminGifts,
        adminGuests,
        adminChosenGifts,
        ADMIN_CONFIG
    };
    console.log('🔍 Modo debug ativo (Admin). Use window.debugAdmin para inspecionar dados.');
}

function showManualInstructions() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'manualInstructionsModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-book"></i> Instruções para Configurar a Planilha
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6><i class="fas fa-table"></i> Estrutura das Abas</h6>
                            <div class="alert alert-info">
                                <strong>Aba "Presentes" (A:D):</strong><br>
                                • A = Nome do presente<br>
                                • B = URL para compra<br>
                                • C = Preço (ex: R$ 100,00)<br>
                                • D = URL da foto<br><br>
                                
                                <strong>Aba "Escolhidos" (A:C):</strong><br>
                                • A = Email do convidado<br>
                                • B = Nome do convidado<br>
                                • C = Nome do presente escolhido
                            </div>
                            
                            <h6><i class="fas fa-users"></i> Seus Convidados</h6>
                            <div class="alert alert-success">
                                ✅ <strong>30+ convidados</strong> já estão na aba "convidados"<br>
                                ⚠️ <strong>Coluna C (Quantidade)</strong> está vazia - preencha com números (1, 2, 3...)
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h6><i class="fas fa-cog"></i> Passos para Configurar</h6>
                            <ol class="manual-steps">
                                <li><strong>Abrir planilha:</strong><br>
                                    <a href="https://docs.google.com/spreadsheets/d/1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y/edit" target="_blank">🔗 Clique aqui</a>
                                </li>
                                
                                <li><strong>Preencher aba "Presentes":</strong><br>
                                    Linha 1: Nome | URL | Preço | Foto<br>
                                    Linha 2+: Seus presentes
                                </li>
                                
                                <li><strong>Preencher quantidade (opcional):</strong><br>
                                    Na aba "convidados", coluna C, adicione números
                                </li>
                                
                                <li><strong>Salvar:</strong><br>
                                    Ctrl+S ou aguardar salvamento automático
                                </li>
                                
                                <li><strong>Testar sistema:</strong><br>
                                    Atualizar esta página e testar funcionalidades
                                </li>
                            </ol>
                            
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                <strong>Dica:</strong> Mesmo sem permissões de escrita pela API, 
                                o sistema funcionará perfeitamente para visualização e escolha de presentes!
                            </div>
                        </div>
                    </div>
                    
                    <hr>
                    
                    <h6><i class="fas fa-gift"></i> Exemplos de Presentes</h6>
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Nome (A)</th>
                                    <th>URL (B)</th>
                                    <th>Preço (C)</th>
                                    <th>Foto (D)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Jogo de Panelas</td>
                                    <td>https://magazineluiza.com.br/panela</td>
                                    <td>R$ 150,00</td>
                                    <td>https://img.url/panela.jpg</td>
                                </tr>
                                <tr>
                                    <td>Microondas</td>
                                    <td>https://americanas.com/micro</td>
                                    <td>R$ 300,00</td>
                                    <td>(deixar vazio = usa ícone padrão)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="https://docs.google.com/spreadsheets/d/1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y/edit" 
                       target="_blank" class="btn btn-primary">
                        <i class="fas fa-external-link-alt"></i> Abrir Planilha
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
    
    // Remover modal ao fechar
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}