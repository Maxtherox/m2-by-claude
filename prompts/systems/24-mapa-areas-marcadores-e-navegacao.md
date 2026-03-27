# Implementar sistema de mapa do mundo, áreas, marcadores de objetivos e navegação no GameMaker

## Objetivo

Implementar o sistema central de mapa e navegação do jogo, conectando salas, áreas nomeadas, progresso de descoberta, marcadores de objetivo e rastreamento de destino. Este prompt resolve a organização espacial do mundo e a orientação do jogador, integrando quests, NPCs, bosses e pontos relevantes sem depender de uma minimapa completa ou de pathfinding avançado.

Este prompt vem depois de:
- `21-sistema-de-quests-e-missoes.md`
- `22-interface-de-npcs-e-dialogos.md`
- `23-save-load-global.md`

Este prompt vem antes de:
- `25-dungeons-e-instancias.md`
- prompt de minimapa avançada, se você quiser separar depois
- prompt de fast travel/teleporte, se você quiser separar depois

## Escopo

### Implementar neste prompt
- sistema central de áreas e salas
- registro de rooms/salas do jogo no mapa
- agrupamento de salas por área/região
- descoberta de áreas
- descoberta de salas
- persistência do progresso de descoberta
- metadados de mapa por sala
- metadados de mapa por área
- marcador de objetivo ativo
- marcadores de quest
- marcadores de NPC relevante
- marcadores de boss/encontro especial
- marcador de entrada/saída importante
- rastreamento de objetivo ativo
- navegação básica por direção/indicador
- cálculo simples de destino por sala/área
- integração com quests
- integração com NPCs
- integração com bosses
- interface base de mapa do mundo
- arquitetura pronta para minimapa e fast travel futuros

### Não implementar neste prompt
- minimapa completa em tempo real
- pathfinding avançado
- navegação automática
- fast travel completo
- dungeon completa
- geração procedural de mapa
- editor visual de mapa
- sistema online de compartilhamento de marcador
- GPS detalhado com rota passo a passo
- fog of war avançada por tile
- câmera do jogo
- world streaming
- menu completo de atlas com lore detalhada
- pointer 3D/cinemático
- IA de navegação
- reescrita do sistema de rooms do projeto

## Dependências e contexto

Este prompt depende de:
- sistema de quests
- sistema de NPCs e diálogos
- sistema de bosses e encontros especiais
- save/load global
- estrutura atual de rooms/salas do projeto

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- rooms/salas já existentes no projeto
- player com room atual e posição atual
- quests com objetivos e estados
- NPCs com `npc_id`
- bosses/elites com `boss_profile_id` ou identificador equivalente
- save/load global
- flags internas
- sistema de interação com NPC
- sistema de objetivos/quest pronta para entrega

### Dados que este prompt deve criar
- catálogo de áreas
- catálogo de salas mapeáveis
- metadados de sala
- metadados de área
- estado de descoberta do mapa
- marcador ativo
- catálogo de tipos de marcador
- resolvedor de marcador contextual
- controlador de mapa
- interface base do mapa
- indicador de navegação para objetivo ativo
- integração entre mapa e quests/NPCs/bosses

## Requisitos funcionais

### 1. Auditar a estrutura atual de rooms/áreas antes de implementar mudanças
Antes de implementar qualquer alteração, você deve analisar como o projeto organiza hoje:
- rooms
- transições entre rooms
- nome de salas
- áreas já existentes ou implícitas
- checkpoints/entradas
- fluxo de navegação do player

Você deve identificar:
- o que já existe e pode ser aproveitado
- o que está hardcoded e precisa ser centralizado
- como registrar as salas atuais no novo sistema sem quebrar o jogo

Você não deve substituir a estrutura atual de rooms do projeto por outra genérica sem antes adaptá-la.

### 2. Criar enum de tipos de marcador
Criar enums ou estruturas equivalentes para os tipos de marcador do mapa.

Tipos mínimos esperados:
- `MAP_MARKER_QUEST_ACTIVE`
- `MAP_MARKER_QUEST_TURN_IN`
- `MAP_MARKER_NPC`
- `MAP_MARKER_BLACKSMITH`
- `MAP_MARKER_BOSS`
- `MAP_MARKER_ELITE`
- `MAP_MARKER_EXIT`
- `MAP_MARKER_CHECKPOINT`
- `MAP_MARKER_CUSTOM`

Enum esperado:
- `MapMarkerType`

### 3. Criar catálogo de áreas
Cada área do jogo deve ter definição centralizada.

Campos esperados:
- `area_id`
- `name`
- `display_name`
- `description`
- `area_type`
- `area_level_range` opcional
- `room_ids`
- `default_marker_style`
- `flags`

Funções esperadas:
- `map_build_area_catalog()`
- `map_get_area(area_id)`

### 4. Criar catálogo de salas mapeáveis
Cada room/sala relevante deve possuir metadados centralizados.

Campos esperados:
- `room_id`
- `area_id`
- `display_name`
- `map_grid_x`
- `map_grid_y`
- `room_type`
- `connections`
- `entry_points`
- `marker_defaults`
- `is_discoverable`
- `flags`

Funções esperadas:
- `map_build_room_catalog()`
- `map_get_room_data(room_id)`

### 5. Criar estrutura de descoberta do mapa
O jogador deve ter progresso persistente de descoberta.

Campos esperados:
- `discovered_areas`
- `discovered_rooms`
- `current_area_id`
- `current_room_id`

Funções esperadas:
- `map_init_discovery_state()`
- `map_mark_room_discovered(room_id)`
- `map_mark_area_discovered(area_id)`
- `map_is_room_discovered(room_id)`
- `map_is_area_discovered(area_id)`

### 6. Integrar descoberta com movimentação entre salas
Ao entrar em uma sala:
- a sala deve ser registrada como descoberta
- a área correspondente deve ser descoberta quando necessário
- o estado atual do mapa deve ser atualizado
- o save deve ser marcado como alterado

Funções esperadas:
- `map_on_player_enter_room(room_id)`
- `map_update_current_location(room_id)`

### 7. Criar estrutura central de marcadores
Cada marcador do mapa deve ser uma entidade de dados clara.

Campos esperados:
- `marker_id`
- `marker_type`
- `area_id`
- `room_id`
- `world_x` opcional
- `world_y` opcional
- `target_id`
- `display_name`
- `is_active`
- `is_hidden`
- `priority`
- `conditions`
- `source_type`

Funções esperadas:
- `map_marker_create(...)`
- `map_marker_register(marker_data)`
- `map_marker_remove(marker_id)`
- `map_marker_set_active(marker_id, value)`

### 8. Criar resolvedor contextual de marcadores
O sistema deve conseguir decidir quais marcadores devem existir ou aparecer com base no estado atual do jogo.

Exemplos:
- quest aceita cria marcador de objetivo
- quest pronta para entrega cria marcador no NPC de entrega
- boss ativo cria marcador na área correspondente
- ferreiro sempre pode existir como marcador de serviço
- NPC só aparece se a área já foi descoberta ou se a regra permitir

Funções esperadas:
- `map_markers_refresh_all()`
- `map_markers_resolve_from_quests()`
- `map_markers_resolve_from_npcs()`
- `map_markers_resolve_from_bosses()`

### 9. Implementar marcador de objetivo ativo
O jogador deve poder ter um objetivo ativo rastreável.

Regras:
- apenas um objetivo principal ativo por vez no sistema básico
- o objetivo pode vir de quest ou marcador customizado
- o sistema deve saber em qual área/sala ele está
- a HUD/navegação deve consumir esse objetivo

Campos esperados:
- `tracked_marker_id`
- `tracked_quest_id` opcional

Funções esperadas:
- `map_set_tracked_marker(marker_id)`
- `map_clear_tracked_marker()`
- `map_get_tracked_marker()`

### 10. Implementar rastreamento por quests
O sistema deve conectar quests ao mapa.

Casos mínimos:
- quest de matar alvo em área específica
- quest de falar com NPC
- quest pronta para entrega
- quest de boss
- quest de visita de área

Funções esperadas:
- `map_get_marker_for_quest(quest_id)`
- `map_track_quest(quest_id)`
- `map_untrack_quest(quest_id)`

### 11. Implementar rastreamento por NPCs e serviços
O sistema deve suportar marcador para:
- NPC de quest
- ferreiro
- NPC relevante de tutorial
- loja futura

Funções esperadas:
- `map_get_marker_for_npc(npc_id)`
- `map_get_service_markers(service_type)`

### 12. Implementar rastreamento por boss/encontro especial
O sistema deve suportar marcador contextual para:
- boss ativo
- elite relevante
- entrada de arena
- encontro especial disponível

Funções esperadas:
- `map_get_marker_for_boss(boss_id)`
- `map_get_marker_for_encounter(encounter_id)`

### 13. Criar indicador de navegação básica
Sem implementar pathfinding complexo, o sistema deve fornecer navegação simples para o objetivo rastreado.

O indicador deve suportar:
- direção aproximada para o alvo
- diferença de sala/área
- estado “objetivo nesta sala”
- estado “objetivo em outra área”

Funções esperadas:
- `map_get_navigation_hint_to_marker(marker_id)`
- `map_is_marker_in_current_room(marker_id)`
- `map_is_marker_in_current_area(marker_id)`

### 14. Criar interface base do mapa
A interface de mapa deve permitir ao jogador:
- abrir/fechar o mapa
- ver áreas descobertas
- ver salas descobertas
- ver posição atual
- ver marcadores relevantes
- selecionar/rastrear marcador quando permitido

A interface deve ser base funcional, não apenas mock.

### 15. Aplicar identidade visual coerente com o projeto
A interface do mapa deve seguir a direção visual do projeto.

Direção visual obrigatória:
- aparência sóbria
- medieval/fantasia sombria
- elegante
- com boa legibilidade
- sem aparência mobile genérica
- sem visual sci-fi
- com molduras discretas e hierarquia visual forte

### 16. Separar UI de regra de negócio
A interface deve:
- exibir áreas, salas e marcadores
- permitir rastrear um objetivo
- refletir descoberta e contexto atual

A interface não deve:
- decidir objetivos de quest
- decidir lógica de descoberta
- decidir regras de spawn de marcadores
- conter lógica espalhada de progressão

### 17. Integrar com save/load
O sistema deve persistir:
- áreas descobertas
- salas descobertas
- marcador rastreado atual, quando fizer sentido
- estado mínimo de mapa do jogador

Funções esperadas:
- `save_serialize_map_state()`
- `save_apply_map_state(data)`

### 18. Preparar suporte para minimapa futura
A arquitetura deve nascer pronta para:
- minimapa em gameplay
- fog of war local
- ícones em tempo real
- player arrow em miniatura

Não implementar minimapa agora, apenas preparar a estrutura.

### 19. Preparar suporte para fast travel futuro
A arquitetura deve aceitar no futuro:
- checkpoints
- portais
- teleporte entre áreas
- warp por NPC/item

Não implementar fast travel agora, apenas preparar a estrutura.

### 20. Retornar resultados estruturados
Abertura de mapa, descoberta de sala, rastreamento de objetivo e resolução de marcador devem retornar resultados claros.

Campos esperados:
- `success`
- `action_type`
- `area_id`
- `room_id`
- `marker_id`
- `tracked_changed`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de áreas
- catálogo de salas
- tipos de marcador
- estilos visuais de marcador
- layout da interface do mapa
- regras de rastreamento
- regras de descoberta
- integração com quests/NPCs/bosses

### Estado
Separar claramente:
- áreas descobertas
- salas descobertas
- localização atual
- marcadores registrados
- marcador rastreado atual
- estado da UI do mapa
- cache de resolução de marcadores, se necessário

### Funções centrais
Funções esperadas:
- `map_build_area_catalog()`
- `map_get_area(area_id)`
- `map_build_room_catalog()`
- `map_get_room_data(room_id)`
- `map_init_discovery_state()`
- `map_mark_room_discovered(room_id)`
- `map_mark_area_discovered(area_id)`
- `map_is_room_discovered(room_id)`
- `map_is_area_discovered(area_id)`
- `map_on_player_enter_room(room_id)`
- `map_update_current_location(room_id)`
- `map_marker_create(...)`
- `map_marker_register(marker_data)`
- `map_marker_remove(marker_id)`
- `map_marker_set_active(marker_id, value)`
- `map_markers_refresh_all()`
- `map_markers_resolve_from_quests()`
- `map_markers_resolve_from_npcs()`
- `map_markers_resolve_from_bosses()`
- `map_set_tracked_marker(marker_id)`
- `map_clear_tracked_marker()`
- `map_get_tracked_marker()`
- `map_get_marker_for_quest(quest_id)`
- `map_track_quest(quest_id)`
- `map_untrack_quest(quest_id)`
- `map_get_marker_for_npc(npc_id)`
- `map_get_service_markers(service_type)`
- `map_get_marker_for_boss(boss_id)`
- `map_get_marker_for_encounter(encounter_id)`
- `map_get_navigation_hint_to_marker(marker_id)`
- `map_is_marker_in_current_room(marker_id)`
- `map_is_marker_in_current_area(marker_id)`
- `save_serialize_map_state()`
- `save_apply_map_state(data)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir estrutura atual de rooms do projeto
- consumir quests para objetivos e entrega
- consumir NPCs para serviços e diálogos
- consumir bosses e encontros especiais
- integrar com HUD e navegação simples quando necessário
- integrar com save/load
- preparar integração futura com minimapa e fast travel
- não depender de pathfinding para funcionar

## Critérios de aceite

1. auditar corretamente a estrutura atual de rooms antes de alterar
2. registrar áreas e salas em catálogo central corretamente
3. marcar sala como descoberta ao entrar nela
4. marcar área como descoberta corretamente
5. persistir descoberta do mapa corretamente
6. registrar e resolver marcadores de quest corretamente
7. registrar e resolver marcadores de NPC corretamente
8. registrar e resolver marcadores de boss corretamente
9. permitir rastrear um marcador ativo corretamente
10. atualizar o objetivo rastreado corretamente ao mudar contexto
11. indicar corretamente se o objetivo está na sala atual, em outra sala ou em outra área
12. abrir e fechar a interface de mapa corretamente
13. exibir áreas e salas descobertas corretamente
14. exibir posição atual do jogador corretamente
15. manter separação entre UI e regra de negócio
16. seguir a identidade visual do projeto
17. manter arquitetura pronta para minimapa e fast travel sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta da estrutura atual de rooms/áreas encontrada no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de mapa e navegação em vários lugares
- não misturar UI com regra de negócio
- não ignorar a estrutura atual de rooms do projeto
- não reescrever o sistema atual de salas do zero sem antes auditar o que já existe
- não implementar minimapa completa neste prompt
- não implementar fast travel completo neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders