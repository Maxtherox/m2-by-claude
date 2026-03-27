# Auditar, refatorar e completar o sistema de NPCs e diálogos já existente no GameMaker

## Objetivo

Auditar o sistema de diálogo já existente no projeto e evoluí-lo para um módulo completo de interação com NPCs, sem recriar tudo do zero. Este prompt resolve a camada prática de conversa e interação com NPCs, conectando diálogos, quests, ferreiro, lojas futuras, flags e ações de gameplay, preservando o que já funciona e corrigindo o que estiver incompleto ou mal estruturado.

Este prompt vem depois de:
- `14-interface-npc-ferreiro.md`
- `21-sistema-de-quests-e-missoes.md`

Este prompt vem antes de:
- `23-save-load-global.md`
- `24-mapa-areas-marcadores-e-navegacao.md`
- prompt de lojas/NPCs comerciantes, se quiser separar depois

## Escopo

### Implementar neste prompt
- auditoria completa do sistema de diálogo atual
- mapeamento do fluxo atual de NPCs e diálogos
- preservação do que já está funcional
- refatoração do módulo atual quando necessário
- padronização da arquitetura de diálogo
- sistema de abertura e fechamento de diálogo com NPC
- exibição de falas
- avanço de falas
- opções de resposta quando aplicável
- gatilhos de ações por diálogo
- integração com quests
- integração com ferreiro
- integração futura com loja
- suporte a flags internas
- suporte a diálogos condicionais
- suporte a falas sequenciais
- suporte a diálogos únicos e repetíveis
- base pronta para lore/tutorial/missões
- interface visual de diálogo coerente com o restante do projeto

### Não implementar neste prompt
- sistema de quests do zero
- sistema do ferreiro do zero
- loja completa
- inventário completo dentro do diálogo
- cutscenes
- voice acting
- animações complexas de retrato
- sistema cinemático
- save/load global completo
- minimapa
- pathfinding de NPC
- rotina diária de NPC
- sistema online
- múltiplos idiomas completos
- árvore narrativa cinematográfica complexa

## Dependências e contexto

Este prompt depende de:
- sistema de quests e missões
- interface/fluxo do ferreiro
- flags internas do jogo
- sistema atual de diálogo já existente no projeto

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- algum sistema de diálogo já implementado
- NPCs ou objetos interativos já existentes
- identificação de NPCs
- quests e objetivos
- flags de progresso
- sistema de ferreiro
- player controlável no mapa
- sistema de input básico
- UI base do projeto

### Dados que este prompt deve criar ou consolidar
- catálogo de perfis de NPC
- catálogo de nós de diálogo
- grafo ou sequência de diálogo
- condições de exibição de fala/opção
- ações disparadas por diálogo
- estado atual da conversa
- índice ou nó atual do diálogo
- integração com quests e módulos de NPC
- controlador central de diálogo/NPC

## Requisitos funcionais

### 1. Auditar o sistema de diálogo atual antes de implementar mudanças
Antes de alterar qualquer coisa, você deve analisar o módulo de diálogo já existente no projeto.

Você deve identificar:
- quais objetos controlam diálogo hoje
- quais scripts/funções já existem
- como o diálogo é aberto hoje
- como a fala avança hoje
- se já existem opções de resposta
- se já existem integrações com NPCs específicos
- o que está estável e deve ser preservado
- o que está acoplado, duplicado ou frágil e precisa ser refatorado
- o que ainda não está implementado neste módulo

Você não deve apagar o sistema atual e substituí-lo por outro genérico sem antes adaptá-lo.

### 2. Criar controlador central de diálogo/NPC
Criar um controlador central para o fluxo de interação com NPCs.

Responsabilidades:
- iniciar conversa
- abrir UI de diálogo
- controlar estado da conversa
- avançar fala
- encerrar fala
- disparar ações do diálogo
- bloquear duplicação de conversa
- expor integração com quests e outros módulos

Funções esperadas:
- `npc_dialog_open(npc_id)`
- `npc_dialog_close()`
- `npc_dialog_is_open()`
- `npc_dialog_start_conversation(npc_id, conversation_id)`

### 3. Criar catálogo de perfis de NPC
Cada NPC deve possuir um perfil centralizado.

Campos esperados:
- `npc_id`
- `display_name`
- `npc_type`
- `default_conversation_id`
- `quest_conversation_ids`
- `interaction_flags`
- `services_available`
- `portrait_id` opcional
- `npc_tags`

Exemplos de `services_available`:
- `QUEST_GIVER`
- `BLACKSMITH`
- `SHOP`
- `LORE`
- `TRAINER`

Funções esperadas:
- `npc_build_catalog()`
- `npc_get_profile(npc_id)`

### 4. Criar estrutura central de diálogo
Os diálogos devem ser orientados a dados e centralizados.

Cada conversa deve poder ter:
- sequência linear
- ramificação por opção
- condição por flag/quest
- ação ao entrar
- ação ao sair
- ação ao escolher opção

Campos esperados:
- `conversation_id`
- `start_node_id`
- `conversation_tags`
- `nodes`

Cada nó deve suportar:
- `node_id`
- `speaker_type`
- `speaker_name_override` opcional
- `text`
- `next_node_id`
- `option_list`
- `conditions`
- `actions_on_enter`
- `actions_on_exit`
- `end_conversation`

Funções esperadas:
- `dialog_build_catalog()`
- `dialog_get_conversation(conversation_id)`
- `dialog_get_node(conversation_id, node_id)`

### 5. Implementar seleção de conversa por contexto
Ao falar com um NPC, o sistema deve decidir qual conversa abrir com base no contexto.

Critérios possíveis:
- quest disponível
- quest em progresso
- quest pronta para entrega
- flags internas
- primeira conversa
- conversa repetida
- serviço especial do NPC

Funções esperadas:
- `npc_dialog_resolve_conversation(npc_id)`
- `npc_dialog_get_contextual_conversation(npc_id, player_state)`

### 6. Implementar abertura e fechamento do diálogo
Ao interagir com o NPC:
- abrir a janela de diálogo
- congelar ou limitar o controle do player conforme a regra do projeto
- impedir abertura duplicada
- encerrar corretamente ao fim da conversa ou cancelamento

Funções esperadas:
- `npc_dialog_begin_interaction(npc_id)`
- `npc_dialog_end_interaction()`

### 7. Implementar avanço de falas
O diálogo deve suportar:
- fala simples
- avanço por clique/tecla
- avanço entre nós lineares
- encerramento ao final

Funções esperadas:
- `npc_dialog_advance()`
- `npc_dialog_go_to_node(node_id)`

Se já existir sistema de typewriter/text reveal, ele deve ser auditado e preservado se estiver bom.

### 8. Implementar opções de resposta
O sistema deve suportar opções de resposta quando o nó exigir.

Cada opção deve poder ter:
- texto
- próxima fala
- condição de visibilidade
- ação ao escolher
- bloqueio por contexto

Campos esperados:
- `option_id`
- `text`
- `next_node_id`
- `conditions`
- `actions_on_select`
- `is_visible`
- `is_enabled`

Funções esperadas:
- `npc_dialog_get_visible_options()`
- `npc_dialog_select_option(option_id)`

### 9. Implementar condições de exibição
Falas e opções devem poder depender de:
- quest aceita
- quest concluída
- quest pronta para entrega
- flag de progresso
- nível do player
- item no inventário
- honra
- primeira interação
- serviço desbloqueado

Funções esperadas:
- `npc_dialog_check_conditions(condition_list)`
- `npc_dialog_is_node_available(node_id)`
- `npc_dialog_is_option_available(option_id)`

### 10. Implementar ações disparadas pelo diálogo
O diálogo deve conseguir disparar ações sem colocar lógica pesada dentro da UI.

Ações mínimas esperadas:
- aceitar quest
- entregar quest
- abrir ferreiro
- abrir loja futuramente
- setar flag
- dar item
- remover item
- dar gold
- tocar evento simples
- encerrar conversa

Funções esperadas:
- `npc_dialog_execute_action(action_data)`
- `npc_dialog_execute_action_list(action_list)`

### 11. Integrar com quests
O sistema deve permitir:
- NPC oferecer quest
- NPC entregar quest
- NPC responder de forma diferente conforme estado da quest
- NPC liberar próxima quest da cadeia

Funções esperadas:
- `npc_dialog_offer_quest(quest_id)`
- `npc_dialog_turn_in_quest(quest_id)`
- `npc_dialog_get_quest_state_for_npc(npc_id)`

### 12. Integrar com ferreiro
O sistema deve permitir que um NPC dialogue e depois abra o módulo do ferreiro.

Regras:
- a conversa pode terminar abrindo o ferreiro
- a lógica do ferreiro deve continuar fora do sistema de diálogo
- o diálogo só dispara a transição

Funções esperadas:
- `npc_dialog_open_blacksmith(npc_id)`

### 13. Preparar integração futura com loja
Mesmo sem implementar a loja completa agora, a arquitetura deve suportar:
- opção “Comprar/Vender”
- chamada futura para módulo de loja
- separação entre diálogo e módulo de comércio

Função esperada:
- `npc_dialog_open_shop(npc_id)`

### 14. Implementar flags internas de diálogo
O sistema deve suportar flags específicas de conversa.

Exemplos:
- já falou com NPC pela primeira vez
- viu explicação do sistema
- desbloqueou serviço
- aceitou tutorial
- encerrou cadeia de lore

Funções esperadas:
- `npc_dialog_set_flag(flag_id, value)`
- `npc_dialog_get_flag(flag_id)`
- `npc_dialog_has_flag(flag_id)`

### 15. Implementar diálogos únicos e repetíveis
A arquitetura deve permitir:
- fala única de introdução
- fala repetida curta
- fala condicional enquanto quest está em progresso
- fala diferente após concluir quest

### 16. Implementar interface visual de diálogo
A interface deve conter:
- caixa de diálogo
- nome do NPC/falante
- texto atual
- opções de resposta quando existirem
- botão/indicação de continuar
- botão/indicação de fechar quando permitido

A identidade visual deve seguir o padrão do projeto:
- sombria
- elegante
- medieval
- inspirada em Elden Ring
- legível
- sem aparência mobile genérica
- sem visual sci-fi

### 17. Separar UI de regra de negócio
A UI deve:
- exibir falas
- exibir opções
- chamar funções centrais
- refletir o estado atual

A UI não deve:
- decidir lógica de quest
- decidir flags
- decidir serviço do NPC
- conter regra espalhada de progressão

### 18. Preparar suporte a retrato e variantes visuais
A estrutura deve aceitar no futuro:
- retrato do NPC
- nome estilizado
- variação por humor/estado
- caixas especiais para boss/NPC importante

Não precisa implementar tudo agora, mas a estrutura deve aceitar isso.

### 19. Implementar resultado estruturado das operações
Abrir conversa, avançar, escolher opção e executar ação devem retornar resultados claros.

Campos esperados:
- `success`
- `npc_id`
- `conversation_id`
- `node_id`
- `action_type`
- `next_node_id`
- `conversation_closed`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de NPCs
- catálogo de diálogos
- enums de tipo de falante
- enums de tipo de serviço
- ações de diálogo
- condições de diálogo
- layout visual da caixa de diálogo
- bindings de input

### Estado
Separar claramente:
- NPC atual
- conversa atual
- nó atual
- opções visíveis
- flags de diálogo
- estado de interação aberta/fechada
- fila de ações do diálogo, se necessário

### Funções centrais
Funções esperadas:
- `npc_build_catalog()`
- `npc_get_profile(npc_id)`
- `dialog_build_catalog()`
- `dialog_get_conversation(conversation_id)`
- `dialog_get_node(conversation_id, node_id)`
- `npc_dialog_open(npc_id)`
- `npc_dialog_close()`
- `npc_dialog_is_open()`
- `npc_dialog_start_conversation(npc_id, conversation_id)`
- `npc_dialog_resolve_conversation(npc_id)`
- `npc_dialog_get_contextual_conversation(npc_id, player_state)`
- `npc_dialog_begin_interaction(npc_id)`
- `npc_dialog_end_interaction()`
- `npc_dialog_advance()`
- `npc_dialog_go_to_node(node_id)`
- `npc_dialog_get_visible_options()`
- `npc_dialog_select_option(option_id)`
- `npc_dialog_check_conditions(condition_list)`
- `npc_dialog_is_node_available(node_id)`
- `npc_dialog_is_option_available(option_id)`
- `npc_dialog_execute_action(action_data)`
- `npc_dialog_execute_action_list(action_list)`
- `npc_dialog_offer_quest(quest_id)`
- `npc_dialog_turn_in_quest(quest_id)`
- `npc_dialog_get_quest_state_for_npc(npc_id)`
- `npc_dialog_open_blacksmith(npc_id)`
- `npc_dialog_open_shop(npc_id)`
- `npc_dialog_set_flag(flag_id, value)`
- `npc_dialog_get_flag(flag_id)`
- `npc_dialog_has_flag(flag_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir sistema atual de diálogo já existente
- consumir sistema de quests
- consumir flags internas
- integrar com ferreiro
- preparar integração futura com loja
- preparar integração futura com save/load
- não depender de UI para a regra central funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. auditar corretamente o sistema de diálogo atual antes de alterar
2. preservar o que já está funcional no módulo atual
3. abrir e fechar diálogo com NPC corretamente
4. impedir duplicação de diálogo aberto
5. avançar falas corretamente
6. exibir opções de resposta corretamente
7. aplicar condições de exibição corretamente
8. escolher opção e navegar para o próximo nó corretamente
9. disparar ação de aceitar quest corretamente
10. disparar ação de entregar quest corretamente
11. disparar abertura do ferreiro corretamente
12. suportar flags internas de diálogo corretamente
13. exibir conversa contextual correta conforme estado da quest
14. suportar primeira fala e fala repetida corretamente
15. manter separação entre UI e regra de negócio
16. seguir a identidade visual do projeto
17. manter arquitetura pronta para loja e save/load sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta do sistema de diálogo atual encontrado no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de diálogo em vários lugares
- não misturar UI com regra de negócio
- não ignorar o sistema de diálogo já existente no projeto
- não reescrever do zero sem antes auditar o que já existe
- não implementar loja completa neste prompt
- não implementar save/load completo neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders