/**
 * GOOGLE APPS SCRIPT PARA SISTEMA DE PRESENTES
 * 
 * COMO USAR:
 * 1. Acesse: https://script.google.com
 * 2. Clique em "Novo projeto"
 * 3. Cole este código
 * 4. Configure a planilha ID na linha 15
 * 5. Salve e publique como Web App
 * 6. Copie a URL gerada e use no seu site
 */

// =============================
// CONFIGURAÇÕES
// =============================
const SPREADSHEET_ID = '1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y'; // Sua planilha
const ALLOWED_ORIGINS = [
    'http://localhost',
    'https://localhost',
    'file://', // Para arquivos locais
    'null' // Para arquivos locais também
];

// =============================
// FUNÇÃO PRINCIPAL DO WEB APP
// =============================
function doPost(e) {
    try {
        let data;
        let action;

        // Processar dados recebidos (JSON ou FormData)
        if (e.postData && e.postData.type === 'application/json') {
            // Dados JSON
            data = JSON.parse(e.postData.contents);
            action = data.action;
        } else {
            // Dados FormData (vem em e.parameter)
            data = e.parameter || {};
            action = data.action;

            // Parse de dados JSON embutidos no FormData
            if (data.giftData) {
                try {
                    data.giftData = JSON.parse(data.giftData);
                } catch (parseError) {
                    console.error('Erro ao fazer parse de giftData:', parseError);
                    data.giftData = {};
                }
            }
            if (data.guestData) {
                try {
                    data.guestData = JSON.parse(data.guestData);
                } catch (parseError) {
                    console.error('Erro ao fazer parse de guestData:', parseError);
                    data.guestData = {};
                }
            }
            if (data.choiceData) {
                try {
                    data.choiceData = JSON.parse(data.choiceData);
                } catch (parseError) {
                    console.error('Erro ao fazer parse de choiceData:', parseError);
                    data.choiceData = {};
                }
            }
        }

        // Log para debug
        console.log('Ação recebida:', action);
        console.log('Dados recebidos:', data);

        let result;

        switch (action) {
            case 'addGuest':
                result = addGuest(data.guestData);
                break;

            case 'addGift':
                result = addGift(data.giftData);
                break;

            case 'chooseGift':
                result = chooseGift(data.choiceData);
                break;

            case 'getData':
                result = getAllData();
                break;

            case 'test':
                result = { message: 'API funcionando!', timestamp: new Date() };
                break;

            default:
                throw new Error('Ação não reconhecida: ' + action);
        }

        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                data: result,
                message: 'Operação realizada com sucesso'
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        console.error('Erro no doPost:', error);

        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString(),
                message: 'Erro ao processar solicitação'
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// =============================
// FUNÇÃO PARA REQUISIÇÕES GET
// =============================
function doGet(e) {
    const action = e.parameter.action;

    try {
        let result;

        switch (action) {
            case 'getData':
                result = getAllData();
                break;

            case 'test':
                result = { message: 'API funcionando!', timestamp: new Date() };
                break;

            case 'addGift':
                // Processar dados do presente via GET parameters
                const giftData = {
                    name: e.parameter.name || '',
                    url: e.parameter.url || '',
                    price: e.parameter.price || '',
                    imageUrl: e.parameter.imageUrl || ''
                };
                result = addGift(giftData);
                break;

            case 'chooseGift':
                // Processar escolha de presente via GET parameters
                const choiceData = {
                    guestEmail: e.parameter.guestEmail || '',
                    guestName: e.parameter.guestName || '',
                    giftName: e.parameter.giftName || ''
                };
                result = chooseGift(choiceData);
                break;

            case 'addGuest':
                // Processar novo convidado via GET parameters
                const guestData = {
                    name: e.parameter.name || '',
                    email: e.parameter.email || '',
                    count: e.parameter.count || '1'
                };
                result = addGuest(guestData);
                break;

            case 'deleteGift':
                // Processar exclusão de presente via GET parameters
                const deleteGiftData = {
                    giftName: e.parameter.giftName || ''
                };
                result = deleteGift(deleteGiftData);
                break;

            case 'switchGift':
                // Processar troca de presente via GET parameters
                const switchData = {
                    guestEmail: e.parameter.guestEmail || '',
                    guestName: e.parameter.guestName || '',
                    newGiftName: e.parameter.newGiftName || ''
                };
                result = switchGift(switchData);
                break;

            case 'unselectGift':
                // Processar desmarcação de presente via GET parameters
                const unselectData = {
                    guestEmail: e.parameter.guestEmail || '',
                    giftName: e.parameter.giftName || ''
                };
                result = unselectGift(unselectData);
                break;

            default:
                result = { message: 'API do Sistema de Presentes ativa' };
        }

        return ContentService
            .createTextOutput(JSON.stringify({
                success: true,
                data: result
            }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({
                success: false,
                error: error.toString()
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// =============================
// FUNÇÕES DE MANIPULAÇÃO DE DADOS
// =============================

/**
 * Adicionar novo convidado
 */
function addGuest(guestData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('convidados');

    if (!sheet) {
        throw new Error('Aba "convidados" não encontrada');
    }

    const newRow = [
        guestData.name || '',
        guestData.email || '',
        guestData.count || '1'
    ];

    sheet.appendRow(newRow);

    return {
        message: 'Convidado adicionado com sucesso',
        data: newRow
    };
}

/**
 * Adicionar novo presente
 */
function addGift(giftData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Presentes');

    // Criar aba se não existir
    if (!sheet) {
        sheet = ss.insertSheet('Presentes');
        // Adicionar cabeçalho
        sheet.getRange(1, 1, 1, 4).setValues([
            ['Nome', 'URL', 'Preço', 'Foto']
        ]);
    }

    const newRow = [
        giftData.name || '',
        giftData.url || '',
        giftData.price || '',
        giftData.imageUrl || ''
    ];

    sheet.appendRow(newRow);

    return {
        message: 'Presente adicionado com sucesso',
        data: newRow
    };
}

/**
 * Registrar escolha de presente
 */
function chooseGift(choiceData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Escolhidos');

    // Criar aba se não existir
    if (!sheet) {
        sheet = ss.insertSheet('Escolhidos');
        // Adicionar cabeçalho
        sheet.getRange(1, 1, 1, 3).setValues([
            ['Email', 'Nome', 'Presente']
        ]);
    }

    // Verificar se já escolheu
    const data = sheet.getDataRange().getValues();
    const existingChoice = data.find(row => row[0] === choiceData.guestEmail);

    if (existingChoice) {
        throw new Error('Você já escolheu um presente!');
    }

    const newRow = [
        choiceData.guestEmail || '',
        choiceData.guestName || '',
        choiceData.giftName || ''
    ];

    sheet.appendRow(newRow);

    return {
        message: 'Presente escolhido com sucesso',
        data: newRow
    };
}

/**
 * Obter todos os dados das planilhas
 */
function getAllData() {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const result = {
        convidados: getSheetData(ss, 'convidados'),
        presentes: getSheetData(ss, 'Presentes'),
        escolhidos: getSheetData(ss, 'Escolhidos')
    };

    return result;
}

/**
 * Função auxiliar para obter dados de uma aba
 */
function getSheetData(spreadsheet, sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
        return [];
    }

    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
        return [];
    }

    // Remover cabeçalho
    return data.slice(1);
}

/**
 * Excluir presente e suas escolhas relacionadas
 */
function deleteGift(deleteData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const giftName = deleteData.giftName;

    if (!giftName) {
        throw new Error('Nome do presente é obrigatório para exclusão');
    }

    let deletedGifts = 0;
    let deletedChoices = 0;

    // 1. Excluir da aba "Presentes"
    const presentsSheet = ss.getSheetByName('Presentes');
    if (presentsSheet) {
        const presentsData = presentsSheet.getDataRange().getValues();

        // Encontrar linhas para excluir (de baixo para cima para não afetar índices)
        for (let i = presentsData.length - 1; i >= 1; i--) { // Começar do índice 1 para pular cabeçalho
            if (presentsData[i][0] === giftName) {
                presentsSheet.deleteRow(i + 1); // +1 porque getDataRange é 0-indexed mas deleteRow é 1-indexed
                deletedGifts++;
            }
        }
    }

    // 2. Excluir da aba "Escolhidos"
    const chosenSheet = ss.getSheetByName('Escolhidos');
    if (chosenSheet) {
        const chosenData = chosenSheet.getDataRange().getValues();

        // Encontrar linhas para excluir (de baixo para cima)
        for (let i = chosenData.length - 1; i >= 1; i--) { // Começar do índice 1 para pular cabeçalho
            if (chosenData[i][2] === giftName) { // Coluna 2 = Nome do Presente
                chosenSheet.deleteRow(i + 1);
                deletedChoices++;
            }
        }
    }

    return {
        message: `Presente "${giftName}" excluído com sucesso`,
        data: {
            giftName: giftName,
            deletedGifts: deletedGifts,
            deletedChoices: deletedChoices
        }
    };
}

/**
 * Trocar presente escolhido por um convidado
 */
function switchGift(switchData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const guestEmail = switchData.guestEmail;
    const guestName = switchData.guestName;
    const newGiftName = switchData.newGiftName;

    if (!guestEmail || !newGiftName) {
        throw new Error('Email do convidado e nome do novo presente são obrigatórios');
    }

    const chosenSheet = ss.getSheetByName('Escolhidos');
    if (!chosenSheet) {
        throw new Error('Aba "Escolhidos" não encontrada');
    }

    const chosenData = chosenSheet.getDataRange().getValues();
    let oldGiftName = '';
    let updated = false;

    // Encontrar e atualizar a escolha do convidado
    for (let i = 1; i < chosenData.length; i++) { // Começar do índice 1 para pular cabeçalho
        if (chosenData[i][0] === guestEmail) { // Coluna 0 = Email
            oldGiftName = chosenData[i][2]; // Coluna 2 = Nome do Presente atual

            // Atualizar a linha
            chosenSheet.getRange(i + 1, 1, 1, 3).setValues([
                [
                    guestEmail,
                    guestName,
                    newGiftName
                ]
            ]);

            updated = true;
            break;
        }
    }

    if (!updated) {
        throw new Error('Escolha do convidado não encontrada');
    }

    return {
        message: `Presente trocado com sucesso`,
        data: {
            guestEmail: guestEmail,
            oldGiftName: oldGiftName,
            newGiftName: newGiftName
        }
    };
}

/**
 * Desmarcar presente escolhido por um convidado
 */
function unselectGift(unselectData) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const guestEmail = unselectData.guestEmail;
    const giftName = unselectData.giftName;

    if (!guestEmail || !giftName) {
        throw new Error('Email do convidado e nome do presente são obrigatórios');
    }

    const chosenSheet = ss.getSheetByName('Escolhidos');
    if (!chosenSheet) {
        throw new Error('Aba "Escolhidos" não encontrada');
    }

    const chosenData = chosenSheet.getDataRange().getValues();
    let removed = false;

    // Encontrar e remover a escolha do convidado (de baixo para cima)
    for (let i = chosenData.length - 1; i >= 1; i--) { // Começar do índice 1 para pular cabeçalho
        if (chosenData[i][0] === guestEmail && chosenData[i][2] === giftName) {
            chosenSheet.deleteRow(i + 1); // +1 porque getDataRange é 0-indexed mas deleteRow é 1-indexed
            removed = true;
            break; // Sair do loop após encontrar e remover
        }
    }

    if (!removed) {
        throw new Error('Escolha do convidado não encontrada');
    }

    return {
        message: `Presente "${giftName}" desmarcado com sucesso`,
        data: {
            guestEmail: guestEmail,
            giftName: giftName
        }
    };
}

// =============================
// FUNÇÃO DE TESTE (OPCIONAL)
// =============================
function testAPI() {
    console.log('Testando API...');

    // Teste de leitura
    const data = getAllData();
    console.log('Dados obtidos:', data);

    // Teste de adição de presente
    const giftResult = addGift({
        name: 'Teste API',
        url: 'https://exemplo.com',
        price: 'R$ 10,00',
        imageUrl: ''
    });
    console.log('Presente adicionado:', giftResult);

    console.log('Teste concluído!');
}