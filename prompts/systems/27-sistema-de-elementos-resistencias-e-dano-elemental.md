# Implementar sistema central de elementos, dano elemental, resistências e fraquezas no GameMaker

## Objetivo

Implementar um sistema centralizado de elementos para o jogo, cobrindo dano elemental, resistências, fraquezas, bônus ofensivos e defensivos, integração com combate, skills, itens, inimigos e bosses. Este prompt resolve a camada elemental que ainda não foi implementada de forma dedicada, deixando o projeto pronto para ataques de fogo, gelo, raio, trevas, sagrado e outras variações sem espalhar lógica por vários módulos.

Este prompt vem depois de:
- `11-sistema-itens-e-bonus.md`
- `15-sistema-combate-base.md`
- `18-ia-dos-inimigos-e-respawn.md`
- `19-buffs-debuffs-e-status-effects.md`
- `20-sistema-bosses-e-encontros-especiais.md`
- `26-sistema-de-loja-comercio-e-venda-para-npcs.md`

Este prompt vem antes de:
- `28-sistema-de-fast-travel-teleporte-e-portais.md`
- `29-menu-principal-configuracoes-e-remapeamento.md`
- `30-sistema-de-crafting-producao-e-refinacao-especial.md` se o crafting for usar essências, runas ou materiais elementais
- prompts futuros de skills avançadas e bosses elementais

## Escopo

### Implementar neste prompt
- sistema central de elementos
- enum e catálogo de elementos
- dano elemental separado do dano físico e mágico base
- resistências elementais
- fraquezas elementais
- bônus ofensivos elementais
- bônus defensivos elementais
- integração do elemento em ataques normais quando aplicável
- integração do elemento em skills
- integração do elemento em itens e bônus de equipamento
- integração do elemento em inimigos
- integração do elemento em bosses
- integração com buffs/debuffs e status effects
- cálculo final de dano elemental
- estrutura para imunidade elemental
- estrutura para penetração/resist ignore futura
- arquitetura pronta para UI e tooltips futuras

### Não implementar neste prompt
- reescrita completa do combate
- UI completa de tooltip elemental
- crafting elemental
- encantamento elemental visual
- partículas, shaders e VFX complexos
- sistema de clima/bioma afetando elemento
- árvore de talentos elementais
- PvP
- multiplayer
- balanceamento final de todos os elementos
- sistema procedural de combinação elemental complexa
- fusão de elementos em tempo real
- sistema completo de runas/gemas elementais, além da preparação estrutural

## Dependências e contexto

Este prompt depende de:
- sistema de combate base
- sistema de buffs/debuffs e status effects
- sistema de itens e bônus
- sistema de inimigos
- sistema de bosses

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- `attack_physical`
- `attack_magic`
- `defense_total`
- `hp_current`
- `hp_max`
- sistema central de cálculo de dano
- sistema central de aplicação de dano
- skills com tipo e contexto de uso
- itens com bônus e camadas de atributos
- inimigos e bosses com atributos de combate
- status effects já centralizados

### Dados que este prompt deve criar
- enum de elementos
- catálogo de elementos
- payload de dano elemental
- resistências elementais por entidade
- afinidades/fraquezas elementais por entidade
- bônus ofensivos elementais por entidade
- imunidades elementais
- integração com cálculo de combate
- funções de consulta e cálculo de dano elemental
- serialização futura preparada via dados centrais já compatíveis com save/load

## Requisitos funcionais

### 1. Criar enum central de elementos
Criar enums ou estruturas equivalentes para os elementos do jogo.

Elementos mínimos esperados:
- `ELEMENT_NONE`
- `ELEMENT_FIRE`
- `ELEMENT_ICE`
- `ELEMENT_LIGHTNING`
- `ELEMENT_EARTH`
- `ELEMENT_WIND`
- `ELEMENT_DARK`
- `ELEMENT_LIGHT`
- `ELEMENT_POISON` se você quiser separar veneno como elemento ofensivo
- `ELEMENT_BLEED` apenas se fizer sentido como escola separada; se não fizer, deixar como status effect e não como elemento

Enum esperado:
- `ElementType`

### 2. Criar catálogo central de elementos
Cada elemento deve ter uma definição centralizada.

Campos esperados:
- `element_id`
- `name`
- `display_name`
- `description`
- `color_tag` opcional
- `default_effect_tags`
- `flags`

Funções esperadas:
- `elements_build_catalog()`
- `elements_get_definition(element_id)`

### 3. Criar estrutura de atributos elementais por entidade
Toda entidade que participa de combate deve poder ter dados elementais.

Campos esperados:
- `element_attack_bonus_map`
- `element_resistance_map`
- `element_weakness_map`
- `element_immunity_flags`
- `element_penetration_map` preparado para futuro
- `element_profile_flags`

Esses dados devem existir para:
- player
- inimigos
- bosses
- elites
- eventualmente NPCs combativos

### 4. Separar dano elemental do dano base
O sistema deve distinguir claramente:
- dano físico base
- dano mágico base
- componente elemental adicional
- skill puramente elemental
- ataque híbrido

A arquitetura não deve tratar elemento apenas como texto decorativo.

Funções esperadas:
- `combat_build_elemental_payload(...)`
- `combat_has_elemental_component(attack_context)`

### 5. Implementar cálculo central de dano elemental
Criar função central para dano elemental.

Ela deve considerar:
- elemento da skill/ataque
- poder elemental ofensivo do atacante
- bônus ofensivos elementais do atacante
- resistência elemental do alvo
- fraqueza elemental do alvo
- imunidade elemental do alvo
- multiplicadores vindos de buffs/debuffs
- clamps e limites mínimos

Função esperada:
- `combat_calculate_elemental_damage(attacker, target, attack_context)`

### 6. Implementar resistências elementais
Cada entidade deve poder ter resistência por elemento.

Requisitos:
- valor centralizado por elemento
- efeito real no cálculo do dano
- possibilidade de resistência negativa ou fraqueza explícita
- possibilidade de resistência maior que zero sem hardcode espalhado

Funções esperadas:
- `elements_get_target_resistance(target, element_id)`
- `elements_get_effective_resistance(target, element_id)`

### 7. Implementar fraquezas elementais
Cada entidade deve poder ter fraqueza a certos elementos.

Regras:
- fraqueza deve aumentar o dano recebido daquele elemento
- pode ser representada como resistência negativa ou mapa separado
- a arquitetura deve ser clara e consistente

Funções esperadas:
- `elements_get_target_weakness(target, element_id)`
- `elements_get_effective_weakness_multiplier(target, element_id)`

### 8. Implementar imunidades elementais
O sistema deve suportar imunidade a certos elementos.

Regras:
- imunidade deve impedir ou anular o dano elemental correspondente
- a regra deve ser centralizada
- imunidade não deve depender de ifs espalhados pelo combate

Funções esperadas:
- `elements_is_immune(target, element_id)`
- `elements_apply_immunity_rules(target, element_id, damage_value)`

### 9. Implementar bônus ofensivos elementais
O atacante deve poder receber bônus de dano elemental por elemento.

Origem possível:
- arma
- acessório
- buff
- skill passiva
- perfil do boss/inimigo

Funções esperadas:
- `elements_get_attacker_element_bonus(attacker, element_id)`
- `elements_get_effective_attack_element_power(attacker, element_id)`

### 10. Integrar elementos com ataques normais
Ataques normais devem poder:
- não ter elemento
- ter elemento nativo da arma
- receber elemento temporário por buff
- causar componente elemental adicional

Funções esperadas:
- `combat_get_basic_attack_element(attacker)`
- `combat_apply_basic_attack_element(attacker, target, attack_context)`

### 11. Integrar elementos com skills
Skills devem poder:
- ser de um elemento específico
- escalar dano elemental
- aplicar status effect coerente com o elemento
- misturar dano mágico/físico com componente elemental

Campos esperados na definição de skill:
- `element_id`
- `element_power_scale`
- `element_application_mode`

Funções esperadas:
- `skills_get_element(skill_id)`
- `skills_get_elemental_profile(skill_id)`
- `combat_apply_skill_element(attacker, target, skill_result)`

### 12. Integrar elementos com itens e bônus
Itens equipáveis devem poder conceder:
- ataque elemental
- resistência elemental
- imunidade parcial/futura
- bônus contra certos elementos

A integração deve passar pelo sistema de bônus/agregação já existente.

Funções esperadas:
- `item_get_elemental_bonus_map(instance_id)`
- `equipment_collect_elemental_bonuses()`
- `equipment_rebuild_elemental_cache()`

### 13. Integrar elementos com inimigos
Inimigos devem poder ter:
- perfil elemental
- resistência elemental
- fraqueza elemental
- ataque elemental

Exemplos:
- monstro de fogo resistente a fogo e fraco contra gelo
- monstro sombrio fraco contra luz
- elemental de raio com ataque elemental nativo

Funções esperadas:
- `enemy_apply_element_profile(enemy, profile_id)`
- `enemy_get_element_profile(enemy)`

### 14. Integrar elementos com bosses
Bosses devem poder:
- trocar resistência por fase
- ter imunidade parcial ou total
- ganhar buff elemental
- usar ataques elementais especiais

A arquitetura deve ficar pronta para encounters realmente temáticos.

Funções esperadas:
- `boss_apply_element_profile(boss, profile_id)`
- `boss_update_phase_element_rules(boss)`

### 15. Integrar elementos com buffs/debuffs
Status effects devem poder:
- aumentar resistência elemental
- reduzir resistência elemental
- conceder ataque elemental temporário
- conceder encantamento elemental temporário
- marcar o alvo como vulnerável a certo elemento

Funções esperadas:
- `status_effects_collect_element_modifiers(entity)`
- `status_effects_get_elemental_modifier_map(entity)`

### 16. Implementar pipeline final do dano híbrido
O sistema deve suportar casos como:
- dano físico + fogo
- dano mágico + gelo
- skill puramente raio
- ataque normal com encantamento sombrio

A arquitetura deve retornar o dano de forma estruturada, separando as partes.

Função esperada:
- `combat_calculate_total_damage_with_elements(attacker, target, attack_context)`

Estrutura esperada de resultado:
- `physical_damage`
- `magic_damage`
- `elemental_damage`
- `element_id`
- `was_resisted`
- `was_weakness`
- `was_immune`
- `final_total_damage`

### 17. Preparar suporte a penetração elemental futura
Mesmo sem implementar tudo agora, a arquitetura deve aceitar:
- ignorar parte da resistência elemental
- penetração por elemento
- redução de resistência do alvo

Campos/funções esperadas:
- `element_penetration_map`
- `elements_get_effective_penetrated_resistance(...)`

Pode deixar a base preparada mesmo que a implementação inicial seja simples.

### 18. Preparar suporte a UI futura
A arquitetura deve ficar pronta para a UI mostrar:
- elemento da skill
- elemento da arma
- resistências do personagem
- fraqueza do inimigo
- cor/tipo do dano causado

Não implementar a UI completa agora, mas deixar dados limpos.

### 19. Integrar com save/load quando necessário
Se os dados elementais forem derivados de perfil e equipamento, eles podem ser reconstruídos.
Se houver runtime relevante, deixar claro o que deve ou não ser persistido.

Regras:
- não persistir cache efêmero desnecessário
- persistir apenas perfis/flags relevantes quando necessário

### 20. Retornar resultados estruturados
Todo cálculo elemental deve retornar resultado claro.

Campos esperados:
- `success`
- `element_id`
- `base_elemental_power`
- `attack_bonus`
- `target_resistance`
- `target_weakness`
- `target_immunity`
- `final_elemental_damage`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de elementos
- perfis elementais de inimigos/bosses
- regras de multiplicador/resistência
- integração com skills
- integração com itens
- integração com status effects
- clamps e limites do dano elemental

### Estado
Separar claramente:
- catálogo global de elementos
- perfil elemental de entidades
- mapas de resistência por entidade
- mapas de bônus ofensivo por entidade
- mapas de imunidade por entidade
- caches elementais de equipamento/efeitos quando necessário

### Funções centrais
Funções esperadas:
- `elements_build_catalog()`
- `elements_get_definition(element_id)`
- `combat_build_elemental_payload(...)`
- `combat_has_elemental_component(attack_context)`
- `combat_calculate_elemental_damage(attacker, target, attack_context)`
- `elements_get_target_resistance(target, element_id)`
- `elements_get_effective_resistance(target, element_id)`
- `elements_get_target_weakness(target, element_id)`
- `elements_get_effective_weakness_multiplier(target, element_id)`
- `elements_is_immune(target, element_id)`
- `elements_apply_immunity_rules(target, element_id, damage_value)`
- `elements_get_attacker_element_bonus(attacker, element_id)`
- `elements_get_effective_attack_element_power(attacker, element_id)`
- `combat_get_basic_attack_element(attacker)`
- `combat_apply_basic_attack_element(attacker, target, attack_context)`
- `skills_get_element(skill_id)`
- `skills_get_elemental_profile(skill_id)`
- `combat_apply_skill_element(attacker, target, skill_result)`
- `item_get_elemental_bonus_map(instance_id)`
- `equipment_collect_elemental_bonuses()`
- `equipment_rebuild_elemental_cache()`
- `enemy_apply_element_profile(enemy, profile_id)`
- `enemy_get_element_profile(enemy)`
- `boss_apply_element_profile(boss, profile_id)`
- `boss_update_phase_element_rules(boss)`
- `status_effects_collect_element_modifiers(entity)`
- `status_effects_get_elemental_modifier_map(entity)`
- `combat_calculate_total_damage_with_elements(attacker, target, attack_context)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir combate central
- consumir skills
- consumir sistema de itens e bônus
- consumir inimigos e bosses
- consumir status effects
- preparar integração futura com UI, crafting elemental e conteúdos especiais
- não depender de UI para funcionar

## Critérios de aceite

1. criar catálogo central de elementos corretamente
2. calcular dano elemental corretamente para um ataque com elemento
3. aplicar resistência elemental corretamente
4. aplicar fraqueza elemental corretamente
5. aplicar imunidade elemental corretamente
6. integrar elemento em ataque normal quando houver encantamento/arma elemental
7. integrar elemento em skill corretamente
8. integrar bônus elementais de item corretamente
9. integrar resistência elemental de inimigo corretamente
10. integrar perfil elemental de boss corretamente
11. permitir buffs/debuffs alterando resistência ou poder elemental corretamente
12. suportar dano híbrido físico/mágico/elemental corretamente
13. manter separação entre dano base e dano elemental
14. não espalhar lógica elemental pelo combate todo
15. manter arquitetura pronta para UI e penetração elemental futura sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica elemental em vários lugares
- não misturar UI com regra de negócio
- não tratar elemento apenas como texto decorativo
- não reescrever o combate base do zero
- não implementar crafting elemental neste prompt
- não implementar UI completa de tooltip elemental neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders