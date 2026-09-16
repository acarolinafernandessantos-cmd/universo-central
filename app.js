const navItems = document.querySelectorAll('.nav-item, [data-view]');
document.addEventListener('input', (event) => {
  if (!event.target.matches(
    '#currentPlanValue, #newPlanValue, #totalPenaltyValue'
  )) {
    return;
  }

  function parseMoney(value) {
    const text = String(value || '')
      .replace(/R\$\s?/gi, '')
      .trim();

    if (!text) {
      return 0;
    }

    if (text.includes(',')) {
      return Number(
        text.replace(/\./g, '').replace(',', '.')
      ) || 0;
    }

    return Number(text) || 0;
  }

  const planoAtual = parseMoney(
    document.getElementById('currentPlanValue').value
  );

  const novoPlano = parseMoney(
    document.getElementById('newPlanValue').value
  );

  const multaTotal = parseMoney(
    document.getElementById('totalPenaltyValue').value
  );

  const diferenca = planoAtual - novoPlano;
  const percentualReducao =
    planoAtual > 0 ? diferenca / planoAtual : 0;

  const multaProporcional =
    multaTotal * percentualReducao;

  document.getElementById('penaltyResult').textContent =
    multaProporcional.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  document.getElementById('penaltyBreakdown').textContent =
    percentualReducao > 0 && multaTotal > 0
      ? `Redução de ${(percentualReducao * 100)
          .toFixed(2)
          .replace('.', ',')}% aplicada sobre a multa total`
      : 'Informe plano atual, novo plano e multa total';
});

document.getElementById('searchInput').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }

  const query = event.target.value.toLowerCase();

  const target =
    query.includes('globoplay') ||
    query.includes('amazon') ||
    query.includes('deezer') ||
    query.includes('disney') ||
    query.includes('hbo') ||
    query.includes('sky+') ||
    query.includes('aplicativo')
      ? 'guias'
      : query.includes('sva') ||
        query.includes('multa') ||
        query.includes('regra') ||
        query.includes('cancel') ||
        query.includes('formaliza') ||
        query.includes('financeiro')
      ? 'regras'
      : query.includes('compos') ||
        (query.includes('equipamento') &&
          query.includes('valor'))
      ? 'composicao'
      : query.includes('plano') ||
        query.includes('atualiza')
      ? 'atualizacoes'
      : query.includes('endereço') ||
        query.includes('titular') ||
        query.includes('cabo') ||
        query.includes('equipamento')
      ? 'processos'
      : query.includes('mensagem') ||
        query.includes('fala')
      ? 'colinhas'
      : query.includes('vídeo')
      ? 'videos'
      : 'atendimentos';

  showView(target);
});

document.addEventListener('keydown', (event) => {
  if (
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === 'k'
  ) {
    event.preventDefault();
    document.getElementById('searchInput').focus();
  }
});
const homeSections = document.querySelectorAll('[data-section="inicio"]');
const views = document.querySelectorAll('.view');
const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
const toast = document.getElementById('toast');
const sidebar = document.getElementById('sidebar');

const viewNames = {
  inicio: 'VISÃO GERAL', atendimentos: 'ABRIR ATENDIMENTO', processos: 'PROCESSOS E SERVIÇOS',
  atualizacoes: 'ATUALIZAÇÕES E PLANOS', composicao: 'COMPOSIÇÃO DOS PLANOS', regras: 'SVA E REGRAS OBRIGATÓRIAS', colinhas: 'COLINHAS PRONTAS', apps: 'APLICATIVOS E ACESSOS', guias: 'GUIAS DOS APLICATIVOS', videos: 'VÍDEOS DE TREINAMENTO'
};

const copyTexts = {};
let copyId = 0;
const copy = (text) => {
  const done = () => showToast('Modelo copiado. Agora é só colar no atendimento.');
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  else fallbackCopy(text, done);
};
const fallbackCopy = (text, done) => {
  const area = document.createElement('textarea'); area.value = text; area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); done();
};
const esc = (text) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const copyCard = (title, tag, intro, text) => {
  const id = `copy-${++copyId}`; copyTexts[id] = text;
  return `<article class="copy-card process-card"><div class="copy-card-top"><span class="tag red">${tag}</span><button class="copy-btn copy-model-btn" data-copy-id="${id}">COPIAR MODELO</button></div><h3>${title}</h3><p class="copy-intro">${intro}</p><div class="model-box"><pre>${esc(text)}</pre></div></article>`;
};
const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); };
const card = (title, body, extra = '') => `<article class="info-card"><h3>${title}</h3>${body}${extra}</article>`;
const processCard = (title, tag, intro, fields, text = '') => `<article class="process-card"><span class="tag ${tag.includes('ABRE') ? 'red' : ''}">${tag}</span><h3>${title}</h3><p>${intro}</p><ul>${fields.map(field => `<li>${field}</li>`).join('')}</ul>${text ? `<div class="copy-box"><p>${text}</p><button class="copy-btn" data-copy="${text.replaceAll('"', '&quot;')}">COPIAR</button></div>` : ''}</article>`;

const commercialPlans = [
  { category: 'Planos comerciais', price: 'R$ 69,99', name: '500MB + UBOOK + UNIVERSO PLAY + TV PLUS', items: [['SCM', 'R$ 6,99'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 4,00']], total: 'R$ 69,99' },
  { category: 'Planos comerciais', price: 'R$ 79,99', name: '600MB + UBOOK + UNIVERSO PLAY TV PLUS', items: [['SCM', 'R$ 15,99'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 5,00']], total: 'R$ 79,99' },
  { category: 'Planos comerciais', price: 'R$ 89,99', name: '800MB + UBOOK + DEEZER + UNIVERSO PLAY TV PLUS', items: [['SCM', 'R$ 19,00'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['UNIVERSO PLAY TV PLUS', 'R$ 5,00']], total: 'R$ 89,99' },
  { category: 'Planos comerciais', price: 'R$ 99,99', name: '600MB + UBOOK + UNIVERSO PLAY TV PLUS + SERVIÇO PREMIUM', items: [['SCM', 'R$ 16,00'], ['UBOOK', 'R$ 59,00'], ['DISNEY+, MAX, AMAZON PRIME E APPLE TV', 'R$ 19,99'], ['UNIVERSO PLAY TV PLUS', 'R$ 5,00']], total: 'R$ 99,99' },
  { category: 'Planos comerciais', price: 'R$ 99,99', name: '1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV PLUS', items: [['SCM', 'R$ 29,00'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['UNIVERSO PLAY TV PLUS', 'R$ 5,00']], total: 'R$ 99,99' },
  { category: 'Planos comerciais', price: 'R$ 99,99', name: '1 GIGA + UBOOK + GLOBO PLAY + UNIVERSO PLAY TV PLUS', items: [['SCM', 'R$ 35,99'], ['UBOOK', 'R$ 59,00'], ['GLOBO PLAY', 'R$ 0,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 5,00']], total: 'R$ 99,99' },
  { category: 'Planos comerciais', price: 'R$ 109,99', name: '1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV TOP + GLOBO PLAY', items: [['SCM', 'R$ 26,01'], ['GLOBO PLAY', 'R$ 0,00'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 109,99' },
  { category: 'Planos comerciais', price: 'R$ 109,99', name: '1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 26,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 109,99' },
  { category: 'Planos comerciais', price: 'R$ 119,99', name: '1 GIGA + UBOOK + DEEZER + APP PREMIUM + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 16,02'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['HBO MAX / DISNEY PLUS', 'R$ 19,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 119,99' },
  { category: 'Planos comerciais', price: 'R$ 119,99', name: '1 GIGA + UBOOK + DEEZER + AMAZON PRIME + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 16,02'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['AMAZON PRIME', 'R$ 19,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 119,99' },
  { category: 'Planos comerciais', price: 'R$ 129,99', name: '1 GIGA + UBOOK + DEEZER + MAX + DISNEY PLUS + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 6,03'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 6,99'], ['HBO MAX', 'R$ 19,99'], ['DISNEY PLUS', 'R$ 19,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 129,99' },
  { category: 'Planos comerciais', price: 'R$ 159,99', name: '1 GIGA + UBOOK + DEEZER + MAX + DISNEY PLUS + UNIVERSO PLAY + TV TOP + AMAZON PRIME', items: [['SCM', 'R$ 12,05'], ['UBOOK', 'R$ 59,99'], ['DEEZER', 'R$ 9,99'], ['HBO MAX', 'R$ 19,99'], ['DISNEY PLUS', 'R$ 19,99'], ['AMAZON PRIME', 'R$ 19,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 159,99' },
  { category: 'Planos comerciais', price: 'R$ 179,99', name: '1 GIGA + UBOOK + DEEZER + MAX + DISNEY PLUS + UNIVERSO PLAY + TV TOP + AMAZON PRIME + APPLE TV', items: [['SCM', 'R$ 12,06'], ['UBOOK', 'R$ 59,99'], ['DEEZER', 'R$ 9,99'], ['HBO MAX', 'R$ 19,99'], ['APPLE TV', 'R$ 19,99'], ['DISNEY PLUS', 'R$ 19,99'], ['AMAZON PRIME', 'R$ 19,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99']], total: 'R$ 179,99' },
  { category: 'Planos novos', price: 'R$ 69,99', name: '800MB + UBOOK + UNIVERSO PLAY + TV PLUS', items: [['SCM', 'R$ 14,00'], ['UBOOK', 'R$ 46,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 9,99']], total: 'R$ 69,99' },
  { category: 'Planos novos', price: 'R$ 74,99', name: '1 GIGA + UBOOK + UNIVERSO PLAY + TV PLUS', items: [['SCM', 'R$ 19,00'], ['UBOOK', 'R$ 46,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 9,99']], total: 'R$ 74,99' },
  { category: 'Planos novos', price: 'R$ 59,99', name: '1 GIGA + UBOOK + UNIVERSO PLAY TV TOP + DEEZER', items: [['SCM', 'R$ 0,99'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 0,00']], total: 'R$ 59,99' },
  { category: 'Planos novos', price: 'R$ 79,99', name: '1 GIGA + UBOOK + UNIVERSO PLAY TV TOP + DEEZER', items: [['SCM', 'R$ 9,00'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 5,00'], ['DEEZER', 'R$ 6,99']], total: 'R$ 79,99' },
  { category: 'Repetidor / Wi-Fi', price: 'R$ 109,99', name: '1 GIGA + UBOOK + UNIVERSO PLAY TV TOP + WI-FI ADICIONAL', items: [['SCM', 'R$ 9,00'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 5,00'], ['WI-FI ADICIONAL', 'R$ 6,99']], total: 'R$ 79,99' },
  { category: 'Repetidor / Wi-Fi', price: 'R$ 129,99', name: '1 GIGA + UBOOK + DEEZER + MAX + WI-FI ADICIONAL + UNIVERSO PLAY + TV TOP', items: [['SCM', 'R$ 6,02'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['DEEZER', 'R$ 6,99'], ['MAX', 'R$ 19,99'], ['WI-FI ADICIONAL', 'R$ 20,00']], total: 'R$ 129,99' },
  { category: 'Telefone fixo', price: 'R$ 99,99', name: '400MB + UBOOK + UNIVERSO PLAY TV PLUS + FIXO ILIMITADO BRASIL', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV PLUS', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 173,00' },
  { category: 'Telefone fixo', price: 'R$ 109,99', name: '600MB + UBOOK + UNIVERSO PLAY TV TOP + FIXO ILIMITADO BRASIL', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 173,00' },
  { category: 'Telefone fixo', price: 'R$ 119,99', name: '600MB + UBOOK + DEEZER + UNIVERSO PLAY TV TOP + FIXO ILIMITADO BRASIL', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 232,00' },
  { category: 'Telefone fixo', price: 'R$ 129,99', name: '1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV TOP + TELEFONE ILIMITADO', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 232,00' },
  { category: 'Telefone fixo', price: 'R$ 159,99', name: '1 GIGA + UBOOK + TELEFONE ILIMITADO BRASIL + WI-FI MESH + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 59,00'], ['WI-FI MESH', 'R$ 17,99'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 249,99' },
  { category: 'Telefone fixo', price: 'R$ 169,99', name: '1 GIGA + UBOOK + DEEZER + TELEFONE ILIMITADO BRASIL + UNIVERSO PLAY TV FAST + WI-FI MESH', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 59,00'], ['WI-FI MESH', 'R$ 17,99'], ['UNIVERSO PLAY TV PLUS', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 249,99' },
  { category: 'Telefone fixo', price: 'R$ 179,99', name: '1 GIGA + UBOOK + DEEZER + MAX + UNIVERSO PLAY TV TOP + TELEFONE ILIMITADO + WI-FI MESH', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['DEEZER', 'R$ 59,00'], ['WI-FI MESH', 'R$ 17,99'], ['UNIVERSO PLAY TV PLUS', 'R$ 17,99'], ['MAX', 'R$ 17,99'], ['FIXO ILIMITADO BRASIL', 'R$ 60,00']], total: 'R$ 267,98' },
  { category: 'Repetidor / Wi-Fi', price: 'R$ 179,99', name: '1 GIGA + UBOOK + DEEZER + 2 WI-FI ADICIONAL + UNIVERSO PLAY TV TOP', items: [['SCM', 'R$ 36,01'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 17,99'], ['DEEZER', 'R$ 6,99'], ['2 WI-FI ADICIONAL', 'R$ 60,00']], total: 'R$ 179,99' },
  { category: 'Repetidor / Wi-Fi', price: 'R$ 219,99', name: '1 GIGA + UBOOK + DEEZER + MAX + AMAZON PRIME + DISNEY + APPLE + UNIVERSO PLAY TV TOP + 1 WI-FI ADICIONAL', items: [['SCM', 'R$ 9,00'], ['UBOOK', 'R$ 59,00'], ['UNIVERSO PLAY TV TOP', 'R$ 5,00'], ['DEEZER', 'R$ 6,99'], ['MAX', 'R$ 6,99'], ['AMAZON PRIME', 'R$ 6,99'], ['DISNEY+', 'R$ 6,99'], ['APPLE TV', 'R$ 6,99'], ['WI-FI ADICIONAL', 'R$ 6,99']], total: 'R$ 114,94' }
];

const equipmentPrices = [['SETUP BOX', 'R$ 400,00'], ['ONT', 'R$ 400,00'], ['ROTEADOR /1000', 'R$ 330,00'], ['ONU', 'R$ 200,00'], ['ROTEADOR /100', 'R$ 200,00'], ['CONTROLE SETUPBOX', 'R$ 40,00'], ['FONTE (ROTEADOR / ONU / ONT)', 'R$ 40,00'], ['ANTENA - RÁDIO', 'R$ 500,00'], ['FONTE POE', 'R$ 200,00'], ['CABO RCA/P2', 'R$ 40,00'], ['ATA', 'R$ 300,00'], ['ALUGUEL ATA', 'R$ 19,99'], ['CÂMERAS', 'R$ 500,00']];
const servicePrices = [['Mudança de endereço', 'R$ 120,00'], ['Troca de equipamento de lugar', 'R$ 120,00'], ['Retirada de equipamentos: visita para buscar', 'R$ 120,00'], ['Cabo de rede / metro', 'R$ 5,00'], ['RJ45', 'R$ 2,50'], ['Repetidor de sinal: migração para o plano', 'R$ 150,00']];
const renderPlanTile = (plan) => `<article class="plan-detail"><div class="plan-detail-top"><span class="tag">${plan.category}</span><strong>${plan.price}</strong></div><h3>${plan.name}</h3><div class="composition-list">${plan.items.map(item => `<div><span>${item[0]}</span><b>${item[1]}</b></div>`).join('')}</div><div class="plan-total"><span>Total informado</span><b>${plan.total}</b></div></article>`;
const renderPriceTable = (items) => `<table class="price-table"><tbody>${items.map(item => `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>`).join('')}</tbody></table>`;
const detailedComposition = () => `<div class="view-head"><p class="eyebrow">CONSULTA · CONTRATO</p><h2>Composição completa.</h2><p>Use esta tela antes de editar o contrato. Cada card traz a composição comercial informada, o valor de cada item e o total registrado na tabela.</p></div><div class="notice"><b>Atenção:</b> os totais abaixo foram mantidos exatamente como enviados. Quando a soma dos itens não coincidir com o total comercial, confirme a regra vigente antes de alterar o contrato.</div><div class="plan-filter"><button class="filter-pill active" data-plan-filter="Todos">Todos</button><button class="filter-pill" data-plan-filter="Planos comerciais">Comerciais</button><button class="filter-pill" data-plan-filter="Planos novos">Novos</button><button class="filter-pill" data-plan-filter="Repetidor / Wi-Fi">Wi-Fi</button><button class="filter-pill" data-plan-filter="Telefone fixo">Telefone</button></div><div class="plan-detail-grid">${commercialPlans.map(renderPlanTile).join('')}</div><div class="price-columns"><div><p class="eyebrow">EQUIPAMENTOS</p><h3>Valores de produtos</h3>${renderPriceTable(equipmentPrices)}</div><div><p class="eyebrow">SERVIÇOS E TAXAS</p><h3>Valores para informar</h3>${renderPriceTable(servicePrices)}</div></div>`;

const processModels = [
  {title:`Mudança de endereço`, tag:`ABRE ATENDIMENTO`, intro:`Modelo completo para registrar a mudança e deixar todos os dados da O.S. preenchidos.`, text:`TIPO DE SERVIÇO: MUDANÇA DE ENDEREÇO
CLIENTE TEM REPETIDOR:
CASA OU AP:
ANTIGO ENDEREÇO:
PLANO+SVA:
VENC:
TAXA:
EQUIPAMENTOS EM COMODATO:
AGENDAMENTO: TURNO/
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
COD.
METRAGEM DE FIBRA UTILIZADA:
CTO:
PORTA:
LOCALIZAÇÃO:
REFERÊNCIA:
COMPROVANTE DE ENDEREÇO / FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Troca de titularidade`, tag:`ABRE ATENDIMENTO`, intro:`Sempre conferir boleto em aberto e definir quem será responsável antes de agendar.`, text:`AUTORIZAÇÃO TROCA DE TITULARIDADE

EU AUTORIZO A TROCA DE TITULARIDADE PARA , NOME:___________________ PORTADOR DO CPF: ________.
EQUIPAMENTO EM COMODATO VAI PARA O NOVO TITULAR.

(sempre verificar boleto em aberto, caso esteja aberto tem q saber quem vai pagar)
AGENDAR PARA SUPORTE INTERNO
TIPO DE SERVIÇO: TROCA DE TITULARIDADE
ANTIGO TITULAR (NOME) COD:
NOVO TITULAR (NOME) COD:
NOVO PLANO+SVA:
HOUVE ATUALIZAÇÃO?
POR ONDE FOI A SOLICITAÇÃO:`},
  {title:`Equipamento de lugar`, tag:`ABRE ATENDIMENTO`, intro:`Registre o novo local, metragem, CTO e porta antes do agendamento.`, text:`TIPO DE SERVIÇO: MUDAR EQUIPAMENTO DE LUGAR
PARA ONDE MUDAR:
PLANO+SVA:
TAXA:
EQUIPAMENTOS EM COMODATOS:
COD.:
AGENDAMENTO: TURNO/
METRAGEM DE FIBRA UTILIZADA:
CTO:
PORTA:
LOCALIZAÇÃO:
REFERÊNCIA:
FOTO ANEXADA:`},
  {title:`Cabo de rede`, tag:`ABRE ATENDIMENTO`, intro:`Informe os valores antes de confirmar e registre metragem e conectores.`, text:`O cabo de rede custa R$ 5,00 por metro e cada conector custa R$ 2,50. Posso confirmar a solicitação?`},
  {title:`Reativação`, tag:`ABRE ATENDIMENTO`, intro:`Confira se a antiga CTO já foi desativada e use o encaminhamento correto.`, text:`TIPO DE SERVIÇO: REATIVAÇÃO DE SINAL
CLIENTE TEM REPETIDOR:
CASA OU AP:
NOVO PLANO+SVA:
VENC:
EQUIPAMENTO:
JÁ FOI DESCONECTADO DA ANTIGA CTO?
AGENDAMENTO: TURNO/
COD:
CTO:
PORTA:
METRAGEM:
CONTATO DO CLIENTE:
LOCALIZAÇÃO:
REFERÊNCIA:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
COMPROVANTE DE ENDEREÇO / FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Instalação nova`, tag:`ABRE ATENDIMENTO`, intro:`Use este modelo para uma nova instalação e não esqueça localização e referência.`, text:`TIPO DE SERVIÇO: INSTALAÇÃO NOVA
CLIENTE TEM REPETIDOR: NÃO
CASA OU AP:
PLANO+SVA:
VENC:
TAXA: SEM TAXA
EQUIPAMENTOS EM COMODATO: EQUIPAMENTO GIGA
AGENDAMENTO:
COD:
POR ONDE FOI SOLICITADO:
FORMALIZAÇÃO:
LOCALIZAÇÃO:
REFERÊNCIA:`},
  {title:`Troca de plano`, tag:`ABRE ATENDIMENTO`, intro:`Preencha o novo plano, movimento de valor e formalização.`, text:`TIPO DE SERVIÇO: TROCA DE PLANO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR: MESMO VALOR
VENCIMENTO: O MESMO
EQUIPAMENTOS EM COMODATO: COMPATÍVEL
COD.
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Troca de plano + extensor`, tag:`ABRE ATENDIMENTO`, intro:`Modelo para alteração de plano com instalação de extensor de sinal em comodato.`, text:`TIPO DE SERVIÇO: TROCA DE PLANO/INSTALAR EXTENSOR DE SINAL EM COMODATO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR:
VENCIMENTO:
EQUIPAMENTOS EM COMODATO:
COD.
AGENDAMENTO: TURNO/
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Viabilidade`, tag:`ABRE ATENDIMENTO`, intro:`Use para consultar viabilidade e, em mudança de endereço, informe o novo endereço na O.S.`, text:`VIABILIDADE
TIPO DE SERVIÇO: (MOTIVO)
LOCALIZAÇÃO FIXA:
REFERENCIA DO LOCAL:
FOTO DA CASA:
TELEFONES PARA CONTATO:
AGENDAMENTO: TURNO/
COD:
OBSERVAÇÃO: QUANDO FOR MUDANÇA DE ENDEREÇO COLOCAR O NOVO ENDEREÇO NA O.S`},
  {title:`Instalar repetidor de sinal`, tag:`ABRE ATENDIMENTO`, intro:`Registre se o repetidor é do cliente, o agendamento e a ciência sobre cobertura.`, text:`TIPO DE SERVIÇO: INSTALAR REPETIDOR DE SINAL
CASA OU AP:
PLANO+SVA:
TAXA:
EQUIPAMENTOS EM COMODATOS: ONU + ROTEADOR
REPETIDOR DO CLIENTE?
COD.:
CONTATO DO CLIENTE:
AGENDAMENTO: TURNO/
POR ONDE FOI FEITO A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
LOCALIZAÇÃO:
REFERÊNCIA:
FOTO ANEXADA: SIM
CLIENTE CIENTE ATÉ 30 METROS:`},
  {title:`Troca de cabeamento: rádio para fibra`, tag:`ABRE ATENDIMENTO`, intro:`Registre a retirada da tecnologia antiga e os equipamentos da nova tecnologia.`, text:`TIPO DE SERVIÇO: TROCA DE CABEAMENTO DE RADIO PARA FIBRA
PLANO+SVA:
VENCIMENTO:
TAXA:
RECOLHER OS EQUIPAMENTOS A ANTIGA TECNOLOGIA:
EQUIPAMENTOS EM COMODATO REFERENTE A NOVA TECNOLOGIA: ONU + ROTEADOR
POSSUI REPETIDOR:
FORMALIZAÇÃO:
AGENDAMENTO:
COD:
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO:
LOCALIZAÇÃO:
ANEXADO FOTO COM DOCUMENTO: SIM`}
];
const colinhaModels = [
  {title:`Atendimento`, tag:`ABRIR ATENDIMENTO`, intro:`Modelo base para registrar qualquer contato.`, text:`ATENDIMENTO:
RELATO DO CLIENTE:
TELEFONE DE CONTATO:
SOLICITANTE:
MELHOR TURNO PARA LIGAÇÕES:
RECLAMAÇÕES FRENTE DE LOJA OU POR TELEFONE:`},
  {title:`Sem resposta`, tag:`ABRIR ATENDIMENTO`, intro:`Use quando não houve resposta pelo chat e não foi possível contato por ligação.`, text:`RELATO DO CLIENTE:
ENTREI EM CONTATO PARA OFERTAR UMA ATUALIZAÇÃO DE PLANO, NÃO TIVE RESPOSTA PELO CHAT, SEM CONTATO POR LIGAÇÃO.

NÚMERO:
PROTOCOLO CHAT:
HORÁRIO LIGAÇÃO:
PROTOCOLO LIGAÇÃO:`},
  {title:`Autorização de troca de titularidade`, tag:`AUTORIZAÇÃO`, intro:`Modelo de autorização + dados para encaminhar ao suporte interno.`, text:`AUTORIZAÇÃO TROCA DE TITULARIDADE

EU AUTORIZO A TROCA DE TITULARIDADE PARA , NOME:___________________ PORTADOR DO CPF: ________.
EQUIPAMENTO EM COMODATO VAI PARA O NOVO TITULAR.
(sempre verificar boleto em aberto, caso esteja aberto tem q saber quem vai pagar)

AGENDAR PARA SUPORTE INTERNO
TIPO DE SERVIÇO: TROCA DE TITULARIDADE
ANTIGO TITULAR (NOME) COD:
NOVO TITULAR (NOME) COD:
NOVO PLANO+SVA:
HOUVE ATUALIZAÇÃO?
POR ONDE FOI A SOLICITAÇÃO:`},
  {title:`Instalação nova`, tag:`SERVIÇO`, intro:`Modelo para abertura de instalação nova.`, text:`TIPO DE SERVIÇO: INSTALAÇÃO NOVA
CLIENTE TEM REPETIDOR: NÃO
CASA OU AP:
PLANO+SVA:
VENC:
TAXA: SEM TAXA
EQUIPAMENTOS EM COMODATO: EQUIPAMENTO GIGA
AGENDAMENTO:
COD:
POR ONDE FOI SOLICITADO:
FORMALIZAÇÃO:
LOCALIZAÇÃO:
REFERÊNCIA:`},
  {title:`Troca de plano`, tag:`SERVIÇO`, intro:`Modelo para alteração de plano.`, text:`TIPO DE SERVIÇO: TROCA DE PLANO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR: MESMO VALOR
VENCIMENTO: O MESMO
EQUIPAMENTOS EM COMODATO: COMPATÍVEL
COD.
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Reativação`, tag:`SERVIÇO`, intro:`Modelo completo para reativação de sinal.`, text:`TIPO DE SERVIÇO: REATIVAÇÃO DE SINAL
CLIENTE TEM REPETIDOR:
CASA OU AP:
NOVO PLANO+SVA:
VENC:
EQUIPAMENTO:
JÁ FOI DESCONECTADO DA ANTIGA CTO?
AGENDAMENTO: TURNO/
COD:
CTO:
PORTA:
METRAGEM:
CONTATO DO CLIENTE:
LOCALIZAÇÃO:
REFERÊNCIA:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
COMPROVANTE DE ENDEREÇO / FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Mudança de endereço`, tag:`SERVIÇO`, intro:`Modelo completo para mudança de endereço.`, text:`TIPO DE SERVIÇO: MUDANÇA DE ENDEREÇO
CLIENTE TEM REPETIDOR:
CASA OU AP:
ANTIGO ENDEREÇO:
PLANO+SVA:
VENC:
TAXA:
EQUIPAMENTOS EM COMODATO:
AGENDAMENTO: TURNO/
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
COD.
METRAGEM DE FIBRA UTILIZADA:
CTO:
PORTA:
LOCALIZAÇÃO:
REFERÊNCIA:
COMPROVANTE DE ENDEREÇO / FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Troca do equipamento`, tag:`SERVIÇO`, intro:`Modelo para troca de equipamento.`, text:`TIPO DE SERVIÇO: TROCA DO EQUIPAMENTO
PLANO+SVA:
UP/DOW/MESMO VALOR:
HOUVE ATUALIZAÇÃO?
TAXA:
EQUIPAMENTOS EM COMODATOS: ONU + ROTEADOR
COD.:
AGENDAMENTO:
LOCALIZAÇÃO:
REFERÊNCIA:
FOTO ANEXADA: SIM
ACEITE: SIM`},
  {title:`Troca de plano + extensor`, tag:`SERVIÇO`, intro:`Modelo para troca de plano com instalação de extensor.`, text:`TIPO DE SERVIÇO: TROCA DE PLANO/INSTALAR EXTENSOR DE SINAL EM COMODATO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR:
VENCIMENTO:
EQUIPAMENTOS EM COMODATO:
COD.
AGENDAMENTO: TURNO/
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
FOTO ANEXADO: SIM
ACEITE: SIM`},
  {title:`Viabilidade`, tag:`SERVIÇO`, intro:`Modelo para análise de viabilidade.`, text:`VIABILIDADE
TIPO DE SERVIÇO: (MOTIVO)
LOCALIZAÇÃO FIXA:
REFERENCIA DO LOCAL:
FOTO DA CASA:
TELEFONES PARA CONTATO:
AGENDAMENTO: TURNO/
COD:
OBSERVAÇÃO: QUANDO FOR MUDANÇA DE ENDEREÇO COLOCAR O NOVO ENDEREÇO NA O.S`},
  {title:`Instalar repetidor de sinal`, tag:`SERVIÇO`, intro:`Modelo para instalação de repetidor.`, text:`TIPO DE SERVIÇO: INSTALAR REPETIDOR DE SINAL
CASA OU AP:
PLANO+SVA:
TAXA:
EQUIPAMENTOS EM COMODATOS: ONU + ROTEADOR
REPETIDOR DO CLIENTE?
COD.:
CONTATO DO CLIENTE:
AGENDAMENTO: TURNO/
POR ONDE FOI FEITO A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO:
LOCALIZAÇÃO:
REFERÊNCIA:
FOTO ANEXADA: SIM
CLIENTE CIENTE ATÉ 30 METROS:`},
  {title:`Mudar equipamento de lugar`, tag:`SERVIÇO`, intro:`Modelo para mudança de equipamento.`, text:`TIPO DE SERVIÇO: MUDAR EQUIPAMENTO DE LUGAR
PARA ONDE MUDAR:
PLANO+SVA:
TAXA:
EQUIPAMENTOS EM COMODATOS:
COD.:
AGENDAMENTO: TURNO/
METRAGEM DE FIBRA UTILIZADA:
CTO:
PORTA:
LOCALIZAÇÃO:
REFERÊNCIA:
FOTO ANEXADA:`},
  {title:`Troca de cabeamento rádio → fibra`, tag:`SERVIÇO`, intro:`Modelo para migração da tecnologia rádio para fibra.`, text:`TIPO DE SERVIÇO: TROCA DE CABEAMENTO DE RADIO PARA FIBRA
PLANO+SVA:
VENCIMENTO:
TAXA:
RECOLHER OS EQUIPAMENTOS A ANTIGA TECNOLOGIA:
EQUIPAMENTOS EM COMODATO REFERENTE A NOVA TECNOLOGIA: ONU + ROTEADOR
POSSUI REPETIDOR:
FORMALIZAÇÃO:
AGENDAMENTO:
COD:
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO:
LOCALIZAÇÃO:
ANEXADO FOTO COM DOCUMENTO: SIM`},
  {title:`Promoção`, tag:`COMERCIAL`, intro:`Mensagem pronta para apresentar a promoção informada.`, text:`promoção é assim

✅ 1GIGA+UBOOK+NBA+UNIVERSO TV+DEEZER+WATCH BASIC+DOCTOR UNI (TELEMEDICINA)

✅ A senhora pode escolher o Disney Plus ou HBO MAX, um dos dois para usar durante 6 meses como bonificação.

❎ R$99,99 por mês`},
  {title:`Confirmação da contratação`, tag:`COMERCIAL`, intro:`Solicitação de documentos para finalizar a ativação.`, text:`Confirma a contratação do plano

📌 Para finalizarmos, solicitamos:

Uma foto sua segurando o documento ao lado do rosto;
Uma foto só do documento (frente e verso).

Assim que recebermos, concluímos sua ativação`},
  {title:`Análise HE2 e CEMIG`, tag:`APOIO`, intro:`Documentos necessários para a análise.`, text:`ANALISE HE2 E CEMIG
Documentos necessários do titular da conta da Cemig
• Documento com foto e CPF (RG/CNH) frente e verso;
• Login e senha do app CEMIG Atende;
• Última conta da CEMIG;
• Cartão CNPJ (no caso de pessoa jurídica);
• E-mail.
Para fazermos a analise caso seja aprovado vai chegar uma e-mail para o senhor (a)`},
  {title:`Criar SVA`, tag:`APOIO`, intro:`Modelo para solicitar criação/liberação de SVA.`, text:`CRIAR SVA
COD:
NOME:
E-MAIL:
TELEFONE:
PRODUTOS:`},
  {title:`Cancelamento`, tag:`APOIO`, intro:`Orientação para solicitar cancelamento por telefone.`, text:`CANCELAMENTO
Para cancelamentos o senhor precisa ligar pelo 0800 009 0004 na opção 09 de segunda a sexta-feira entre 08:00 ás 17 horas.`}
];
const templates = {
  guias: `<div class="view-head"><p class="eyebrow">APOIO · PASSO A PASSO</p><h2>Ajude o cliente a acessar.</h2><p>Escolha o aplicativo e acompanhe o cliente em cada tela. Antes de começar, confirme o plano, o telefone e o e-mail cadastrados.</p></div><div class="guide-grid"><article class="guide-card"><div class="guide-title"><span class="guide-number">01</span><div><h3>Globoplay</h3><small>Ativação pelo e-mail</small></div></div><ol><li>Abra o e-mail “Ative agora o Globoplay que você contratou!” e clique em <b>Ativar</b>.</li><li>Na Conta Globo, clique em <b>Ir para Conta Globo</b>.</li><li>Entre com sua conta ou escolha <b>Criar Conta Globo grátis</b>.</li><li>Para uma conta nova, informe nome, e-mail, data de nascimento, CPF, gênero, localização e crie uma senha de 8 a 15 caracteres.</li><li>Abra o e-mail “Clique para ativar sua conta” e clique em <b>Confirmar e-mail</b>.</li><li>Clique em <b>Continuar</b>, entre com e-mail e senha e acesse o Globoplay.</li></ol></article><article class="guide-card"><div class="guide-title"><span class="guide-number">02</span><div><h3>Amazon Prime</h3><small>Ativação pelo app SKY+</small></div></div><ol><li>Baixe o app <b>SKY+</b> e selecione <b>Entrar na minha conta</b>.</li><li>Escolha <b>Operadoras</b> e busque <b>Outros Parceiros</b>.</li><li>Preencha os dados usados na contratação e clique em <b>Autorizar</b>.</li><li>Abra o perfil, entre em <b>Meus Produtos</b>, encontre <b>Amazon Prime</b> e clique em <b>Ativar</b>.</li><li>Escolha <b>Criar Conta</b>, use o mesmo e-mail da SKY+ e confirme o código recebido.</li><li>Crie uma chave de acesso ou escolha <b>Ignorar</b>. Depois, use a conta Amazon nos apps Prime Video, Prime Gaming, Amazon Music e Kindle.</li></ol></article><article class="guide-card"><div class="guide-title"><span class="guide-number">03</span><div><h3>Deezer</h3><small>Ativação por telefone</small></div></div><ol><li>Acesse <a href="https://www.ativardeezer.com.br" target="_blank" rel="noreferrer">ativardeezer.com.br</a>.</li><li>Informe o telefone cadastrado e escolha receber o código por <b>SMS ou WhatsApp</b>.</li><li>Digite o código recebido e clique em <b>Resgatar Código</b>.</li><li>Abra o SMS com o link de ativação e clique nele.</li><li>Se já tiver cadastro, clique em <b>Login</b>. Caso contrário, clique em <b>Cadastre-se</b> e preencha os dados.</li><li>Finalize em <b>Ouvir agora</b> para acessar músicas e podcasts.</li></ol></article><article class="guide-card"><div class="guide-title"><span class="guide-number">04</span><div><h3>Disney+</h3><small>Ativação por SMS</small></div></div><ol><li>No Portal do Assinante, escolha o Disney+ e aguarde o SMS de ativação.</li><li>Abra o link <a href="https://ativefacil.com.br" target="_blank" rel="noreferrer">ativefacil.com.br</a> recebido por SMS.</li><li>Informe o telefone cadastrado e digite o código de segurança.</li><li>Clique em <b>Ativar</b> para ser redirecionado ao Disney+.</li><li>Digite o e-mail e clique em <b>Continuar</b>. Se já possuir conta, informe a senha; se não, crie uma.</li><li>Leia e aceite o contrato, configure o perfil e aproveite o conteúdo.</li></ol></article><article class="guide-card"><div class="guide-title"><span class="guide-number">05</span><div><h3>HBO Max</h3><small>Celular e televisão</small></div></div><ol><li>Abra o app HBO Max, clique em <b>Entrar</b> e escolha <b>Crie uma conta HBO Max</b>.</li><li>Em “Pesquise seu provedor”, procure e selecione <b>PlayHub</b>.</li><li>Informe o login e a senha fornecidos na contratação e clique em <b>Autorizar</b>.</li><li>Se já tiver conta, entre com e-mail e senha. Se não, preencha os dados e clique em <b>Criar Conta</b>.</li><li>Na TV, escolha <b>Conecte-se com seu provedor</b>. Escaneie o QR Code ou acesse <a href="https://hbomax.com/providers" target="_blank" rel="noreferrer">hbomax.com/providers</a> e informe o código da TV.</li><li>No celular, escolha PlayHub, autorize e finalize. Na TV, o login será automático.</li></ol></article></div><div class="guide-note"><b>Durante o atendimento:</b> nunca peça ou registre senha do cliente na colinha. Oriente o cliente a usar o e-mail e o telefone cadastrados e registre somente a orientação realizada.</div>`,
  regras: `<div class="view-head"><p class="eyebrow">CONTROLE · OBRIGATÓRIO</p><h2>SVA, regras e decisões.</h2><p>Use esta tela como conferência antes de liberar aplicativos, atualizar plano, cancelar ou encaminhar qualquer processo.</p></div><div class="view-grid"><article class="info-card"><p class="eyebrow">LIBERAR SVA</p><h3>Modelo de solicitação</h3><p>Preencha todos os dados e confirme que a solicitação veio do titular.</p><div class="copy-box"><p>COD:<br>NOME:<br>E-MAIL:<br>TELEFONE:<br>PRODUTOS:<br>CPF:</p><button class="copy-btn" data-copy="COD:\nNOME:\nE-MAIL:\nTELEFONE:\nPRODUTOS:\nCPF:">COPIAR MODELO</button></div></article><article class="info-card dark-card"><p class="eyebrow">ANTES DE LIBERAR</p><h3>Checklist SVA</h3><ul><li>Confirmar código e titularidade.</li><li>Conferir e-mail e telefone para acesso.</li><li>Registrar exatamente quais produtos serão liberados.</li><li>Deixar a formalização anexada ao atendimento ou venda.</li></ul></article></div><div class="rule-grid"><article class="rule-card"><span>01</span><h3>Reclamação na frente de loja</h3><p>Ligue para o cliente na hora e faça o teste. Confirme se o número funciona ou não antes de encaminhar.</p></article><article class="rule-card"><span>02</span><h3>Atualização no mesmo valor</h3><p>Pode ser feita com somente <b>1 boleto em aberto</b>. Upgrade ou downgrade não devem seguir com boleto em aberto.</p></article><article class="rule-card"><span>03</span><h3>Financeiro depois do ganho</h3><p>Em upgrade, downgrade e troca de titularidade, ligue para o financeiro depois de dar o ganho para cancelar os boletos. Nunca conclua com boleto em aberto.</p></article><article class="rule-card"><span>04</span><h3>Cliente de indicação</h3><p>Encaminhe no grupo <b>Demandas Financeira</b>.</p></article><article class="rule-card"><span>05</span><h3>Troca de titularidade</h3><p>Confirme se o novo titular assume o boleto recente. Se o proporcional ficar para o titular antigo, ele precisa pagar para concluir o processo. Abra atendimento para autorização e conclusão, com formalização que identifique o titular autorizando.</p></article><article class="rule-card"><span>06</span><h3>Formalização sempre</h3><p>Atualização, venda ou qualquer outra situação deve ter formalização para confirmar que é o titular quem solicita.</p></article><article class="rule-card"><span>07</span><h3>Câmeras</h3><p>O local precisa ter tomada ao lado, a 30 cm. Não usar extensão. Explique qualidade, cartão de memória e armazenamento em nuvem.</p></article><article class="rule-card"><span>08</span><h3>Repetidor de sinal</h3><p>Entenda a casa antes de ofertar: pergunte se tem 2 andares, área gourmet e como é a necessidade de cobertura.</p></article><article class="rule-card"><span>09</span><h3>Reverter cancelamento</h3><p>Pergunte o motivo, tente troca de titularidade quando fizer sentido e trate reclamações buscando reverter. O objetivo é deixar o cliente satisfeito.</p></article><article class="rule-card"><span>10</span><h3>Cancelamento e equipamento</h3><p>Não receba equipamento com ponto ativo. Se o cliente ameaçar ligar, deixe o atendimento aberto para o financeiro realizar o contato.</p></article><article class="rule-card"><span>11</span><h3>Promoção no contrato</h3><p>Na contratação, registre na colinha o plano promocional, quantas mensalidades promocionais ele tem direito e qual será o valor.</p></article></div><article class="calculator-card"><div><p class="eyebrow">DOWNGRADE · FIDELIDADE</p><h3>Calcule a multa proporcional</h3><p>Use a redução entre o plano atual e o novo plano sobre a multa de rescisão informada pelo sistema.</p></div><div class="calculator-fields"><label>Plano atual <input id="currentPlanValue" type="number" min="0" step="0.01" placeholder="99,99"></label><label>Novo plano <input id="newPlanValue" type="number" min="0" step="0.01" placeholder="69,99"></label><label>Multa total <input id="totalPenaltyValue" type="number" min="0" step="0.01" placeholder="1080,00"></label><div class="calculator-result"><small>Multa proporcional</small><strong id="penaltyResult">R$ 0,00</strong><span id="penaltyBreakdown">Preencha os três valores</span></div></div></article>`,
  composicao: `<div class="view-head"><p class="eyebrow">CONSULTA · CONTRATO</p><h2>Composição completa.</h2><p>Use esta tela antes de editar o contrato. Cada card traz a composição comercial informada, o valor de cada item e o total registrado na tabela.</p></div><div class="notice"><b>Atenção:</b> os totais abaixo foram mantidos exatamente como enviados. Quando a soma dos itens não coincidir com o total comercial, confirme a regra vigente antes de alterar o contrato.</div><div class="plan-filter"><button class="filter-pill active" data-plan-filter="Todos">Todos</button><button class="filter-pill" data-plan-filter="Planos comerciais">Comerciais</button><button class="filter-pill" data-plan-filter="Planos novos">Novos</button><button class="filter-pill" data-plan-filter="Repetidor / Wi-Fi">Wi-Fi</button><button class="filter-pill" data-plan-filter="Telefone fixo">Telefone</button></div><div class="plan-detail-grid">${commercialPlans.map(renderPlanTile).join('')}</div><div class="price-columns"><div><p class="eyebrow">EQUIPAMENTOS</p><h3>Valores de produtos</h3>${renderPriceTable(equipmentPrices)}</div><div><p class="eyebrow">SERVIÇOS E TAXAS</p><h3>Valores para informar</h3>${renderPriceTable(servicePrices)}</div></div>`,
  atendimentos: `<div class="view-head"><p class="eyebrow">PASSO 01 · REGISTRO</p><h2>Abra do jeito certo.</h2><p>Todo atendimento precisa deixar uma história clara para quem continuar o caso. Comece identificando o pedido, confira os documentos e registre o contato.</p></div><div class="rule-banner">Antes de salvar: confira o código do cliente, telefone, melhor turno e se existem boletos em aberto.</div><div class="view-grid">${card('Modelo base', '<p>Copie este cabeçalho para começar qualquer registro:</p><div class="copy-box"><p>ATENDIMENTO:<br>RELATO DO CLIENTE:<br>TELEFONE DE CONTATO:<br>SOLICITANTE:<br>MELHOR TURNO PARA LIGAÇÕES:<br>POR ONDE FOI A SOLICITAÇÃO:</p><button class="copy-btn" data-copy="ATENDIMENTO:\nRELATO DO CLIENTE:\nTELEFONE DE CONTATO:\nSOLICITANTE:\nMELHOR TURNO PARA LIGAÇÕES:\nPOR ONDE FOI A SOLICITAÇÃO:">COPIAR</button></div>')}${card('Quando abrir atendimento', '<ul><li>Mudança de endereço</li><li>Troca de titularidade</li><li>Troca de equipamento de lugar</li><li>Segunda via de fatura, quando precisar de apoio</li><li>Solicitação de cabo de rede</li><li>Instalação, viabilidade, repetidor e troca de tecnologia</li></ul>')}${card('O que não precisa abrir', '<ul><li>Troca de plano normal, quando o processo é concluído no mesmo contato</li><li>Reativação, conforme o fluxo interno disponível</li><li>Orientações simples que não geram serviço ou agenda</li></ul><p class="notice">Na dúvida, registre o contato e confirme com a liderança antes de encaminhar.</p>')}</div>`,
  processos: `<div class="view-head"><p class="eyebrow">PASSO 02 · SERVIÇOS</p><h2>Processos sem complicação.</h2><p>Escolha o serviço, confira rapidamente o que precisa ser preenchido e clique em <b>COPIAR MODELO</b>. O modelo vai para a área de transferência já com as quebras de linha.</p></div><div class="model-tip"><span>✓</span><div><b>Como usar</b><small>Abra o atendimento quando necessário, confira os dados e depois copie o modelo completo. Não precisa selecionar o texto manualmente.</small></div></div><div class="model-grid">${processModels.map(m => copyCard(m.title,m.tag,m.intro,m.text)).join('')}</div>`,
  atualizacoes: `<div class="view-head"><p class="eyebrow">PASSO 03 · OFERTA</p><h2>Atualização sem tropeço.</h2><p>Use a comparação do plano, confirme a regra de boleto e só então avance para documentos e contrato.</p></div><div class="notice"><b>Regra importante:</b> não realizar upgrade ou downgrade com boleto em aberto. A exceção é a atualização para o mesmo valor, com apenas 1 boleto em aberto.</div><div class="view-grid">${card('Checklist rápido', '<ul><li>Conferir plano atual, valor e SVA</li><li>Verificar boletos em aberto</li><li>Explicar benefícios sem prometer o que não está na composição</li><li>Solicitar foto segurando documento + documento frente e verso</li><li>Enviar contrato para assinatura</li><li>Finalizar somente após confirmação</li></ul>')}${card('Após o aceite', '<p>Confirmação de contratação:</p><div class="copy-box"><p>Para finalizarmos, solicitamos:<br><br>• Uma foto sua segurando o documento ao lado do rosto;<br>• Uma foto só do documento (frente e verso).<br><br>Assim que recebermos, concluímos sua ativação.</p><button class="copy-btn" data-copy="Para finalizarmos, solicitamos:\n\nUma foto sua segurando o documento ao lado do rosto;\nUma foto só do documento (frente e verso).\n\nAssim que recebermos, concluímos sua ativação.">COPIAR</button></div>')}${card('Universo Play', '<p>O aplicativo oferece novelas, jornais, esportes, filmes, séries, desenhos e muito mais. Pode ser instalado em Smart TVs, celulares, tablets, notebooks e computadores. Após a atualização, o acesso será gerado e enviado.</p>')}</div><h3 class="eyebrow" style="margin-top:42px">TABELA DE OFERTAS</h3><table class="price-table"><thead><tr><th>Valor</th><th>Plano atual</th><th>Plano atualizado</th></tr></thead><tbody>${[['R$ 69,99','500MB + UBOOK','500MB + UBOOK + UNIVERSO PLAY + TV PLUS'],['R$ 74,99','500MB + UBOOK','1 GIGA + UBOOK + UNIVERSO PLAY TV PLUS'],['R$ 79,99','500MB + UBOOK','600MB + UBOOK + UNIVERSO PLAY TV PLUS'],['R$ 89,99','500MB + UBOOK + DEEZER','800MB + UBOOK + DEEZER + UNIVERSO PLAY TV PLUS'],['R$ 99,99','700MB + DEEZER + UBOOK','1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV PLUS'],['R$ 109,99','600MB + UBOOK + DEEZER','1 GIGA + UBOOK + DEEZER + UNIVERSO PLAY TV TOP + GLOBO PLAY'],['R$ 119,99','1 GIGA + UBOOK + DEEZER + MAX','1 GIGA + UBOOK + DEEZER + MAX + UNIVERSO PLAY TV TOP'],['R$ 129,99','1 GIGA + UBOOK + MAX + DEEZER + TV PRIME','1 GIGA + UBOOK + DEEZER + MAX + DISNEY PLUS + UNIVERSO PLAY TV TOP'],['R$ 149,99','850MB + UBOOK + HBO','1 GIGA + UBOOK + DEEZER + MAX + UNIVERSO PLAY TV TOP']].map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('')}</tbody></table>`,
  colinhas: `<div class="view-head"><p class="eyebrow">MODELOS · COLINHAS</p><h2>Copie e cole.</h2><p>Os modelos abaixo já estão formatados para o atendimento. Clique uma vez em <b>COPIAR MODELO</b> e cole direto no Voalle ou no chat.</p></div><div class="model-tip"><span>⚡</span><div><b>Pronto para usar</b><small>O texto é copiado com as quebras de linha. Basta preencher os campos vazios depois de colar.</small></div></div><div class="model-grid">${colinhaModels.map(m => copyCard(m.title,m.tag,m.intro,m.text)).join('')}</div>`,
  composicao: `<div class="view-head"><p class="eyebrow">CONSULTA · CONTRATO</p><h2>Composição dos planos.</h2><p>Consulte o que entra em cada oferta antes de editar o contrato. Os valores de equipamento serão preenchidos a partir da planilha comercial assim que ela estiver disponível no projeto.</p></div><div class="notice"><b>Como usar:</b> confirme o valor mensal, marque cada SVA incluído e só depois confira equipamentos, comodato e taxas no contrato.</div><div class="plan-filter"><button class="filter-pill active">Todos</button><button class="filter-pill">R$ 69,99</button><button class="filter-pill">R$ 89,99</button><button class="filter-pill">R$ 99,99</button><button class="filter-pill">R$ 109,99+</button></div><div class="plan-grid">${[['R$ 69,99','500MB','UBOOK · UNIVERSO PLAY · TV PLUS'],['R$ 74,99','1 GIGA','UBOOK · UNIVERSO PLAY · TV PLUS'],['R$ 79,99','600MB','UBOOK · UNIVERSO PLAY · TV PLUS'],['R$ 89,99','800MB','UBOOK · DEEZER · UNIVERSO PLAY · TV PLUS'],['R$ 99,99','1 GIGA','UBOOK · DEEZER · UNIVERSO PLAY · TV PLUS'],['R$ 109,99','1 GIGA','UBOOK · DEEZER · UNIVERSO PLAY · TV TOP · GLOBO PLAY'],['R$ 119,99','1 GIGA','UBOOK · DEEZER · MAX · UNIVERSO PLAY · TV TOP'],['R$ 129,99','1 GIGA','UBOOK · DEEZER · MAX · DISNEY PLUS · UNIVERSO PLAY · TV TOP']].map(plan => `<article class="plan-tile"><div class="plan-price">${plan[0]}</div><h3>${plan[1]}</h3><p>${plan[2]}</p><div class="plan-meta"><span>SVA inclusos</span><b>Ver composição →</b></div></article>`).join('')}</div><div class="equipment-box"><div><p class="eyebrow">EQUIPAMENTOS E TAXAS</p><h3>Valores da planilha comercial</h3><p>Área reservada para os equipamentos, comodato, instalação e taxas da planilha <b>PLANOS COMERCIAL 08_26.xlsx</b>. Salve o arquivo na pasta do portal para completar esta tabela com os valores oficiais.</p></div><span class="sheet-icon">▦</span></div>`,
  apps: `<div class="view-head"><p class="eyebrow">APOIO · ACESSOS</p><h2>Aplicativos úteis.</h2><p>Links para orientar o cliente. Nunca exponha credenciais de outros clientes e confirme o usuário antes de compartilhar.</p></div><div class="app-list">${[['Universo Play','Android: https://play.google.com/store/apps/details?id=br.com.universoplay','iOS: https://apps.apple.com/br/app/universo-play/id6448992750','Usuário: ______  Senha: ______'],['Universo Internet SAC','Android: https://play.google.com/store/apps/details?id=br.com.portal.universo','iOS: https://apps.apple.com/br/app/universo-tecnologia-sac/id1499565255','Clicar em “Realizar login”. Usuário e senha: conferir cadastro do cliente.'],['Ubook','Android: https://play.google.com/store/apps/details?id=br.com.ubook.ubookapp','iOS: https://apps.apple.com/br/app/ubook-audiobooks-e-podcasts/id796476765','Usuário e senha: conferir cadastro do cliente.']].map(app => `<article class="app-card"><h3>${app[0]}</h3><a href="${app[1].replace('Android: ','')}" target="_blank" rel="noreferrer">${app[1]}</a><a href="${app[2].replace('iOS: ','')}" target="_blank" rel="noreferrer">${app[2]}</a><p>${app[3]}</p></article>`).join('')}</div>`,
  videos: `<div class="view-head"><p class="eyebrow">APOIO · TREINAMENTO</p><h2>Aprenda vendo.</h2><p>Esta área já está pronta para receber seus vídeos. Quando você enviar os arquivos, eles podem ser colocados aqui junto com o passo a passo correspondente.</p></div><div class="view-grid"><article class="video-placeholder"><div><div class="play">▶</div><h3>Vídeo 01 · Conhecendo o CRM Voalle</h3><p>Arquivo de vídeo aguardando envio</p></div></article><article class="video-placeholder"><div><div class="play">▶</div><h3>Vídeo 02 · Abertura de atendimento</h3><p>Arquivo de vídeo aguardando envio</p></div></article><article class="video-placeholder"><div><div class="play">▶</div><h3>Vídeo 03 · Mudança de endereço</h3><p>Arquivo de vídeo aguardando envio</p></div></article><article class="video-placeholder"><div><div class="play">▶</div><h3>Vídeo 04 · Troca de titularidade</h3><p>Arquivo de vídeo aguardando envio</p></div></article></div>`
};

function showView(view) {
  homeSections.forEach(section => { section.hidden = view !== 'inicio'; section.classList.toggle('is-hidden', view !== 'inicio'); });
  views.forEach(section => { section.hidden = true; section.classList.add('is-hidden'); });
  if (view !== 'inicio') { const target = document.getElementById(`view-${view}`); target.innerHTML = view === 'composicao' ? detailedComposition() : templates[view] || ''; if (view === 'regras') { const svaCard = target.querySelector('.info-card'); svaCard.querySelector('h3').textContent = 'Modelo de solicitação SVA'; svaCard.querySelector('p:not(.eyebrow)').innerHTML = 'Use este modelo para registrar <b>quais aplicativos o cliente quer</b> liberar. Preencha todos os dados e confirme que a solicitação veio do titular.'; svaCard.querySelector('.copy-box p').innerHTML = 'COD:<br>NOME:<br>E-MAIL:<br>TELEFONE:<br>PRODUTOS (APLICATIVOS QUE O CLIENTE QUER):<br>CPF:'; const svaCopy = svaCard.querySelector('.copy-btn'); svaCopy.textContent = 'COPIAR MODELO SVA'; svaCopy.dataset.copy = 'SOLICITAÇÃO SVA - APLICATIVOS QUE O CLIENTE QUER\nCOD:\nNOME:\nE-MAIL:\nTELEFONE:\nPRODUTOS:\nCPF:'; } if (view === 'atendimentos') { const baseCard = target.querySelector('.info-card'); const baseText = baseCard.querySelector('.copy-box p'); baseText.innerHTML = 'ATENDIMENTO:<br>RELATO DO CLIENTE:<br>TELEFONE DE CONTATO:<br>SOLICITANTE:<br>MELHOR TURNO PARA LIGAÇÕES:<br>RECLAMAÇÕES FRENTE DE LOJA OU POR TELEFONE:<br>POR ONDE FOI A SOLICITAÇÃO:'; baseCard.querySelector('.copy-btn').dataset.copy = 'ATENDIMENTO:\nRELATO DO CLIENTE:\nTELEFONE DE CONTATO:\nSOLICITANTE:\nMELHOR TURNO PARA LIGAÇÕES:\nRECLAMAÇÕES FRENTE DE LOJA OU POR TELEFONE:\nPOR ONDE FOI A SOLICITAÇÃO:'; } target.hidden = false; target.classList.remove('is-hidden'); }
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === view && item.classList.contains('nav-item')));
  breadcrumbCurrent.textContent = viewNames[view];
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const originalShowView = showView;
showView = (view) => {
  originalShowView(view);
  if (view !== 'regras') return;
  const target = document.getElementById('view-regras');
  const dailyRoutine = `<section class="daily-routine"><div><p class="eyebrow">ROTINA DIÁRIA · BÁSICO DO BÁSICO</p><h3>Antes de encerrar o dia</h3><p>Use esta lista em todos os atendimentos e contatos realizados.</p></div><div class="daily-checks"><label><input type="checkbox"> Fazer pelo menos 3 tentativas de ligação para o cliente</label><label><input type="checkbox"> Abrir atendimento para todo cliente contatado</label><small>Exceção: nova contratação, quando ainda não existe cadastro na base.</small><label><input type="checkbox"> Preencher e manter o relatório atualizado</label><label><input type="checkbox"> Conferir se existe algum atendimento em aberto</label><label><input type="checkbox"> Fechar os atendimentos que já foram concluídos</label></div></section>`;
  const calculator = target.querySelector('.calculator-card');
  if (calculator && !target.querySelector('.daily-routine')) calculator.insertAdjacentHTML('beforebegin', dailyRoutine);
};

const showViewWithBillingRule = showView;
showView = (view) => {
  showViewWithBillingRule(view);
  if (view !== 'atendimentos') return;
  const target = document.getElementById('view-atendimentos');
  const secondCopyCard = target.querySelectorAll('.info-card')[1];
  if (secondCopyCard) secondCopyCard.querySelector('li:nth-child(4)').textContent = 'Segunda via de fatura: sempre abrir atendimento para conseguir retirar o boleto';
};

const showViewWithReactivationRule = showView;
showView = (view) => {
  showViewWithReactivationRule(view);
  if (view !== 'processos') return;
  const reactivationCard = document.querySelectorAll('#view-processos .process-card')[4];
  if (!reactivationCard) return;
  reactivationCard.querySelector('.tag').textContent = 'INTERNA OU EXTERNA';
  reactivationCard.querySelector('p').textContent = 'A situação da CTO define o encaminhamento e o tipo de agendamento.';
  reactivationCard.querySelector('li:nth-child(1)').textContent = 'Se NÃO foi desativado da CTO: reativação interna, agendar para o suporte interno';
  reactivationCard.querySelector('li:nth-child(4)').textContent = 'Se JÁ foi desativado da CTO: reativação externa, agendar para técnico';
};

const showViewWithVideos = showView;
showView = (view) => {
  showViewWithVideos(view);
  if (view !== 'videos') return;
  const target = document.getElementById('view-videos');
  target.innerHTML = `<div class="view-head"><p class="eyebrow">APOIO · TREINAMENTO</p><h2>Aprenda vendo.</h2><p>Assista ao vídeo e confira a colinha logo abaixo. Os arquivos ficam disponíveis localmente nesta pasta do portal.</p></div><div class="video-training-grid"><article class="training-video"><video controls preload="metadata"><source src="Abrir%20atendimento.mp4" type="video/mp4">Seu navegador não consegue reproduzir este vídeo.</video><div class="training-video-copy"><span class="tag red">ROTINA</span><h3>Abrir atendimento</h3><p>Confira o fluxo para registrar o pedido do cliente e deixar o atendimento pronto para continuidade.</p><ol><li>Identifique o motivo do contato.</li><li>Preencha relato, telefone, solicitante e melhor turno.</li><li>Registre reclamação de frente de loja ou telefone quando existir.</li><li>Revise os dados antes de salvar.</li></ol></div></article><article class="training-video"><video controls preload="metadata"><source src="Processo%20de%20venda.mp4" type="video/mp4">Seu navegador não consegue reproduzir este vídeo.</video><div class="training-video-copy"><span class="tag red">COMERCIAL</span><h3>Processo de venda</h3><p>Acompanhe o passo a passo da venda e use a composição do plano para preencher a contratação.</p><ol><li>Confirme o plano, valor e benefícios.</li><li>Faça a formalização obrigatória do titular.</li><li>Registre a promoção e a quantidade de mensalidades.</li><li>Solicite os documentos e finalize o contrato.</li></ol></div></article><article class="training-video"><video controls preload="metadata"><source src="Segunda%20venda%20segundo%20ponto.mp4" type="video/mp4">Seu navegador não consegue reproduzir este vídeo.</video><div class="training-video-copy"><span class="tag red">VENDA</span><h3>Segunda venda · segundo ponto</h3><p>Use o vídeo junto com a conferência de endereço, equipamento, taxa e agendamento.</p><ol><li>Entenda onde será instalado o segundo ponto.</li><li>Confira plano, SVA, equipamento e taxa.</li><li>Registre contato, localização e referência.</li><li>Formalize o aceite e encaminhe o agendamento.</li></ol></div></article></div>`;
};

document.addEventListener('click', (event) => {
  const nav = event.target.closest('[data-view]');
  if (nav) showView(nav.dataset.view);
  const copyButton = event.target.closest('[data-copy-id], [data-copy]');
  if (copyButton) copy(copyButton.dataset.copyId ? copyTexts[copyButton.dataset.copyId] : copyButton.dataset.copy);
  const filterButton = event.target.closest('[data-plan-filter]');
  if (filterButton) {
    document.querySelectorAll('[data-plan-filter]').forEach(button => button.classList.toggle('active', button === filterButton));
    document.querySelectorAll('.plan-detail').forEach(plan => { plan.hidden = filterButton.dataset.planFilter !== 'Todos' && !plan.querySelector('.tag').textContent.includes(filterButton.dataset.planFilter); });
  }
});
document.getElementById('openMenu').addEventListener('click', () => sidebar.classList.add('open'));
document.getElementById('closeMenu').addEventListener('click', () => sidebar.classList.remove('open'));

document.addEventListener('input', (event) => {
  if (!event.target.matches(
    '#currentPlanValue, #newPlanValue, #totalPenaltyValue'
  )) {
    return;
  }

  function parseMoney(value) {
    const text = String(value || '')
      .replace(/R\$\s?/gi, '')
      .trim();

    if (!text) {
      return 0;
    }

    if (text.includes(',')) {
      return Number(
        text.replace(/\./g, '').replace(',', '.')
      ) || 0;
    }

    return Number(text) || 0;
  }

  const planoAtual = parseMoney(
    document.getElementById('currentPlanValue').value
  );

  const novoPlano = parseMoney(
    document.getElementById('newPlanValue').value
  );

  const multaTotal = parseMoney(
    document.getElementById('totalPenaltyValue').value
  );

  const diferenca = planoAtual - novoPlano;
  const percentualReducao =
    planoAtual > 0 ? diferenca / planoAtual : 0;

  const multaProporcional =
    multaTotal * percentualReducao;

  document.getElementById('penaltyResult').textContent =
    multaProporcional.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  document.getElementById('penaltyBreakdown').textContent =
    percentualReducao > 0 && multaTotal > 0
      ? `Redução de ${(percentualReducao * 100)
          .toFixed(2)
          .replace('.', ',')}% aplicada sobre a multa total`
      : 'Informe plano atual, novo plano e multa total';
});

document.getElementById('searchInput').addEventListener('keydown', (event) => {
  if (event.key !== 'Enter') {
    return;
  }

  const query = event.target.value.toLowerCase();

  const target =
    query.includes('multa') || query.includes('regra')
      ? 'regras'
      : query.includes('plano') || query.includes('atualiza')
      ? 'atualizacoes'
      : query.includes('vídeo')
      ? 'videos'
      : 'atendimentos';

  showView(target);
});

document.addEventListener('keydown', (event) => {
  if (
    (event.metaKey || event.ctrlKey) &&
    event.key.toLowerCase() === 'k'
  ) {
    event.preventDefault();
    document.getElementById('searchInput').focus();
  }
});
