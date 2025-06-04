# 🎁 Sistema de Presentes - Chá de Casa Nova

## 📋 Visão Geral

Sistema integrado para gerenciamento de presentes do Chá de Casa Nova do Arysson & Nicole, conectado diretamente ao Google Sheets para controle em tempo real.

## 🔗 Configuração da Planilha

### ID da Planilha
- **ID**: `1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y`
- **Chave API**: `AIzaSyBW98wPFQdj5DscddMnWNG3TBQptj69uPI`

### Estrutura das Abas

#### 1. **convidados** (Coluna A:C)
Controla o acesso ao sistema de presentes:

| Coluna A | Coluna B | Coluna C |
|----------|----------|----------|
| Nome     | Email    | Quantidade |
| Arysson Silva | arysson@email.com | 2 |
| Nicole Santos | nicole@email.com | 1 |

**📝 Detalhes:**
- **Nome**: Nome completo do convidado
- **Email**: Email usado para login (deve ser único)
- **Quantidade**: Número de pessoas (opcional, padrão: 1)

#### 2. **Presentes** (Coluna A:D)
Lista todos os presentes disponíveis:

| Coluna A | Coluna B | Coluna C | Coluna D |
|----------|----------|----------|----------|
| Nome | URL | Preço | Foto |
| Panela Antiaderente | https://amazon.com/... | R$ 89,90 | https://imgur.com/... |
| Jogo de Cama Casal | https://americanas.com.br/... | R$ 149,99 | https://imgur.com/... |

**📝 Detalhes:**
- **Nome**: Nome do presente
- **URL**: Link para compra (opcional)
- **Preço**: Valor do presente (formato: R$ XX,XX)
- **Foto**: URL da imagem do presente

#### 3. **Escolhidos** (Coluna A:C)
Registra os presentes já escolhidos:

| Coluna A | Coluna B | Coluna C |
|----------|----------|----------|
| Email | Nome | Presente |
| arysson@email.com | Arysson Silva | Panela Antiaderente |
| nicole@email.com | Nicole Santos | Jogo de Cama Casal |

**📝 Detalhes:**
- **Email**: Email do convidado que escolheu
- **Nome**: Nome do convidado
- **Presente**: Nome do presente escolhido

## 🚀 Fluxo do Sistema

### 1. **Confirmação de Presença (index.html)**
O formulário de confirmação foi simplificado e agora coleta apenas:
- **Nome completo** (obrigatório)
- **Email** (obrigatório)
- **Quantidade de pessoas** (opcional, padrão: 1 pessoa)

### 2. **Acesso aos Presentes (presentes.html)**
- Sistema verifica se o email existe na aba `convidados`
- **Se encontrado**: Login realizado com sucesso
- **Se NÃO encontrado**: Modal de cadastro aparece automaticamente
  - Usuário informa nome e quantidade
  - Sistema cadastra automaticamente na planilha
  - Login é realizado automaticamente

### 3. **Seleção de Presentes**
- Apenas 1 presente por convidado
- Lista atualizada em tempo real
- Presentes já escolhidos ficam indisponíveis

### 4. **Painel Administrativo (admin-presentes.html)**
- **Senha**: `admin123`
- Gerenciamento completo de convidados e presentes
- Estatísticas em tempo real
- Exportação de dados

## 🎯 Funcionalidades Principais

### ✅ **Cadastro Automático**
- Novos convidados são cadastrados automaticamente
- Não há necessidade de pré-cadastro na planilha
- Interface amigável com modal de cadastro

### ✅ **Controle de Acesso**
- Login por email
- Verificação automática na planilha
- Uma escolha por convidado

### ✅ **Atualização em Tempo Real**
- Mudanças refletem imediatamente
- Sincronização automática com Google Sheets
- Cache inteligente para performance

### ✅ **Interface Responsiva**
- Design moderno e elegante
- Funciona em mobile e desktop
- Tema roxo consistente

## 🛠️ Configuração Técnica

### Limitações de Performance
- **Máximo 200 linhas por aba**: Para otimizar a performance, o sistema busca apenas as primeiras 200 linhas de cada aba
- **Ranges configurados**:
  - `convidados!A1:C200`
  - `Presentes!A1:D200`
  - `Escolhidos!A1:C200`

### Permissões da Planilha (IMPORTANTE para Escrita)
1. Abra a planilha no Google Sheets
2. Clique em **"Compartilhar"** (botão azul no canto superior direito)
3. Em **"Obter link"**, configure como:
   - ✅ **"Qualquer pessoa com o link"**
   - ✅ **"Pode editar"** (não apenas visualizar!)
4. Copie o link e verifique se contém `/edit` no final
5. API habilitada para Google Sheets v4
6. Chave API configurada corretamente

**⚠️ ATENÇÃO**: Para que o sistema funcione completamente, a planilha DEVE estar com permissão de **"Edição pública"**. Caso contrário, apenas a leitura funcionará.

### Estrutura de Arquivos
```
projeto/
├── index.html              # Convite e confirmação
├── presentes.html          # Sistema de presentes
├── presentes.js           # Lógica principal
├── presentes.css          # Estilos
├── admin-presentes.html   # Painel admin
├── admin-presentes.js     # Lógica admin
├── admin-presentes.css    # Estilos admin
└── README-planilha.md     # Esta documentação
```

## 📊 Capacidade do Sistema

### Limites Recomendados
- **Convidados**: Até 199 (linha 1 = cabeçalho)
- **Presentes**: Até 199 (linha 1 = cabeçalho)
- **Escolhidos**: Até 199 (linha 1 = cabeçalho)

### Performance
- ✅ **Busca rápida**: Máximo 200 linhas por consulta
- ✅ **Cache inteligente**: Dados armazenados localmente
- ✅ **Atualizações otimizadas**: Apenas quando necessário

## 📊 Exemplo de Dados

### Convidados (3 registros)
```
Nome               | Email                    | Quantidade
Arysson Silva      | arysson@email.com       | 2
Nicole Santos      | nicole@email.com        | 1
Maria da Silva     | maria@email.com         | 3
```

### Presentes (5 registros)
```
Nome                    | URL                           | Preço      | Foto
Panela Antiaderente     | https://amazon.com/panela     | R$ 89,90   | https://imgur.com/panela.jpg
Jogo de Cama Casal      | https://americanas.com/jogo   | R$ 149,99  | https://imgur.com/cama.jpg
Micro-ondas 20L         | https://extra.com.br/micro    | R$ 299,00  | https://imgur.com/micro.jpg
Aspirador de Pó         | https://magazineluiza.com/asp | R$ 179,90  | https://imgur.com/aspirador.jpg
Jogo de Panelas         | https://casasbahia.com.br/pan | R$ 199,99  | https://imgur.com/panelas.jpg
```

### Escolhidos (2 registros)
```
Email                    | Nome          | Presente
arysson@email.com        | Arysson Silva | Panela Antiaderente
nicole@email.com         | Nicole Santos | Jogo de Cama Casal
```

## 🔧 Solução de Problemas

### ❌ "Erro 401 (Unauthorized)" - Mais Comum
**Problema**: Sistema não consegue salvar dados (presentes, escolhas)
**Causa**: Planilha sem permissão de edição pública
**Solução**:
1. Abra a planilha: https://docs.google.com/spreadsheets/d/1LNBNy1JVLOdlsiBMI0okZjj-7jfa9G-npLdwLzpvX8Y/edit
2. Clique em **"Compartilhar"** (botão azul no canto superior direito)
3. Em **"Obter link"**, altere de "Visualizador" para **"Editor"**
4. Certifique-se que está como **"Qualquer pessoa com o link"**
5. Clique em **"Copiar link"** e verifique se termina com `/edit`
6. Teste novamente o sistema

### ❌ "Erro ao carregar dados"
- Verificar ID da planilha
- Conferir permissões de compartilhamento
- Validar chave API

### ❌ "Email não encontrado"
- Agora isso é normal! O sistema irá cadastrar automaticamente
- Modal de cadastro aparecerá para coleta de informações

### ❌ "Presente não disponível"
- Verificar se já foi escolhido por outro convidado
- Atualizar página para sincronizar dados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar esta documentação
2. Consultar console do navegador (F12)
3. Verificar dados na planilha do Google Sheets

---

### API Key do Google
- **Atual:** `AIzaSyBW98wPFQdj5DscddMnWNG3TBQptj69uPI`
- **Status:** Configurada nos arquivos `presentes.js` e `admin-presentes.js`

### Permissões da Planilha
1. A planilha deve estar com permissão **"Qualquer pessoa com o link pode ver"**
2. Para escrita (adicionar presentes escolhidos), a API Key precisa ter permissões adequadas

### Configuração dos Nomes das Abas
No código JavaScript, os nomes das abas estão definidos como:
```javascript
sheets: {
    convidados: 'convidados!A:C',     // Nome, Email, Quantidade
    presentes: 'Presentes!A:D',       // Nome, URL, Preço, Foto
    escolhidos: 'Escolhidos!A:C'      // Email, Nome, Presente
}
```

## 🎯 Como Usar o Sistema

### Para Convidados:
1. Acesse `presentes.html`
2. Digite o email usado na confirmação
3. Escolha um presente da lista
4. Confirme a seleção

### Para Administradores:
1. Acesse `admin-presentes.html`
2. Digite a senha: `admin123`
3. Gerencie presentes, veja estatísticas e exporte dados

## 🔒 Configurações de Segurança

### Senha do Admin
- **Atual:** `admin123`
- **Para alterar:** Edite a variável `adminPassword` no arquivo `admin-presentes.js`

## 📊 Estrutura dos Dados

### Fluxo de Dados:
1. **Convidados** confirmam presença → dados ficam na aba `convidados`
2. **Sistema** verifica email na aba `convidados` para permitir login
3. **Convidado** escolhe presente → dados são salvos na aba `Escolhidos`
4. **Admin** gerencia presentes → dados ficam na aba `Presentes`

### Validações:
- ✅ Email deve existir na aba `convidados`
- ✅ Cada convidado pode escolher apenas 1 presente
- ✅ Presentes já escolhidos ficam indisponíveis
- ✅ Sistema atualiza em tempo real

## 🚀 Próximos Passos

1. **Preencher a aba `convidados`** com nomes, emails e quantidade de acompanhantes
2. **Adicionar presentes** via painel admin ou diretamente na aba `Presentes`
3. **Testar o sistema** com alguns emails
4. **Configurar permissões** adequadas da planilha
5. **Personalizar senha** do admin

## 🎁 Exemplo de Dados para Teste

### Aba `convidados`:
```
Nome                Email                    Quantidade
João Silva          joao@email.com          2
Maria Santos        maria@email.com         1
Pedro Lima          pedro@email.com         3
Ana Costa           ana@email.com           1
```

### Aba `Presentes`:
```
Nome                URL                                 Preço       Foto
Jogo de Panelas     https://magazineluiza.com/panela   R$ 150,00   https://a-static.mlcdn.com.br/450x450/jogo-de-panelas-antiaderente-5-pecas-tramontina-paris-grafite/magazineluiza/033063500/fcca23e2bbff4a14d518c50b8f05ae6d.jpg
Microondas          https://casasbahia.com.br/micro    R$ 380,00   https://a-static.mlcdn.com.br/450x450/microondas-consul-cms45ar-32-litros-branco-110v/casasbahia/15051920/d4d7c19936bc79d1b3f5d0e3c4de2a1b.jpg
Liquidificador      https://americanas.com/liqui       R$ 120,00   https://a-static.mlcdn.com.br/450x450/liquidificador-philips-walita-daily-ri2110-2-litros-550w/magazineluiza/033063501/fcca23e2bbff4a14d518c50b8f05ae6e.jpg
```

## 🆘 Troubleshooting

### Problemas Comuns:
- **"Email não encontrado":** Verificar se email está na aba `convidados`
- **"Erro ao carregar":** Verificar permissões da planilha
- **"Erro de API":** Verificar se API Key está configurada corretamente

### Debug:
- Abra o console do navegador (F12)
- Verifique as mensagens de erro
- Use `window.debugGifts` (página pública) ou `window.debugAdmin` (página admin) para inspecionar dados

## ✨ Sistema Simplificado

Este sistema foi simplificado para ser mais funcional e fácil de usar:
- ❌ Removido: categorias, descrições, prioridades, datas/horas
- ✅ Mantido: funcionalidade essencial, design bonito, estatísticas
- 🎯 Foco: escolha rápida de presentes com preços e links 