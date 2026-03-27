# Implementar sistema completo de inventário, equipamento e manipulação de itens no GameMaker

## Objetivo

Implementar a base completa do inventário do jogo, inspirada estruturalmente no Metin2, com páginas de inventário, slots de equipamento, drag and drop, pilhas de itens, ouro visível, tipos diferentes de item e arquitetura pronta para expansão. Este prompt resolve o núcleo de armazenamento, movimentação, equipar/desequipar e organização de itens, sem ainda entrar nas regras profundas de bônus extras, refino do ferreiro ou drops.

Este prompt vem depois de:
- `01-sistema-status-base.md`
- `03-sistema-atributos-derivados.md`
- `04-interface-de-status.md`
- `06-sistema-skills-base.md`
- `08-interface-de-skills.md`
- `09-itens-consumiveis-progressao-skill.md`

Este prompt vem antes de:
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`

## Escopo

### Implementar neste prompt
- inventário paginado inspirado em Metin2
- 4 páginas de inventário
- 2 páginas iniciais desbloqueadas
- 2 páginas bloqueadas, prontas para expansão futura
- grid de slots do inventário
- slots de equipamento
- armazenamento de ouro
- drag and drop de itens
- mover item entre slots
- trocar item de posição
- dividir stack
- empilhar itens compatíveis
- equipar e desequipar itens
- validação de slot compatível
- categorias de item
- definição base de item
- estado da instância do item
- suporte a itens equipáveis e não equipáveis
- suporte a consumíveis, itens de quest, misc e especiais
- integração com atributos do personagem quando item for equipado
- interface de inventário com identidade visual inspirada em Elden Ring
- arquitetura pronta para expansão de páginas, filtros e outras janelas

### Não implementar neste prompt
- sistema completo de bônus aleatórios de item
- sistema de 1º ao 5º bônus
- sistema de 6º e 7º bônus
- reroll com Pergaminho do Feitiço
- Esfera da Benção
- Arumaka/Jolla
- refino do ferreiro
- quebra/destruição de item por upgrade
- receitas de aprimoramento
- drops de monstros
- lojas/NPC de compra e venda
- baú/armazém
- trade
- sistema de peso
- sistema de sockets/pedras
- tooltips complexas finais de item
- filtros avançados
- crafting

## Dependências e contexto

Este sistema depende de:
- sistema de atributos base e derivados
- sistema de HP/MP e recursos do personagem
- sistema de honra apenas como contexto futuro
- sistema de consumíveis já iniciado em `09-itens-consumiveis-progressao-skill.md`

Campos e dados que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- `for_total`
- `int_total`
- `dex_total`
- `def_total`
- `vit_total`
- `attack_physical`
- `attack_magic`
- `defense_total`
- `hp_max`
- `mp_max`
- sistema central de recálculo de atributos
- sistema de consumíveis base

### Dados que este prompt deve criar
- catálogo de definições de item
- instância de item
- inventário do jogador
- páginas de inventário
- páginas desbloqueadas/bloqueadas
- grid de slots
- slots de equipamento
- ouro do personagem
- estado de drag and drop
- validações de movimento/equipamento
- interface de inventário
- funções centrais de inserir, mover, equipar e remover itens

## Requisitos funcionais

### 1. Criar enum de categorias e subtipos de item
Criar enums ou structs equivalentes para organizar claramente os tipos de item.

Categorias mínimas esperadas:
- `WEAPON`
- `ARMOR`
- `ACCESSORY`
- `CONSUMABLE`
- `QUEST`
- `MISC`
- `SPECIAL`

Subtipos mínimos esperados:
- armas
- armaduras
- escudo
- elmo
- bota
- colar
- brinco
- bracelete
- poção de HP
- poção de buff
- item especial de buff
- item especial geral
- item de quest
- material misc

Enums esperados:
- `ItemCategory`
- `ItemSubType`
- `EquipmentSlotType`

### 2. Criar estrutura de definição base de item
Todo item deve possuir uma definição global centralizada.

Campos esperados:
- `id`
- `name`
- `category`
- `subtype`
- `description`
- `icon_index` ou referência visual equivalente
- `max_stack`
- `is_stackable`
- `is_equippable`
- `required_level`
- `sell_value` opcional
- `buy_value` opcional
- `rarity` opcional
- `equip_slot_type` quando aplicável
- `base_stats` ou `base_effects`
- `special_flags` opcionais

Funções esperadas:
- `items_build_catalog()`
- `items_get_definition(item_id)`

### 3. Criar estrutura de instância de item
Além da definição global, o item no inventário precisa existir como instância própria.

Campos esperados:
- `instance_id`
- `item_id`
- `quantity`
- `inventory_page`
- `inventory_slot_index`
- `is_equipped`
- `equip_slot_type`
- `instance_data` para expansão futura
- `locked` opcional

Essa estrutura deve permitir, no futuro:
- bônus aleatórios
- raridade
- refino
- atributos extras
- sockets
- tempo de duração
- vínculo com personagem

Função esperada:
- `item_instance_create(item_id, quantity)`

### 4. Criar estrutura do inventário paginado
O inventário do personagem deve ter 4 páginas.

Regras:
- páginas 1 e 2 começam desbloqueadas
- páginas 3 e 4 começam bloqueadas
- cada página deve possuir uma grade configurável de slots
- o layout deve ficar centralizado em configuração

Campos esperados:
- `inventory_pages`
- `inventory_unlocked_pages`
- `inventory_slots_per_page`
- `inventory_page_width`
- `inventory_page_height`

Funções esperadas:
- `inventory_init()`
- `inventory_is_page_unlocked(page_index)`
- `inventory_unlock_page(page_index)`

### 5. Criar slots de equipamento
O personagem deve possuir um painel de equipamento separado do inventário comum.

Slots mínimos esperados:
- arma
- armadura
- escudo
- elmo
- bota
- colar
- brinco
- bracelete

Campos esperados:
- `equipped_weapon`
- `equipped_armor`
- `equipped_shield`
- `equipped_helmet`
- `equipped_boots`
- `equipped_necklace`
- `equipped_earring`
- `equipped_bracelet`

Pode implementar como struct/map de slots, desde que fique consistente.

### 6. Implementar ouro do personagem no inventário
O inventário deve exibir o ouro atual do personagem.

Campos esperados:
- `gold_current`

Funções esperadas:
- `inventory_add_gold(amount)`
- `inventory_remove_gold(amount)`
- `inventory_can_spend_gold(amount)`

O ouro não deve ocupar slot de inventário.

### 7. Implementar inserção de item no inventário
O sistema deve permitir inserir item no inventário tentando:
- empilhar em stack existente compatível
- ocupar slot vazio
- respeitar páginas desbloqueadas
- falhar de forma clara se não houver espaço

Funções esperadas:
- `inventory_add_item(item_id, quantity)`
- `inventory_find_stackable_slot(item_id)`
- `inventory_find_first_empty_slot()`

### 8. Implementar movimentação de item entre slots
O sistema deve permitir:
- mover item para slot vazio
- trocar itens de posição
- impedir movimento para página bloqueada
- impedir movimento inválido entre tipos incompatíveis

Funções esperadas:
- `inventory_move_item(from_location, to_location)`
- `inventory_swap_items(location_a, location_b)`
- `inventory_can_move_item(from_location, to_location)`

### 9. Implementar stack e divisão de stack
O sistema deve suportar pilhas de itens.

Regras:
- itens stackáveis devem somar quantidade quando compatíveis
- respeitar `max_stack`
- permitir divisão de stack
- permitir mover apenas parte da pilha

Funções esperadas:
- `inventory_stack_items(source, target)`
- `inventory_split_stack(source, amount, target)`
- `inventory_can_stack(source, target)`

### 10. Implementar equipar item
O jogador deve poder equipar itens a partir do inventário.

Regras:
- item deve ser equipável
- slot de equipamento deve ser compatível
- personagem deve cumprir requisitos mínimos
- ao equipar, item sai do inventário comum e entra no slot de equipamento
- se já houver item equipado no slot, ele deve voltar para o inventário se houver espaço

Funções esperadas:
- `inventory_can_equip(item_instance_id)`
- `inventory_equip_item(item_instance_id)`
- `inventory_get_equipment_slot_for_item(item_instance_id)`

### 11. Implementar desequipar item
O jogador deve poder remover item equipado de volta para o inventário.

Regras:
- precisa haver espaço livre
- ao desequipar, item volta para inventário
- atributos do personagem devem ser recalculados

Funções esperadas:
- `inventory_can_unequip(slot_type)`
- `inventory_unequip_item(slot_type)`

### 12. Integrar item equipado com atributos do personagem
Ao equipar ou desequipar:
- recalcular bônus do personagem
- refletir ataque, defesa, HP, MP ou outros stats base do item
- usar o sistema central de recálculo já existente

Importante:
- neste prompt só implementar bônus base fixos do item
- não implementar ainda bônus aleatórios extras

Funções esperadas:
- `inventory_apply_equipment_stats()`
- `inventory_rebuild_equipment_bonuses()`

### 13. Implementar interface de inventário
Criar a UI completa do inventário.

A interface deve conter:
- painel principal do inventário
- abas ou botões de páginas
- indicação de páginas bloqueadas
- grid de slots
- painel de equipamento
- área de ouro
- feedback visual de item arrastado
- destaque de slot válido/inválido
- identidade visual coerente com o restante do projeto

Funções esperadas:
- `ui_inventory_open()`
- `ui_inventory_close()`
- `ui_inventory_toggle()`

### 14. Implementar drag and drop
A UI deve permitir:
- clicar e arrastar item
- soltar em slot válido
- trocar item ao soltar em slot ocupado
- equipar ao arrastar para slot de equipamento
- voltar item à origem se a ação for inválida

Campos esperados:
- `drag_item_instance_id`
- `drag_origin`
- `drag_is_active`

Funções esperadas:
- `ui_inventory_begin_drag(location)`
- `ui_inventory_update_drag()`
- `ui_inventory_end_drag(target_location)`

### 15. Exibir tipos diferentes de item
A interface deve deixar claro o tipo do item por ícone e organização.

Tipos mínimos a suportar visualmente:
- armas
- armaduras
- acessórios
- poções
- itens especiais de buff
- itens especiais gerais
- itens de quest
- misc

Não precisa fazer tooltip avançada neste prompt, mas a UI deve estar pronta para isso.

### 16. Implementar páginas bloqueadas e desbloqueáveis
As páginas 3 e 4 devem existir visualmente, mas começar bloqueadas.

Comportamento esperado:
- jogador vê que elas existem
- não pode guardar item nelas enquanto bloqueadas
- a estrutura deve permitir desbloqueio futuro por item, quest ou nível

Funções esperadas:
- `inventory_unlock_page(page_index)`
- `inventory_is_page_unlocked(page_index)`

### 17. Separar lógica de inventário, item e UI
A implementação deve separar claramente:
- catálogo de item
- instância de item
- inventário/equipamento
- drag and drop
- renderização da interface

A UI não deve conter a regra central de inventário.

### 18. Preparar expansão futura para bônus, refino e sockets
A arquitetura precisa nascer preparada para:
- bônus 1 a 5
- bônus 6 e 7
- dano médio e dano de skill de armas especiais
- refino do ferreiro
- quebra protegida por pergaminhos
- materiais de drop
- itens de reroll
- atributos brancos/dourados

Essas regras não devem ser implementadas agora, mas a struct do item precisa deixar espaço limpo para isso. A separação entre camadas de bônus por slot e entre bônus 1–5 vs 6/7 já precisa estar prevista porque isso varia por categoria de item. :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}

## Arquitetura esperada

### Configuração
Criar local central para:
- dimensões do grid
- quantidade de páginas
- páginas desbloqueadas iniciais
- quantidade de slots por página
- definição dos slots de equipamento
- regras de stack
- regras de drag and drop
- layout visual do inventário
- teclas de abertura/fechamento

### Estado
Separar claramente:
- catálogo global de itens
- instâncias de item
- páginas do inventário
- slots de equipamento
- ouro do jogador
- estado atual de drag and drop
- janela aberta/fechada
- página atual selecionada

### Funções centrais
Funções esperadas:
- `items_build_catalog()`
- `items_get_definition(item_id)`
- `item_instance_create(item_id, quantity)`
- `inventory_init()`
- `inventory_add_item(item_id, quantity)`
- `inventory_find_stackable_slot(item_id)`
- `inventory_find_first_empty_slot()`
- `inventory_move_item(from_location, to_location)`
- `inventory_swap_items(location_a, location_b)`
- `inventory_stack_items(source, target)`
- `inventory_split_stack(source, amount, target)`
- `inventory_can_equip(item_instance_id)`
- `inventory_equip_item(item_instance_id)`
- `inventory_can_unequip(slot_type)`
- `inventory_unequip_item(slot_type)`
- `inventory_rebuild_equipment_bonuses()`
- `inventory_apply_equipment_stats()`
- `inventory_add_gold(amount)`
- `inventory_remove_gold(amount)`
- `inventory_unlock_page(page_index)`
- `inventory_is_page_unlocked(page_index)`
- `ui_inventory_open()`
- `ui_inventory_close()`
- `ui_inventory_toggle()`
- `ui_inventory_begin_drag(location)`
- `ui_inventory_update_drag()`
- `ui_inventory_end_drag(target_location)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir e atualizar atributos do personagem ao equipar
- integrar com consumíveis do prompt 09
- preparar integração futura com sistema de bônus do prompt 11
- preparar integração futura com ferreiro/refino do prompt 12
- preparar integração futura com drops e materiais do prompt 13
- não depender de lojas, crafting ou trade para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. inicializar inventário com 4 páginas
2. páginas 1 e 2 começam desbloqueadas
3. páginas 3 e 4 começam bloqueadas
4. adicionar item stackável corretamente
5. adicionar item não stackável corretamente
6. impedir adicionar item quando não houver espaço válido
7. mover item entre slots vazios
8. trocar itens entre slots ocupados
9. empilhar itens compatíveis corretamente
10. dividir stack corretamente
11. equipar arma no slot correto
12. impedir equipar item em slot incompatível
13. desequipar item corretamente quando houver espaço
14. recalcular atributos ao equipar e desequipar
15. exibir ouro corretamente no inventário
16. abrir e fechar a UI do inventário corretamente
17. arrastar item e soltar em slot válido corretamente
18. retornar item à origem em ação inválida
19. exibir páginas bloqueadas visualmente
20. impedir uso de páginas bloqueadas
21. manter arquitetura pronta para bônus, refino e materiais sem retrabalho estrutural

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de inventário em vários lugares
- não misturar UI com regra de negócio
- não implementar sistema completo de bônus aleatórios neste prompt
- não implementar refino do ferreiro neste prompt
- não implementar drops neste prompt
- não criar apenas mock visual sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders