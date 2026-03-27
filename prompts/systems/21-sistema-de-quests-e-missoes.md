# Implementar sistema completo de quests, missões, objetivos e recompensas no GameMaker

## Objetivo

Implementar o sistema completo de quests e missões do jogo, inspirado estruturalmente em RPGs como Metin2, permitindo criar missões lineares, repetíveis e especiais com objetivos, progresso, estados, entrega e recompensas. Este prompt resolve a base de conteúdo guiado do jogo, conectando NPCs, monstros, drops, bosses, itens, honra, XP e progressão do personagem.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`
- `13-sistema-drops-e-materiais.md`
- `14-interface-npc-ferreiro.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `20-sistema-bosses-e-encontros-especiais.md`

Este prompt vem antes de:
- prompt de interface de NPCs e diálogos gerais
- prompt de dungeons/instâncias
- prompt de save/load global
- prompt de mapa/marcadores e navegação de objetivos

## Escopo

### Implementar neste prompt
- sistema central de quests
- definição global de quests
- estados de quest
- objetivos de quest
- progresso de quest
- missões principais
- missões secundárias
- missões repetíveis
- missões de caça
- missões de coleta
- missões de entrega
- missões de interação com NPC
- missões ligadas a boss
- missões com múltiplos objetivos
- requisitos de aceitação
- conclusão e entrega
- recompensas
- integração com monstros, drops, inventário, NPCs, bosses, XP, gold e honra
- suporte a cadeia de quests
- suporte a flags internas de progresso
- arquitetura pronta para diálogos e UI de quests no futuro

### Não implementar neste prompt
- interface visual final de diário de quests
- árvore visual complexa de quests
- cutscenes
- diálogos ricos finais
- voice lines
- save/load global completo
- dungeons completas
- sistema online de party/shared quests
- achievements
- ranking global
- minimapa com marcadores
- scripting cinematográfico avançado
- eventos globais complexos
- reputação por facção complexa além da honra já existente

## Dependências e contexto

Este sistema depende de:
- inventário e itens
- drops e materiais
- IA e morte de monstros
- bosses e elites
- gold, XP e honra
- NPCs existentes ou futuros como entidades/interações simples

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- inventário do jogador
- gold do jogador
- XP do jogador
- honra do jogador
- sistema de drops
- sistema de morte de monstros e bosses
- identificação de NPCs
- identificação de inimigos
- catálogo de itens
- possibilidade de conceder recompensas ao jogador

### Dados que este prompt deve criar
- catálogo global de quests
- enum de estados de quest
- enum de tipos de objetivo
- instância de quest no jogador
- progresso por objetivo
- flags de conclusão/entrega
- integração com eventos do jogo
- fila de quests ativas
- histórico de quests concluídas
- funções centrais de aceitar, atualizar, completar e entregar quests

## Requisitos funcionais

### 1. Criar enum de estados de quest
Criar enums ou estruturas equivalentes para os estados mínimos da quest.

Estados esperados:
- `QUEST_STATE_LOCKED`
- `QUEST_STATE_AVAILABLE`
- `QUEST_STATE_ACCEPTED`
- `QUEST_STATE_IN_PROGRESS`
- `QUEST_STATE_COMPLETED`
- `QUEST_STATE_READY_TO_TURN_IN`
- `QUEST_STATE_TURNED_IN`
- `QUEST_STATE_FAILED` preparado para futuro

Enum esperado:
- `QuestState`

### 2. Criar enum de tipos de objetivo
Cada quest deve poder ter um ou mais objetivos de tipos diferentes.

Tipos mínimos esperados:
- `QUEST_OBJECTIVE_KILL`
- `QUEST_OBJECTIVE_COLLECT`
- `QUEST_OBJECTIVE_DELIVER`
- `QUEST_OBJECTIVE_TALK_TO_NPC`
- `QUEST_OBJECTIVE_VISIT_AREA`
- `QUEST_OBJECTIVE_KILL_BOSS`
- `QUEST_OBJECTIVE_USE_ITEM`
- `QUEST_OBJECTIVE_GAIN_ITEM`
- `QUEST_OBJECTIVE_REACH_LEVEL`
- `QUEST_OBJECTIVE_TRIGGER_FLAG`

Enum esperado:
- `QuestObjectiveType`

### 3. Criar definição global de quest
Cada quest deve possuir uma definição centralizada.

Campos esperados:
- `quest_id`
- `name`
- `description`
- `quest_type`
- `quest_state_initial`
- `giver_npc_id`
- `turn_in_npc_id`
- `required_level`
- `required_quests_completed`
- `required_flags`
- `is_repeatable`
- `repeat_cooldown` preparado para futuro
- `objective_list`
- `reward_list`
- `quest_flags`
- `quest_chain_next_id` opcional

Funções esperadas:
- `quests_build_catalog()`
- `quests_get_definition(quest_id)`

### 4. Criar estrutura de objetivo de quest
Cada objetivo deve ter estrutura clara.

Campos esperados:
- `objective_id`
- `objective_type`
- `target_id`
- `required_amount`
- `current_amount`
- `is_completed`
- `extra_conditions`
- `description_override` opcional

Funções esperadas:
- `quest_objective_create(...)`
- `quest_objective_is_complete(objective)`

### 5. Criar instância de quest no jogador
O jogador deve possuir instâncias próprias das quests.

Campos esperados:
- `quest_id`
- `state`
- `objectives_progress`
- `accepted_time`
- `completed_time`
- `turned_in_time`
- `is_repeatable_instance`
- `quest_runtime_flags`

Funções esperadas:
- `quest_instance_create(quest_id)`
- `quest_get_player_instance(quest_id)`

### 6. Criar estrutura de armazenamento de quests do jogador
O sistema deve separar:
- quests disponíveis
- quests ativas
- quests prontas para entrega
- quests concluídas
- histórico de quests repetíveis, se necessário

Campos esperados:
- `quests_active`
- `quests_completed`
- `quests_ready_to_turn_in`
- `quests_runtime_flags`

Funções esperadas:
- `quests_init_player_log()`
- `quests_get_active_list()`
- `quests_get_completed_list()`

### 7. Implementar aceitação de quest
O jogador deve poder aceitar uma quest quando os requisitos forem atendidos.

Validações mínimas:
- quest existe
- quest está disponível
- requisitos de nível atendidos
- requisitos de quests anteriores atendidos
- requisitos de flags atendidos
- NPC correto, quando aplicável

Funções esperadas:
- `quests_can_accept(quest_id, npc_id)`
- `quests_accept(quest_id, npc_id)`

### 8. Implementar progresso automático por evento
As quests devem progredir a partir de eventos centrais do jogo.

Eventos mínimos a suportar:
- matar monstro
- matar boss
- obter item
- entregar item
- falar com NPC
- usar item
- visitar área
- subir de nível
- completar outra quest
- ativar flag de progresso

Funções esperadas:
- `quests_handle_enemy_killed(enemy_id, killer_id)`
- `quests_handle_boss_killed(boss_id, killer_id)`
- `quests_handle_item_obtained(item_id, amount)`
- `quests_handle_item_delivered(item_id, amount, npc_id)`
- `quests_handle_npc_talk(npc_id)`
- `quests_handle_item_used(item_id)`
- `quests_handle_area_visited(area_id)`
- `quests_handle_level_reached(level)`
- `quests_handle_flag_triggered(flag_id)`

### 9. Implementar atualização de objetivos
Quando um evento relevante ocorrer:
- localizar quests ativas compatíveis
- atualizar objetivo correspondente
- marcar objetivo como completo quando atingir o necessário
- verificar se a quest inteira foi concluída

Funções esperadas:
- `quests_update_objectives_by_event(event_type, payload)`
- `quests_check_objective_completion(quest_instance, objective_id)`
- `quests_check_quest_completion(quest_instance)`

### 10. Implementar conclusão da quest
Quando todos os objetivos forem concluídos:
- a quest deve entrar em estado concluído
- se houver entrega em NPC, deve ir para `READY_TO_TURN_IN`
- se for auto-complete, pode ir direto para recompensa, conforme configuração

Funções esperadas:
- `quests_mark_completed(quest_id)`
- `quests_mark_ready_to_turn_in(quest_id)`

### 11. Implementar entrega da quest
Para quests com NPC de entrega:
- validar NPC correto
- validar estado da quest
- entregar recompensas
- mover a quest para concluídas/entregues
- liberar próxima quest da cadeia, se existir

Funções esperadas:
- `quests_can_turn_in(quest_id, npc_id)`
- `quests_turn_in(quest_id, npc_id)`

### 12. Implementar recompensas de quest
O sistema deve suportar recompensas variadas.

Tipos mínimos:
- XP
- gold
- honra
- item
- consumível
- material
- desbloqueio de quest seguinte
- flag interna
- página de inventário futura, se quiser usar isso depois

Estrutura esperada de recompensa:
- `reward_type`
- `reward_target_id`
- `reward_amount`
- `reward_payload`

Funções esperadas:
- `quests_apply_rewards(quest_id)`
- `quests_apply_single_reward(reward_data)`

### 13. Implementar missões de caça
Quests de caça devem funcionar com:
- matar N inimigos de um tipo
- matar inimigos de um grupo/família
- possibilidade futura de matar elite ou boss específico

### 14. Implementar missões de coleta
Quests de coleta devem funcionar com:
- obter item X em quantidade Y
- opcionalmente exigir item no inventário
- opcionalmente consumir item ao entregar

### 15. Implementar missões de entrega
Quests de entrega devem funcionar com:
- falar com NPC A
- levar item para NPC B
- entregar item para NPC B
- marcar progresso correto

### 16. Implementar missões ligadas a boss
Quests devem poder exigir:
- matar boss específico
- entregar item dropado de boss
- falar com NPC após matar boss

### 17. Implementar quests repetíveis
A arquitetura deve permitir quests repetíveis.

Regras:
- quest pode ser repetida se `is_repeatable == true`
- histórico deve registrar execução anterior
- cooldown pode ficar apenas como estrutura preparada se você não quiser ativar agora

### 18. Implementar cadeia de quests
A arquitetura deve permitir sequência de quests.

Exemplo:
- completar quest A libera quest B

Campos esperados:
- `quest_chain_next_id`
- `required_quests_completed`

### 19. Implementar flags internas de progresso
O sistema deve suportar flags para destravar conteúdo e objetivos.

Exemplos:
- falou com NPC especial
- abriu área
- concluiu tutorial
- derrotou elite X

Funções esperadas:
- `quests_set_flag(flag_id, value)`
- `quests_get_flag(flag_id)`
- `quests_has_flag(flag_id)`

### 20. Retornar resultados estruturados
Aceitação, atualização, conclusão e entrega devem retornar resultado claro.

Campos esperados:
- `success`
- `quest_id`
- `previous_state`
- `new_state`
- `updated_objective_ids`
- `rewards_applied`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de quests
- enums de estado
- enums de objetivo
- tipos de recompensa
- regras de repeatable
- flags internas
- definições de cadeia de quests

### Estado
Separar claramente:
- catálogo global de quests
- instâncias de quest do jogador
- objetivos e progresso
- quests ativas
- quests prontas para entrega
- quests concluídas
- flags internas do sistema

### Funções centrais
Funções esperadas:
- `quests_build_catalog()`
- `quests_get_definition(quest_id)`
- `quest_objective_create(...)`
- `quest_objective_is_complete(objective)`
- `quest_instance_create(quest_id)`
- `quest_get_player_instance(quest_id)`
- `quests_init_player_log()`
- `quests_get_active_list()`
- `quests_get_completed_list()`
- `quests_can_accept(quest_id, npc_id)`
- `quests_accept(quest_id, npc_id)`
- `quests_handle_enemy_killed(enemy_id, killer_id)`
- `quests_handle_boss_killed(boss_id, killer_id)`
- `quests_handle_item_obtained(item_id, amount)`
- `quests_handle_item_delivered(item_id, amount, npc_id)`
- `quests_handle_npc_talk(npc_id)`
- `quests_handle_item_used(item_id)`
- `quests_handle_area_visited(area_id)`
- `quests_handle_level_reached(level)`
- `quests_handle_flag_triggered(flag_id)`
- `quests_update_objectives_by_event(event_type, payload)`
- `quests_check_objective_completion(quest_instance, objective_id)`
- `quests_check_quest_completion(quest_instance)`
- `quests_mark_completed(quest_id)`
- `quests_mark_ready_to_turn_in(quest_id)`
- `quests_can_turn_in(quest_id, npc_id)`
- `quests_turn_in(quest_id, npc_id)`
- `quests_apply_rewards(quest_id)`
- `quests_apply_single_reward(reward_data)`
- `quests_set_flag(flag_id, value)`
- `quests_get_flag(flag_id)`
- `quests_has_flag(flag_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir eventos de morte de monstros e bosses
- consumir inventário e itens
- conceder gold, XP, honra e recompensas
- interagir com NPCs
- liberar novas quests/cadeias
- preparar integração futura com UI de quests, diálogos, minimapa e save/load
- não depender de UI para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de quests
2. aceitar quest válida corretamente
3. bloquear aceitação de quest sem requisitos
4. atualizar objetivo de kill corretamente
5. atualizar objetivo de boss corretamente
6. atualizar objetivo de coleta corretamente
7. atualizar objetivo de talk to NPC corretamente
8. atualizar objetivo de entrega corretamente
9. marcar objetivo como concluído corretamente
10. marcar quest como concluída corretamente
11. marcar quest pronta para entrega corretamente
12. entregar quest corretamente no NPC certo
13. aplicar recompensas corretamente
14. consumir itens na entrega quando a quest exigir
15. registrar quest concluída corretamente
16. suportar quest repetível sem quebrar histórico
17. liberar quest seguinte da cadeia corretamente
18. suportar flags internas corretamente
19. manter arquitetura pronta para UI de quests e diálogos sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de quest em vários lugares
- não misturar UI com regra de negócio
- não implementar interface final de quests neste prompt
- não implementar diálogo rico final neste prompt
- não implementar save/load completo neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders