# Implementar sistema completo de drops, materiais e loot de inimigos no GameMaker

## Objetivo

Implementar o sistema completo de drops do jogo, com tabelas de loot por inimigo, geração de materiais, gold, itens consumíveis e itens especiais, tudo integrado ao inventário e aos sistemas de refino e bônus já criados. Este prompt resolve a origem dos itens e materiais do gameplay, especialmente os usados no ferreiro, em consumíveis especiais e na progressão geral do personagem.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`

Este prompt vem antes de:
- prompt de NPC/lojas
- prompt de coleta automática/manual de loot, se você quiser separar depois
- prompt de baú/cofres/drop especial de chefes, se quiser detalhar depois

## Escopo

### Implementar neste prompt
- sistema de loot por inimigo
- tabelas de drop centralizadas
- geração de materiais de refino
- geração de gold
- geração de consumíveis
- geração de itens especiais
- geração de itens misc e de quest
- suporte a quantidades variáveis
- suporte a chance individual por entrada
- suporte a pesos/rolagens de grupos
- suporte a drops garantidos e não garantidos
- suporte a diferenças entre monstro comum, elite, chefe e metin/objeto especial
- integração com inventário
- integração com materiais usados no ferreiro
- integração com consumíveis especiais já existentes
- estrutura de loot no chão ou container temporário de drop
- função central de coleta do drop
- arquitetura pronta para balanceamento por tabelas

### Não implementar neste prompt
- IA dos monstros
- sistema de combate
- spawn de inimigos
- pathfinding
- sistema de quest completo
- lojas
- crafting genérico
- trade
- chest/baús especiais complexos
- eventos globais de drop rate
- UI complexa de tooltip de loot
- pet que coleta item
- auto loot avançado
- filtros avançados de pickup
- drop por fishing/mineração/coleta, a menos que seja apenas estrutura preparada
- sons e partículas
- animações complexas de queda

## Dependências e contexto

Este sistema depende de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de itens
- instâncias de item
- inventário do jogador
- sistema de gold
- sistema de materiais consumidos no ferreiro
- sistema de consumíveis especiais
- enums/categorias de item
- funções centrais de adicionar item ao inventário
- funções centrais de adicionar/remover gold

### Dados que este prompt deve criar
- catálogo de inimigos elegíveis para drop
- tabelas de drop por inimigo ou grupo
- grupos de drop
- entradas de drop
- categorias de drop
- geração de loot ao derrotar inimigo
- container temporário de loot no chão
- função de coleta do loot
- estrutura de fallback quando inventário estiver cheio
- suporte a gold como drop
- suporte a quantidades variáveis e múltiplos itens por kill

## Requisitos funcionais

### 1. Criar enum de tipos de fonte de drop
Criar enums ou estruturas equivalentes para diferenciar a origem do loot.

Tipos mínimos esperados:
- `MONSTER_COMMON`
- `MONSTER_ELITE`
- `MONSTER_BOSS`
- `METIN_OBJECT`
- `QUEST_SOURCE`
- `SPECIAL_EVENT_SOURCE` preparado para futuro

Enums esperados:
- `DropSourceType`
- `DropEntryType`
- `LootContainerType`

### 2. Criar estrutura central de tabelas de drop
As regras de drop devem vir de tabelas centrais, não de lógica espalhada por inimigo.

Cada tabela deve permitir:
- identificar o inimigo, grupo ou família de inimigo
- listar entradas de drop
- definir gold mínimo/máximo
- definir drops garantidos
- definir drops aleatórios
- definir materiais de refino
- definir grupos exclusivos e grupos cumulativos

Funções esperadas:
- `drops_build_table_catalog()`
- `drops_get_table_for_enemy(enemy_id_or_group_id)`

### 3. Criar estrutura de entrada de drop
Cada entrada de drop deve suportar ao menos:

- `entry_id`
- `item_id`
- `drop_chance`
- `min_quantity`
- `max_quantity`
- `is_guaranteed`
- `weight`
- `entry_type`
- `required_conditions` opcional
- `group_id` opcional
- `unique_within_group` opcional

Isso deve permitir:
- drop simples por chance
- drop garantido
- drop por grupo de peso
- múltiplos itens na mesma morte
- grupos exclusivos onde só um item sai

### 4. Criar suporte a gold como parte do loot
Gold deve poder ser dropado separadamente dos itens.

Requisitos:
- valor mínimo e máximo configurável por inimigo/tabela
- suporte a multiplicadores futuros
- gold não deve ocupar slot de inventário
- gold pode ir para o container de loot ou ser creditado direto, conforme configuração

Funções esperadas:
- `drops_roll_gold(drop_table)`
- `loot_collect_gold(container_id)` ou equivalente

### 5. Criar suporte a materiais de refino como drops reais
Os materiais usados no ferreiro devem existir como itens normais do jogo e poder dropar de inimigos.

Requisitos:
- materiais devem usar `item_id` reais do catálogo global
- tabelas de drop devem apontar para esses `item_id`
- o sistema não deve tratar material como categoria separada fora do sistema de item

Isso é obrigatório para integrar com o prompt do ferreiro sem gambiarra.

### 6. Criar suporte a consumíveis e itens especiais no loot
O sistema deve suportar drop de:
- poções
- consumíveis de buff
- Pergaminho do Ferreiro
- Pergaminho da Paz
- Pergaminho do Feitiço
- Esfera da Benção
- Arumaka
- Jolla
- itens misc
- itens de quest
- materiais especiais

Tudo deve sair da mesma base de tabelas, sem hardcode específico por item dentro da função principal.

### 7. Criar suporte a grupos de drop
O sistema deve permitir grupos de drop independentes.

Tipos de grupo esperados:
- grupo cumulativo: pode dropar mais de um item
- grupo exclusivo: apenas um item do grupo é escolhido
- grupo garantido: sempre roda
- grupo opcional: roda por chance

Funções esperadas:
- `drops_build_group_catalog()`
- `drops_roll_group(group_id)`

### 8. Implementar função central de rolagem de loot
Criar a função principal que recebe um inimigo derrotado e gera o loot correspondente.

Função esperada:
- `drops_generate_for_enemy(enemy_id, context_data)`

Responsabilidades:
- localizar a tabela correta
- rolar gold
- rolar grupos e entradas
- gerar lista estruturada de loot
- criar container de loot ou retorno estruturado
- manter a lógica centralizada

### 9. Criar container temporário de loot no chão
O loot gerado deve poder existir temporariamente antes de ser coletado.

Campos esperados:
- `loot_container_id`
- `source_enemy_id`
- `position_x`
- `position_y`
- `gold_amount`
- `item_entries`
- `created_time`
- `expire_time`
- `is_collected`

Funções esperadas:
- `loot_container_create(x, y, loot_result)`
- `loot_container_expire(container_id)`

A implementação pode ser simples, mas a estrutura precisa existir.

### 10. Implementar coleta do loot
Criar a função central de coleta do loot gerado.

Função esperada:
- `loot_collect(container_id, collector_id)` ou equivalente

Responsabilidades:
- tentar adicionar itens ao inventário
- adicionar gold
- registrar itens que não couberam
- esvaziar ou remover container quando coletado totalmente
- retornar resultado estruturado

### 11. Implementar fallback para inventário cheio
Se o inventário estiver cheio:
- não perder os itens silenciosamente
- retornar quais itens não entraram
- permitir manter parte do loot no container
- coletar gold separadamente se essa for a regra adotada

Funções esperadas:
- `loot_try_add_items_to_inventory(item_list)`
- `loot_get_remaining_items_after_collect(container_id)`

A regra deve ser consistente e documentada.

### 12. Implementar suporte a quantidades variáveis
Cada entrada deve permitir:
- quantidade fixa
- quantidade aleatória entre mínimo e máximo
- múltiplos materiais de uma mesma entrada
- gold aleatório por faixa

Funções esperadas:
- `drops_roll_quantity(entry)`
- `drops_roll_entry(entry)`

### 13. Implementar suporte a inimigos comuns, elites, chefes e objetos especiais
O sistema deve permitir tabelas diferentes para:
- monstro comum
- monstro elite
- chefe
- metin/rocha/objeto especial

A arquitetura deve permitir:
- chance melhor para chefes
- mais gold em elite/chefe
- grupos exclusivos de drop raro
- materiais específicos por família de inimigo

### 14. Criar estrutura para famílias ou grupos de inimigo
Em vez de cadastrar tudo por `enemy_id` isolado, o sistema deve suportar grupos/famílias.

Exemplos conceituais:
- lobo
- orc
- demônio
- fera
- chefe de caverna
- metin de certo nível

Campos esperados:
- `enemy_drop_group_id`
- `enemy_level_band` opcional

Funções esperadas:
- `drops_get_table_for_group(group_id)`

### 15. Preparar suporte a condições de drop
A arquitetura deve permitir condições futuras como:
- nível mínimo do jogador
- tipo de mapa
- boss kill
- status de quest
- evento ativo
- multiplicador de drop temporário

Não precisa implementar todas agora, mas a estrutura de `required_conditions` deve existir de forma limpa.

### 16. Integrar drops com o sistema de itens existente
Os drops devem gerar:
- itens normais do catálogo
- instâncias de item quando necessário
- stacks quando apropriado

O sistema deve respeitar:
- `max_stack`
- `is_stackable`
- categoria/subtipo do item
- integridade com inventário

### 17. Retornar resultado estruturado da geração de loot
A função central de geração deve retornar estrutura clara.

Campos esperados:
- `success`
- `source_enemy_id`
- `drop_table_id`
- `gold_amount`
- `generated_items`
- `generated_groups`
- `container_created`
- `container_id`
- `failure_reason`

### 18. Retornar resultado estruturado da coleta
A coleta também deve retornar estrutura clara.

Campos esperados:
- `success`
- `container_id`
- `gold_collected`
- `items_collected`
- `items_left_in_container`
- `inventory_full`
- `failure_reason`

### 19. Preparar integração com UI futura de loot
Mesmo sem fazer a UI completa agora, a arquitetura deve ficar pronta para:
- popup de loot
- janela de drop
- texto flutuante
- indicação visual de itens raros
- auto loot opcional no futuro

A lógica central não deve depender da UI.

### 20. Preparar balanceamento por tabelas
As chances, pesos, grupos e quantidades devem ser facilmente ajustáveis.

Quero estrutura pronta para:
- mudar drop rate por família de inimigo
- testar materiais de refino por faixa
- ajustar rareza de consumíveis especiais
- criar drops temáticos por mapa/bioma depois

## Arquitetura esperada

### Configuração
Criar local central para:
- enum de tipos de fonte de drop
- catálogo de grupos de drop
- tabelas de drop por inimigo/grupo
- parâmetros de gold
- regras de expiração de container
- flags de auto coleta futura
- condições opcionais de drop
- grupos exclusivos e cumulativos

### Estado
Separar claramente:
- catálogo de tabelas de drop
- grupos de drop
- containers de loot ativos
- lista de itens gerados por container
- gold por container
- estado de coleta e expiração

### Funções centrais
Funções esperadas:
- `drops_build_table_catalog()`
- `drops_build_group_catalog()`
- `drops_get_table_for_enemy(enemy_id_or_group_id)`
- `drops_get_table_for_group(group_id)`
- `drops_roll_gold(drop_table)`
- `drops_roll_quantity(entry)`
- `drops_roll_entry(entry)`
- `drops_roll_group(group_id)`
- `drops_generate_for_enemy(enemy_id, context_data)`
- `loot_container_create(x, y, loot_result)`
- `loot_container_expire(container_id)`
- `loot_collect(container_id, collector_id)`
- `loot_try_add_items_to_inventory(item_list)`
- `loot_get_remaining_items_after_collect(container_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir catálogo de itens do inventário
- gerar materiais reais usados no ferreiro
- gerar consumíveis especiais do sistema de bônus/refino
- adicionar gold ao jogador
- respeitar stacks e limites do inventário
- preparar integração futura com UI de loot, NPCs, mapas e eventos
- não depender do sistema de combate para a lógica central funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de tabelas de drop
2. criar grupos de drop cumulativos e exclusivos
3. gerar gold corretamente por inimigo
4. gerar materiais de refino corretamente como itens reais
5. gerar consumíveis e itens especiais corretamente
6. suportar quantidades fixas e variáveis
7. suportar drops garantidos e não garantidos
8. suportar tabelas diferentes para monstro comum, elite, chefe e metin/objeto
9. gerar container de loot corretamente ao derrotar inimigo
10. coletar gold corretamente
11. coletar itens corretamente para o inventário
12. respeitar stacks ao coletar
13. lidar corretamente com inventário cheio
14. não perder itens silenciosamente quando não houver espaço
15. retornar resultado estruturado consistente na geração
16. retornar resultado estruturado consistente na coleta
17. manter arquitetura pronta para balanceamento por tabelas
18. manter arquitetura pronta para integração com sistemas futuros sem retrabalho

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de drop em vários lugares
- não misturar UI com regra de negócio
- não hardcodar drops diretamente nos inimigos
- não implementar combate neste prompt
- não implementar IA de monstros neste prompt
- não implementar lojas neste prompt
- não criar apenas mock sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders