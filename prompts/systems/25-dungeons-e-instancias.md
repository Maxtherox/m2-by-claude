# Implementar sistema de dungeons, instâncias, andares e progressão de entrada no GameMaker

## Objetivo

Implementar o sistema completo de dungeons e instâncias do jogo, permitindo criar conteúdos fechados com entrada controlada, regras próprias, progresso interno, múltiplos andares/salas, objetivos, bosses e conclusão. Este prompt resolve a base de conteúdo instanciado do jogo, conectando mapa, quests, bosses, loot, flags e save/load sem quebrar a estrutura atual de rooms e transições.

Este prompt vem depois de:
- `20-sistema-bosses-e-encontros-especiais.md`
- `21-sistema-de-quests-e-missoes.md`
- `22-interface-de-npcs-e-dialogos.md`
- `23-save-load-global.md`
- `24-mapa-areas-marcadores-e-navegacao.md`

Este prompt vem antes de:
- prompt de loja/comércio
- prompt de crafting/produção
- prompt de sistema de party/grupo, se você quiser adicionar depois
- prompt de eventos temporários de mapa ou raids futuras

## Escopo

### Implementar neste prompt
- sistema central de dungeons
- sistema central de instâncias
- definição de dungeon por dados
- entrada em dungeon
- validação de requisitos de entrada
- criação de instância de dungeon
- progresso interno da instância
- múltiplos andares/salas/etapas
- objetivos internos da dungeon
- bosses de dungeon
- regras de conclusão
- regras de falha
- temporizador opcional de dungeon
- checkpoints internos opcionais
- movimentação controlada entre andares da dungeon
- vínculo da dungeon com quests e flags
- vínculo da dungeon com mapa/áreas
- regras de recompensa final
- persistência mínima do estado da dungeon quando aplicável
- arquitetura pronta para dungeons repetíveis e especiais

### Não implementar neste prompt
- multiplayer
- sistema de party completo
- matchmaking
- raid online
- geração procedural completa de mapas
- editor visual de dungeon
- cutscenes
- cinematics
- puzzles complexos com UI dedicada
- sistema de ranking global de clear time
- loja interna de dungeon
- crafting
- mundo aberto procedural
- eventos sazonais completos
- dungeon infinita procedural
- narrativa cinematográfica avançada
- voice acting
- sistema online de instâncias compartilhadas

## Dependências e contexto

Este prompt depende de:
- sistema de bosses e encontros especiais
- sistema de quests e missões
- sistema de NPCs e diálogos
- sistema global de save/load
- sistema de mapa, áreas e navegação
- estrutura atual de rooms e transições do projeto

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- rooms/salas do projeto
- player com room atual e posição atual
- sistema de bosses
- sistema de quests
- sistema de flags
- sistema de drops e recompensas
- sistema de diálogo/NPC para entrada em conteúdo
- save/load global
- estrutura de mapa e áreas

### Dados que este prompt deve criar
- catálogo de dungeons
- catálogo de andares/etapas de dungeon
- instância ativa de dungeon
- enum de estado da dungeon
- enum de tipo de objetivo interno
- enum de motivo de falha/saída
- controlador de entrada e saída
- progresso interno da instância
- vínculo entre instância e rooms do projeto
- sistema de conclusão e recompensa de dungeon

## Requisitos funcionais

### 1. Auditar a estrutura atual de rooms, transições e conteúdo fechado antes de implementar mudanças
Antes de implementar qualquer alteração, você deve analisar:
- como o projeto organiza hoje as rooms
- como o player entra e sai de áreas
- como transições de sala funcionam hoje
- se já existe algum conteúdo que se comporta como arena, boss room ou área fechada
- o que pode ser reaproveitado para dungeons
- o que precisa ser centralizado/refatorado

Você não deve substituir a estrutura atual de rooms/transições por outra genérica sem antes adaptá-la.

### 2. Criar enum de estados da dungeon
Criar enums ou estruturas equivalentes para os estados mínimos da dungeon.

Estados esperados:
- `DUNGEON_STATE_LOCKED`
- `DUNGEON_STATE_AVAILABLE`
- `DUNGEON_STATE_ACTIVE`
- `DUNGEON_STATE_COMPLETED`
- `DUNGEON_STATE_FAILED`
- `DUNGEON_STATE_ABORTED`
- `DUNGEON_STATE_EXPIRED`

Enum esperado:
- `DungeonState`

### 3. Criar enum de tipos de objetivo interno
Cada dungeon deve poder ter um ou mais objetivos internos.

Tipos mínimos esperados:
- `DUNGEON_OBJECTIVE_KILL_ALL`
- `DUNGEON_OBJECTIVE_KILL_TARGET`
- `DUNGEON_OBJECTIVE_KILL_BOSS`
- `DUNGEON_OBJECTIVE_COLLECT_KEY_ITEM`
- `DUNGEON_OBJECTIVE_ACTIVATE_OBJECT`
- `DUNGEON_OBJECTIVE_REACH_ROOM`
- `DUNGEON_OBJECTIVE_SURVIVE_TIME`
- `DUNGEON_OBJECTIVE_TRIGGER_FLAG`

Enum esperado:
- `DungeonObjectiveType`

### 4. Criar definição global de dungeon
Cada dungeon deve possuir definição centralizada.

Campos esperados:
- `dungeon_id`
- `name`
- `description`
- `entry_area_id`
- `entry_room_id`
- `entry_npc_id` opcional
- `required_level`
- `required_quests_completed`
- `required_flags`
- `required_items`
- `is_repeatable`
- `reset_rule`
- `time_limit_seconds` opcional
- `floor_list`
- `completion_rewards`
- `failure_rules`
- `dungeon_tags`

Funções esperadas:
- `dungeon_build_catalog()`
- `dungeon_get_definition(dungeon_id)`

### 5. Criar definição de andares/etapas da dungeon
Cada dungeon deve poder possuir múltiplas etapas.

Campos esperados por etapa:
- `floor_id`
- `dungeon_id`
- `room_id`
- `display_name`
- `objective_list`
- `boss_profile_id` opcional
- `entry_position`
- `exit_rule`
- `floor_flags`
- `next_floor_id`

Funções esperadas:
- `dungeon_get_floor(dungeon_id, floor_id)`
- `dungeon_get_first_floor(dungeon_id)`

### 6. Criar instância ativa de dungeon
Quando o jogador entrar, deve ser criada uma instância lógica da dungeon.

Campos esperados:
- `instance_id`
- `dungeon_id`
- `state`
- `current_floor_id`
- `entered_at`
- `remaining_time`
- `objective_progress`
- `runtime_flags`
- `spawned_boss_ids`
- `is_completed`
- `is_failed`

Funções esperadas:
- `dungeon_instance_create(dungeon_id)`
- `dungeon_get_active_instance()`
- `dungeon_clear_active_instance()`

### 7. Implementar validação de entrada
O sistema deve validar:
- dungeon existe
- dungeon está disponível
- nível mínimo
- quests exigidas
- flags exigidas
- item de entrada, quando aplicável
- NPC/portal correto, quando aplicável
- se já existe instância ativa incompatível

Funções esperadas:
- `dungeon_can_enter(dungeon_id, source_context)`
- `dungeon_get_entry_block_reason(dungeon_id, source_context)`

### 8. Implementar entrada na dungeon
Ao entrar:
- criar instância ativa
- setar estado `ACTIVE`
- posicionar player no primeiro andar/sala
- iniciar timer, se existir
- marcar flags/runtime necessários
- integrar com mapa/save quando necessário

Funções esperadas:
- `dungeon_enter(dungeon_id, source_context)`
- `dungeon_move_player_to_floor(instance_id, floor_id)`

### 9. Implementar progresso por objetivos internos
A dungeon deve atualizar progresso com base em eventos do jogo.

Eventos mínimos:
- matar inimigo
- matar boss
- obter item-chave
- ativar objeto
- entrar em sala específica
- sobreviver X tempo
- trigger de flag

Funções esperadas:
- `dungeon_handle_enemy_killed(enemy_id, killer_id)`
- `dungeon_handle_boss_killed(boss_id, killer_id)`
- `dungeon_handle_item_obtained(item_id, amount)`
- `dungeon_handle_object_activated(object_id)`
- `dungeon_handle_room_entered(room_id)`
- `dungeon_handle_flag_triggered(flag_id)`

### 10. Implementar atualização de objetivos de andar
A cada evento:
- localizar a instância ativa
- atualizar objetivo correspondente do andar atual
- marcar objetivo como concluído quando atingir o necessário
- verificar se o andar foi concluído

Funções esperadas:
- `dungeon_update_objectives_by_event(event_type, payload)`
- `dungeon_check_floor_completion(instance_id, floor_id)`
- `dungeon_is_floor_completed(instance_id, floor_id)`

### 11. Implementar progressão entre andares
Quando o andar atual for concluído:
- permitir transição ao próximo andar quando existir
- executar regra de saída do andar
- mover o player para a próxima sala/andar
- atualizar `current_floor_id`

Funções esperadas:
- `dungeon_can_advance_floor(instance_id)`
- `dungeon_advance_to_next_floor(instance_id)`

### 12. Implementar boss de dungeon
O sistema deve suportar bosses internos da dungeon.

Regras:
- boss vinculado ao andar atual
- boss pode ser objetivo obrigatório
- boss deve integrar com o sistema já existente de bosses
- ao morrer, deve atualizar o progresso da dungeon

Funções esperadas:
- `dungeon_spawn_floor_boss(instance_id, floor_id)`
- `dungeon_handle_floor_boss_death(instance_id, boss_id)`

### 13. Implementar temporizador opcional
Dungeons podem possuir limite de tempo.

Regras:
- timer configurável por dungeon
- ao expirar, a dungeon falha ou aplica regra de expiração
- timer deve ser integrado à instância ativa
- deve ficar pronto para HUD futura

Funções esperadas:
- `dungeon_update_timer(instance_id, delta_time)`
- `dungeon_handle_time_expired(instance_id)`

### 14. Implementar regras de falha
A dungeon pode falhar por:
- tempo esgotado
- morte do player, se a regra da dungeon exigir
- abandono manual
- flag de falha interna
- boss resetado, se a dungeon exigir

Enum esperado:
- `DungeonFailureReason`

Funções esperadas:
- `dungeon_fail(instance_id, failure_reason)`
- `dungeon_abort(instance_id)`
- `dungeon_should_fail_on_player_death(instance_id)`

### 15. Implementar conclusão da dungeon
Quando todos os andares/objetivos forem concluídos:
- marcar instância como `COMPLETED`
- conceder recompensas
- setar flags
- atualizar quests relacionadas
- registrar clear da dungeon
- permitir saída segura

Funções esperadas:
- `dungeon_complete(instance_id)`
- `dungeon_apply_completion_rewards(instance_id)`

### 16. Implementar recompensas de dungeon
A dungeon deve suportar recompensas como:
- XP
- gold
- honra
- itens
- materiais
- drops especiais de clear
- flags de desbloqueio
- progresso de quest

Estrutura esperada:
- `reward_type`
- `reward_target_id`
- `reward_amount`
- `reward_payload`

Funções esperadas:
- `dungeon_apply_rewards(reward_list)`
- `dungeon_apply_single_reward(reward_data)`

### 17. Implementar saída da dungeon
A dungeon deve permitir:
- saída por conclusão
- saída por falha
- saída por abandono
- retorno a room/área segura

Campos esperados:
- `exit_room_id`
- `exit_position`
- `safe_return_area_id` opcional

Funções esperadas:
- `dungeon_exit(instance_id, exit_reason)`
- `dungeon_return_player_to_safe_location(instance_id)`

### 18. Integrar dungeon com quests
Quests devem poder:
- exigir entrar na dungeon
- exigir completar a dungeon
- exigir derrotar boss interno
- exigir coletar item interno
- reagir à conclusão/falha da dungeon

Funções esperadas:
- `quests_handle_dungeon_entered(dungeon_id)`
- `quests_handle_dungeon_completed(dungeon_id)`
- `quests_handle_dungeon_failed(dungeon_id)`

### 19. Integrar dungeon com mapa e navegação
O sistema deve:
- registrar a dungeon no mapa/áreas
- permitir marcador de entrada
- permitir marcador do objetivo principal relacionado
- atualizar progresso quando a dungeon for descoberta ou concluída

Funções esperadas:
- `map_get_marker_for_dungeon(dungeon_id)`
- `map_mark_dungeon_discovered(dungeon_id)`

### 20. Integrar dungeon com save/load
O sistema deve decidir claramente o que persistir.

Persistir ao menos:
- dungeon ativa, se o design permitir retomada
- andar atual
- tempo restante
- objetivos concluídos
- flags internas relevantes

Não persistir lixo efêmero desnecessário.

Funções esperadas:
- `save_serialize_dungeon_state()`
- `save_apply_dungeon_state(data)`

### 21. Preparar dungeons repetíveis e especiais
A arquitetura deve aceitar:
- dungeon repetível
- dungeon one-time
- dungeon desbloqueada por quest
- dungeon de boss
- dungeon de farm de materiais
- dungeon com múltiplos bosses
- dungeon com requisitos de item de entrada

Não precisa implementar todas as variações além da estrutura.

### 22. Retornar resultados estruturados
Entrada, avanço de andar, falha, conclusão e saída devem retornar resultados claros.

Campos esperados:
- `success`
- `dungeon_id`
- `instance_id`
- `previous_state`
- `new_state`
- `current_floor_id`
- `updated_objective_ids`
- `rewards_applied`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de dungeons
- catálogo de andares
- enums de estado
- enums de objetivo
- enums de falha
- regras de repetição/reset
- regras de timer
- regras de entrada e saída
- integração com quests/mapa/save

### Estado
Separar claramente:
- catálogo global de dungeons
- instância ativa de dungeon
- objetivos e progresso internos
- timers de dungeon
- flags internas da instância
- vínculo com rooms e floors
- estado de conclusão/falha

### Funções centrais
Funções esperadas:
- `dungeon_build_catalog()`
- `dungeon_get_definition(dungeon_id)`
- `dungeon_get_floor(dungeon_id, floor_id)`
- `dungeon_get_first_floor(dungeon_id)`
- `dungeon_instance_create(dungeon_id)`
- `dungeon_get_active_instance()`
- `dungeon_clear_active_instance()`
- `dungeon_can_enter(dungeon_id, source_context)`
- `dungeon_get_entry_block_reason(dungeon_id, source_context)`
- `dungeon_enter(dungeon_id, source_context)`
- `dungeon_move_player_to_floor(instance_id, floor_id)`
- `dungeon_handle_enemy_killed(enemy_id, killer_id)`
- `dungeon_handle_boss_killed(boss_id, killer_id)`
- `dungeon_handle_item_obtained(item_id, amount)`
- `dungeon_handle_object_activated(object_id)`
- `dungeon_handle_room_entered(room_id)`
- `dungeon_handle_flag_triggered(flag_id)`
- `dungeon_update_objectives_by_event(event_type, payload)`
- `dungeon_check_floor_completion(instance_id, floor_id)`
- `dungeon_is_floor_completed(instance_id, floor_id)`
- `dungeon_can_advance_floor(instance_id)`
- `dungeon_advance_to_next_floor(instance_id)`
- `dungeon_spawn_floor_boss(instance_id, floor_id)`
- `dungeon_handle_floor_boss_death(instance_id, boss_id)`
- `dungeon_update_timer(instance_id, delta_time)`
- `dungeon_handle_time_expired(instance_id)`
- `dungeon_fail(instance_id, failure_reason)`
- `dungeon_abort(instance_id)`
- `dungeon_should_fail_on_player_death(instance_id)`
- `dungeon_complete(instance_id)`
- `dungeon_apply_completion_rewards(instance_id)`
- `dungeon_apply_rewards(reward_list)`
- `dungeon_apply_single_reward(reward_data)`
- `dungeon_exit(instance_id, exit_reason)`
- `dungeon_return_player_to_safe_location(instance_id)`
- `quests_handle_dungeon_entered(dungeon_id)`
- `quests_handle_dungeon_completed(dungeon_id)`
- `quests_handle_dungeon_failed(dungeon_id)`
- `map_get_marker_for_dungeon(dungeon_id)`
- `map_mark_dungeon_discovered(dungeon_id)`
- `save_serialize_dungeon_state()`
- `save_apply_dungeon_state(data)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir bosses e encontros especiais
- consumir quests e flags
- consumir mapa e marcadores
- consumir save/load global
- consumir rooms/transições atuais do projeto
- preparar integração futura com party e conteúdo mais avançado
- não depender de UI para funcionar

## Critérios de aceite

1. auditar corretamente a estrutura atual de rooms e transições antes de alterar
2. criar catálogo central de dungeons corretamente
3. criar andares/etapas de dungeon corretamente
4. validar entrada corretamente com nível, flags, quest e item quando aplicável
5. criar instância ativa corretamente ao entrar
6. posicionar player corretamente no primeiro andar
7. atualizar objetivos internos corretamente por evento
8. concluir andar corretamente
9. avançar para o próximo andar corretamente
10. integrar boss de dungeon corretamente
11. concluir dungeon corretamente
12. falhar dungeon corretamente por tempo ou regra interna
13. abortar/abandonar dungeon corretamente
14. aplicar recompensas corretamente
15. atualizar quests relacionadas corretamente
16. integrar marcadores do mapa corretamente
17. persistir estado mínimo da dungeon corretamente no save/load
18. permitir estrutura para dungeons repetíveis e especiais sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta da estrutura atual de rooms/transições encontrada no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de dungeon em vários lugares
- não misturar UI com regra de negócio
- não ignorar a estrutura atual de rooms/transições do projeto
- não reescrever o sistema atual do zero sem antes auditar o que já existe
- não implementar multiplayer/party neste prompt
- não implementar UI cinematográfica neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders