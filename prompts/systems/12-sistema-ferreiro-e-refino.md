# Implementar sistema completo de ferreiro, refino e aprimoramento de itens no GameMaker

## Objetivo

Implementar o sistema completo de ferreiro e refino de itens, inspirado estruturalmente no Metin2, com níveis de aprimoramento, chance de sucesso, falha, consumo de materiais, custo em gold e uso de itens de proteção ou aumento de chance. Este prompt resolve a base do aprimoramento de equipamentos e armas, deixando a arquitetura pronta para integração com inventário, bônus de item, materiais de drop e futura interface de NPC/ferreiro.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`

Este prompt vem antes de:
- `13-sistema-drops-e-materiais.md`
- prompt de interface/NPC do ferreiro, se você quiser separar depois

## Escopo

### Implementar neste prompt
- sistema de refino de itens equipáveis
- níveis de aprimoramento do item
- regras de progressão de +0 até o máximo configurado
- receitas de refino por item, grupo ou família de item
- consumo de materiais
- consumo de gold
- chance de sucesso por nível de refino
- comportamento de falha por nível de refino
- integração com itens modificadores de refino
- suporte a Pergaminho do Ferreiro
- suporte a Pergaminho da Paz
- integração com inventário
- integração com equipamento
- integração com recálculo de atributos do personagem
- resultado estruturado de tentativa de refino
- arquitetura pronta para múltiplos tipos de ferreiro no futuro

### Não implementar neste prompt
- sprite final do NPC ferreiro
- interface visual completa do ferreiro
- árvores de diálogo do NPC
- drop de materiais
- loot tables
- sistema de bônus 1–5
- sistema de bônus 6/7
- reroll de bônus
- sockets/pedras
- crafting genérico
- lojas
- sistema de trade
- eventos globais de aumento de chance
- animações visuais do refino
- efeitos de partículas
- sons
- sistema de quest para desbloquear ferreiro

## Dependências e contexto

Este sistema depende de:
- inventário completo
- sistema de itens e bônus
- sistema de atributos derivados
- sistema de gold
- sistema de consumíveis do projeto

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de itens
- instância de item
- inventário do jogador
- sistema de gold
- slots de equipamento
- recálculo central de atributos do personagem
- estrutura de item com `refine_level` preparada no prompt anterior
- consumo de itens do inventário
- remoção de item do inventário/equipamento

### Dados que este prompt deve criar
- catálogo de receitas de refino
- enum de comportamento de falha
- enum de modificadores de refino
- definição de grupo/família de refino
- função central de validação de refino
- função central de execução de refino
- integração com consumíveis de refino
- resultado estruturado do refino
- suporte a destruição, downgrade ou manutenção do item conforme regra

## Requisitos funcionais

### 1. Criar enum de tipos de refino e comportamento de falha
Criar enums ou estruturas equivalentes para separar claramente:

#### Tipos de operação
- `NORMAL_REFINE`
- `REFINE_WITH_BLACKSMITH_SCROLL`
- `REFINE_WITH_PEACE_SCROLL`

#### Comportamento de falha
- `FAIL_KEEP_LEVEL`
- `FAIL_DOWNGRADE`
- `FAIL_DESTROY`
- `FAIL_BLOCKED_BY_PROTECTION`

Enums esperados:
- `RefineOperationType`
- `RefineFailBehavior`

### 2. Criar estrutura de grupo/família de refino
Itens que pertencem à mesma linha de evolução devem compartilhar regras de refino.

A estrutura deve permitir:
- item saber a qual grupo de refino pertence
- item saber qual é o nível atual de refino
- item saber qual é o limite máximo de refino
- item saber qual receita usar para tentar o próximo nível

Campos esperados na definição do item ou em estrutura associada:
- `refine_group_id`
- `refine_level`
- `refine_max_level`
- `refine_recipe_table_id`

A arquitetura deve permitir:
- itens que apenas incrementam `refine_level`
- itens que futuramente possam trocar de `item_id` ao refinar, se necessário

### 3. Criar catálogo central de receitas de refino
Toda a regra de refino deve vir de uma tabela central de receitas.

Cada receita deve definir pelo menos:
- `refine_group_id` ou critério equivalente
- `target_refine_level`
- `gold_cost`
- `success_chance`
- `required_materials`
- `fail_behavior`
- `can_use_blacksmith_scroll`
- `can_use_peace_scroll`
- `success_bonus_from_scroll`
- `destroy_protection_enabled`
- `downgrade_protection_enabled` opcional
- `extra_rules` opcionais

Funções esperadas:
- `refine_build_recipe_catalog()`
- `refine_get_recipe_for_item(instance_id, target_refine_level)`

### 4. Criar estrutura para materiais exigidos
Receitas de refino devem poder exigir múltiplos materiais.

Cada entrada de material deve suportar:
- `item_id`
- `quantity`

O sistema deve:
- validar se o jogador possui todos os materiais
- consumir materiais ao tentar o refino
- permitir expansão futura para materiais alternativos ou opcionais

### 5. Criar função central de validação de refino
Antes de qualquer tentativa, o sistema deve validar:

- item existe
- item é refinável
- item não está no refino máximo
- existe receita para o próximo nível
- jogador possui gold suficiente
- jogador possui materiais suficientes
- modificador escolhido é compatível com a receita
- item modificador existe no inventário quando necessário

Função esperada:
- `refine_can_attempt(instance_id, operation_type)`

Essa função deve retornar resultado claro e motivo do bloqueio.

### 6. Implementar função central de tentativa de refino
Criar a função principal que executa o refino.

Função esperada:
- `refine_attempt(instance_id, operation_type)`

Responsabilidades:
- validar a tentativa
- carregar a receita
- calcular chance final
- consumir gold
- consumir materiais
- consumir item modificador quando aplicável
- rolar sucesso/falha
- aplicar o resultado final no item
- atualizar inventário/equipamento
- recalcular atributos se o item estava equipado
- retornar estrutura completa do resultado

### 7. Implementar chance de sucesso configurável por nível
A chance de sucesso não pode ficar hardcoded espalhada no código.

Ela deve vir da receita ou de tabela central por faixa de refino.

O sistema deve permitir facilmente testar balanceamentos diferentes para:
- +0 a +4
- +5 a +6
- +7 a +8
- +9 e acima, se o projeto expandir depois

Funções esperadas:
- `refine_get_success_chance(instance_id, operation_type)`
- `refine_apply_operation_modifiers(base_chance, operation_type, recipe)`

### 8. Implementar consumo de gold e materiais
Toda tentativa válida de refino deve consumir:
- gold
- materiais obrigatórios
- item modificador, se usado

Quero isso separado em funções claras.

Funções esperadas:
- `refine_consume_gold(recipe)`
- `refine_consume_materials(recipe)`
- `refine_consume_modifier_item(operation_type)`

A ordem deve ser consistente e claramente documentada.

### 9. Implementar sucesso do refino
Quando o refino for bem-sucedido:
- aumentar `refine_level` do item
- atualizar qualquer cache agregado do item
- recalcular atributos se necessário
- manter os bônus extras e estado do item intactos
- registrar resultado estruturado

Função esperada:
- `refine_apply_success(instance_id, recipe)`

### 10. Implementar falha do refino
Quando o refino falhar, o sistema deve seguir o `fail_behavior` da receita.

Comportamentos mínimos:
- manter nível atual
- reduzir nível
- destruir item

A lógica deve ser centralizada.

Função esperada:
- `refine_apply_failure(instance_id, recipe, operation_type)`

### 11. Implementar destruição do item por falha
Quando a regra for destruição:
- remover item do inventário ou do slot equipado
- limpar referências internas
- recalcular atributos do personagem se o item estava equipado
- retornar no resultado que o item foi destruído

Função esperada:
- `refine_destroy_item(instance_id)`

### 12. Implementar downgrade do item por falha
Quando a regra for downgrade:
- reduzir o `refine_level`
- respeitar limite mínimo
- atualizar caches do item
- recalcular atributos se necessário

Função esperada:
- `refine_downgrade_item(instance_id, amount)`

### 13. Implementar Pergaminho do Ferreiro
O Pergaminho do Ferreiro deve funcionar como modificador de refino focado em aumentar a chance de sucesso.

Regras esperadas:
- só pode ser usado quando a receita permitir
- deve consumir o item ao tentar
- o bônus de chance deve vir da receita ou configuração, não hardcoded
- não deve impedir destruição automaticamente, a menos que a configuração diga isso

Função esperada:
- `refine_apply_blacksmith_scroll_modifier(recipe, base_chance)`

### 14. Implementar Pergaminho da Paz
O Pergaminho da Paz deve funcionar como item de proteção.

Regras esperadas:
- só pode ser usado quando a receita permitir
- deve consumir o item ao tentar
- deve impedir destruição em falha, quando aplicável
- a proteção deve ser aplicada sem misturar regra diretamente em vários lugares
- se a falha normalmente destruiria, a operação deve converter isso para comportamento protegido conforme a receita

Funções esperadas:
- `refine_apply_peace_scroll_protection(recipe, fail_behavior)`
- `refine_is_failure_protected(operation_type, recipe)`

### 15. Preservar bônus e identidade do item ao refinar
Ao refinar um item:
- atributos base ligados ao refino podem mudar
- nível de refino deve mudar
- bônus nativos e bônus extras do item devem ser preservados
- a instância deve continuar sendo a mesma, salvo regra futura muito específica

Isso é obrigatório para não quebrar o sistema de bônus do prompt anterior.

### 16. Implementar cálculo dos stats finais após refino
O refino deve influenciar atributos base do item conforme tabela configurável.

A arquitetura deve suportar:
- ganho de ataque base por refino
- ganho de ataque mágico base por refino
- ganho de defesa base por refino
- ganho de HP/efeitos base por refino, se necessário

Esses valores devem vir de tabela/configuração.

Funções esperadas:
- `refine_get_stat_growth_for_item(instance_id, refine_level)`
- `item_get_effective_base_stats(instance_id)`

### 17. Integrar refino com item equipado e item no inventário
O sistema deve suportar refinar item:
- que esteja no inventário
- que esteja equipado, se essa regra for habilitada pela configuração
ou
- bloquear refinamento de item equipado, se essa regra for adotada

Quero que isso seja configurável e centralizado.

Campo/configuração esperada:
- `allow_refine_equipped_items`

### 18. Preparar arquitetura para múltiplos tipos de ferreiro
Mesmo sem sprite ou UI final, o sistema deve ficar pronto para ter no futuro:
- ferreiro comum
- ferreiro especial
- eventos com ferreiro melhorado
- diferentes tabelas de chance por NPC

Campos/configurações opcionais esperados:
- `smith_type`
- `smith_modifier_profile_id`

Não precisa implementar a variação completa agora, mas a arquitetura deve permitir isso.

### 19. Retornar resultado estruturado da tentativa de refino
Toda tentativa deve retornar uma estrutura clara.

Campos esperados:
- `success`
- `instance_id`
- `item_id`
- `previous_refine_level`
- `new_refine_level`
- `operation_type`
- `gold_spent`
- `materials_spent`
- `modifier_item_spent`
- `fail_behavior_applied`
- `item_destroyed`
- `protection_used`
- `final_success_chance`
- `failure_reason`

### 20. Preparar integração futura com materiais de drop
As receitas devem consumir materiais reais do inventário, mas este prompt não define como esses materiais entram no jogo.

A arquitetura deve ficar pronta para o próximo prompt de drops:
- materiais devem ser itens normais do inventário
- receitas devem apontar para `item_id` dos materiais
- o sistema não deve depender de drop tables para funcionar

## Arquitetura esperada

### Configuração
Criar local central para:
- regras gerais de refino
- enum de operação
- enum de falha
- receitas de refino
- crescimento de stats por refino
- flags de uso de itens modificadores
- regra de refinar item equipado ou não
- perfis futuros de ferreiro/NPC

### Estado
Separar claramente:
- catálogo de receitas
- estado da instância do item
- materiais no inventário
- gold do jogador
- modificadores disponíveis
- resultado da última tentativa, se fizer sentido

### Funções centrais
Funções esperadas:
- `refine_build_recipe_catalog()`
- `refine_get_recipe_for_item(instance_id, target_refine_level)`
- `refine_can_attempt(instance_id, operation_type)`
- `refine_attempt(instance_id, operation_type)`
- `refine_get_success_chance(instance_id, operation_type)`
- `refine_apply_operation_modifiers(base_chance, operation_type, recipe)`
- `refine_consume_gold(recipe)`
- `refine_consume_materials(recipe)`
- `refine_consume_modifier_item(operation_type)`
- `refine_apply_success(instance_id, recipe)`
- `refine_apply_failure(instance_id, recipe, operation_type)`
- `refine_destroy_item(instance_id)`
- `refine_downgrade_item(instance_id, amount)`
- `refine_apply_blacksmith_scroll_modifier(recipe, base_chance)`
- `refine_apply_peace_scroll_protection(recipe, fail_behavior)`
- `refine_is_failure_protected(operation_type, recipe)`
- `refine_get_stat_growth_for_item(instance_id, refine_level)`
- `item_get_effective_base_stats(instance_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir inventário para materiais e itens modificadores
- consumir gold do jogador
- atualizar item equipado ou no inventário
- recalcular atributos do personagem após refino
- preservar os bônus do item definidos no sistema anterior
- preparar integração futura com drops e materiais do próximo prompt
- preparar integração futura com UI/NPC do ferreiro sem depender dela para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de receitas de refino
2. validar corretamente se item pode ou não ser refinado
3. bloquear refino quando item estiver no nível máximo
4. bloquear refino sem gold suficiente
5. bloquear refino sem materiais suficientes
6. bloquear uso de modificador incompatível
7. consumir gold corretamente em tentativa válida
8. consumir materiais corretamente em tentativa válida
9. consumir Pergaminho do Ferreiro corretamente quando usado
10. consumir Pergaminho da Paz corretamente quando usado
11. aumentar o nível de refino corretamente em sucesso
12. manter ou reduzir nível corretamente em falha, conforme receita
13. destruir item corretamente quando a falha exigir
14. impedir destruição quando houver proteção válida
15. preservar bônus extras e identidade da instância ao refinar
16. recalcular atributos do personagem corretamente após refino
17. suportar item no inventário e item equipado conforme configuração
18. retornar resultado estruturado consistente em toda tentativa
19. manter arquitetura pronta para múltiplos tipos de ferreiro
20. manter arquitetura pronta para integração com materiais de drop no próximo prompt

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de refino em vários lugares
- não misturar UI com regra de negócio
- não misturar sistema de refino com sistema de bônus 1–5 e 6/7
- não implementar drops neste prompt
- não implementar UI final do ferreiro neste prompt
- não criar apenas mock sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders