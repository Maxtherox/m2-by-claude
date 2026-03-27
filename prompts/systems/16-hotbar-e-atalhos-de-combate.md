# Implementar hotbar de combate, atalhos rápidos e uso de skills/itens no GameMaker

## Objetivo

Implementar a hotbar principal de combate do jogo, permitindo ao jogador equipar skills e consumíveis em slots rápidos, usar atalhos de teclado/mouse e visualizar cooldown, custo e quantidade disponível. Este prompt resolve a camada de uso imediato em gameplay dos sistemas de combate, skills, consumíveis e inventário, sem duplicar a lógica central desses sistemas.

Este prompt vem depois de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `08-interface-de-skills.md`
- `09-itens-consumiveis-progressao-skill.md`
- `10-sistema-inventario-completo.md`
- `15-sistema-combate-base.md`

Este prompt vem antes de:
- prompt de HUD completa
- prompt de IA dos inimigos
- prompt de buffs/debuffs avançados
- prompt de controles avançados/combo expandido
- prompt de minimapa e HUD secundária, se você quiser separar depois

## Escopo

### Implementar neste prompt
- hotbar principal de combate
- slots rápidos para skills
- slots rápidos para consumíveis
- atribuição manual de skill a slot
- atribuição manual de item consumível a slot
- uso por teclado
- suporte a clique no slot
- exibição de cooldown
- exibição de quantidade restante do item
- exibição de custo de MP da skill
- bloqueio visual de uso inválido
- integração com combate já existente
- integração com inventário
- integração com sistema de skills
- atualização dinâmica da hotbar após consumo, cooldown ou remoção do item
- identidade visual coerente com o restante do projeto

### Não implementar neste prompt
- HUD completa de combate
- barra de HP/MP geral da tela
- minimapa
- IA dos inimigos
- sistema de combate do zero
- lógica central de skill
- lógica central de consumível
- combo novo de ataques
- buffs/debuffs avançados
- drag and drop de inventário inteiro, exceto a parte necessária para atribuir slot rápido
- gamepad avançado
- configurações complexas de remapeamento
- multiplayer
- PvP
- notificações globais complexas
- sistema de macro/auto uso

## Dependências e contexto

Este prompt depende de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `08-interface-de-skills.md`
- `09-itens-consumiveis-progressao-skill.md`
- `10-sistema-inventario-completo.md`
- `15-sistema-combate-base.md`

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de skills
- estado individual das skills do jogador
- `skills_can_use(skill_id)`
- `skills_use(skill_id, target)` ou fluxo equivalente já integrado ao combate
- `cooldown_remaining`
- `mp_current`
- `mp_max`
- inventário do jogador
- itens consumíveis com `item_id`, `quantity` e categoria/subtipo
- funções centrais de uso de consumível
- sistema de combate já integrado com skill
- sistema de input básico do jogo
- personagem já controlável em gameplay

### Dados que este prompt deve criar
- estrutura da hotbar
- slots rápidos
- enum de tipo de slot rápido
- bindings de teclas
- estado visual da hotbar
- sistema de atribuição de skill/item ao slot
- função central de uso de slot
- integração com alvo atual ou direção atual de combate
- atualização visual de cooldown/quantidade

## Requisitos funcionais

### 1. Criar enum de tipos de slot rápido
Criar enums ou estruturas equivalentes para separar claramente o que cada slot da hotbar pode armazenar.

Tipos mínimos esperados:
- `HOTBAR_SLOT_SKILL`
- `HOTBAR_SLOT_ITEM`
- `HOTBAR_SLOT_EMPTY`

Enums esperados:
- `HotbarSlotType`

### 2. Criar estrutura da hotbar
A hotbar deve ter uma estrutura centralizada e reutilizável.

Campos esperados:
- `slot_index`
- `slot_type`
- `assigned_skill_id`
- `assigned_item_instance_id` ou `assigned_item_id`, conforme a arquitetura adotada
- `key_binding`
- `is_locked`
- `display_order`

A hotbar deve ter quantidade de slots configurável.
Sugestão inicial:
- 8 slots principais

Campos/configuração esperados:
- `hotbar_slot_count`
- `hotbar_default_bindings`

### 3. Criar sistema de inicialização da hotbar
Ao iniciar o personagem ou o save:
- criar a hotbar
- aplicar bindings padrão
- deixar slots vazios
- carregar dados persistidos se existirem

Funções esperadas:
- `hotbar_init()`
- `hotbar_reset_to_default()`

### 4. Implementar atribuição de skill ao slot
O jogador deve poder vincular skills a slots rápidos.

Regras:
- apenas skills desbloqueadas podem ser atribuídas
- não duplicar regra de desbloqueio dentro da hotbar
- a hotbar deve armazenar referência consistente da skill
- permitir substituir skill já atribuída em um slot

Funções esperadas:
- `hotbar_assign_skill(slot_index, skill_id)`
- `hotbar_can_assign_skill(slot_index, skill_id)`
- `hotbar_clear_slot(slot_index)`

### 5. Implementar atribuição de item consumível ao slot
O jogador deve poder vincular consumíveis a slots rápidos.

Regras:
- apenas itens consumíveis válidos podem ser atribuídos
- o item precisa existir no inventário
- a hotbar deve refletir a quantidade atual disponível
- se o item acabar, o slot deve atualizar automaticamente
- o slot pode continuar vinculado ao item_id ou limpar automaticamente, desde que isso seja consistente e documentado

Funções esperadas:
- `hotbar_assign_item(slot_index, item_reference)`
- `hotbar_can_assign_item(slot_index, item_reference)`

### 6. Implementar uso por teclado
Cada slot deve possuir um atalho de teclado.

Regras:
- pressionar a tecla deve tentar usar o slot correspondente
- slots vazios não fazem nada
- slots bloqueados não devem executar
- o uso deve respeitar o estado atual do personagem

Funções esperadas:
- `hotbar_handle_input()`
- `hotbar_use_slot(slot_index)`

### 7. Implementar uso por clique
O jogador também deve poder clicar diretamente no slot para usar seu conteúdo.

Regras:
- clique esquerdo usa o slot
- clique direito pode limpar slot ou abrir modo de reassociação, se você achar mais consistente
- o comportamento deve ser simples e previsível

Funções esperadas:
- `hotbar_handle_mouse_input()`
- `hotbar_on_slot_left_click(slot_index)`
- `hotbar_on_slot_right_click(slot_index)`

### 8. Integrar uso de skill com o combate atual
Quando um slot de skill for usado:
- validar a skill via sistema central
- respeitar MP
- respeitar cooldown
- usar o fluxo de combate/skill já existente
- não recalcular dano dentro da hotbar
- não duplicar lógica de skill

Funções esperadas:
- `hotbar_use_skill_slot(slot_index)`
- `hotbar_get_skill_use_target_or_context(slot_index)` ou equivalente

### 9. Integrar uso de consumível com inventário e sistema central
Quando um slot de item for usado:
- validar se o item ainda existe
- validar se é utilizável no contexto atual
- consumir via sistema central de item/consumível
- atualizar quantidade na hotbar
- reagir corretamente quando o item acabar

Funções esperadas:
- `hotbar_use_item_slot(slot_index)`
- `hotbar_refresh_item_binding(slot_index)`

### 10. Exibir cooldown da skill
A hotbar deve mostrar claramente o cooldown das skills atribuídas.

Requisitos:
- overlay visual de recarga
- texto opcional de tempo restante
- slot bloqueado visualmente enquanto em cooldown
- sem controlar cooldown por conta própria; apenas ler do sistema central

Funções esperadas:
- `hotbar_get_slot_cooldown(slot_index)`
- `hotbar_is_slot_on_cooldown(slot_index)`

### 11. Exibir custo e disponibilidade da skill
A hotbar deve deixar claro quando a skill não pode ser usada por:
- falta de MP
- cooldown
- skill bloqueada
- contexto inválido

A UI deve mostrar estado visual de indisponibilidade.
Não precisa exibir todos os motivos em tooltip complexa, mas deve haver feedback claro.

Função esperada:
- `hotbar_get_slot_block_reason(slot_index)`

### 12. Exibir quantidade do item consumível
Slots de consumível devem mostrar:
- quantidade atual
- estado de indisponível quando chegar a zero
- atualização imediata após uso
- atualização imediata após remoção do inventário

Funções esperadas:
- `hotbar_get_item_quantity(slot_index)`
- `hotbar_is_item_available(slot_index)`

### 13. Implementar atualização automática da hotbar
A hotbar deve reagir automaticamente a mudanças do estado do jogo.

Casos mínimos:
- skill entrou em cooldown
- cooldown terminou
- MP mudou
- item foi consumido
- item foi removido do inventário
- skill foi removida ou ficou indisponível
- slot foi reatribuído

Funções esperadas:
- `hotbar_refresh_all()`
- `hotbar_refresh_slot(slot_index)`

### 14. Implementar sistema de reassociação simples
Deve existir forma clara de atribuir ou trocar skills/itens entre slots.

Pode ser por:
- função chamada pela interface de skills
- função chamada pela interface de inventário
- modo simples de seleção de slot

O importante é manter consistência e não criar uma lógica solta.

Funções esperadas:
- `hotbar_begin_assign_mode(assign_type, source_reference)`
- `hotbar_commit_assignment(slot_index, assign_payload)`

### 15. Aplicar identidade visual inspirada em Elden Ring
A hotbar deve seguir a mesma direção visual do projeto.

Direção visual obrigatória:
- aparência sóbria
- fantasia sombria
- molduras discretas
- fundo escuro ou translúcido escuro
- detalhes em dourado, bronze, chumbo ou marfim queimado
- visual limpo e premium
- boa legibilidade dos ícones, números e cooldowns
- sem aparência mobile genérica
- sem visual sci-fi
- sem excesso de efeitos

A hotbar deve combinar com a interface de status, skills e ferreiro.

### 16. Não quebrar o combate atual já existente
A hotbar deve se encaixar no combate metroidvania já funcional.

Isso significa:
- não substituir o sistema atual de clique e combo básico
- coexistir com o ataque normal atual
- acionar skill/consumível sem travar o fluxo do combate
- respeitar estados existentes do player

### 17. Preparar persistência futura
A arquitetura deve ficar pronta para salvar:
- bindings da hotbar
- conteúdo de cada slot
- ordem dos slots
- travas/lock dos slots, se existirem

Não precisa implementar o save/load completo aqui, mas a estrutura deve nascer preparada.

## Arquitetura esperada

### Configuração
Criar local central para:
- quantidade de slots
- teclas padrão
- layout visual
- tamanhos e espaçamentos
- enums de slot
- regras de uso por slot
- estados visuais de cooldown e indisponibilidade

### Estado
Separar claramente:
- estrutura da hotbar
- slots e seus conteúdos
- modo de atribuição
- estado visual da barra
- feedback de uso
- cache de cooldown/quantidade, se necessário

### Funções centrais
Funções esperadas:
- `hotbar_init()`
- `hotbar_reset_to_default()`
- `hotbar_assign_skill(slot_index, skill_id)`
- `hotbar_can_assign_skill(slot_index, skill_id)`
- `hotbar_assign_item(slot_index, item_reference)`
- `hotbar_can_assign_item(slot_index, item_reference)`
- `hotbar_clear_slot(slot_index)`
- `hotbar_handle_input()`
- `hotbar_handle_mouse_input()`
- `hotbar_use_slot(slot_index)`
- `hotbar_use_skill_slot(slot_index)`
- `hotbar_use_item_slot(slot_index)`
- `hotbar_get_slot_cooldown(slot_index)`
- `hotbar_is_slot_on_cooldown(slot_index)`
- `hotbar_get_slot_block_reason(slot_index)`
- `hotbar_get_item_quantity(slot_index)`
- `hotbar_is_item_available(slot_index)`
- `hotbar_refresh_all()`
- `hotbar_refresh_slot(slot_index)`
- `hotbar_begin_assign_mode(assign_type, source_reference)`
- `hotbar_commit_assignment(slot_index, assign_payload)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir skills do sistema central
- consumir inventário e consumíveis do sistema central
- consumir combate atual já existente
- refletir cooldown e MP sem recalcular regras
- preparar integração futura com HUD completa
- preparar integração futura com save/load
- não depender de IA dos inimigos para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. inicializar hotbar com slots e bindings padrão
2. atribuir skill válida a slot corretamente
3. impedir atribuição inválida de skill
4. atribuir item consumível válido a slot corretamente
5. impedir atribuição inválida de item
6. usar slot de skill por teclado corretamente
7. usar slot de item por teclado corretamente
8. usar slot por clique corretamente
9. respeitar cooldown da skill
10. respeitar custo de MP da skill
11. atualizar cooldown visual corretamente
12. exibir quantidade do item corretamente
13. atualizar quantidade após consumir item
14. reagir corretamente quando o item acabar
15. não quebrar o ataque normal e combo atual já existentes
16. manter separação entre UI e regra de negócio
17. seguir a identidade visual do projeto
18. manter arquitetura pronta para persistência futura sem retrabalho

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica da hotbar em vários lugares
- não misturar UI com regra de negócio
- não duplicar lógica central de skills, consumíveis ou combate
- não quebrar o combate atual já existente
- não implementar HUD completa neste prompt
- não implementar IA dos inimigos neste prompt
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders