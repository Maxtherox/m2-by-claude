# Implementar IA base dos inimigos, aggro, combate PvE e respawn estilo Metin2 no GameMaker

## Objetivo

Implementar a IA base dos inimigos do jogo, incluindo idle, patrulha simples, detecção do player, perseguição, ataque, retorno ao ponto de origem, morte e respawn automático em loop, inspirado no comportamento prático de grind do Metin2. Este prompt resolve a camada de comportamento dos monstros no mapa e o ciclo completo de vida e reaparecimento, sem reescrever o combate que já existe.

Este prompt vem depois de:
- `15-sistema-combate-base.md`
- `17-hud-completa-de-combate.md`

Este prompt vem antes de:
- prompt de bosses
- prompt de mapas/áreas/spawn zones avançadas
- prompt de quests ligadas a monstros
- prompt de navegação avançada e comportamento especial por tipo de monstro

## Escopo

### Implementar neste prompt
- IA base de inimigos comuns
- estados de comportamento
- idle
- patrulha simples ou variação de espera
- detecção do player
- aggro
- perseguição
- ataque básico do inimigo
- cooldown de ataque do inimigo
- retorno ao ponto de origem quando perder o alvo
- leash/range máximo de perseguição
- morte do inimigo
- bloqueio de ações quando morto
- respawn automático do inimigo
- respawn contínuo no mapa em estilo grind semelhante ao Metin2
- sistema de spawn point
- tempo de respawn configurável
- controle para evitar duplicação errada de inimigos
- integração com combate, XP e drops
- suporte a múltiplos inimigos no mapa
- estrutura pronta para elites, bosses e variações futuras

### Não implementar neste prompt
- boss AI complexa
- pathfinding avançado em grid/navmesh
- skills especiais de inimigo
- projéteis complexos
- padrões avançados de fase
- comportamentos cooperativos entre monstros
- summons
- mapa procedural
- spawn dinâmico por evento global
- quests
- cutscenes
- diálogos
- loot especial de boss
- pet system
- PvP
- multiplayer
- reescrita total do combate do player
- HUD nova
- sistema de grupos avançados de monstros
- elite/boss mechanics completas

## Dependências e contexto

Este prompt depende de:
- `15-sistema-combate-base.md`
- `13-sistema-drops-e-materiais.md`
- sistemas atuais de inimigo já existentes no projeto, se houver
- sistema de combate metroidvania já funcional no player

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- inimigos já com HP ou estrutura equivalente
- sistema de combate central
- sistema de morte do inimigo
- concessão de XP ao matar inimigo
- geração de drops ao matar inimigo
- player controlável no mapa
- posição do player e dos inimigos
- resultado estruturado de dano e morte
- alvo atual ou capacidade de localizar o player

### Dados que este prompt deve criar
- enum de estados da IA
- struct/estado interno do inimigo
- sistema de spawn point
- sistema de respawn
- temporizador de respawn
- ponto de origem do monstro
- raio de detecção
- raio de leash/perseguição
- alcance de ataque
- cooldown de ataque do inimigo
- funções centrais de transição de estado
- integração entre inimigo morto e respawn futuro

## Requisitos funcionais

### 1. Analisar a estrutura atual dos inimigos antes de alterar o comportamento
Antes de implementar mudanças, você deve analisar como os inimigos já funcionam hoje no projeto.

Você deve identificar:
- quais objetos de inimigo já existem
- como a vida do inimigo está armazenada
- como o dano é recebido hoje
- como a morte do inimigo acontece hoje
- quais eventos e scripts já controlam movimentação ou ataque
- o que deve ser preservado
- o que precisa ser encapsulado/refatorado

Você não deve apagar o que já funciona sem necessidade.

### 2. Criar enum de estados da IA
Criar enum ou estrutura equivalente para os estados mínimos do inimigo.

Estados esperados:
- `ENEMY_STATE_IDLE`
- `ENEMY_STATE_PATROL`
- `ENEMY_STATE_CHASE`
- `ENEMY_STATE_ATTACK`
- `ENEMY_STATE_RETURN`
- `ENEMY_STATE_DEAD`
- `ENEMY_STATE_RESPAWNING`

Enum esperado:
- `EnemyAIState`

### 3. Criar estrutura base de estado do inimigo
Cada inimigo deve possuir estado interno claro.

Campos esperados:
- `enemy_id`
- `enemy_type_id`
- `ai_state`
- `spawn_point_x`
- `spawn_point_y`
- `current_target_id`
- `is_aggroed`
- `is_alive`
- `respawn_enabled`
- `respawn_time_seconds`
- `respawn_timer`
- `detection_radius`
- `leash_radius`
- `attack_range`
- `attack_cooldown`
- `attack_cooldown_remaining`
- `return_tolerance`
- `move_speed`
- `idle_timer`
- `state_timer`
- `spawn_group_id` opcional
- `enemy_level` opcional

### 4. Implementar estado idle
No estado idle o inimigo deve:
- ficar parado
- poder alternar animação de espera
- monitorar a presença do player
- transicionar para patrulha ou chase conforme configuração

Funções esperadas:
- `enemy_ai_update_idle(enemy)`
- `enemy_ai_can_detect_player(enemy, player)`

### 5. Implementar patrulha simples
Se a configuração permitir, o inimigo deve poder:
- andar em pequena área ao redor do ponto de spawn
- alternar entre mover e esperar
- nunca se afastar demais do ponto de origem

Funções esperadas:
- `enemy_ai_update_patrol(enemy)`
- `enemy_ai_get_patrol_target(enemy)`

A patrulha pode ser simples. Não precisa pathfinding complexo.

### 6. Implementar detecção do player e aggro
O inimigo deve detectar o player por raio.

Regras:
- ao entrar no raio de detecção, o inimigo adquire alvo
- o inimigo muda para chase
- o aggro deve ser consistente e não ficar oscilando de forma caótica
- a detecção deve respeitar o estado do inimigo

Funções esperadas:
- `enemy_ai_find_target(enemy)`
- `enemy_ai_acquire_target(enemy, target_id)`
- `enemy_ai_should_enter_chase(enemy, player)`

### 7. Implementar perseguição
No estado chase o inimigo deve:
- perseguir o alvo atual
- respeitar velocidade de movimento do inimigo
- respeitar o leash radius
- mudar para ataque quando estiver em alcance
- mudar para return se perder o alvo ou exceder a distância máxima

Funções esperadas:
- `enemy_ai_update_chase(enemy)`
- `enemy_ai_is_target_in_attack_range(enemy, target)`
- `enemy_ai_is_target_lost(enemy, target)`

### 8. Implementar ataque básico do inimigo
No estado attack o inimigo deve:
- parar ou ajustar posição conforme o alcance
- atacar apenas quando o cooldown permitir
- aplicar dano ao player usando o sistema central de combate
- voltar para chase se o player sair do alcance
- não atacar se estiver morto ou sem alvo válido

Funções esperadas:
- `enemy_ai_update_attack(enemy)`
- `enemy_ai_can_attack(enemy, target)`
- `enemy_ai_execute_attack(enemy, target)`

### 9. Integrar ataque do inimigo ao combate central
O ataque do inimigo não deve recalcular dano de forma isolada.

Ele deve:
- montar contexto de ataque
- chamar o sistema central de combate
- aplicar dano ao player pelo núcleo já existente
- respeitar crítica, mitigação e morte conforme sistema central

Funções esperadas:
- `enemy_combat_build_attack_context(enemy, target)`
- `enemy_combat_attack_player(enemy, target)`

### 10. Implementar retorno ao ponto de origem
Quando o inimigo perder o alvo ou ultrapassar o leash:
- ele deve parar de perseguir
- limpar aggro
- voltar para o ponto de spawn
- ao chegar perto do ponto de origem, voltar para idle ou patrol

Funções esperadas:
- `enemy_ai_update_return(enemy)`
- `enemy_ai_clear_target(enemy)`
- `enemy_ai_has_returned_to_spawn(enemy)`

### 11. Implementar estado morto
Quando o inimigo morrer:
- entrar em estado `DEAD`
- parar movimento
- parar detecção
- parar ataques
- impedir múltiplas execuções de morte
- disparar XP e drop apenas uma vez
- iniciar timer de respawn se o respawn estiver ativo

Funções esperadas:
- `enemy_ai_on_death(enemy, killer)`
- `enemy_ai_enter_dead_state(enemy)`

### 12. Implementar respawn automático estilo Metin2
Esse ponto é obrigatório.

O sistema deve fazer os monstros reaparecerem continuamente depois de mortos, em loop, como em áreas de grind do Metin2.

Regras:
- cada inimigo ou spawn point deve possuir `respawn_time_seconds`
- após a morte, inicia o timer
- ao concluir o timer, o monstro reaparece no ponto de origem
- o monstro volta com HP cheio
- o monstro reaparece em estado idle ou patrol
- o respawn não pode duplicar entidades incorretamente
- o respawn deve ser previsível e configurável

Funções esperadas:
- `enemy_respawn_start(enemy)`
- `enemy_respawn_update(enemy)`
- `enemy_respawn_execute(enemy)`

### 13. Criar sistema de spawn point
O respawn não deve depender apenas da entidade viva original.

Quero estrutura clara de spawn point, que possa gerar e regenerar monstros.

Campos esperados:
- `spawn_id`
- `enemy_type_id`
- `spawn_x`
- `spawn_y`
- `respawn_time_seconds`
- `max_alive_count`
- `current_alive_count`
- `respawn_enabled`
- `spawn_radius` opcional
- `spawn_profile_id` opcional

Funções esperadas:
- `enemy_spawn_point_create(...)`
- `enemy_spawn_point_spawn_enemy(spawn_id)`
- `enemy_spawn_point_on_enemy_death(spawn_id, enemy_id)`

### 14. Permitir dois modos de respawn
A arquitetura deve suportar pelo menos dois modos:

#### Modo A: respawn pela própria entidade
A entidade morre, espera e reaparece reutilizando a própria instância ou controle equivalente.

#### Modo B: respawn por spawn point
A entidade morta é removida e o spawn point cria uma nova entidade quando o timer terminar.

A IA pode escolher qual modelo implementar como principal, mas deve estruturar de forma clara e robusta para mapas com muitos monstros.

### 15. Integrar morte do inimigo com XP e drops
Ao morrer:
- conceder XP ao jogador pelo sistema central
- disparar drops pelo sistema central
- marcar o spawn para respawn futuro
- não duplicar essas recompensas no respawn

Funções esperadas:
- `enemy_ai_handle_kill_rewards(enemy, killer)`
- `enemy_ai_handle_respawn_link(enemy)`

### 16. Suportar múltiplos inimigos ativos simultaneamente
O sistema deve funcionar corretamente com vários monstros no mapa ao mesmo tempo.

Requisitos:
- cada inimigo com seu próprio estado
- cada spawn point com seu próprio timer
- sem vazamento de referência de alvo
- sem bug de um monstro controlar estado do outro

### 17. Preparar IA para variações futuras
A arquitetura deve permitir no futuro:
- inimigos agressivos e passivos
- monstros que não patrulham
- monstros com maior leash
- elites
- bosses
- ataques especiais
- monstros que atacam à distância

Não implementar isso agora além da estrutura de configuração.

### 18. Respeitar o combate metroidvania já existente
A IA deve se encaixar no combate atual, não o contrário.

Requisitos:
- não quebrar hitboxes/hurtboxes atuais
- não substituir o fluxo atual de dano do player
- se já existe lógica parcial de knockback, dano ou morte, integrar em vez de apagar
- preservar fluidez de combate do jogo

## Arquitetura esperada

### Configuração
Criar local central para:
- enum de estados da IA
- raios padrão de detecção
- raios de leash
- alcance de ataque
- cooldown padrão de ataque
- tempos padrão de respawn
- flags de idle/patrol
- parâmetros por tipo de inimigo
- perfil de spawn point

### Estado
Separar claramente:
- estado individual do inimigo
- estado do spawn point
- alvo atual do inimigo
- timers de ataque
- timers de idle
- timers de respawn
- vínculo entre inimigo e spawn point

### Funções centrais
Funções esperadas:
- `enemy_ai_init(enemy)`
- `enemy_ai_update(enemy)`
- `enemy_ai_change_state(enemy, new_state)`
- `enemy_ai_update_idle(enemy)`
- `enemy_ai_update_patrol(enemy)`
- `enemy_ai_update_chase(enemy)`
- `enemy_ai_update_attack(enemy)`
- `enemy_ai_update_return(enemy)`
- `enemy_ai_find_target(enemy)`
- `enemy_ai_acquire_target(enemy, target_id)`
- `enemy_ai_clear_target(enemy)`
- `enemy_ai_can_detect_player(enemy, player)`
- `enemy_ai_is_target_in_attack_range(enemy, target)`
- `enemy_ai_is_target_lost(enemy, target)`
- `enemy_ai_can_attack(enemy, target)`
- `enemy_ai_execute_attack(enemy, target)`
- `enemy_ai_on_death(enemy, killer)`
- `enemy_ai_enter_dead_state(enemy)`
- `enemy_respawn_start(enemy)`
- `enemy_respawn_update(enemy)`
- `enemy_respawn_execute(enemy)`
- `enemy_spawn_point_create(...)`
- `enemy_spawn_point_spawn_enemy(spawn_id)`
- `enemy_spawn_point_on_enemy_death(spawn_id, enemy_id)`
- `enemy_ai_handle_kill_rewards(enemy, killer)`
- `enemy_ai_handle_respawn_link(enemy)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir o sistema central de combate
- consumir XP e drops ao morrer
- respeitar o combate atual já existente
- preparar integração futura com elites e bosses
- preparar integração futura com mapas e spawn zones avançadas
- não depender de HUD para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. analisar corretamente a estrutura atual dos inimigos antes de alterar o comportamento
2. inimigo entrar em idle corretamente
3. inimigo patrulhar corretamente quando a configuração permitir
4. inimigo detectar o player corretamente dentro do raio
5. inimigo adquirir aggro corretamente
6. inimigo perseguir o player corretamente
7. inimigo atacar apenas dentro do alcance
8. inimigo respeitar cooldown de ataque
9. inimigo aplicar dano ao player via sistema central de combate
10. inimigo parar de perseguir ao perder o alvo
11. inimigo retornar ao ponto de origem corretamente
12. inimigo entrar em estado morto corretamente
13. XP e drops serem disparados apenas uma vez por morte
14. timer de respawn iniciar corretamente após a morte
15. monstro reaparecer automaticamente após o tempo configurado
16. monstro reaparecer no ponto de origem com HP cheio
17. respawn não duplicar monstros incorretamente
18. múltiplos monstros e múltiplos spawn points funcionarem ao mesmo tempo
19. arquitetura ficar pronta para elites e bosses sem retrabalho grande
20. comportamento de respawn ficar compatível com grind contínuo estilo Metin2

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta da estrutura atual dos inimigos encontrada no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de IA em vários lugares
- não misturar UI com regra de negócio
- não ignorar a estrutura atual dos inimigos já existente no projeto
- não reescrever do zero o sistema atual sem antes analisar o que já existe
- não esquecer o respawn automático dos monstros em loop
- não implementar bosses complexos neste prompt
- não implementar HUD neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders