# Workflow Ideal de Execucao dos Prompts

## Objetivo

Este arquivo define como executar a sequencia de prompts do projeto sem quebrar a arquitetura, sem duplicar regras de negocio e sem precisar revisar tudo do zero a cada etapa.

A regra principal e simples:
- implementacao principal: sequencial
- revisao e apoio: paralelo

## Dono da Arquitetura

### Agente principal
Nome sugerido:
- `ArquitetoPrincipal`

Responsabilidades:
- ser o unico agente autorizado a decidir nomes de campos, structs, enums e funcoes centrais
- implementar os prompts principais em ordem
- manter o contrato central da arquitetura atualizado
- aprovar ou rejeitar sugestoes dos subagentes
- resolver conflitos entre prompts
- garantir que um prompt novo nao reabra responsabilidade de um prompt antigo

O agente principal sempre deve ser o dono de:
- contrato do personagem
- contrato de inventario e itens
- contrato de combate
- contrato de persistencia

## Subagentes de Apoio

### 1. Revisor de Contrato
Nome sugerido:
- `RevisorContrato`

Funcao:
- verificar se o prompt atual respeita os nomes e contratos ja definidos
- apontar divergencias de campos, assinaturas e ownership de regras

Nao implementa sistema principal.
Nao decide arquitetura.

### 2. Revisor de Escopo
Nome sugerido:
- `RevisorEscopo`

Funcao:
- verificar se a entrega fez apenas o que o prompt pedia
- detectar invasao de escopo
- detectar pseudo-codigo, omissoes e logica espalhada

### 3. Preparador de Prompt
Nome sugerido:
- `PreparadorPrompt`

Funcao:
- revisar o proximo prompt antes da execucao
- padronizar estrutura
- preencher arquivos vazios
- explicitar dependencias, criterios de aceite e formato esperado de resposta

Este subagente e obrigatorio quando o prompt seguinte estiver vazio ou mal estruturado.

### 4. Auditor de Integracao
Nome sugerido:
- `AuditorIntegracao`

Funcao:
- revisar se o prompt novo conversa corretamente com os sistemas anteriores
- validar pontos de integracao entre status, skills, inventario, combate, quests e save/load

### 5. Auditor de Codigo Existente
Nome sugerido:
- `AuditorCodigoExistente`

Funcao:
- ler e mapear sistemas ja implementados no projeto antes de prompts que explicitamente dependem de auditoria do codigo atual

Usar especialmente em:
- `15-sistema-combate-base.md`
- `22-interface-de-npcs-e-dialogos.md`

### 6. Tradutor de Stack JS/React/Node
Nome sugerido:
- `TradutorJSReactNode`

Funcao:
- receber prompts escritos para GameMaker/GML
- reinterpretar esses prompts como especificacao funcional
- implementar no stack real do projeto atual usando JavaScript, TypeScript, React e Node quando aplicavel

Arquivo de referencia:
- `prompts/agents/AGENTE-TRADUTOR-JS-REACT-NODE.md`

Este agente deve ser usado quando o prompt estiver em linguagem de dominio GameMaker, mas o repositorio real for web ou full stack em JS/TS.

## Regra de Paralelizacao

Nunca paralelizar dois agentes implementando ao mesmo tempo sistemas que compartilham o mesmo contrato central.

Exemplos do que nao pode rodar em paralelo:
- `01` com `02`
- `02` com `03`
- `03` com `04`
- `10` com `11`
- `15` com `16`
- `15` com `18`
- `21` com `23`

Exemplos do que pode rodar em paralelo:
- agente principal implementando o prompt atual
- `RevisorContrato` preparando checklist do prompt atual
- `PreparadorPrompt` ajustando o prompt seguinte
- `AuditorIntegracao` levantando riscos da proxima fase
- `TradutorJSReactNode` mapeando o prompt GML para a arquitetura JS/React/Node do repositorio

## Ciclo Padrao por Prompt

Para cada prompt, seguir sempre este ciclo:

1. `ArquitetoPrincipal` le o prompt atual, o contrato central e os prompts anteriores ja executados.
2. `RevisorContrato` confirma dependencias e campos obrigatorios.
3. `PreparadorPrompt` revisa o proximo prompt da fila.
4. `ArquitetoPrincipal` implementa o prompt atual.
5. `RevisorEscopo` verifica se a entrega respeitou o escopo.
6. `AuditorIntegracao` valida o encaixe com os sistemas anteriores.
7. `ArquitetoPrincipal` corrige os achados.
8. Atualizar `CONTRATO-ARQUITETURA.md`.
9. So depois disso iniciar o proximo prompt.

## Fases Recomendadas

### Fase 0: Saneamento dos prompts
Antes da execucao principal, revisar a qualidade dos prompts.

Bloqueadores atuais encontrados:
- `07-progressao-skills-estilo-metin2.md` esta vazio
- `09-itens-consumiveis-progressao-skill.md` esta vazio
- `24-mapa-areas-marcadores-e-navegacao.md` esta vazio

Esses arquivos devem ser preenchidos pelo `PreparadorPrompt` antes de chegar neles na fila.

### Fase 1: Fundacao do personagem
Executar em ordem:
- `01-sistema-status-base.md`
- `02-sistema-xp-level-up-progressivo.md`
- `03-sistema-atributos-derivados.md`
- `04-interface-de-status.md`

Checkpoint de saida da fase:
- existe um contrato unico do personagem
- status, XP, atributos derivados e UI usam os mesmos nomes
- nenhuma regra de negocio foi duplicada na interface

### Fase 2: Honra e skills
Executar em ordem:
- `05-sistema-honra.md`
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `08-interface-de-skills.md`
- `09-itens-consumiveis-progressao-skill.md`

Checkpoint de saida da fase:
- honra e skills usam o mesmo estado central do personagem
- progressao de skill nao duplica regras de honra
- UI de skills e apenas consumidora de estado

### Fase 3: Inventario, itens e economia base
Executar em ordem:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`
- `14-interface-npc-ferreiro.md`

Checkpoint de saida da fase:
- inventario e equipamentos usam um contrato estavel de item
- bonus de item entram no recálculo sem logica duplicada
- ferreiro e drops consomem o mesmo modelo de item/instancia

### Fase 4: Combate e PvE
Executar em ordem:
- `15-sistema-combate-base.md`
- `16-hotbar-e-atalhos-de-combate.md`
- `17-hud-completa-de-combate.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `19-buffs-debuffs-e-status-effects.md`
- `20-sistema-bosses-e-encontros-especiais.md`

Checkpoint de saida da fase:
- combate novo respeita o combate ja existente
- hotbar e HUD nao carregam regra de negocio de combate
- IA, buffs e bosses usam o mesmo pipeline de dano, alvo e efeitos

### Fase 5: Conteudo persistente e mundo
Executar em ordem:
- `21-sistema-de-quests-e-missoes.md`
- `22-interface-de-npcs-e-dialogos.md`
- `23-save-load-global.md`
- `24-mapa-areas-marcadores-e-navegacao.md`

Checkpoint de saida da fase:
- quests e dialogos compartilham flags e estados coerentes
- save/load serializa apenas contratos estaveis
- mapa consome dados persistentes sem redefinir estruturas centrais

## Checkpoints Obrigatorios por Prompt

### Depois do 01
- existe um unico estado central do personagem
- campos base estao estaveis
- distribuicao de pontos passa por funcoes centrais

### Depois do 02
- XP e level up usam o mesmo estado do personagem
- bonus permanentes de progressao foram adicionados sem quebrar o contrato base

### Depois do 03
- existe um recálculo centralizado
- atributos derivados consomem bonus do level up e bonus externos

### Depois do 04
- a UI nao recalcula atributos por conta propria
- confirmacao e cancelamento chamam funcoes centrais

Replicar esse mesmo padrao de checkpoint para as fases seguintes.

## Ordem de Execucao Recomendada na Pratica

Fluxo diario recomendado:

1. `ArquitetoPrincipal` executa 1 prompt principal por vez.
2. Em paralelo, `PreparadorPrompt` revisa o proximo prompt.
3. Ao terminar, `RevisorEscopo` e `RevisorContrato` fazem checagem rapida.
4. `ArquitetoPrincipal` corrige.
5. Atualizar contrato.
6. Seguir para o proximo.

Nao tente fechar duas fases grandes no mesmo ciclo se o contrato central ainda mudou no prompt anterior.

## Quando usar subagentes de escrita

Subagente pode editar arquivo somente quando:
- estiver preenchendo prompt vazio
- estiver melhorando documentacao
- estiver preparando checklist
- estiver atuando em arquivos que nao conflitam com o trabalho do agente principal

Subagente nao deve editar:
- os mesmos arquivos de implementacao que o agente principal esta alterando
- contratos centrais sem aprovacao do agente principal

## Resultado Esperado

Se este workflow for seguido:
- a arquitetura para de quebrar entre prompts
- a revisao vira check de contrato, nao auditoria completa toda vez
- prompts vazios deixam de bloquear a fila
- voce consegue escalar a execucao com menos retrabalho
