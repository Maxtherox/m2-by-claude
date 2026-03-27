# Implementar sistema de itens consumíveis para progressão de skills no GameMaker

## Objetivo

Implementar a camada de itens consumíveis usados na progressão de skills, especialmente livros e Pedra Espiritual, com validação, consumo e integração com os sistemas de skill e honra. Este prompt resolve a formalização dos consumíveis de progressão para que a evolução avançada das skills não dependa de chamadas soltas ou abstrações temporárias.

Este prompt vem depois de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `08-interface-de-skills.md`

Este prompt vem antes de:
- prompt de inventário completo
- prompt de loot/drop
- prompt de hotbar de itens, se existir depois

## Escopo

### Implementar neste prompt
- definição de itens consumíveis de progressão de skill
- estrutura de identificação por tipo de item
- uso de livro de skill
- uso de Pedra Espiritual
- validação de compatibilidade entre item e progressão da skill
- consumo do item ao usar
- retorno estruturado do resultado de uso
- integração com sistema de skills
- integração com sistema de honra no caso da Pedra Espiritual
- estrutura pronta para futura integração com inventário completo

### Não implementar neste prompt
- inventário completo
- sistema de drop
- loot de monstros
- lojas
- crafting
- interface visual completa de inventário
- sistema de stack visual
- economia
- combate
- tooltips completas
- geração procedural de itens
- uso de outros tipos de consumível fora de progressão de skill

## Dependências e contexto

Este sistema depende de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `05-sistema-honra.md`

Campos e dados que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- `skills_can_read_book(skill_id)`
- `skills_read_book(skill_id)`
- `skills_can_use_spirit_stone(skill_id)`
- `skills_use_spirit_stone(skill_id)`
- `skills_get_player_skill(skill_id)`
- `skills_get_progression_label(skill_id)`
- `honor_current`
- `honor_remove(amount, source)`

### Dados que este prompt deve criar
- catálogo de itens consumíveis de progressão
- enum de tipos de item consumível
- struct de item consumível
- estado de posse/quantidade simples para testes
- função central de uso do consumível
- função de validação por tipo de consumível
- integração opcional com container temporário de itens enquanto não existir inventário completo

## Requisitos funcionais

### 1. Criar enum ou estrutura de tipos de consumível
O sistema deve distinguir claramente os tipos de consumível usados em progressão de skill.

Tipos mínimos esperados:
- `SKILL_BOOK`
- `SPIRIT_STONE`

Enums esperados:
- `ItemConsumableType`
ou equivalente consistente com o projeto

### 2. Criar estrutura de definição de item consumível
Criar uma struct ou estrutura equivalente para definição de item.

Campos esperados:
- `id`
- `name`
- `type`
- `description`
- `target_skill_id` opcional
- `is_generic`
- `stack_limit`
- `rarity` opcional
- `can_consume_outside_inventory`
- `progression_stage_required` opcional

Explicação desejada:
- um livro pode ser genérico ou vinculado a uma skill específica
- Pedra Espiritual pode ser genérica
- a arquitetura deve permitir ambos os modelos

### 3. Criar catálogo central de itens consumíveis
Os itens consumíveis devem ser cadastrados em um local central e consultáveis por `id`.

Funções esperadas:
- `consumables_build_catalog()`
- `consumables_get_definition(item_id)`

A definição não deve ficar espalhada em vários scripts.

### 4. Criar estado temporário de posse de consumíveis
Mesmo sem inventário completo, o projeto precisa de uma estrutura simples para armazenar quantidades.

Quero uma solução temporária e limpa, por exemplo:
- map de `item_id -> quantity`
ou estrutura equivalente consistente com GameMaker

Funções esperadas:
- `consumables_init_player_storage()`
- `consumables_add(item_id, amount)`
- `consumables_remove(item_id, amount)`
- `consumables_get_amount(item_id)`

Esse armazenamento deve ser fácil de substituir depois pelo inventário real.

### 5. Implementar validação central de uso de consumível
Criar uma função central que valide se um item pode ser usado para uma skill específica.

Função esperada:
- `consumables_can_use_on_skill(item_id, skill_id)`

Ela deve validar ao menos:
- item existe
- quantidade disponível
- skill existe
- skill está no estágio correto
- item é compatível com a skill ou é genérico
- progressão da skill permite aquele tipo de item
- o uso não violaria regras já validadas pelo sistema de skills

### 6. Implementar uso de livro de skill como item real
Criar a integração entre item livro e progressão Mestre.

Comportamento esperado:
- usar item do tipo `SKILL_BOOK`
- validar compatibilidade
- validar se a skill está em `MASTER`
- chamar o sistema central `skills_read_book(skill_id)`
- em caso de uso válido, consumir 1 unidade do item
- retornar resultado estruturado

Função esperada:
- `consumables_use_skill_book(item_id, skill_id)`

### 7. Implementar uso de Pedra Espiritual como item real
Criar a integração entre item Pedra Espiritual e progressão `GRAND_MASTER`.

Comportamento esperado:
- usar item do tipo `SPIRIT_STONE`
- validar compatibilidade
- validar se a skill está em `GRAND_MASTER`
- chamar o sistema central `skills_use_spirit_stone(skill_id)`
- em caso de uso válido, consumir 1 unidade do item
- perda de honra deve continuar sendo responsabilidade do sistema de skills/honra, não do item
- retornar resultado estruturado

Função esperada:
- `consumables_use_spirit_stone(item_id, skill_id)`

### 8. Criar função central única para uso em skill
Além das funções específicas, quero uma função central única para roteamento do consumo.

Função esperada:
- `consumables_use_on_skill(item_id, skill_id)`

Responsabilidades:
- identificar tipo do item
- chamar a função apropriada
- padronizar o retorno
- manter a lógica organizada

### 9. Retornar resultado estruturado do uso do item
Toda tentativa de uso de consumível deve retornar uma estrutura clara.

Campos esperados:
- `success`
- `item_id`
- `item_type`
- `skill_id`
- `item_consumed`
- `amount_consumed`
- `previous_progress_label`
- `new_progress_label`
- `honor_spent`
- `failure_reason`
- `skill_result`

Isso será importante para a futura interface e para logs internos.

### 10. Separar compatibilidade por item genérico e item específico
A arquitetura deve permitir os dois cenários:

#### Item genérico
Exemplo:
- livro genérico que serve para qualquer skill elegível
- Pedra Espiritual genérica

#### Item específico
Exemplo:
- livro da skill X
- livro da skill Y

O sistema deve validar:
- se `is_generic == true`, qualquer skill elegível pode usar
- se `is_generic == false`, o `target_skill_id` deve coincidir

### 11. Preparar integração futura com inventário completo
O armazenamento temporário de itens deve ser desenhado para futura substituição pelo inventário real.

Quero que a IA deixe isso explícito:
- a lógica de validação e consumo não deve ficar acoplada a uma implementação temporária ruim
- deve haver uma camada simples de acesso à quantidade disponível
- depois o inventário real poderá substituir essa camada sem quebrar o restante

### 12. Garantir que o item só seja consumido em uso válido
O item não deve ser removido quando:
- não existir quantidade
- a skill estiver em estágio inválido
- a skill estiver em estágio máximo
- a skill não for compatível
- a chamada central de progressão falhar por invalidação antes da tentativa real

Se a tentativa foi válida e o sistema de skill executou a progressão, o consumo deve seguir a regra configurada.
Se fizer sentido, a IA pode manter:
- item consumido ao tentar
ou
- item consumido apenas em tentativa considerada válida pelo sistema central

Mas isso deve ser consistente e claramente documentado.

## Arquitetura esperada

### Configuração
Criar local central para:
- tipos de consumível
- catálogo de livros e pedras
- limites de stack
- regras de compatibilidade
- flags para comportamento de consumo

### Estado
Separar claramente:
- catálogo global de consumíveis
- armazenamento temporário de quantidade do jogador
- resultado da última operação, se fizer sentido

### Funções centrais
Funções esperadas:
- `consumables_build_catalog()`
- `consumables_get_definition(item_id)`
- `consumables_init_player_storage()`
- `consumables_add(item_id, amount)`
- `consumables_remove(item_id, amount)`
- `consumables_get_amount(item_id)`
- `consumables_can_use_on_skill(item_id, skill_id)`
- `consumables_use_skill_book(item_id, skill_id)`
- `consumables_use_spirit_stone(item_id, skill_id)`
- `consumables_use_on_skill(item_id, skill_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- chamar o sistema central de skills para progressão
- chamar indiretamente o sistema de honra através da progressão com Pedra Espiritual
- preparar substituição futura do armazenamento temporário por inventário real
- preparar futura integração com UI de inventário e UI de skills

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo central de consumíveis corretamente
2. inicializar armazenamento temporário do jogador corretamente
3. adicionar e remover quantidades corretamente
4. consultar quantidade corretamente
5. validar corretamente livro genérico em skill elegível
6. validar corretamente livro específico apenas para a skill correta
7. impedir uso quando não houver quantidade suficiente
8. impedir uso quando a skill estiver no estágio incorreto
9. usar livro corretamente em skill no estágio `MASTER`
10. usar Pedra Espiritual corretamente em skill no estágio `GRAND_MASTER`
11. consumir 1 unidade do item corretamente após uso válido
12. não consumir item em uso inválido
13. retornar resultado estruturado consistente
14. propagar corretamente o resultado da progressão da skill
15. manter arquitetura pronta para futura substituição por inventário completo

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de consumível em vários lugares
- não misturar UI com regra de negócio
- não implementar inventário completo neste prompt
- não implementar drop neste prompt
- não implementar lojas neste prompt
- não duplicar regras centrais de progressão já existentes no sistema de skills
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders