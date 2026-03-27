# Implementar sistema de bosses, elites e encontros especiais no GameMaker

## Objetivo

Implementar a base completa de bosses e elites do jogo, separando esse tipo de encontro da IA comum dos monstros. Este prompt resolve fases, padrões especiais, arena de combate, regras de recompensa, HUD de boss e spawn controlado de encontros relevantes, sem reescrever o combate, a IA comum ou o sistema de drops já existentes.

Este prompt vem depois de:
- `15-sistema-combate-base.md`
- `17-hud-completa-de-combate.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `19-buffs-debuffs-e-status-effects.md`

Este prompt vem antes de:
- prompt de quests e missões
- prompt de mapas/zonas especiais
- prompt de dungeons/instâncias
- prompt de save/load global

## Escopo

### Implementar neste prompt
- sistema base de bosses
- sistema base de elites
- separação entre inimigo comum, elite e boss
- perfis de encontro especiais
- múltiplas fases de boss
- troca de comportamento por fase
- skills especiais de boss
- buffs e debuffs aplicados por bosses
- arena/leash específico de boss
- HUD específica de boss
- regras especiais de morte e recompensa
- spawn controlado de boss e elite
- respawn configurável de boss e elite
- integração com combate, drops, XP e status effects
- estrutura para encontros especiais como “mini-boss” e “world boss”

### Não implementar neste prompt
- dungeon completa
- cutscenes
- narrativa de quest
- diálogos complexos
- puzzle de mapa
- matchmaking
- multiplayer
- PvP
- raid
- sistema procedural de fases
- animações complexas finais
- partículas complexas
- sons
- cinematics
- save/load completo
- sistema de ranking global
- evento global de servidor
- instância online

## Dependências e contexto

Este prompt depende de:
- `15-sistema-combate-base.md`
- `17-hud-completa-de-combate.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `19-buffs-debuffs-e-status-effects.md`
- sistema de drops e materiais
- sistema de inventário e recompensas

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- sistema central de combate
- sistema de IA comum dos inimigos
- sistema de dano
- sistema de morte
- sistema de drops
- sistema de XP
- sistema de status effects
- HUD pronta para alvo atual e preparada para boss HUD
- sistema de spawn/respawn de inimigos
- player controlável
- entidades com HP, MP, atributos e estados de combate

### Dados que este prompt deve criar
- enum de tipos de encontro
- enum de fases do boss
- perfil de boss/elite
- tabela de habilidades especiais de boss
- regras de transição de fase
- arena profile
- boss HUD data
- timers de comportamento especial
- spawn profile de boss/elite
- resultado estruturado de transição de fase e morte de boss

## Requisitos funcionais

### 1. Criar enum de tipos de encontro
Criar enums ou estruturas equivalentes para separar claramente os tipos de encontro.

Tipos mínimos esperados:
- `ENCOUNTER_COMMON`
- `ENCOUNTER_ELITE`
- `ENCOUNTER_BOSS`
- `ENCOUNTER_WORLD_BOSS`
- `ENCOUNTER_MINI_BOSS`

Enums esperados:
- `EncounterType`
- `BossPhaseState`
- `BossBehaviorMode`

### 2. Criar perfil base de elite e boss
Cada elite ou boss deve possuir um perfil próprio, separado da IA comum.

Campos esperados:
- `encounter_type`
- `boss_profile_id`
- `display_name`
- `max_hp`
- `max_mp`
- `level`
- `phase_count`
- `arena_profile_id`
- `loot_profile_id`
- `respawn_profile_id`
- `special_skill_ids`
- `boss_flags`
- `hud_profile_id`

Funções esperadas:
- `boss_build_profile_catalog()`
- `boss_get_profile(profile_id)`

### 3. Criar sistema de fases
Bosses devem poder possuir múltiplas fases.

Regras:
- cada fase deve ter gatilho claro
- o gatilho pode ser por percentual de HP, tempo, evento interno ou combinação
- cada fase pode alterar comportamento, cooldown, skill disponível, buffs e agressividade
- a transição deve ser centralizada

Campos esperados:
- `current_phase`
- `phase_trigger_rules`
- `phase_transition_in_progress`
- `phase_behavior_profile`

Funções esperadas:
- `boss_check_phase_transition(boss)`
- `boss_apply_phase_transition(boss, new_phase)`
- `boss_get_phase_by_hp_ratio(boss)`

### 4. Implementar regras de transição por HP
O caso mínimo obrigatório é transição por percentual de HP.

Exemplos esperados:
- fase 1 acima de 70%
- fase 2 entre 70% e 35%
- fase 3 abaixo de 35%

A tabela deve ser configurável por boss, sem hardcode espalhado.

### 5. Criar comportamento especial por fase
Cada fase deve poder alterar:
- padrão de perseguição
- frequência de ataque
- skill pool
- buffs próprios
- debuffs aplicados
- velocidade
- leash/arena
- agressividade

Funções esperadas:
- `boss_apply_phase_behavior(boss)`
- `boss_get_current_behavior_profile(boss)`

### 6. Criar skills especiais de boss
Bosses devem poder usar skills especiais separadas do ataque básico.

Requisitos:
- usar o sistema central de skills/efeitos quando possível
- suportar ataques especiais sem quebrar a IA comum
- suportar skill ofensiva, utilitária e de controle
- respeitar cooldown próprio da skill
- respeitar fase atual

Funções esperadas:
- `boss_can_use_special_skill(boss, skill_id)`
- `boss_choose_special_skill(boss, target)`
- `boss_use_special_skill(boss, skill_id, target)`

### 7. Integrar buffs e debuffs em bosses
Bosses e elites devem poder:
- aplicar debuffs no player
- se buffar em certas fases
- usar efeitos periódicos
- usar stun/slow/poison/burn/bleed quando configurado

A lógica deve passar pelo sistema central de status effects.

Funções esperadas:
- `boss_apply_self_buff(boss, effect_id)`
- `boss_apply_target_debuff(boss, target, effect_id)`

### 8. Criar arena e leash especiais de boss
Bosses devem poder ter arena própria.

Regras:
- o boss deve respeitar uma área de combate configurável
- o player pode ser punido, resetar o boss ou encerrar aggro ao sair da arena, conforme configuração
- a arena deve ser separada do leash simples do monstro comum

Campos esperados:
- `arena_center_x`
- `arena_center_y`
- `arena_radius`
- `arena_reset_on_exit`
- `arena_soft_limit_enabled`

Funções esperadas:
- `boss_is_target_inside_arena(boss, target)`
- `boss_handle_arena_violation(boss, target)`
- `boss_reset_encounter(boss)`

### 9. Implementar reset de encontro
Bosses devem poder resetar o encontro.

Regras:
- limpar alvo
- voltar ao ponto/centro da arena
- restaurar estado da IA
- opcionalmente restaurar HP total ou parcial conforme configuração
- limpar fase e reiniciar timers especiais quando configurado

Funções esperadas:
- `boss_reset_encounter(boss)`
- `boss_restore_on_reset(boss)`

### 10. Criar respawn específico para elite e boss
O respawn de boss/elite deve ser separado da lógica simples do monstro comum.

Regras:
- elite pode ter respawn mais lento
- boss pode ter respawn longo
- world boss pode ter perfil especial
- deve ser data-driven
- não deve copiar a lógica do monstro comum sem separação

Campos esperados:
- `boss_respawn_enabled`
- `boss_respawn_time_seconds`
- `boss_spawn_profile_id`

Funções esperadas:
- `boss_spawn_profile_create(...)`
- `boss_spawn_execute(spawn_profile_id)`
- `boss_respawn_start(boss)`
- `boss_respawn_update(boss)`

### 11. Integrar morte do boss com recompensa especial
Ao morrer, o boss deve:
- disparar XP
- disparar drop especial
- disparar possível mensagem/evento local
- limpar HUD de boss
- iniciar regra de respawn se aplicável
- impedir múltiplas execuções de morte

Funções esperadas:
- `boss_handle_death(boss, killer)`
- `boss_grant_rewards(boss, killer)`
- `boss_spawn_special_loot(boss, killer)`

### 12. Criar HUD específica de boss
A HUD deve conseguir exibir:
- nome do boss
- barra de HP do boss
- fase atual, se aplicável
- estado visual especial de encontro

Essa HUD deve reutilizar a base da HUD já existente, sem duplicar regra de combate.

Funções esperadas:
- `boss_hud_show(boss)`
- `boss_hud_hide()`
- `boss_hud_update(boss)`
- `boss_hud_draw()`

### 13. Criar diferenciação visual e lógica para elite
Elites devem ser mais fortes que monstros comuns, mas menos complexos que bosses.

Requisitos:
- atributo diferenciado
- possível skill especial simples
- loot melhor
- identificação própria
- sem exigir sistema de fases completo, mas a arquitetura deve permitir

Funções esperadas:
- `elite_apply_profile(enemy, elite_profile_id)`
- `elite_handle_death(enemy, killer)`

### 14. Integrar com o sistema de spawn já existente
Bosses e elites devem usar o sistema de spawn/respawn sem quebrar o respawn comum de monstros.

Requisitos:
- reaproveitar o que for estável
- separar perfis especiais
- não misturar timers de boss com timers de monstro comum
- manter compatibilidade com grind normal do mapa

### 15. Preparar encontros especiais
A arquitetura deve ficar pronta para:
- mini-boss de mapa
- world boss
- encontro único
- encontro com múltiplos adds
- encontro que invoca reforços

Não precisa implementar todos agora, mas a estrutura deve aceitar isso.

Campos opcionais esperados:
- `summon_profiles`
- `encounter_tags`
- `special_rules`

### 16. Retornar resultados estruturados
Transição de fase, morte e reset devem retornar estrutura clara.

Campos esperados:
- `success`
- `boss_id`
- `previous_phase`
- `new_phase`
- `action_type`
- `target_id`
- `encounter_reset`
- `boss_dead`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- perfis de boss
- perfis de elite
- fases por boss
- perfis de arena
- perfis de respawn
- perfis de HUD de boss
- tabelas de skills especiais
- regras de reset

### Estado
Separar claramente:
- estado do boss/elite
- fase atual
- timers de skill especial
- timers de transição
- estado de arena
- vínculo com spawn profile
- vínculo com loot profile
- estado da boss HUD

### Funções centrais
Funções esperadas:
- `boss_build_profile_catalog()`
- `boss_get_profile(profile_id)`
- `boss_check_phase_transition(boss)`
- `boss_apply_phase_transition(boss, new_phase)`
- `boss_get_phase_by_hp_ratio(boss)`
- `boss_apply_phase_behavior(boss)`
- `boss_get_current_behavior_profile(boss)`
- `boss_can_use_special_skill(boss, skill_id)`
- `boss_choose_special_skill(boss, target)`
- `boss_use_special_skill(boss, skill_id, target)`
- `boss_apply_self_buff(boss, effect_id)`
- `boss_apply_target_debuff(boss, target, effect_id)`
- `boss_is_target_inside_arena(boss, target)`
- `boss_handle_arena_violation(boss, target)`
- `boss_reset_encounter(boss)`
- `boss_restore_on_reset(boss)`
- `boss_spawn_profile_create(...)`
- `boss_spawn_execute(spawn_profile_id)`
- `boss_respawn_start(boss)`
- `boss_respawn_update(boss)`
- `boss_handle_death(boss, killer)`
- `boss_grant_rewards(boss, killer)`
- `boss_spawn_special_loot(boss, killer)`
- `boss_hud_show(boss)`
- `boss_hud_hide()`
- `boss_hud_update(boss)`
- `boss_hud_draw()`
- `elite_apply_profile(enemy, elite_profile_id)`
- `elite_handle_death(enemy, killer)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir combate central
- consumir IA comum quando fizer sentido
- consumir status effects
- consumir HUD existente
- consumir drops e XP
- integrar com spawn/respawn
- preparar integração futura com quests, mapas especiais e dungeons
- não depender de UI fora da boss HUD para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de perfis de boss e elite
2. boss entrar e trocar de fase corretamente por percentual de HP
3. fase alterar comportamento sem quebrar o combate
4. boss usar skill especial respeitando fase e cooldown
5. boss aplicar buff/debuff via sistema central de status effects
6. elite receber perfil especial sem exigir fases completas
7. boss respeitar arena configurada
8. boss resetar encontro corretamente ao violar regra de arena
9. boss restaurar estado corretamente após reset
10. boss morrer executando recompensas apenas uma vez
11. elite morrer executando recompensas corretamente
12. boss iniciar respawn corretamente quando a regra permitir
13. elite iniciar respawn corretamente quando a regra permitir
14. boss HUD aparecer corretamente ao iniciar o encontro
15. boss HUD atualizar HP e fase corretamente
16. boss HUD desaparecer corretamente ao fim do encontro
17. sistema manter separação entre boss, elite e monstro comum
18. arquitetura ficar pronta para mini-boss e world boss sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de boss em vários lugares
- não misturar UI com regra de negócio, exceto a boss HUD consumindo dados prontos
- não reescrever o combate base do zero
- não reescrever a IA comum inteira sem necessidade
- não implementar dungeon completa neste prompt
- não implementar cutscenes neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders