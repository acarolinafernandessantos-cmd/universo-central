from pathlib import Path
import re
p=Path('/mnt/data/site_work/current/app.js')
s=p.read_text(encoding='utf-8')

# Replace copy infrastructure
s=s.replace("const copy = (text) => {\n  navigator.clipboard?.writeText(text).then(() => showToast('Colinha copiada para a área de transferência.'));\n};",
"const copyTexts = {};\nlet copyId = 0;\nconst copy = (text) => {\n  const done = () => showToast('Modelo copiado. Agora é só colar no atendimento.');\n  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));\n  else fallbackCopy(text, done);\n};\nconst fallbackCopy = (text, done) => {\n  const area = document.createElement('textarea'); area.value = text; area.style.position = 'fixed'; area.style.opacity = '0';\n  document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); done();\n};\nconst esc = (text) => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');\nconst copyCard = (title, tag, intro, text) => {\n  const id = `copy-${++copyId}`; copyTexts[id] = text;\n  return `<article class=\"copy-card process-card\"><div class=\"copy-card-top\"><span class=\"tag red\">${tag}</span><button class=\"copy-btn copy-model-btn\" data-copy-id=\"${id}\">COPIAR MODELO</button></div><h3>${title}</h3><p class=\"copy-intro\">${intro}</p><div class=\"model-box\"><pre>${esc(text)}</pre></div></article>`;\n};")

# Replace old processCard helper with harmless alias if other sections use it (none should, but preserve compatibility)
s=s.replace("const processCard = (title, tag, intro, fields, text = '') => `<article class=\"process-card\"><span class=\"tag ${tag.includes('ABRE') ? 'red' : ''}\">${tag}</span><h3>${title}</h3><p>${intro}</p><ul>${fields.map(field => `<li>${field}</li>`).join('')}</ul>${text ? `<div class=\"copy-box\"><p>${text}</p><button class=\"copy-btn\" data-copy=\"${text.replaceAll('\\\"', '&quot;')}\">COPIAR</button></div>` : ''}</article>`;", "")

process_texts = [
("Mudança de endereço","ABRE ATENDIMENTO","Modelo completo para registrar a mudança e deixar todos os dados da O.S. preenchidos.","""TIPO DE SERVIÇO: MUDANÇA DE ENDEREÇO
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
ACEITE: SIM"""),
("Troca de titularidade","ABRE ATENDIMENTO","Sempre conferir boleto em aberto e definir quem será responsável antes de agendar.","""AUTORIZAÇÃO TROCA DE TITULARIDADE

EU AUTORIZO A TROCA DE TITULARIDADE PARA , NOME:___________________ PORTADOR DO CPF: ________.
EQUIPAMENTO EM COMODATO VAI PARA O NOVO TITULAR.

(sempre verificar boleto em aberto, caso esteja aberto tem q saber quem vai pagar)
AGENDAR PARA SUPORTE INTERNO
TIPO DE SERVIÇO: TROCA DE TITULARIDADE
ANTIGO TITULAR (NOME) COD:
NOVO TITULAR (NOME) COD:
NOVO PLANO+SVA:
HOUVE ATUALIZAÇÃO?
POR ONDE FOI A SOLICITAÇÃO:"""),
("Equipamento de lugar","ABRE ATENDIMENTO","Registre o novo local, metragem, CTO e porta antes do agendamento.","""TIPO DE SERVIÇO: MUDAR EQUIPAMENTO DE LUGAR
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
FOTO ANEXADA:"""),
("Cabo de rede","ABRE ATENDIMENTO","Informe os valores antes de confirmar e registre metragem e conectores.","""O cabo de rede custa R$ 5,00 por metro e cada conector custa R$ 2,50. Posso confirmar a solicitação?"""),
("Reativação","ABRE ATENDIMENTO","Confira se a antiga CTO já foi desativada e use o encaminhamento correto.","""TIPO DE SERVIÇO: REATIVAÇÃO DE SINAL
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
ACEITE: SIM"""),
("Instalação nova","ABRE ATENDIMENTO","Use este modelo para uma nova instalação e não esqueça localização e referência.","""TIPO DE SERVIÇO: INSTALAÇÃO NOVA
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
REFERÊNCIA:"""),
("Troca de plano","ABRE ATENDIMENTO","Preencha o novo plano, movimento de valor e formalização.","""TIPO DE SERVIÇO: TROCA DE PLANO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR: MESMO VALOR
VENCIMENTO: O MESMO
EQUIPAMENTOS EM COMODATO: COMPATÍVEL
COD.
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
FOTO ANEXADO: SIM
ACEITE: SIM"""),
("Troca de plano + extensor","ABRE ATENDIMENTO","Modelo para alteração de plano com instalação de extensor de sinal em comodato.","""TIPO DE SERVIÇO: TROCA DE PLANO/INSTALAR EXTENSOR DE SINAL EM COMODATO
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
ACEITE: SIM"""),
("Viabilidade","ABRE ATENDIMENTO","Use para consultar viabilidade e, em mudança de endereço, informe o novo endereço na O.S.","""VIABILIDADE
TIPO DE SERVIÇO: (MOTIVO)
LOCALIZAÇÃO FIXA:
REFERENCIA DO LOCAL:
FOTO DA CASA:
TELEFONES PARA CONTATO:
AGENDAMENTO: TURNO/
COD:
OBSERVAÇÃO: QUANDO FOR MUDANÇA DE ENDEREÇO COLOCAR O NOVO ENDEREÇO NA O.S"""),
("Instalar repetidor de sinal","ABRE ATENDIMENTO","Registre se o repetidor é do cliente, o agendamento e a ciência sobre cobertura.","""TIPO DE SERVIÇO: INSTALAR REPETIDOR DE SINAL
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
CLIENTE CIENTE ATÉ 30 METROS:"""),
("Troca de cabeamento: rádio para fibra","ABRE ATENDIMENTO","Registre a retirada da tecnologia antiga e os equipamentos da nova tecnologia.","""TIPO DE SERVIÇO: TROCA DE CABEAMENTO DE RADIO PARA FIBRA
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
ANEXADO FOTO COM DOCUMENTO: SIM"""),
]

colinha_texts = [
("Atendimento","ABRIR ATENDIMENTO","Modelo base para registrar qualquer contato.","""ATENDIMENTO:
RELATO DO CLIENTE:
TELEFONE DE CONTATO:
SOLICITANTE:
MELHOR TURNO PARA LIGAÇÕES:
RECLAMAÇÕES FRENTE DE LOJA OU POR TELEFONE:"""),
("Sem resposta","ABRIR ATENDIMENTO","Use quando não houve resposta pelo chat e não foi possível contato por ligação.","""RELATO DO CLIENTE:
ENTREI EM CONTATO PARA OFERTAR UMA ATUALIZAÇÃO DE PLANO, NÃO TIVE RESPOSTA PELO CHAT, SEM CONTATO POR LIGAÇÃO.

NÚMERO:
PROTOCOLO CHAT:
HORÁRIO LIGAÇÃO:
PROTOCOLO LIGAÇÃO:"""),
("Autorização de troca de titularidade","AUTORIZAÇÃO","Modelo de autorização + dados para encaminhar ao suporte interno.","""AUTORIZAÇÃO TROCA DE TITULARIDADE

EU AUTORIZO A TROCA DE TITULARIDADE PARA , NOME:___________________ PORTADOR DO CPF: ________.
EQUIPAMENTO EM COMODATO VAI PARA O NOVO TITULAR.
(sempre verificar boleto em aberto, caso esteja aberto tem q saber quem vai pagar)

AGENDAR PARA SUPORTE INTERNO
TIPO DE SERVIÇO: TROCA DE TITULARIDADE
ANTIGO TITULAR (NOME) COD:
NOVO TITULAR (NOME) COD:
NOVO PLANO+SVA:
HOUVE ATUALIZAÇÃO?
POR ONDE FOI A SOLICITAÇÃO:"""),
("Instalação nova","SERVIÇO","Modelo para abertura de instalação nova.","""TIPO DE SERVIÇO: INSTALAÇÃO NOVA
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
REFERÊNCIA:"""),
("Troca de plano","SERVIÇO","Modelo para alteração de plano.","""TIPO DE SERVIÇO: TROCA DE PLANO
NOVO PLANO+SVA:
UP/DOW/MESMO VALOR: MESMO VALOR
VENCIMENTO: O MESMO
EQUIPAMENTOS EM COMODATO: COMPATÍVEL
COD.
CONTATO DO CLIENTE:
POR ONDE FOI A SOLICITAÇÃO: (CHAT/ PROTOCOLO/LIGAÇÃO/HORA/TEL/PRESENCIAL)
FORMALIZAÇÃO: SIM
FOTO ANEXADO: SIM
ACEITE: SIM"""),
("Reativação","SERVIÇO","Modelo completo para reativação de sinal.","""TIPO DE SERVIÇO: REATIVAÇÃO DE SINAL
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
ACEITE: SIM"""),
("Mudança de endereço","SERVIÇO","Modelo completo para mudança de endereço.","""TIPO DE SERVIÇO: MUDANÇA DE ENDEREÇO
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
ACEITE: SIM"""),
("Troca do equipamento","SERVIÇO","Modelo para troca de equipamento.","""TIPO DE SERVIÇO: TROCA DO EQUIPAMENTO
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
ACEITE: SIM"""),
("Troca de plano + extensor","SERVIÇO","Modelo para troca de plano com instalação de extensor.","""TIPO DE SERVIÇO: TROCA DE PLANO/INSTALAR EXTENSOR DE SINAL EM COMODATO
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
ACEITE: SIM"""),
("Viabilidade","SERVIÇO","Modelo para análise de viabilidade.","""VIABILIDADE
TIPO DE SERVIÇO: (MOTIVO)
LOCALIZAÇÃO FIXA:
REFERENCIA DO LOCAL:
FOTO DA CASA:
TELEFONES PARA CONTATO:
AGENDAMENTO: TURNO/
COD:
OBSERVAÇÃO: QUANDO FOR MUDANÇA DE ENDEREÇO COLOCAR O NOVO ENDEREÇO NA O.S"""),
("Instalar repetidor de sinal","SERVIÇO","Modelo para instalação de repetidor.","""TIPO DE SERVIÇO: INSTALAR REPETIDOR DE SINAL
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
CLIENTE CIENTE ATÉ 30 METROS:"""),
("Mudar equipamento de lugar","SERVIÇO","Modelo para mudança de equipamento.","""TIPO DE SERVIÇO: MUDAR EQUIPAMENTO DE LUGAR
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
FOTO ANEXADA:"""),
("Troca de cabeamento rádio → fibra","SERVIÇO","Modelo para migração da tecnologia rádio para fibra.","""TIPO DE SERVIÇO: TROCA DE CABEAMENTO DE RADIO PARA FIBRA
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
ANEXADO FOTO COM DOCUMENTO: SIM"""),
("Promoção","COMERCIAL","Mensagem pronta para apresentar a promoção informada.","""promoção é assim

✅ 1GIGA+UBOOK+NBA+UNIVERSO TV+DEEZER+WATCH BASIC+DOCTOR UNI (TELEMEDICINA)

✅ A senhora pode escolher o Disney Plus ou HBO MAX, um dos dois para usar durante 6 meses como bonificação.

❎ R$99,99 por mês"""),
("Confirmação da contratação","COMERCIAL","Solicitação de documentos para finalizar a ativação.","""Confirma a contratação do plano

📌 Para finalizarmos, solicitamos:

Uma foto sua segurando o documento ao lado do rosto;
Uma foto só do documento (frente e verso).

Assim que recebermos, concluímos sua ativação"""),
("Análise HE2 e CEMIG","APOIO","Documentos necessários para a análise.","""ANALISE HE2 E CEMIG
Documentos necessários do titular da conta da Cemig
• Documento com foto e CPF (RG/CNH) frente e verso;
• Login e senha do app CEMIG Atende;
• Última conta da CEMIG;
• Cartão CNPJ (no caso de pessoa jurídica);
• E-mail.
Para fazermos a analise caso seja aprovado vai chegar uma e-mail para o senhor (a)"""),
("Criar SVA","APOIO","Modelo para solicitar criação/liberação de SVA.","""CRIAR SVA
COD:
NOME:
E-MAIL:
TELEFONE:
PRODUTOS:"""),
("Cancelamento","APOIO","Orientação para solicitar cancelamento por telefone.","""CANCELAMENTO
Para cancelamentos o senhor precisa ligar pelo 0800 009 0004 na opção 09 de segunda a sexta-feira entre 08:00 ás 17 horas."""),
]

# Build JS array declarations before templates
insert = """
const processModels = [\n""" + ',\n'.join([f"  {title!r}," for title,tag,intro,text in []]) + """\n];
"""
# Use JSON-ish generated via JS template literal array directly

def js_obj(item):
    title,tag,intro,text=item
    def q(x):
        return "`"+x.replace('`','\\`')+"`"
    return "  {title:%s, tag:%s, intro:%s, text:%s}"%(q(title),q(tag),q(intro),q(text))
proc_js="const processModels = [\n"+',\n'.join(js_obj(x) for x in process_texts)+"\n];\n"
col_js="const colinhaModels = [\n"+',\n'.join(js_obj(x) for x in colinha_texts)+"\n];\n"
marker="const templates = {"
s=s.replace(marker, proc_js+col_js+marker, 1)

# Replace process template line
pattern=r"  processos: `.*?`,\n  atualizacoes: `"
replacement="  processos: `<div class=\"view-head\"><p class=\"eyebrow\">PASSO 02 · SERVIÇOS</p><h2>Processos sem complicação.</h2><p>Escolha o serviço, confira rapidamente o que precisa ser preenchido e clique em <b>COPIAR MODELO</b>. O modelo vai para a área de transferência já com as quebras de linha.</p></div><div class=\"model-tip\"><span>✓</span><div><b>Como usar</b><small>Abra o atendimento quando necessário, confira os dados e depois copie o modelo completo. Não precisa selecionar o texto manualmente.</small></div></div><div class=\"model-grid\">${processModels.map(m => copyCard(m.title,m.tag,m.intro,m.text)).join('')}</div>`,\n  atualizacoes: `"
s,n=re.subn(pattern,replacement,s,flags=re.S)
if n!=1: raise SystemExit(f'process replacement count {n}')

# Replace colinhas template line
pattern=r"  colinhas: `.*?`,\n  composicao: `"
replacement="  colinhas: `<div class=\"view-head\"><p class=\"eyebrow\">MODELOS · COLINHAS</p><h2>Copie e cole.</h2><p>Os modelos abaixo já estão formatados para o atendimento. Clique uma vez em <b>COPIAR MODELO</b> e cole direto no Voalle ou no chat.</p></div><div class=\"model-tip\"><span>⚡</span><div><b>Pronto para usar</b><small>O texto é copiado com as quebras de linha. Basta preencher os campos vazios depois de colar.</small></div></div><div class=\"model-grid\">${colinhaModels.map(m => copyCard(m.title,m.tag,m.intro,m.text)).join('')}</div>`,\n  composicao: `"
s,n=re.subn(pattern,replacement,s,flags=re.S)
if n!=1: raise SystemExit(f'colinha replacement count {n}')

# Update event handler to support IDs and retain old copy support
s=s.replace("  const copyButton = event.target.closest('[data-copy]');\n  if (copyButton) copy(copyButton.dataset.copy);",
"  const copyButton = event.target.closest('[data-copy-id], [data-copy]');\n  if (copyButton) copy(copyButton.dataset.copyId ? copyTexts[copyButton.dataset.copyId] : copyButton.dataset.copy);")

# Remove old colinhas mutation block in showView, since it overwrites our models
old=""" if (view === 'colinhas') { const editGuide = target.querySelector('.view-head p:last-child'); editGuide.innerHTML = 'Antes de enviar, substitua os campos entre parênteses: <b>(NOME DO CLIENTE)</b>, <b>(VALOR DO PLANO ATUAL)</b> e <b>(VALOR DO PLANO ATUALIZADO)</b>.'; const messages = ['Boa tarde, (NOME DO CLIENTE)! 😊 Aqui é da Universo Internet. Estou entrando em contato pois recentemente nossos planos foram atualizados. Você pode atualizar seu plano atual pelo mesmo valor de (VALOR DO PLANO ATUAL) e ter acesso ao Universo Play, com mais de 100 canais em TV aberta e fechada. Posso prosseguir?', 'Bom dia, (NOME DO CLIENTE)! 😊 Temos uma promoção especial para você! Atualmente, seu plano está no valor de (VALOR DO PLANO ATUAL), e você pode aproveitar uma atualização para (VALOR DO PLANO ATUALIZADO), com mais benefícios e maior velocidade de internet. É uma ótima oportunidade para melhorar seu plano pagando a diferença informada.']; target.querySelectorAll('.process-card').forEach((messageCard, index) => { if (!messages[index]) return; messageCard.querySelector('.copy-box p').textContent = messages[index]; messageCard.querySelector('.copy-btn').dataset.copy = messages[index]; }); }"""
s=s.replace(old,"")

p.write_text(s,encoding='utf-8')
print('patched', len(s))
