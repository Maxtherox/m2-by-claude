# Implementar sistema completo de itens, atributos base, bônus especiais e bônus extras no GameMaker

## Objetivo

Implementar a arquitetura central dos itens equipáveis do jogo, separando corretamente definição base do item, instância do item, atributos fixos, bônus especiais do item, bônus extras 1–5 e bônus extras 6/7. Este prompt resolve o núcleo do sistema “Metin-like” de itemização, deixando o projeto pronto para reroll, adição de bônus, consumo de itens especiais e integração futura com ferreiro, drops e inventário.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`

Este prompt vem antes de:
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`

## Escopo

### Implementar neste prompt
- definição completa de item equipável
- separação entre definição global e instância do item
- atributos base fixos do item
- bônus especiais nativos do item
- sistema de bônus extras 1–5
- sistema de bônus extras 6/7
- pools de bônus por categoria/slot
- validação de compatibilidade de bônus por item
- regras de quantidade máxima de bônus por camada
- reroll de bônus 1–5
- adição do 5º bônus
- adição de bônus 6º e 7º
- integração com itens consumíveis especiais
- cálculo final dos bônus do item equipado
- integração com inventário e atributos do personagem
- arquitetura pronta para balanceamento por tabelas

### Não implementar neste prompt
- sistema do ferreiro/refino
- chance de quebrar item por upgrade
- receitas com materiais de refino
- drop de monstros
- lojas/NPCs
- crafting
- sockets/pedras
- sistema de trade
- tooltip final completa
- visual completo de reroll em UI
- sistema de raridade procedural
- economia do jogo
- reforço por pergaminho do ferreiro
- aprimoramento +0 até +9

## Dependências e contexto

Este prompt depende de:
- `10-sistema-inventario-completo.md`
- sistema de atributos derivados do personagem
- sistema de consumíveis já iniciado nos prompts anteriores

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de itens
- instância de item
- slots de equipamento
- função de equipar/desequipar item
- função central de recálculo de atributos do personagem
- sistema de inventário
- sistema de consumíveis base

### Dados que este prompt deve criar
- enums de tipos de bônus
- enums de camadas de bônus
- pools de bônus por categoria/slot
- estrutura de bônus base do item
- estrutura de bônus especiais do item
- estrutura de bônus extras 1–5
- estrutura de bônus extras 6/7
- sistema de geração e reroll de bônus
- sistema de validação por categoria do item
- integração com consumíveis especiais como:
  - Pergaminho do Feitiço
  - Esfera da Benção
  - Arumaka
  - Jolla
- funções de cálculo agregado de bônus do item equipado

## Requisitos funcionais

### 1. Criar enum de categorias, slots e camadas de bônus
Criar enums ou estruturas equivalentes para separar claramente:

#### Categorias de item
- `WEAPON`
- `ARMOR`
- `HELMET`
- `SHIELD`
- `BOOTS`
- `NECKLACE`
- `EARRING`
- `BRACELET`
- `GLOVE`
- `TALISMAN`
- outras categorias equipáveis que o projeto já use

#### Camadas de bônus
- `BASE_STATS`
- `SPECIAL_NATIVE_BONUSES`
- `EXTRA_BONUSES_1_TO_5`
- `EXTRA_BONUSES_6_TO_7`

Enums esperados:
- `ItemCategory`
- `EquipmentSlotType`
- `ItemBonusLayer`
- `ItemBonusType`

### 2. Criar separação obrigatória entre as camadas de bônus do item
A arquitetura do item deve separar de forma explícita:

#### Atributos base fixos
Exemplos:
- ataque físico base da arma
- ataque mágico base da arma
- defesa base da armadura
- velocidade de ataque nativa do item
- HP base do item
- outros atributos fixos definidos pelo item

#### Bônus especiais nativos
Exemplos:
- dano médio %
- dano de skill %
- outros bônus especiais que são nativos de certos itens e fazem parte da identidade daquele item

#### Bônus extras 1–5
Camada separada, rerrolável por item específico

#### Bônus extras 6/7
Camada completamente separada, com pool própria e reroll próprio

Essa separação é obrigatória.

### 3. Criar estrutura de definição global do item
A definição global do item deve conter ao menos:

- `id`
- `name`
- `category`
- `equip_slot_type`
- `required_level`
- `base_stats`
- `special_native_bonuses`
- `allowed_bonus_pool_1_to_5_id`
- `allowed_bonus_pool_6_to_7_id`
- `max_extra_bonus_count_1_to_5`
- `max_extra_bonus_count_6_to_7`
- `flags`
- `icon_index` opcional
- `description`

Funções esperadas:
- `items_get_definition(item_id)`
- `items_build_catalog()`

### 4. Criar estrutura da instância do item
A instância do item deve armazenar os dados variáveis.

Campos esperados:
- `instance_id`
- `item_id`
- `refine_level` preparado para prompt futuro
- `extra_bonuses_1_to_5`
- `extra_bonuses_6_to_7`
- `generated_state`
- `locked`
- `owner_bound` opcional
- `instance_flags`

A instância não deve duplicar a definição global desnecessariamente.

### 5. Criar enum/tabela dos tipos de bônus possíveis
Criar uma tabela central de bônus possíveis.

Ela deve suportar ao menos grupos como:
- fortes contra raças/monstros
- resistências elementais
- defesas contra tipos de arma
- HP máximo
- MP/SP máximo
- absorção HP/SP
- crítico
- perfurante
- atordoamento
- lentidão
- veneno
- sangramento
- refletir
- bloquear
- evitar flecha
- velocidade de ataque
- velocidade de movimento
- velocidade de conjuração
- bônus de EXP
- bônus de gold/yang
- drop de item
- roubo de SP
- STR/FOR
- DEX
- INT
- VIT
- dano médio %
- dano de skill %
- valor de ataque
- valor de ataque mágico
- poder elemental
- bônus específicos de chefes/metins/monstros quando aplicável

A tabela deve ser centralizada e orientada a dados.

### 6. Criar pools de bônus por categoria/slot para bônus 1–5
Os bônus 1–5 não podem ser tratados como uma lista universal.

O sistema deve permitir pool por categoria/slot, por exemplo:
- armas
- armaduras
- elmos
- escudos
- pulseiras/braceletes
- brincos
- colares
- sapatos/botas
- talismãs
- luvas

Cada pool deve listar:
- bônus permitidos
- valor mínimo
- valor máximo
- peso/chance opcional
- quantidade máxima por item
- duplicidade permitida ou não

Funções esperadas:
- `item_bonus_build_pool_catalog()`
- `item_bonus_get_pool_1_to_5(category_or_pool_id)`

### 7. Criar pools separadas para bônus 6/7
Os bônus 6/7 devem usar outra camada e outra pool.

Regras:
- não compartilhar diretamente a lógica de reroll 1–5
- poder ter regras de elegibilidade diferentes
- poder ter valor e peso diferentes
- poder depender do slot/categoria do item

Funções esperadas:
- `item_bonus_get_pool_6_to_7(category_or_pool_id)`

### 8. Implementar bônus especiais nativos de certas armas
Armas específicas devem poder nascer com bônus especiais nativos como:
- `average_damage_percent`
- `skill_damage_percent`

Esses bônus:
- não são atributo extra comum
- não ocupam diretamente um dos slots de bônus 1–5
- devem ser tratados como camada própria do item

A arquitetura deve permitir caps configuráveis por item ou grupo de item.

Funções esperadas:
- `item_has_native_special_bonus(item_instance_id, bonus_type)`
- `item_get_native_special_bonus_value(item_instance_id, bonus_type)`

### 9. Implementar sistema de bônus extras 1–5
Cada item elegível deve poder possuir até 4 bônus iniciais nessa camada e depois receber o 5º bônus por item especial.

Regras:
- começar com 0 a 4, conforme configuração ou geração
- suportar reroll completo dessa camada
- o 5º bônus deve ser adicionado de forma separada quando o item já tiver 4
- os bônus 1–5 não devem alterar os bônus 6/7
- os bônus 1–5 não devem alterar os bônus especiais nativos

Estruturas esperadas:
- array/lista de bônus 1–5
- cada bônus contendo:
  - `bonus_type`
  - `bonus_value`
  - `bonus_rank`
  - `source_layer`

Funções esperadas:
- `item_can_add_bonus_1_to_5(instance_id)`
- `item_add_random_bonus_1_to_5(instance_id)`
- `item_reroll_bonuses_1_to_5(instance_id)`
- `item_get_bonus_count_1_to_5(instance_id)`

### 10. Implementar regra do 5º bônus
O sistema deve suportar adicionar o 5º bônus apenas quando:
- o item já possuir 4 bônus na camada 1–5
- ainda não possuir o 5º
- o item for elegível

Isso deve ser separado do reroll normal.

Funções esperadas:
- `item_can_add_fifth_bonus(instance_id)`
- `item_add_fifth_bonus(instance_id)`

### 11. Implementar sistema de bônus 6º e 7º
O sistema deve suportar:
- adicionar 6º bônus
- adicionar 7º bônus
- rerrollar apenas essa camada
- manter 1–5 intactos
- validar elegibilidade do item

Regras:
- essa camada é totalmente separada
- pode exigir quantidade mínima de bônus 1–5, se essa regra for adotada
- pode usar pool própria por categoria

Funções esperadas:
- `item_can_add_bonus_6_or_7(instance_id)`
- `item_add_bonus_6(instance_id)`
- `item_add_bonus_7(instance_id)`
- `item_reroll_bonuses_6_to_7(instance_id)`
- `item_get_bonus_count_6_to_7(instance_id)`

### 12. Implementar consumíveis especiais para bônus
Criar integração estrutural com itens especiais que manipulam bônus.

Itens mínimos esperados:
- `SCROLL_ENCHANT` para reroll dos bônus 1–5
- `BLESSING_SPHERE` para adicionar 5º bônus
- `ARUMAKA` para camada 6/7
- `JOLLA` para camada 6/7

Esses itens devem chamar funções centrais do sistema de bônus e não conter regra de bônus espalhada.

Funções esperadas:
- `item_bonus_use_scroll_enchant(instance_id)`
- `item_bonus_use_blessing_sphere(instance_id)`
- `item_bonus_use_arumaka(instance_id)`
- `item_bonus_use_jolla(instance_id)`

### 13. Implementar validação de compatibilidade por item
Antes de adicionar ou rerrollar bônus, validar:
- item existe
- item é equipável
- item possui pool compatível
- camada correta
- limite de bônus não excedido
- consumível correto para a operação

Funções esperadas:
- `item_bonus_can_reroll_1_to_5(instance_id)`
- `item_bonus_can_add_fifth(instance_id)`
- `item_bonus_can_modify_6_to_7(instance_id)`
- `item_bonus_validate_pool_compatibility(instance_id, bonus_type, layer)`

### 14. Implementar cálculo agregado do item
O sistema deve conseguir calcular o resultado final do item combinando:

- atributos base fixos
- bônus especiais nativos
- bônus extras 1–5
- bônus extras 6/7

Esse cálculo agregado será usado quando o item estiver equipado.

Funções esperadas:
- `item_get_combined_stats(instance_id)`
- `item_get_combined_bonus_map(instance_id)`

### 15. Integrar com o sistema de equipamento do personagem
Ao equipar ou desequipar item:
- recalcular os bônus agregados
- enviar os valores finais ao sistema central de atributos do personagem
- não espalhar cálculo em cada slot

Funções esperadas:
- `equipment_rebuild_bonus_cache()`
- `equipment_collect_all_item_bonuses()`

### 16. Preparar a arquitetura para tabelas externas de balanceamento
As pools, caps, valores e pesos devem poder ser rebalanceados facilmente.

Quero estrutura pronta para:
- tabelas por categoria
- caps por item
- pools diferentes por tipo de arma
- pools específicas por slot
- ajuste de chance sem reescrever funções

### 17. Preservar separação entre definição, instância e modificação
A arquitetura deve deixar claro:
- definição global do item é estática
- instância do item carrega o estado variável
- funções de modificação alteram apenas a instância
- reroll de uma camada não destrói outra camada

## Arquitetura esperada

### Configuração
Criar local central para:
- enum de tipos de bônus
- enum de camadas de bônus
- pools 1–5 por categoria/slot
- pools 6/7 por categoria/slot
- caps de bônus especiais nativos
- regras de duplicidade
- regras de peso/chance
- regras dos consumíveis especiais

### Estado
Separar claramente:
- catálogo global de itens
- catálogo de tipos de bônus
- catálogo de pools
- instância do item
- listas de bônus 1–5 por item
- listas de bônus 6/7 por item
- cache agregado do item equipado, se necessário

### Funções centrais
Funções esperadas:
- `item_bonus_build_type_catalog()`
- `item_bonus_build_pool_catalog()`
- `item_bonus_get_pool_1_to_5(category_or_pool_id)`
- `item_bonus_get_pool_6_to_7(category_or_pool_id)`
- `item_has_native_special_bonus(instance_id, bonus_type)`
- `item_get_native_special_bonus_value(instance_id, bonus_type)`
- `item_can_add_bonus_1_to_5(instance_id)`
- `item_add_random_bonus_1_to_5(instance_id)`
- `item_reroll_bonuses_1_to_5(instance_id)`
- `item_can_add_fifth_bonus(instance_id)`
- `item_add_fifth_bonus(instance_id)`
- `item_can_add_bonus_6_or_7(instance_id)`
- `item_add_bonus_6(instance_id)`
- `item_add_bonus_7(instance_id)`
- `item_reroll_bonuses_6_to_7(instance_id)`
- `item_bonus_use_scroll_enchant(instance_id)`
- `item_bonus_use_blessing_sphere(instance_id)`
- `item_bonus_use_arumaka(instance_id)`
- `item_bonus_use_jolla(instance_id)`
- `item_bonus_validate_pool_compatibility(instance_id, bonus_type, layer)`
- `item_get_combined_stats(instance_id)`
- `item_get_combined_bonus_map(instance_id)`
- `equipment_collect_all_item_bonuses()`
- `equipment_rebuild_bonus_cache()`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir inventário e equipamento do prompt 10
- atualizar atributos do personagem via sistema central de recálculo
- preparar integração futura com ferreiro/refino
- preparar integração futura com drops e materiais
- preparar integração futura com tooltip e UI avançada de item
- não depender do sistema do ferreiro para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de tipos de bônus
2. criar pools 1–5 por categoria/slot
3. criar pools 6/7 separadas por categoria/slot
4. separar corretamente atributos base, bônus especiais nativos, bônus 1–5 e bônus 6/7
5. instância do item preservar estado variável sem alterar definição global
6. arma com dano médio/dano de skill tratar isso como camada nativa separada
7. adicionar bônus 1–5 corretamente respeitando pool do item
8. rerrollar bônus 1–5 sem alterar bônus 6/7
9. adicionar 5º bônus apenas quando a regra permitir
10. adicionar 6º bônus corretamente
11. adicionar 7º bônus corretamente
12. rerrollar bônus 6/7 sem alterar bônus 1–5
13. impedir bônus incompatível com a categoria do item
14. integrar consumível de reroll 1–5 corretamente
15. integrar consumível de 5º bônus corretamente
16. integrar Arumaka/Jolla corretamente na camada 6/7
17. calcular bônus agregados finais do item corretamente
18. refletir os bônus do item equipado nos atributos finais do personagem
19. manter arquitetura pronta para ferreiro e refino sem retrabalho estrutural

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de bônus em vários lugares
- não misturar UI com regra de negócio
- não tratar bônus 1–5 e 6/7 como a mesma camada
- não tratar dano médio/dano de skill como simples atributo extra comum
- não implementar ferreiro/refino neste prompt
- não implementar drops neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders