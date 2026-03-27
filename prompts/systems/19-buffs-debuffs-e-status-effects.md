# Implementar sistema completo de buffs, debuffs e status effects no GameMaker

## Objetivo

Implementar o sistema central de buffs, debuffs e efeitos temporários de status do jogo, de forma unificada e reutilizável para skills, itens, inimigos e futuro conteúdo avançado. Este prompt resolve a camada de efeitos temporários que alteram atributos, comportamento, dano e utilidade em combate, sem espalhar lógica em skills, consumíveis ou IA.

Este prompt vem depois de:
- `03-sistema-atributos-derivados.md`
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `11-sistema-itens-e-bonus.md`
- `15-sistema-combate-base.md`
- `17-hud-completa-de-combate.md`
- `18-ia-dos-inimigos-e-respawn.md`

Este prompt vem antes de:
- prompt de bosses
- prompt de skills avançadas com efeitos complexos
- prompt de consumíveis especiais avançados
- prompt de resistências elementais avançadas, se você quiser separar depois

## Escopo

### Implementar neste prompt
- sistema central de buffs
- sistema central de debuffs
- sistema de status effects temporários
- aplicação de efeitos em player e inimigos
- duração de efeitos
- expiração de efeitos
- atualização contínua dos efeitos ativos
- efeitos instantâneos e efeitos por duração
- efeitos de alteração de atributos
- efeitos de dano periódico
- efeitos de cura periódica
- efeitos de controle simples
- empilhamento e não empilhamento de efeitos
- recálculo de atributos com efeitos ativos
- integração com skills
- integração com itens/consumíveis
- integração com combate
- integração com HUD para exibição futura/presente dos efeitos
- arquitetura pronta para resistências e imunidades futuras

### Não implementar neste prompt
- boss mechanics complexas
- interface completa de tooltip avançada dos efeitos
- árvore de talentos
- crafting
- lojas
- PvP
- multiplayer
- resistências elementais completas por escola mágica, a menos que sejam apenas estrutura preparada
- sistema de cleanse/dispel avançado com múltiplas regras exóticas
- animações complexas
- partículas
- sons
- efeitos cinemáticos
- balanceamento final de todas as skills do jogo
- reescrita do sistema de combate do zero

## Dependências e contexto

Este sistema depende de:
- atributos derivados
- sistema de skills
- sistema de combate
- sistema de itens e bônus
- HUD
- IA de inimigos

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- `hp_current`
- `hp_max`
- `mp_current`
- `mp_max`
- `attack_physical`
- `attack_magic`
- `defense_total`
- `crit_chance`
- `attack_speed`
- `move_speed`
- sistema central de recálculo de atributos
- sistema central de dano
- sistema central de uso de skill
- sistema central de uso de consumíveis
- player e inimigos com estado de combate e vida

### Dados que este prompt deve criar
- enum de tipos de status effect
- definição global de status effect
- instância ativa de status effect
- lista de efeitos ativos por entidade
- sistema de atualização de duração
- sistema de ticks periódicos
- funções de aplicação, renovação, remoção e consulta de efeitos
- integração com recálculo de atributos
- integração com HUD para slots de buff/debuff
- resultado estruturado de aplicação e remoção

## Requisitos funcionais

### 1. Criar enum de tipos de status effect
Criar enums ou estruturas equivalentes para separar claramente os tipos de efeito.

Tipos mínimos esperados:
- `BUFF_STAT`
- `DEBUFF_STAT`
- `DAMAGE_OVER_TIME`
- `HEAL_OVER_TIME`
- `CONTROL_SLOW`
- `CONTROL_STUN`
- `CONTROL_POISON`
- `CONTROL_BURN`
- `CONTROL_BLEED`
- `SPECIAL_UTILITY`

Enums esperados:
- `StatusEffectType`
- `StatusEffectStackRule`
- `StatusEffectSourceType`

### 2. Criar definição global de status effect
Todo efeito deve ter uma definição centralizada.

Campos esperados:
- `effect_id`
- `name`
- `effect_type`
- `description`
- `base_duration`
- `tick_interval`
- `max_stacks`
- `stack_rule`
- `refresh_rule`
- `is_buff`
- `is_debuff`
- `source_type`
- `modifier_payload`
- `visual_tag`
- `flags`

Funções esperadas:
- `status_effects_build_catalog()`
- `status_effects_get_definition(effect_id)`

### 3. Criar estrutura da instância ativa de efeito
Cada efeito ativo em uma entidade deve ser uma instância própria.

Campos esperados:
- `active_effect_id`
- `definition_id`
- `target_entity_id`
- `source_entity_id`
- `source_type`
- `remaining_time`
- `total_duration`
- `tick_interval`
- `tick_timer`
- `stack_count`
- `applied_payload`
- `is_active`
- `instance_flags`

Função esperada:
- `status_effect_instance_create(effect_id, source_entity_id, target_entity_id, payload_override)`

### 4. Criar container de efeitos ativos por entidade
Player e inimigos devem possuir lista clara de efeitos ativos.

Campos esperados por entidade:
- `active_status_effects`

Funções esperadas:
- `status_effects_init_container(entity)`
- `status_effects_get_active_list(entity)`
- `status_effects_find_active(entity, effect_id)`

### 5. Implementar aplicação central de efeito
Todo buff/debuff deve ser aplicado por uma função central.

Função esperada:
- `status_effect_apply(target, effect_id, source_entity_id, payload_override)`

Responsabilidades:
- validar efeito
- validar alvo
- verificar duplicidade
- aplicar regra de stack
- aplicar regra de refresh
- inserir instância ativa
- disparar recálculo de atributos quando necessário
- retornar resultado estruturado

### 6. Implementar regras de stack e refresh
O sistema deve suportar ao menos:
- não acumula, apenas renova duração
- acumula até limite
- substitui se novo efeito for mais forte
- múltiplas instâncias independentes, se configurado

Campos/configuração esperados:
- `StatusEffectStackRule`
- `refresh_rule`

Funções esperadas:
- `status_effects_can_stack(target, effect_id)`
- `status_effects_apply_stack_rule(target, effect_instance)`
- `status_effects_refresh_existing(target, effect_instance)`

### 7. Implementar remoção e expiração de efeito
O sistema deve remover corretamente efeitos expirados ou cancelados.

Funções esperadas:
- `status_effect_remove(target, active_effect_id)`
- `status_effect_remove_by_definition(target, effect_id)`
- `status_effect_expire(target, active_effect_id)`

Requisitos:
- limpar instância ativa
- remover efeito do container
- recalcular atributos se necessário
- retornar resultado estruturado

### 8. Implementar atualização contínua dos efeitos ativos
A cada update/tick do jogo, o sistema deve:
- reduzir duração restante
- processar tick periódico quando aplicável
- expirar efeito quando o tempo acabar
- manter estabilidade com vários efeitos simultâneos

Função esperada:
- `status_effects_update_entity(entity, delta_time)`

### 9. Implementar buffs e debuffs de atributos
O sistema deve suportar efeitos que alteram:
- ataque físico
- ataque mágico
- defesa
- HP máximo
- MP máximo
- chance crítica
- velocidade de ataque
- velocidade de movimento
- regeneração
- outros atributos centrais do projeto

A aplicação desses bônus/penalidades deve ser integrada ao recálculo de atributos já existente.

Funções esperadas:
- `status_effects_collect_stat_modifiers(entity)`
- `status_effects_rebuild_modifier_cache(entity)`

### 10. Implementar dano periódico
O sistema deve suportar efeitos como:
- veneno
- queima
- sangramento

Regras:
- dano em ticks
- intervalo configurável
- integração com sistema central de dano
- não aplicar dano diretamente de forma solta fora do sistema central

Funções esperadas:
- `status_effects_process_damage_tick(entity, active_effect)`
- `status_effects_apply_periodic_damage(entity, active_effect)`

### 11. Implementar cura periódica
O sistema deve suportar:
- regeneração temporária
- cura em ticks
- buff de sustain

Funções esperadas:
- `status_effects_process_heal_tick(entity, active_effect)`
- `status_effects_apply_periodic_heal(entity, active_effect)`

### 12. Implementar efeitos de controle simples
O sistema deve suportar ao menos:
- slow
- stun

Regras:
- `slow` deve impactar movimentação e/ou ataque conforme configuração
- `stun` deve bloquear ação do alvo enquanto durar

A lógica deve ficar centralizada e reutilizável.

Funções esperadas:
- `status_effects_is_stunned(entity)`
- `status_effects_get_move_speed_multiplier(entity)`
- `status_effects_get_attack_speed_multiplier(entity)`

### 13. Integrar buffs e debuffs com skills
Skills devem poder:
- aplicar buffs no usuário
- aplicar debuffs no alvo
- aplicar DOT/HOT
- aplicar slow/stun

A skill não deve conter a lógica completa do efeito.
Ela deve chamar o sistema central de status effects.

Funções esperadas:
- `skills_apply_status_effect(skill_id, source_entity, target_entity)`
- `skills_get_embedded_effects(skill_id)`

### 14. Integrar buffs e debuffs com itens/consumíveis
Itens devem poder:
- curar instantaneamente
- aplicar buff temporário
- remover debuff simples no futuro
- ativar HOT temporário

A lógica central deve continuar no sistema de status effects.

Funções esperadas:
- `items_apply_status_effect(item_id, source_entity, target_entity)`

### 15. Integrar buffs e debuffs com combate
O combate deve consultar o estado atual da entidade ao calcular dano e ação.

Exemplos:
- entidade atordoada não pode atacar
- entidade com slow tem redução de movimento
- entidade com buff de ataque causa mais dano
- entidade com debuff defensivo recebe mais dano

Funções esperadas:
- `combat_can_entity_act(entity)`
- `combat_get_effective_combat_modifiers(entity)`

### 16. Integrar com HUD
A HUD já foi preparada para buffs/debuffs e agora deve poder consumir o sistema.

Requisitos:
- lista de efeitos ativos exposta de forma limpa
- dados suficientes para mostrar ícone, tempo e stacks
- sem depender da HUD para a lógica existir

Funções esperadas:
- `status_effects_get_visual_list(entity)`
- `status_effects_get_remaining_time(active_effect_id)`

### 17. Preparar suporte para resistências e imunidades futuras
A arquitetura deve ficar pronta para:
- resistência a veneno
- imunidade a stun
- resistência a slow
- redução de duração de debuff
- resistência elemental futura

Não precisa implementar tudo agora, mas a estrutura deve aceitar isso.

Campos opcionais esperados:
- `effect_resistance_type`
- `effect_immunity_flags`
- `duration_modifier`

### 18. Retornar resultado estruturado nas operações do sistema
Aplicação, remoção e expiração devem retornar resultado estruturado.

Campos esperados:
- `success`
- `effect_id`
- `active_effect_id`
- `target_entity_id`
- `source_entity_id`
- `action_type`
- `stack_count`
- `remaining_time`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de status effects
- enums de tipo de efeito
- regras de stack
- regras de refresh
- tempos base
- intervalos de tick
- tipos visuais para HUD
- flags futuras de resistência e imunidade

### Estado
Separar claramente:
- catálogo global de efeitos
- instâncias ativas por entidade
- cache de modificadores por entidade
- timers de duração
- timers de tick
- flags de controle como stun/slow

### Funções centrais
Funções esperadas:
- `status_effects_build_catalog()`
- `status_effects_get_definition(effect_id)`
- `status_effect_instance_create(effect_id, source_entity_id, target_entity_id, payload_override)`
- `status_effects_init_container(entity)`
- `status_effects_get_active_list(entity)`
- `status_effects_find_active(entity, effect_id)`
- `status_effect_apply(target, effect_id, source_entity_id, payload_override)`
- `status_effects_can_stack(target, effect_id)`
- `status_effects_apply_stack_rule(target, effect_instance)`
- `status_effects_refresh_existing(target, effect_instance)`
- `status_effect_remove(target, active_effect_id)`
- `status_effect_remove_by_definition(target, effect_id)`
- `status_effect_expire(target, active_effect_id)`
- `status_effects_update_entity(entity, delta_time)`
- `status_effects_collect_stat_modifiers(entity)`
- `status_effects_rebuild_modifier_cache(entity)`
- `status_effects_process_damage_tick(entity, active_effect)`
- `status_effects_apply_periodic_damage(entity, active_effect)`
- `status_effects_process_heal_tick(entity, active_effect)`
- `status_effects_apply_periodic_heal(entity, active_effect)`
- `status_effects_is_stunned(entity)`
- `status_effects_get_move_speed_multiplier(entity)`
- `status_effects_get_attack_speed_multiplier(entity)`
- `skills_apply_status_effect(skill_id, source_entity, target_entity)`
- `skills_get_embedded_effects(skill_id)`
- `items_apply_status_effect(item_id, source_entity, target_entity)`
- `combat_can_entity_act(entity)`
- `combat_get_effective_combat_modifiers(entity)`
- `status_effects_get_visual_list(entity)`
- `status_effects_get_remaining_time(active_effect_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir e modificar atributos derivados
- integrar com skills e consumíveis
- integrar com combate
- integrar com HUD
- preparar integração futura com bosses e resistências
- não depender de UI para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de status effects
2. aplicar buff de atributo corretamente
3. aplicar debuff de atributo corretamente
4. renovar duração quando a regra mandar renovar
5. acumular stacks quando a regra permitir
6. impedir stack quando a regra não permitir
7. expirar efeito corretamente ao fim da duração
8. remover efeito manualmente corretamente
9. aplicar dano periódico corretamente
10. aplicar cura periódica corretamente
11. aplicar slow corretamente
12. aplicar stun corretamente
13. impedir ação de entidade atordoada
14. recalcular atributos corretamente com buffs/debuffs ativos
15. integrar skills com o sistema sem duplicar lógica
16. integrar consumíveis com o sistema sem duplicar lógica
17. expor lista visual de efeitos para HUD
18. manter arquitetura pronta para resistências e imunidades futuras sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de buffs/debuffs em vários lugares
- não misturar UI com regra de negócio
- não recalcular efeitos diretamente dentro de skills ou itens sem passar pelo sistema central
- não implementar bosses complexos neste prompt
- não implementar resistências completas neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders