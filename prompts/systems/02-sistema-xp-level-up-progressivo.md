# Implementar sistema de XP e level up progressivo para jogo 2D no GameMaker

Use GML moderno (GameMaker 2.3+), com `structs`, `functions` e `enums`, e entregue código real pronto para integração.

## Objetivo

Implementar a lógica completa de progressão por experiência, incluindo:
- ganho de XP
- cálculo de XP por nível
- múltiplos level ups em sequência
- recompensas por level up
- restauração total de HP ao subir de nível
- recompensa especial por marco de níveis
- progressão automática em níveis altos

Não implementar neste prompt:
- interface visual
- skills
- honra
- combate
- inventário completo

## Dependências e contexto

Considere que o projeto já possui, ou deve passar a possuir, a base do personagem do prompt 01.

O sistema deve operar sobre um estado que inclua pelo menos:
- `level`
- `status_points`
- `hp_current`
- `hp_max`

Se ainda não existirem, crie também:
- `exp_current`
- `exp_to_next`
- `exp_total`
- `level_bonus_attack_physical`
- `level_bonus_attack_magic`
- `level_bonus_defense`
- `level_bonus_hp`

Esses bônus são permanentes, acumulativos e devem ser consumidos depois pelo sistema de atributos derivados.

## Requisitos funcionais

### 1. Curva de XP progressiva
Implemente uma função central equivalente a:
- `xp_get_required_for_level(level)`

A curva deve:
- crescer de forma perceptível conforme o nível aumenta
- ser fácil de rebalancear
- não explodir de forma inviável
- ser controlada por configuração central

Centralize valores como:
- `xp_base`
- `xp_growth_linear`
- `xp_growth_curve`
- `xp_growth_extra_interval`

Você pode escolher a fórmula exata, desde que ela seja previsível, limpa e parametrizada.

### 2. Ganho de XP por fonte genérica
Implemente uma função equivalente a:
- `xp_add(amount, source)`

Ela deve:
- validar entrada
- somar XP ao personagem
- atualizar `exp_total` se existir
- disparar a rotina de level up quando necessário

`source` deve existir para futura integração com inimigos, quests, eventos e itens, mesmo que neste prompt ele seja apenas informativo.

### 3. Múltiplos level ups
Quando `exp_current >= exp_to_next`, o sistema deve:
- subir 1 nível por vez
- carregar o excesso de XP para o próximo nível
- recalcular `exp_to_next` a cada novo nível
- continuar processando enquanto ainda houver XP suficiente

Crie uma rotina clara para isso, por exemplo:
- `xp_check_level_up()`
- `xp_process_single_level_up()`

### 4. Recompensa padrão por level up
Antes de um nível de transição configurável, o jogador deve ganhar pontos de status manuais.

Centralize em configuração:
- `level_threshold_auto_growth`
- `status_points_per_level`

Regra:
- abaixo do limiar: ganha `status_points`
- a partir do limiar: deixa de ganhar pontos manuais e passa a ganhar bônus automáticos

### 5. Progressão automática em níveis altos
Após `level_threshold_auto_growth`, cada level up deve conceder:
- bônus de ataque físico
- bônus de ataque mágico
- bônus de defesa
- bônus de HP

Centralize em configuração:
- `auto_gain_physical_attack_per_level`
- `auto_gain_magic_attack_per_level`
- `auto_gain_defense_per_level`
- `auto_gain_hp_per_level`

Não deixe esses valores hardcoded na rotina principal de level up.

### 6. Recuperação de HP no level up
A cada subida de nível individual:
- `hp_current` deve ser restaurado para `hp_max`

Isso deve acontecer em todos os level ups processados, inclusive quando vários níveis são ganhos de uma vez.

### 7. Recompensa de marco
Implemente uma recompensa separada para marcos recorrentes, por padrão a cada 10 níveis.

Centralize em configuração:
- `level_milestone_interval`
- `level_milestone_reward_id`

Crie uma função equivalente a:
- `xp_grant_milestone_reward(level)`

Ela pode:
- adicionar uma recompensa em fila ou struct própria
ou
- chamar uma função central de recompensa

Não implementar inventário completo, apenas a estrutura preparada para isso.

## Arquitetura esperada

Separe o sistema em pelo menos estas partes:

### Configuração
Curva de XP, limiar de progressão automática, ganhos por level, intervalo de marco e IDs de recompensa.

### Estado
Campos de XP, nível, recompensas acumuladas e bônus permanentes de level up.

### Funções centrais
Exemplos aceitáveis:
- `xp_get_required_for_level(level)`
- `xp_add(amount, source)`
- `xp_check_level_up(character)`
- `xp_process_single_level_up(character)`
- `xp_apply_level_rewards(character, new_level)`
- `xp_apply_auto_growth_rewards(character)`
- `xp_grant_milestone_reward(character, level)`
- `xp_restore_hp_on_level_up(character)`

Use nomes melhores se fizer sentido, mas mantenha responsabilidades separadas.

## Integração futura obrigatória

O resultado deste prompt deve ficar pronto para integrar com:
- sistema de status base
- atributos derivados
- drops e recompensas
- inventário
- save/load

Se algum valor recalculado depender do prompt 03, deixe o ponto de integração explícito em vez de duplicar lógica.

## Critérios de aceite

Garanta que o sistema trate corretamente:
- ganho pequeno de XP sem subir de nível
- ganho exato para subir 1 nível
- ganho com sobra de XP
- ganho massivo para subir vários níveis
- level up antes do limiar de progressão automática
- level up depois do limiar de progressão automática
- level up em nível múltiplo do marco
- múltiplos level ups em sequência com um marco no meio
- restauração correta de HP em cada subida

## Formato de resposta esperado

Entregue nesta ordem:

1. Resumo curto da arquitetura adotada
2. Código GML completo, sem pseudo-código
3. Explicação breve de como integrar com status base e atributos derivados

## Restrições importantes

- Não implementar UI
- Não implementar skills
- Não implementar honra
- Não implementar combate
- Não implementar inventário completo
- Não espalhar regras de progressão pelo projeto
- Não omitir partes importantes
