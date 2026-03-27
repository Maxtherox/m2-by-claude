# Implementar sistema de status base para jogo 2D no GameMaker

Use GML moderno (GameMaker 2.3+), com `structs`, `functions` e `enums`, e entregue código real pronto para integração.

## Objetivo

Implementar a base estrutural do personagem: atributos primários, pontos de status, recursos básicos e dados gerais que serão consumidos pelos próximos sistemas.

Este prompt deve implementar apenas:
- estado base do personagem
- atributos primários distribuíveis
- pontos de status e regras de distribuição permanente
- bônus externos separados dos atributos base
- recursos básicos mínimos do personagem
- honra em estado inicial simplificado
- funções centrais de inicialização, leitura e atualização

Não implementar neste prompt:
- interface visual
- sistema de XP e level up
- atributos derivados finais
- combate
- inventário
- skills
- equipamentos

## Dependências e contexto

Este é o primeiro prompt da sequência. Ele deve criar uma fundação limpa para os prompts seguintes:
- `02-sistema-xp-level-up-progressivo`
- `03-sistema-atributos-derivados`
- `04-interface-de-status`

Se algum dado ainda não existir no projeto, crie a estrutura mínima necessária sem depender de UI.

## Estado mínimo que o personagem deve expor

O personagem deve possuir, no mínimo, os campos abaixo:

### Identidade e progressão base
- `character_name`
- `level`
- `status_points`
- `honor_value`
- `honor_rank`

### Atributos primários base
- `for_base`
- `int_base`
- `dex_base`
- `def_base`
- `vit_base`

### Bônus externos separados
- `bonus_for`
- `bonus_int`
- `bonus_dex`
- `bonus_def`
- `bonus_vit`

### Recursos básicos mínimos
- `hp_current`
- `hp_max`
- `mp_current`
- `mp_max`

Observações:
- `hp_max` e `mp_max` podem começar com valores simples e provisórios, desde que fiquem prontos para serem recalculados pelo sistema de atributos derivados no prompt 03.
- `honor_rank` pode ser calculado a partir de `honor_value` com uma regra inicial simples.

## Requisitos funcionais

Implemente uma estrutura centralizada para:

### 1. Configuração inicial
Centralize em um único local:
- nome padrão do personagem ou valor de fallback
- nível inicial
- quantidade inicial de pontos de status
- valores iniciais de `FOR`, `INT`, `DEX`, `DEF` e `VIT`
- valores iniciais de `hp_current`, `hp_max`, `mp_current` e `mp_max`
- faixas simples de honra

### 2. Inicialização do personagem
Crie função equivalente a:
- `player_stats_create()`
ou
- `stats_base_initialize()`

Essa inicialização deve:
- preencher todos os campos obrigatórios
- definir valores coerentes de início
- deixar bônus externos zerados
- deixar a estrutura pronta para save/load futuro

### 3. Leitura e acesso aos atributos
Crie uma forma limpa de acessar atributos por chave, enum ou nome padronizado.

Exemplos aceitáveis:
- enum de atributos primários
- helper para obter/setar atributo por chave

Evite lógica duplicada para cada atributo em vários lugares.

### 4. Distribuição permanente de pontos
Crie funções centrais para gastar pontos de status de forma permanente.

O sistema deve permitir:
- validar se há pontos suficientes
- aplicar pontos em um atributo específico
- aplicar múltiplos pontos de uma vez
- aplicar uma alocação em lote para vários atributos

Exemplos aceitáveis:
- `stats_base_can_allocate(allocation_struct)`
- `stats_base_apply_point(stat_key)`
- `stats_base_apply_allocation(allocation_struct)`

### 5. Validações obrigatórias
O sistema deve impedir:
- gastar pontos negativos
- gastar mais pontos do que o disponível
- aplicar atributos inválidos
- reduzir atributo base abaixo do valor mínimo

### 6. Honra simplificada
Crie uma função central para resolver o título textual de honra a partir do valor numérico.

Exemplo de base simples:
- valor baixo ou neutro -> `Neutra`
- valor positivo -> `Honrada`
- valor mais alto -> `Respeitada`

Essa parte deve ficar preparada para expansão futura, inclusive honra negativa.

## Arquitetura esperada

Separe responsabilidades em pelo menos estas camadas:

### Configuração
Um local central com valores iniciais e limites.

### Estado do personagem
Uma `struct` ou organização equivalente contendo todos os campos do sistema base.

### Funções de serviço
Funções para:
- inicializar
- validar
- aplicar pontos
- consultar atributos
- resolver honra

Não espalhe números mágicos ou regras de distribuição pelo projeto.

## Integração futura obrigatória

O resultado deste prompt deve ficar compatível com os próximos sistemas:

### Prompt 02
O sistema de XP deve conseguir:
- ler `level`
- aumentar `status_points`
- restaurar `hp_current` para `hp_max`

### Prompt 03
O sistema de atributos derivados deve conseguir:
- ler `for_base`, `int_base`, `dex_base`, `def_base`, `vit_base`
- ler `bonus_for`, `bonus_int`, `bonus_dex`, `bonus_def`, `bonus_vit`
- ajustar `hp_max`, `mp_max`, `hp_current` e `mp_current`

### Prompt 04
A interface de status deve conseguir:
- ler os valores base
- exibir `status_points`
- confirmar distribuição chamando funções centrais deste sistema

## Critérios de aceite

Garanta que o sistema trate corretamente:
- personagem recém-criado com valores iniciais coerentes
- gasto de 1 ponto com sucesso
- gasto de vários pontos no mesmo atributo
- gasto distribuído entre múltiplos atributos
- tentativa de gastar sem pontos suficientes
- tentativa de usar atributo inválido
- bônus externos permanecendo separados do valor base
- honra textual atualizada a partir de `honor_value`

## Formato de resposta esperado

Entregue nesta ordem:

1. Resumo curto da arquitetura adotada
2. Código GML completo, sem pseudo-código
3. Explicação breve de como o sistema conversa com XP, atributos derivados e UI

## Restrições importantes

- Não implementar UI
- Não implementar level up
- Não implementar atributos derivados finais
- Não implementar combate
- Não implementar inventário
- Não omitir partes importantes
- Não espalhar regra de negócio em eventos de draw
- Não depender de assets externos para funcionar
