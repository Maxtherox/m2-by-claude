# Implementar e integrar sistema base de combate sobre o combate já existente no GameMaker

## Objetivo

Implementar a evolução do sistema de combate do jogo sem reescrever do zero o que já está funcionando. O projeto já possui um combate estilo metroidvania parcialmente funcional, com combo básico de 3 ataques, inimigos com vida e outras regras já implementadas. Este prompt resolve a integração entre o combate existente e os sistemas novos de atributos, skills, dano, XP e drops, preservando a base atual e expandindo apenas o que for necessário.

Este prompt vem depois de:
- `01-sistema-status-base.md`
- `02-sistema-xp-level-up-progressivo.md`
- `03-sistema-atributos-derivados.md`
- `05-sistema-honra.md`
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`

Este prompt vem antes de:
- prompt de hotbar e atalhos
- prompt de IA dos inimigos
- prompt de HUD de combate
- prompt de buffs e debuffs avançados
- prompt de PvP, se existir no futuro

## Objetivo adicional obrigatório antes da implementação

Antes de implementar qualquer alteração, você deve primeiro analisar o sistema de combate atual já existente no projeto.

O combate atual já possui base funcional de jogo de ação/metroidvania, incluindo pelo menos:
- personagem atacando
- combo de 3 ataques ao clicar repetidamente
- inimigos com vida
- lógica parcial de combate já implementada

A sua primeira responsabilidade é auditar esse sistema atual e entender:
- como o combo atual funciona
- como o dano está sendo aplicado hoje
- como os inimigos recebem dano hoje
- como a vida dos inimigos está estruturada
- quais objetos, scripts e eventos já controlam combate
- o que já está pronto e deve ser preservado
- o que está duplicado, frágil ou improvisado e precisa ser refatorado
- onde os novos sistemas devem ser integrados sem quebrar o fluxo atual

Você não deve substituir o combate atual por um sistema novo genérico sem antes adaptar a arquitetura existente.

## Escopo

### Implementar neste prompt
- análise técnica do combate atual já implementado
- mapeamento dos scripts/objetos/eventos de combate existentes
- preservação do combate metroidvania já funcional
- integração do ataque normal já existente com os atributos do personagem
- integração do combo atual de 3 ataques com o novo sistema de dano
- integração do uso de skill em combate
- cálculo de dano físico
- cálculo de dano mágico
- aplicação de defesa e mitigação
- chance crítica
- recebimento de dano
- morte de personagem e inimigo
- recompensa de XP ao matar inimigos
- disparo do sistema de drops ao derrotar inimigos
- integração com atributos, equipamento e skills
- estrutura base para alvo único
- estrutura pronta para expansão futura em área, projéteis e buffs
- refatoração do que for necessário no combate atual sem quebrar a experiência já existente

### Não implementar neste prompt
- hotbar
- HUD final de combate
- IA dos inimigos
- pathfinding
- animações finais novas de ataque, exceto se forem necessárias para preservar o fluxo existente
- sprites finais
- efeitos visuais complexos
- partículas
- sons
- PvP
- multiplayer
- sistema avançado de combo além do combo atual já existente
- sistema completo de buffs/debuffs
- boss fights complexas
- sistema de lock-on
- parry
- esquiva avançada
- stamina de ação, a menos que já exista no projeto e precise ser preservada
- reescrita total do combate do zero

## Dependências e contexto

Este sistema depende de:
- sistema de atributos base
- sistema de atributos derivados
- sistema de XP/level up
- sistema de skills
- sistema de drops
- sistema de inventário/equipamentos
- sistema atual de combate já existente no projeto

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
- sistema de skills com cooldown e custo de MP
- sistema de XP
- sistema de drops
- sistema de atributos do equipamento
- inimigos com HP já implementado
- combo atual de 3 ataques já implementado
- lógica de hit ou dano parcial já implementada

### Dados que este prompt deve criar ou consolidar
- camada central de cálculo de dano
- camada central de aplicação de dano
- camada central de integração do combo atual com atributos
- estrutura unificada de combatente
- resultado estruturado de ataque e dano
- fluxo de morte
- fluxo de recompensa
- integração limpa entre combate atual e sistemas novos
- funções centrais para evitar lógica espalhada

## Requisitos funcionais

### 1. Auditar o combate atual antes de implementar mudanças
A primeira etapa da resposta deve ser a análise da implementação atual.

Você deve identificar:
- objetos envolvidos no combate
- scripts envolvidos
- eventos que disparam ataque
- eventos que recebem dano
- lógica do combo atual
- lógica de vida atual dos inimigos
- como o personagem já acerta os inimigos
- o que pode ser reaproveitado
- o que precisa ser encapsulado/refatorado

Funções/etapas esperadas:
- análise do fluxo atual
- proposta de integração em vez de substituição
- mapeamento claro do que será preservado

### 2. Preservar o combo atual de 3 ataques
O sistema atual já possui combo de 3 ataques ao clicar repetidamente.

Esse comportamento deve ser mantido.

O novo sistema deve:
- usar o combo atual como base
- integrar o cálculo de dano de cada golpe
- permitir que cada golpe do combo tenha multiplicador próprio
- não destruir a responsividade do combate atual

Campos/configuração esperados:
- `combo_attack_1_multiplier`
- `combo_attack_2_multiplier`
- `combo_attack_3_multiplier`

Funções esperadas:
- `combat_get_basic_attack_combo_stage()`
- `combat_get_basic_attack_multiplier(combo_stage)`

### 3. Criar estrutura base de combatente
Criar uma estrutura central reutilizável para entidades que participam de combate.

Ela deve servir para:
- player
- inimigos
- chefes futuramente

Campos esperados:
- `entity_id`
- `entity_type`
- `hp_current`
- `hp_max`
- `mp_current`
- `mp_max`
- `attack_physical`
- `attack_magic`
- `defense_total`
- `crit_chance`
- `is_alive`
- `level` opcional
- `combat_flags`

Isso pode ser aplicado por struct, componente ou organização equivalente ao padrão do projeto.

### 4. Criar cálculo central de dano físico
Todo dano físico deve passar por função central.

O cálculo deve considerar:
- ataque físico do atacante
- multiplicador do golpe
- bônus do equipamento
- bônus do combo
- crítico
- defesa do alvo
- clamps mínimos para evitar dano zero absoluto, se fizer sentido

Função esperada:
- `combat_calculate_physical_damage(attacker, target, attack_context)`

### 5. Criar cálculo central de dano mágico
Toda skill ou efeito mágico deve passar por função central.

O cálculo deve considerar:
- ataque mágico do atacante
- poder base da skill
- multiplicador da skill
- bônus relevantes
- defesa/resistência do alvo
- crítico mágico apenas se o design permitir; se não permitir, deixar isso explícito

Função esperada:
- `combat_calculate_magic_damage(attacker, target, skill_context)`

### 6. Integrar skills ao combate
O sistema de skills já existe e deve ser conectado ao combate atual.

Ao usar skill:
- validar custo de MP
- validar cooldown
- calcular dano ou efeito
- aplicar no alvo
- registrar resultado
- não duplicar regra de skill dentro do combate

Funções esperadas:
- `combat_use_skill_on_target(skill_id, attacker, target)`
- `combat_apply_skill_result(skill_result, target)`

### 7. Implementar chance crítica
O combate deve suportar crítico real.

Regras:
- usar `crit_chance` do atacante
- aplicar multiplicador configurável
- funcionar tanto em ataque normal quanto em skill, se o design permitir
- o cálculo deve ser centralizado

Campos/configuração esperados:
- `critical_damage_multiplier`

Funções esperadas:
- `combat_roll_critical(attacker)`
- `combat_apply_critical(damage_result)`

### 8. Implementar aplicação central de dano
Depois de calcular o dano, a aplicação no alvo deve ser unificada.

Função esperada:
- `combat_apply_damage(target, damage_result)`

Responsabilidades:
- reduzir `hp_current`
- impedir HP abaixo de 0
- registrar origem do dano
- marcar morte quando necessário
- devolver resultado estruturado

### 9. Implementar recebimento de dano no player e nos inimigos
A arquitetura deve permitir que:
- inimigos recebam dano do player
- player receba dano de inimigos
- ambos usem o mesmo núcleo de aplicação, com diferenças apenas de contexto

Funções esperadas:
- `combat_receive_damage(target, damage_result)`
- `combat_is_target_alive(target)`

### 10. Implementar morte de inimigo
Quando um inimigo morrer:
- marcar estado de morto
- impedir novas aplicações de dano
- disparar recompensa de XP
- disparar geração de drop
- chamar fluxo de morte do inimigo
- manter compatibilidade com a lógica atual do projeto

Função esperada:
- `combat_handle_enemy_death(enemy, killer)`

### 11. Implementar morte do player
Quando o player morrer:
- marcar estado de morto
- impedir ataques e skills
- interromper ações de combate
- preparar gancho para respawn futuro

Função esperada:
- `combat_handle_player_death(player, killer)`

Não precisa implementar respawn completo neste prompt, apenas a estrutura da morte.

### 12. Integrar XP ao combate
Ao matar inimigo:
- conceder XP ao player
- usar o sistema central de XP já criado
- não duplicar regra de XP dentro do combate

Função esperada:
- `combat_grant_kill_rewards(enemy, killer)`

### 13. Integrar drops ao combate
Ao matar inimigo:
- chamar o sistema central de drops
- gerar container de loot ou equivalente
- não embutir drop table dentro do combate

Função esperada:
- `combat_spawn_loot_from_enemy(enemy, killer)`

### 14. Integrar atributos de equipamento ao combate
O dano final do personagem deve refletir:
- arma equipada
- armadura e acessórios relevantes
- bônus agregados do equipamento
- bônus especiais e extras do item já calculados em sistemas anteriores

O combate não deve recalcular bônus de item manualmente.
Deve consumir os atributos finais já preparados pelo sistema do personagem.

### 15. Criar contexto de ataque
Cada ataque deve usar uma struct/contexto clara.

Campos esperados:
- `attack_type`
- `combo_stage`
- `base_multiplier`
- `skill_id` opcional
- `source_entity_id`
- `target_entity_id`
- `can_crit`
- `damage_school`
- `hit_flags`

Função esperada:
- `combat_build_attack_context(...)`

### 16. Retornar resultado estruturado em ações de combate
O combate deve retornar resultados claros para facilitar HUD, feedback e efeitos futuros.

Estrutura esperada:
- `success`
- `damage_amount`
- `damage_type`
- `was_critical`
- `target_died`
- `source_id`
- `target_id`
- `skill_id` opcional
- `combo_stage` opcional
- `failure_reason`

### 17. Não quebrar a responsividade do combate metroidvania já existente
A implementação deve respeitar o estilo atual do jogo.

Isso significa:
- preservar o timing do combo
- não inserir camadas desnecessárias que atrasem o clique
- não travar o fluxo já funcional
- adaptar a lógica nova ao fluxo atual

Se o combate atual já usa hitbox, animation event, alarm, state machine ou script específico, a nova implementação deve se encaixar nisso, não substituir cegamente.

### 18. Preparar expansão futura
A arquitetura deve ficar pronta para:
- dano em área
- projéteis
- buffs e debuffs
- chefes
- golpes pesados
- variações de combo
- PvP futuro

Mas nada disso deve ser implementado agora além da preparação estrutural.

## Arquitetura esperada

### Configuração
Criar local central para:
- multiplicadores do combo de 3 ataques
- multiplicador de crítico
- clamps de dano
- flags de skill crítica ou não
- regras de morte
- parâmetros base de combate
- integração com ataque normal e skill

### Estado
Separar claramente:
- estado de combate do player
- estado de combate dos inimigos
- contexto do ataque atual
- resultado do último dano
- estado vivo/morto
- caches de atributos já calculados

### Funções centrais
Funções esperadas:
- `combat_get_basic_attack_combo_stage()`
- `combat_get_basic_attack_multiplier(combo_stage)`
- `combat_build_attack_context(...)`
- `combat_calculate_physical_damage(attacker, target, attack_context)`
- `combat_calculate_magic_damage(attacker, target, skill_context)`
- `combat_roll_critical(attacker)`
- `combat_apply_critical(damage_result)`
- `combat_apply_damage(target, damage_result)`
- `combat_receive_damage(target, damage_result)`
- `combat_use_skill_on_target(skill_id, attacker, target)`
- `combat_apply_skill_result(skill_result, target)`
- `combat_is_target_alive(target)`
- `combat_handle_enemy_death(enemy, killer)`
- `combat_handle_player_death(player, killer)`
- `combat_grant_kill_rewards(enemy, killer)`
- `combat_spawn_loot_from_enemy(enemy, killer)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir atributos finais do personagem
- consumir skills já implementadas
- consumir sistema de XP
- consumir sistema de drops
- preservar combo atual já existente
- preparar integração futura com HUD, hotbar e IA
- não depender de UI para a lógica central funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. analisar corretamente o combate atual antes de implementar mudanças
2. preservar o combo atual de 3 ataques
3. integrar o combo atual ao cálculo real de dano
4. calcular dano físico corretamente
5. calcular dano mágico corretamente
6. aplicar crítico corretamente
7. aplicar defesa/mitigação corretamente
8. aplicar dano corretamente em inimigos
9. aplicar dano corretamente no player
10. impedir dano em entidade já morta
11. matar inimigo corretamente ao chegar em 0 HP
12. matar player corretamente ao chegar em 0 HP
13. conceder XP corretamente ao matar inimigo
14. disparar drops corretamente ao matar inimigo
15. usar skills em combate respeitando MP e cooldown
16. retornar resultado estruturado nas ações de combate
17. manter a responsividade do combate metroidvania atual
18. não reescrever do zero o combate existente sem necessidade
19. manter arquitetura pronta para expansão futura sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta do combate atual encontrado no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de combate em vários lugares
- não misturar UI com regra de negócio
- não ignorar o combate atual já existente no projeto
- não substituir o sistema atual por outro genérico sem antes analisar o que já existe
- não quebrar o combo atual de 3 ataques
- não implementar HUD neste prompt
- não implementar IA de inimigos neste prompt
- não implementar PvP neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders