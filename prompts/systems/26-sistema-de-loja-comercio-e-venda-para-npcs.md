# Auditar, implementar e integrar sistema de loja, comércio e venda para NPCs no GameMaker

## Objetivo

Implementar o sistema completo de compra e venda com NPCs, integrado ao inventário, gold, diálogo e save/load, sem recriar do zero módulos que já estejam parcialmente prontos no projeto. Este prompt resolve o ciclo econômico básico do jogo: comprar itens de NPC, vender itens do inventário, controlar preços, limitar o que cada loja oferece e preparar a arquitetura para lojas especiais no futuro.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `13-sistema-drops-e-materiais.md`
- `22-interface-de-npcs-e-dialogos.md`
- `23-save-load-global.md`
- `25-dungeons-e-instancias.md`

Este prompt vem antes de:
- `27-sistema-de-crafting-producao-e-refinacao-especial.md`
- `28-sistema-de-fast-travel-teleporte-e-portais.md`
- `29-menu-principal-configuracoes-e-remapeamento.md`

## Escopo

### Implementar neste prompt
- auditoria de qualquer fluxo de loja/comércio já existente no projeto
- catálogo de lojas de NPC
- catálogo de estoque de loja
- compra de itens do NPC
- venda de itens do inventário para o NPC
- cálculo central de preço de compra e venda
- suporte a stacks na compra e na venda
- suporte a itens equipáveis, consumíveis, misc e materiais
- bloqueio de venda de itens proibidos
- integração com gold do jogador
- integração com inventário
- integração com diálogo/NPC
- interface de loja funcional
- exibição de preço, quantidade e categoria
- confirmação de compra/venda quando necessário
- atualização visual de gold e inventário
- persistência do estado de lojas quando aplicável
- arquitetura pronta para lojas especiais, desconto e estoque limitado futuro

### Não implementar neste prompt
- sistema de trade entre jogadores
- leilão
- loja online
- loja premium
- cash shop
- loja com rotação diária complexa
- crafting
- ferreiro
- reroll de bônus
- loot/drop
- economia dinâmica global
- imposto por cidade
- sistema de reputação comercial complexo
- múltiplas moedas especiais além do gold principal
- UI de carrinho complexa
- loja por gamepad avançado
- multiplayer
- cloud sync
- sistema de marketplace

## Dependências e contexto

Este prompt depende de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `22-interface-de-npcs-e-dialogos.md`
- `23-save-load-global.md`

Dados e campos que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de itens
- instância de item
- inventário do jogador
- stacks e slots de inventário
- gold do jogador
- slots de equipamento
- NPCs e diálogo
- save/load global
- categorias e subtipos de item
- funções centrais de adicionar/remover item do inventário
- funções centrais de adicionar/remover gold

### Dados que este prompt deve criar
- catálogo de lojas
- perfil de loja por NPC
- estrutura de entrada de estoque
- estado de loja aberta/fechada
- lista visível de itens da loja
- regras de compra e venda
- cálculo central de preço
- filtro de itens vendáveis
- integração entre NPC de diálogo e módulo de loja
- interface visual de compra/venda

## Requisitos funcionais

### 1. Auditar qualquer base de comércio já existente
Antes de implementar, você deve analisar se já existe no projeto:
- alguma interação de NPC com serviço
- alguma tela parcial de compra/venda
- alguma lógica de preço de item
- alguma função de vender item por gold
- alguma diferença entre valor de compra e valor de venda
- algum catálogo parcial de loja

Você deve identificar:
- o que já existe e pode ser preservado
- o que está improvisado e precisa ser refatorado
- o que falta implementar neste módulo

Você não deve recriar tudo do zero se já houver base reaproveitável.

### 2. Criar enum de tipos de loja e operação comercial
Criar enums ou estruturas equivalentes para separar claramente os tipos de serviço e operações.

Tipos mínimos esperados:
- `SHOP_TYPE_GENERAL`
- `SHOP_TYPE_CONSUMABLES`
- `SHOP_TYPE_BLACKSMITH_SUPPLIES`
- `SHOP_TYPE_MATERIALS`
- `SHOP_TYPE_SPECIAL`

Operações mínimas esperadas:
- `SHOP_OPERATION_BUY`
- `SHOP_OPERATION_SELL`

Enums esperados:
- `ShopType`
- `ShopOperationType`

### 3. Criar catálogo de lojas por NPC
Cada NPC comerciante deve possuir um perfil centralizado de loja.

Campos esperados:
- `shop_id`
- `npc_id`
- `shop_type`
- `display_name`
- `description`
- `stock_entries`
- `buy_price_modifier`
- `sell_price_modifier`
- `allowed_categories_to_sell`
- `blocked_item_ids`
- `shop_flags`

Funções esperadas:
- `shops_build_catalog()`
- `shops_get_definition(shop_id)`
- `shops_get_shop_by_npc(npc_id)`

### 4. Criar estrutura de entrada de estoque
Cada item vendido pela loja deve possuir uma entrada clara.

Campos esperados:
- `stock_entry_id`
- `item_id`
- `price_override` opcional
- `min_quantity`
- `max_quantity`
- `is_unlimited`
- `current_stock` se houver estoque limitado
- `required_flags`
- `required_level`
- `is_visible`
- `is_enabled`

Funções esperadas:
- `shop_stock_entry_create(...)`
- `shop_get_visible_stock(shop_id, player_state)`

### 5. Criar cálculo central de preço
Todo preço deve ser calculado em camada central.

Regras mínimas:
- preço de compra pelo jogador
- preço de venda para o NPC
- suporte a `buy_value` e `sell_value` do item
- suporte a modificadores da loja
- fallback seguro para itens sem preço definido
- possibilidade futura de desconto ou markup especial

Funções esperadas:
- `shop_get_buy_price(shop_id, item_id, quantity)`
- `shop_get_sell_price(shop_id, item_instance_id, quantity)`
- `shop_get_base_item_buy_value(item_id)`
- `shop_get_base_item_sell_value(item_id)`

### 6. Implementar regras de venda para NPC
O jogador deve poder vender itens do inventário para o NPC.

Regras:
- item precisa existir no inventário
- item não pode estar equipado
- item não pode ser bloqueado para venda
- item de quest, item ligado ou item especial pode ser não vendável conforme regra
- venda deve respeitar stack parcial ou total
- gold deve ser concedido corretamente

Funções esperadas:
- `shop_can_sell_item(shop_id, item_instance_id, quantity)`
- `shop_sell_item(shop_id, item_instance_id, quantity)`

### 7. Implementar regras de compra do NPC
O jogador deve poder comprar itens da loja.

Regras:
- item precisa existir no estoque visível
- jogador precisa ter gold suficiente
- inventário precisa ter espaço
- compra deve respeitar stacks e quantidade
- se a loja usar estoque limitado, deve debitar o estoque
- se a loja for ilimitada, não precisa reduzir `current_stock`

Funções esperadas:
- `shop_can_buy_item(shop_id, stock_entry_id, quantity)`
- `shop_buy_item(shop_id, stock_entry_id, quantity)`

### 8. Integrar compra com o inventário
Ao comprar:
- remover gold do jogador
- criar/adicionar item ao inventário
- empilhar quando possível
- falhar de forma clara se não houver espaço

Funções esperadas:
- `shop_try_add_bought_item_to_inventory(item_id, quantity)`
- `shop_handle_inventory_full_on_buy(...)`

### 9. Integrar venda com o inventário
Ao vender:
- remover item ou parte do stack do inventário
- conceder gold corretamente
- atualizar UI da loja
- atualizar hotbar caso o item vendido estivesse referenciado

Funções esperadas:
- `shop_remove_sold_item_from_inventory(item_instance_id, quantity)`
- `shop_handle_post_sell_refresh()`

### 10. Implementar filtros de item vendável
A loja deve conseguir aceitar ou recusar tipos de item.

Exemplos:
- loja geral aceita vender quase tudo
- loja de consumíveis compra só certos tipos
- itens de quest podem ser bloqueados
- itens raros/especiais podem ser bloqueados

Funções esperadas:
- `shop_is_item_sellable_to_shop(shop_id, item_instance_id)`
- `shop_get_sell_block_reason(shop_id, item_instance_id)`

### 11. Implementar compra e venda de stacks
A compra e a venda devem suportar quantidade parcial.

Casos obrigatórios:
- comprar múltiplas unidades de item stackável
- vender parte de um stack
- vender o stack inteiro
- impedir quantidade inválida

Funções esperadas:
- `shop_validate_stack_quantity(quantity)`
- `shop_split_sell_quantity(item_instance_id, quantity)`
- `shop_split_buy_quantity(stock_entry_id, quantity)`

### 12. Implementar integração com diálogo/NPC
O sistema de diálogo já existente deve poder abrir a loja.

Regras:
- o diálogo decide quando abrir o módulo de loja
- a loja continua sendo um módulo separado
- fechar a loja devolve o controle corretamente ao fluxo do jogo

Funções esperadas:
- `npc_dialog_open_shop(npc_id)`
- `shop_ui_open(shop_id, npc_id)`
- `shop_ui_close()`

### 13. Criar interface visual de loja
A interface deve ser funcional e não apenas mock.

Ela deve conter:
- cabeçalho com nome da loja/NPC
- gold atual do jogador
- lista de itens da loja
- lista de itens vendáveis do inventário
- preço unitário
- preço total
- quantidade
- estado habilitado/desabilitado
- modo compra e modo venda
- feedback de operação bem-sucedida ou bloqueada

### 14. Aplicar identidade visual coerente com o projeto
A interface deve seguir a linguagem visual já usada no projeto.

Direção visual obrigatória:
- sombria
- elegante
- medieval/fantasia
- inspirada em Elden Ring
- legível
- sem aparência mobile genérica
- sem visual sci-fi
- com boa hierarquia visual

### 15. Separar UI de regra de negócio
A UI deve:
- listar itens
- exibir preços
- permitir escolher quantidade
- chamar funções centrais de compra/venda
- refletir resultado das operações

A UI não deve:
- decidir preço
- decidir regras de item vendável
- manipular inventário diretamente fora das funções centrais
- duplicar validações de negócio em vários pontos

### 16. Implementar confirmação opcional de transação
O sistema deve suportar confirmação antes de operações importantes.

Exemplos:
- vender item raro
- comprar múltiplas unidades
- vender item especial

A confirmação pode ser simples, mas a arquitetura deve suportar isso.

Funções esperadas:
- `shop_ui_request_confirm(operation_type, payload)`
- `shop_ui_confirm_transaction()`

### 17. Preparar suporte a lojas especiais futuras
A arquitetura deve ficar pronta para:
- loja com estoque limitado
- loja com itens liberados por flag/quest
- loja com desconto por progresso
- loja de materiais especiais
- loja de dungeon
- loja de evento

Não precisa implementar tudo agora além da estrutura.

### 18. Integrar com save/load quando necessário
Persistir apenas o que fizer sentido.

Persistir ao menos se aplicável:
- estoque limitado da loja
- flags de desbloqueio de loja
- estado de serviço desbloqueado por NPC

Não persistir estado efêmero da UI.

Funções esperadas:
- `save_serialize_shop_state()`
- `save_apply_shop_state(data)`

### 19. Atualizar módulos dependentes após compra/venda
Após compra ou venda, o sistema deve atualizar corretamente:
- inventário
- gold
- hotbar quando necessário
- UI da loja
- UI de inventário se aberta
- save dirty flag

Funções esperadas:
- `shop_refresh_after_transaction()`
- `shop_mark_runtime_changed()`

### 20. Retornar resultados estruturados
Compra, venda, abertura e fechamento da loja devem retornar resultados claros.

Campos esperados:
- `success`
- `shop_id`
- `npc_id`
- `operation_type`
- `item_id`
- `item_instance_id`
- `quantity`
- `gold_delta`
- `inventory_changed`
- `failure_reason`

## Arquitetura esperada

### Configuração
Criar local central para:
- catálogo de lojas
- tipos de loja
- regras de preço
- filtros de venda
- layout visual da loja
- modo compra/venda
- configuração de confirmação
- integração com diálogo e save/load

### Estado
Separar claramente:
- loja atual aberta
- NPC atual da loja
- modo atual da UI
- item selecionado
- quantidade selecionada
- estoque visível
- lista vendável do inventário
- resultado da última transação
- flags de runtime da loja

### Funções centrais
Funções esperadas:
- `shops_build_catalog()`
- `shops_get_definition(shop_id)`
- `shops_get_shop_by_npc(npc_id)`
- `shop_stock_entry_create(...)`
- `shop_get_visible_stock(shop_id, player_state)`
- `shop_get_buy_price(shop_id, item_id, quantity)`
- `shop_get_sell_price(shop_id, item_instance_id, quantity)`
- `shop_get_base_item_buy_value(item_id)`
- `shop_get_base_item_sell_value(item_id)`
- `shop_can_sell_item(shop_id, item_instance_id, quantity)`
- `shop_sell_item(shop_id, item_instance_id, quantity)`
- `shop_can_buy_item(shop_id, stock_entry_id, quantity)`
- `shop_buy_item(shop_id, stock_entry_id, quantity)`
- `shop_try_add_bought_item_to_inventory(item_id, quantity)`
- `shop_handle_inventory_full_on_buy(...)`
- `shop_remove_sold_item_from_inventory(item_instance_id, quantity)`
- `shop_handle_post_sell_refresh()`
- `shop_is_item_sellable_to_shop(shop_id, item_instance_id)`
- `shop_get_sell_block_reason(shop_id, item_instance_id)`
- `shop_validate_stack_quantity(quantity)`
- `shop_split_sell_quantity(item_instance_id, quantity)`
- `shop_split_buy_quantity(stock_entry_id, quantity)`
- `npc_dialog_open_shop(npc_id)`
- `shop_ui_open(shop_id, npc_id)`
- `shop_ui_close()`
- `shop_ui_request_confirm(operation_type, payload)`
- `shop_ui_confirm_transaction()`
- `save_serialize_shop_state()`
- `save_apply_shop_state(data)`
- `shop_refresh_after_transaction()`
- `shop_mark_runtime_changed()`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir inventário e instâncias de item
- consumir gold do jogador
- consumir NPCs e diálogo
- integrar com hotbar quando item vendido/comprado afetar atalhos
- integrar com save/load
- preparar integração futura com crafting e lojas especiais
- não depender de multiplayer para funcionar

## Critérios de aceite

1. auditar corretamente qualquer base atual de comércio antes de alterar
2. criar catálogo central de lojas corretamente
3. abrir loja a partir de NPC corretamente
4. listar estoque visível da loja corretamente
5. calcular preço de compra corretamente
6. calcular preço de venda corretamente
7. comprar item com gold suficiente corretamente
8. bloquear compra sem gold suficiente
9. bloquear compra sem espaço no inventário
10. vender item válido corretamente
11. bloquear venda de item proibido
12. vender stack parcial corretamente
13. vender stack inteiro corretamente
14. atualizar gold corretamente após compra e venda
15. atualizar inventário corretamente após compra e venda
16. atualizar hotbar quando item vendido afetar slot rápido
17. manter separação entre UI e regra de negócio
18. seguir a identidade visual do projeto
19. persistir estoque/estado de loja quando aplicável sem salvar estado efêmero
20. manter arquitetura pronta para lojas especiais sem retrabalho grande

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. análise curta de qualquer base atual de comércio/serviço encontrada no projeto e do que será preservado/refatorado
3. código completo em GML
4. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de loja em vários lugares
- não misturar UI com regra de negócio
- não recalcular preço em vários pontos fora da camada central
- não manipular inventário diretamente pela UI sem passar pelas funções centrais
- não implementar trade entre jogadores neste prompt
- não implementar cash shop neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders