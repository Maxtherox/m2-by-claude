# Implementar sistema global de save/load persistente para todo o jogo no GameMaker

## Objetivo

Implementar um sistema global de save/load capaz de persistir com segurança todos os sistemas centrais já construídos no projeto. Este prompt resolve a continuidade do progresso do jogador entre sessões, incluindo personagem, inventário, equipamentos, skills, quests, flags, mapas, inimigos persistentes relevantes e configurações de runtime que não podem se perder ao fechar o jogo.

Este prompt vem depois de:
- `01-sistema-status-base.md`
- `02-sistema-xp-level-up-progressivo.md`
- `03-sistema-atributos-derivados.md`
- `05-sistema-honra.md`
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `09-itens-consumiveis-progressao-skill.md`
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`
- `15-sistema-combate-base.md`
- `16-hotbar-e-atalhos-de-combate.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `19-buffs-debuffs-e-status-effects.md`
- `20-sistema-bosses-e-encontros-especiais.md`
- `21-sistema-de-quests-e-missoes.md`
- `22-interface-de-npcs-e-dialogos.md`

Este prompt vem antes de:
- `24-mapa-areas-marcadores-e-navegacao.md`
- `25-dungeons-e-instancias.md`
- quaisquer prompts de menu principal, seleção de personagem ou múltiplos saves visuais

## Escopo

### Implementar neste prompt
- sistema global de save
- sistema global de load
- serialização centralizada dos dados do jogo
- desserialização centralizada dos dados do jogo
- estrutura versionada de save
- slot de save único inicialmente
- suporte preparado para múltiplos slots no futuro
- persistência do estado do personagem
- persistência do inventário
- persistência dos equipamentos
- persistência das skills e progressão M/G/P
- persistência da honra
- persistência de gold
- persistência da hotbar
- persistência das quests
- persistência das flags internas
- persistência dos itens únicos com bônus/refino
- persistência de páginas desbloqueadas de inventário
- persistência do mapa/sala/posição atual do jogador
- persistência de boss/elite relevantes quando necessário
- persistência de configurações de runtime do jogo necessárias
- sistema de integridade básica do arquivo de save
- load seguro com validação mínima
- reset/new game
- arquitetura pronta para autosave futuro

### Não implementar neste prompt
- interface visual final de menu de saves
- múltiplos personagens completos
- cloud save
- criptografia pesada
- sistema online
- sincronização entre dispositivos
- replay system
- save-state instantâneo de debug
- persistência completa de todos os monstros comuns do mapa
- persistência de partículas, efeitos visuais ou timers efêmeros irrelevantes
- editor de save
- menu de opções completo
- seleção visual de slot
- backup em nuvem
- persistência de UI aberta/fechada irrelevante

## Dependências e contexto

Este prompt depende de:
- todos os sistemas centrais já implementados
- structs de item instanciado
- inventário e equipamento
- quests e flags
- skills e progressão
- hotbar
- posição e estado principal do player
- sistemas de bosses/elites quando relevantes

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- dados básicos do personagem
- atributos base e derivados
- HP/MP atuais
- XP, level, status points
- honra
- skill points
- estado das skills
- progressão avançada das skills
- inventário com instâncias de item
- equipamentos atuais
- gold
- páginas desbloqueadas do inventário
- bônus de itens e refino
- quests ativas/concluídas
- flags internas de diálogo/quest
- hotbar
- mapa/sala/room atual do jogador
- posição atual do jogador
- estado de boss/elite persistente quando relevante
- catálogos globais orientados a dados

### Dados que este prompt deve criar
- estrutura mestre de save
- enum de seções de save
- versão do save
- serializer central
- loader central
- normalizador/validador de dados carregados
- camada de compatibilidade futura de versão
- caminho/nome do arquivo de save
- funções de snapshot do estado atual
- funções de restauração do estado atual

## Requisitos funcionais

### 1. Criar estrutura mestre versionada de save
Criar uma estrutura central de save com versão explícita.

Campos esperados:
- `save_version`
- `created_at`
- `updated_at`
- `profile_name` opcional
- `player_data`
- `inventory_data`
- `equipment_data`
- `skills_data`
- `hotbar_data`
- `quest_data`
- `flags_data`
- `world_data`
- `boss_data`
- `system_data`

Funções esperadas:
- `save_build_root_snapshot()`
- `save_get_current_version()`

### 2. Criar enum ou catálogo das seções de save
Separar claramente os blocos do save para evitar estrutura caótica.

Seções mínimas esperadas:
- `SAVE_SECTION_PLAYER`
- `SAVE_SECTION_INVENTORY`
- `SAVE_SECTION_EQUIPMENT`
- `SAVE_SECTION_SKILLS`
- `SAVE_SECTION_HOTBAR`
- `SAVE_SECTION_QUESTS`
- `SAVE_SECTION_FLAGS`
- `SAVE_SECTION_WORLD`
- `SAVE_SECTION_BOSSES`
- `SAVE_SECTION_SYSTEM`

Enum esperado:
- `SaveSectionType`

### 3. Implementar serialização do estado básico do personagem
Persistir ao menos:
- level
- exp_current
- exp_to_next
- status_points
- skill_points
- hp_current
- mp_current
- for_base
- int_base
- dex_base
- def_base
- vit_base
- honra
- gold
- bônus automáticos de progressão por level
- room atual
- posição atual
- direção/estado mínimo se relevante

Funções esperadas:
- `save_serialize_player_state()`
- `save_apply_player_state(data)`

### 4. Implementar serialização de inventário
Persistir:
- páginas do inventário
- páginas desbloqueadas
- slots ocupados
- quantidade
- referência de instância
- item_id
- dados únicos de cada instância
- stacks
- posição do item no inventário

Funções esperadas:
- `save_serialize_inventory()`
- `save_apply_inventory(data)`

### 5. Implementar serialização de equipamentos
Persistir:
- item equipado por slot
- instância única do item
- slot correspondente
- estado do item equipado

Funções esperadas:
- `save_serialize_equipment()`
- `save_apply_equipment(data)`

### 6. Implementar serialização de instâncias de item
Isso é obrigatório.

Cada item instanciado deve persistir corretamente:
- `instance_id`
- `item_id`
- `quantity`
- `refine_level`
- `extra_bonuses_1_to_5`
- `extra_bonuses_6_to_7`
- bônus especiais nativos quando aplicável
- flags internas da instância
- estado relevante para stack, binding e vínculo futuro

Funções esperadas:
- `save_serialize_item_instance(item_instance)`
- `save_deserialize_item_instance(data)`

### 7. Implementar serialização das skills e progressão avançada
Persistir corretamente:
- skill desbloqueada ou não
- base_level
- progress_stage
- master_stage_level
- grand_stage_level
- perfect_stage_level ou equivalente
- cooldowns persistíveis apenas se fizer sentido
- skill points do personagem

Funções esperadas:
- `save_serialize_skills()`
- `save_apply_skills(data)`

### 8. Implementar serialização da hotbar
Persistir:
- slots da hotbar
- bindings
- skill atribuída
- item atribuído
- ordem e estado dos slots

Funções esperadas:
- `save_serialize_hotbar()`
- `save_apply_hotbar(data)`

### 9. Implementar serialização das quests
Persistir:
- quests aceitas
- quests ativas
- quests concluídas
- quests prontas para entrega
- progresso de objetivos
- histórico de repetíveis quando necessário
- timestamps de runtime relevantes se usados

Funções esperadas:
- `save_serialize_quests()`
- `save_apply_quests(data)`

### 10. Implementar serialização das flags internas
Persistir:
- flags de quest
- flags de diálogo
- flags de tutorial
- flags de desbloqueio
- flags de serviços/NPC
- flags do mundo relevantes

Funções esperadas:
- `save_serialize_flags()`
- `save_apply_flags(data)`

### 11. Implementar serialização do mundo
Persistir o mínimo necessário do mundo para retomada segura.

Persistir:
- room/mapa atual
- posição do player
- checkpoints ou área visitada relevante
- portas/desbloqueios relevantes se existirem
- estado simples de objetos persistentes importantes

Não persistir tudo do mapa cegamente.

Funções esperadas:
- `save_serialize_world_state()`
- `save_apply_world_state(data)`

### 12. Implementar serialização de bosses/elites relevantes
Persistir apenas o que for realmente importante para continuidade do jogo.

Exemplos:
- boss derrotado permanentemente
- elite única derrotada
- encontro especial resetável com flag específica
- world boss se o design exigir

Não persistir todo monstro comum do mapa.

Funções esperadas:
- `save_serialize_boss_state()`
- `save_apply_boss_state(data)`

### 13. Criar função central de snapshot do jogo
Criar uma função única que monte o save completo.

Função esperada:
- `save_build_game_snapshot()`

Responsabilidades:
- chamar serializers de cada módulo
- montar a estrutura versionada
- validar minimamente o snapshot antes de gravar

### 14. Criar função central de gravação em arquivo
Criar a função que grava o save em disco.

Funções esperadas:
- `save_write_to_disk()`
- `save_get_file_path()`

Requisitos:
- usar formato consistente
- idealmente JSON ou estrutura serializável clara
- manter legibilidade/manutenção
- preparar migração de versão futura

### 15. Criar função central de carregamento
Criar uma função única de load.

Funções esperadas:
- `save_load_from_disk()`
- `save_apply_game_snapshot(data)`

Responsabilidades:
- ler arquivo
- validar existência
- validar versão
- validar blocos mínimos
- aplicar dados na ordem correta

### 16. Implementar ordem correta de restauração
A restauração deve respeitar dependências.

Ordem mínima recomendada:
1. dados básicos do player
2. inventário
3. equipamentos
4. skills
5. quests
6. flags
7. hotbar
8. mundo/posição
9. bosses/elites relevantes
10. recálculo final dos atributos

Função esperada:
- `save_restore_in_dependency_order(snapshot)`

### 17. Implementar validação mínima do save
O sistema deve validar:
- arquivo existe
- formato é válido
- versão é suportada
- campos mínimos existem
- dados críticos não estão corrompidos

Funções esperadas:
- `save_validate_snapshot(snapshot)`
- `save_is_version_supported(version)`

### 18. Implementar fallback seguro para dados ausentes
Se um bloco opcional estiver ausente ou vier de versão anterior:
- usar valores padrão
- não quebrar o load inteiro
- registrar fallback internamente se necessário

Funções esperadas:
- `save_apply_defaults_for_missing_fields(snapshot)`
- `save_normalize_snapshot(snapshot)`

### 19. Implementar new game/reset
Criar fluxo para iniciar um novo jogo sem depender de save anterior.

Funções esperadas:
- `save_create_new_game_state()`
- `save_delete_existing_save()` opcional
- `save_reset_runtime_and_start_new_game()`

### 20. Preparar autosave futuro
A arquitetura deve ficar pronta para:
- autosave ao trocar de sala
- autosave ao completar quest
- autosave ao derrotar boss
- autosave manual

Não precisa implementar autosave completo agora, mas a estrutura deve aceitar isso sem retrabalho.

Campos/funções esperadas:
- `save_mark_dirty(section_type)`
- `save_has_pending_changes()`

### 21. Implementar integridade básica do save
Sem criptografia complexa, mas com proteção mínima contra corrupção simples.

Pode incluir:
- timestamp
- versão
- hash leve/checksum simples opcional
- marca de arquivo válido

Funções esperadas:
- `save_compute_integrity_token(snapshot)` opcional
- `save_verify_integrity(snapshot)` opcional

### 22. Separar dados persistentes de dados efêmeros
O sistema deve deixar claro o que salva e o que não salva.

Não salvar:
- partículas
- timers visuais irrelevantes
- mensagens da HUD
- hitboxes temporárias
- cooldowns puramente efêmeros se não fizerem sentido
- monstros comuns vivos no frame atual, salvo regra especial

Isso deve estar explícito na arquitetura.

### 23. Retornar resultados estruturados
Salvar e carregar devem retornar resultado claro.

Campos esperados:
- `success`
- `action_type`
- `save_version`
- `file_path`
- `sections_processed`
- `failure_reason`

Funções esperadas:
- `save_build_result(...)`

## Arquitetura esperada

### Configuração
Criar local central para:
- versão atual do save
- caminho/arquivo do save
- seções persistidas
- flags de integridade
- ordem de restauração
- chaves padrão
- defaults de new game

### Estado
Separar claramente:
- snapshot em memória
- estado atual do runtime
- flags de save sujo/pending changes
- metadata do último save/load
- cache de serializers por módulo, se fizer sentido

### Funções centrais
Funções esperadas:
- `save_get_current_version()`
- `save_get_file_path()`
- `save_build_root_snapshot()`
- `save_build_game_snapshot()`
- `save_write_to_disk()`
- `save_load_from_disk()`
- `save_validate_snapshot(snapshot)`
- `save_is_version_supported(version)`
- `save_apply_defaults_for_missing_fields(snapshot)`
- `save_normalize_snapshot(snapshot)`
- `save_apply_game_snapshot(data)`
- `save_restore_in_dependency_order(snapshot)`
- `save_create_new_game_state()`
- `save_reset_runtime_and_start_new_game()`
- `save_mark_dirty(section_type)`
- `save_has_pending_changes()`
- `save_build_result(...)`
- `save_serialize_player_state()`
- `save_apply_player_state(data)`
- `save_serialize_inventory()`
- `save_apply_inventory(data)`
- `save_serialize_equipment()`
- `save_apply_equipment(data)`
- `save_serialize_item_instance(item_instance)`
- `save_deserialize_item_instance(data)`
- `save_serialize_skills()`
- `save_apply_skills(data)`
- `save_serialize_hotbar()`
- `save_apply_hotbar(data)`
- `save_serialize_quests()`
- `save_apply_quests(data)`
- `save_serialize_flags()`
- `save_apply_flags(data)`
- `save_serialize_world_state()`
- `save_apply_world_state(data)`
- `save_serialize_boss_state()`
- `save_apply_boss_state(data)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir todos os módulos já implementados
- restaurar o personagem e o mundo com ordem correta
- preservar integridade de itens instanciados, bônus e refino
- preservar progresso de skills, quests, hotbar e flags
- preparar integração futura com menu principal, múltiplos slots e autosave
- não depender de UI para funcionar

## Critérios de aceite

1. criar estrutura versionada de save corretamente
2. salvar dados básicos do personagem corretamente
3. salvar inventário e stacks corretamente
4. salvar equipamentos corretamente
5. salvar instâncias únicas de item com bônus e refino corretamente
6. salvar skills e progressão M/G/P corretamente
7. salvar hotbar corretamente
8. salvar quests e progresso de objetivos corretamente
9. salvar flags internas corretamente
10. salvar room/mapa e posição do player corretamente
11. salvar estado relevante de bosses/elites corretamente
12. carregar todos esses dados corretamente
13. restaurar os módulos na ordem correta
14. recalcular os atributos corretamente após o load
15. iniciar novo jogo corretamente sem save anterior
16. lidar com ausência de arquivo de save sem quebrar o jogo
17. lidar com campo ausente de versão anterior usando fallback seguro
18. não salvar dados efêmeros irrelevantes
19. manter arquitetura pronta para múltiplos slots e autosave sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de save/load em vários lugares
- não misturar UI com regra de negócio
- não reserializar dados de forma caótica sem versão explícita
- não criar dependência circular entre módulos no load
- não implementar menu visual de saves neste prompt
- não implementar cloud save neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders