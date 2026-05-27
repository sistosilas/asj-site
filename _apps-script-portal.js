/**
 * ASJ Portal — Google Apps Script
 * ─────────────────────────────────────────────────────────────────────────────
 * INSTRUÇÕES DE DEPLOY:
 *
 * 1. Acesse https://script.google.com e crie um novo projeto
 * 2. Cole TODO este código no editor (substituindo o código padrão)
 * 3. Substitua SHEET_ID pelo ID da sua planilha Google Sheets
 *    (o ID fica na URL: docs.google.com/spreadsheets/d/ESTE_ID_AQUI/edit)
 * 4. Crie uma aba chamada "Usuarios" na planilha com as colunas:
 *    A: usuario | B: senha | C: nome | D: empresa | E: ativo | F: ultimo_acesso
 * 5. Clique em "Implantar" > "Nova implantação"
 *    - Tipo: App da Web
 *    - Executar como: Eu mesmo
 *    - Quem tem acesso: Qualquer pessoa
 * 6. Copie a URL gerada e cole em portal.html na variável SCRIPT_URL
 *
 * ESTRUTURA DA ABA "Usuarios" no Google Sheets:
 * ┌──────────┬──────────┬──────────────┬──────────────────┬───────┬────────────────────┐
 * │ usuario  │  senha   │     nome     │     empresa      │ ativo │   ultimo_acesso    │
 * ├──────────┼──────────┼──────────────┼──────────────────┼───────┼────────────────────┤
 * │ revenda1 │ senha123 │ João Silva   │ Revenda Norte    │ TRUE  │                    │
 * │ revenda2 │ abc456   │ Maria Souza  │ Distribuidora XY │ TRUE  │                    │
 * └──────────┴──────────┴──────────────┴──────────────────┴───────┴────────────────────┘
 */

const SHEET_ID   = 'COLE_AQUI_O_ID_DA_PLANILHA';
const SHEET_NAME = 'Usuarios';

// ─── ENTRY POINT ──────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (body.action === 'login') {
      return handleLogin(body.usuario, body.senha);
    }

    return jsonResp({ ok: false, msg: 'Ação não reconhecida.' });

  } catch (err) {
    return jsonResp({ ok: false, msg: 'Erro interno: ' + err.message });
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function handleLogin(usuario, senha) {
  if (!usuario || !senha) {
    return jsonResp({ ok: false, msg: 'Usuário e senha são obrigatórios.' });
  }

  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    return jsonResp({ ok: false, msg: 'Planilha "Usuarios" não encontrada.' });
  }

  const rows = sheet.getDataRange().getValues();
  // rows[0] = cabeçalho: usuario | senha | nome | empresa | ativo | ultimo_acesso

  for (let i = 1; i < rows.length; i++) {
    const rowUsuario = String(rows[i][0]).trim();
    const rowSenha   = String(rows[i][1]).trim();
    const nome       = String(rows[i][2]).trim();
    const empresa    = String(rows[i][3]).trim();
    const ativo      = rows[i][4];

    if (rowUsuario === String(usuario).trim() &&
        rowSenha   === String(senha).trim()   &&
        ativo      === true) {

      // Registra data/hora do último acesso
      try {
        const agora = Utilities.formatDate(
          new Date(),
          Session.getScriptTimeZone(),
          'dd/MM/yyyy HH:mm:ss'
        );
        sheet.getRange(i + 1, 6).setValue(agora);
      } catch (e) { /* ignora erro de escrita */ }

      return jsonResp({ ok: true, nome: nome, empresa: empresa });
    }
  }

  return jsonResp({ ok: false, msg: 'Usuário ou senha incorretos.' });
}

// ─── HELPER ───────────────────────────────────────────────────────────────────
function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
