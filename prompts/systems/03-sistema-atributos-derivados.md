# Implementar sistema de atributos derivados e recálculo final para jogo 2D no GameMaker

Use GML moderno (GameMaker 2.3+), com `structs`, `functions` e `enums`, e entregue código real pronto para integração.

## Objetivo

Implementar um sistema centralizado de recálculo dos atributos finais do personagem.

Este prompt deve cobrir:
- separação entre atributos base, bônus externos e atributos finais
- cálculo dos totais primários
- cálculo dos atributos derivados
- recálculo completo em um único ponto
- clamp de `hp_current` e `mp_current`
- consumo dos bônus permanentes vindos do level up

Não implementar neste prompt:
- interface visual
- skills
- honra
- combate completo
- inventário

## Dependências e contexto

Considere que o personagem já possui, ou deve passar a possuir:

### Atributos base
- `for_base`
- `int_base`
- `dex_base`
- `def_base`
- `vit_base`

### Bônus externos
- `bonus_for`
- `bonus_int`
- `bonus_dex`
- `bonus_def`
- `bonus_vit`

### Bônus permanentes do level up
- `level_bonus_attack_physical`
- `level_bonus_attack_magic`
- `level_bonus_defense`
- `level_bonus_hp`

### Recursos atuais
- `hp_current`
- `mp_current`

Se algum desses campos ainda não existir, crie a estrutura mínima necessária.

## Resultado que o sistema deve produzir

### Totais primários
- `for_total`
- `int_total`
- `dex_total`
- `def_total`
- `vit_total`

### Atributos derivados finais
- `hp_max`
- `mp_max`
- `attack_physical`
- `attack_magic`
- `defense_total`
- `crit_chance`
- `attack_speed`
- `move_speed`
- `hp_regen`
- `mp_regen`

## Regras conceituais

Use estas relações como base:
- `FOR` influencia dano físico
- `INT` influencia dano mágico, MP máximo e regen de MP
- `DEX` influencia chance crítica, velocidade de ataque e velocidade de movimento
- `DEF` influencia defesa final
- `VIT` influencia HP máximo e regen de HP

Os cálculos devem ser previsíveis, legíveis e fáceis de rebalancear.

## Requisitos funcionais

### 1. Configuração centralizada
Crie um local único para os coeficientes dos cálculos, por exemplo:
- `hp_base_value`
- `hp_per_vit`
- `mp_base_value`
- `mp_per_int`
- `physical_attack_base`
- `physical_attack_per_for`
- `magical_attack_base`
- `magical_attack_per_int`
- `defense_base_value`
- `defense_per_def`
- `crit_base_chance`
- `crit_per_dex`
- `crit_min`
- `crit_max`
- `attack_speed_base`
- `attack_speed_per_dex`
- `move_speed_base`
- `move_speed_per_dex`
- `hp_regen_base`
- `hp_regen_per_vit`
- `mp_regen_base`
- `mp_regen_per_int`

Os nomes podem variar, mas os valores devem ficar centralizados e sem números mágicos espalhados.

### 2. Totais primários
Sempre some:
- valor base
- bônus externo

Exemplo esperado:
- `for_total = for_base + bonus_for`
- `int_total = int_base + bonus_int`
- `dex_total = dex_base + bonus_dex`
- `def_total = def_base + bonus_def`
- `vit_total = vit_base + bonus_vit`

### 3. Cálculo dos atributos derivados
Implemente fórmulas reais, parametrizadas e equilibradas para:
- `hp_max`, considerando `vit_total` e `level_bonus_hp`
- `mp_max`, considerando `int_total`
- `attack_physical`, considerando `for_total` e `level_bonus_attack_physical`
- `attack_magic`, considerando `int_total` e `level_bonus_attack_magic`
- `defense_total`, considerando `def_total` e `level_bonus_defense`
- `crit_chance`, considerando `dex_total` com clamp mínimo e máximo
- `attack_speed`, com crescimento sutil por `dex_total`
- `move_speed`, com crescimento pequeno e controlado por `dex_total`
- `hp_regen`, escalando com `vit_total`
- `mp_regen`, escalando com `int_total`

### 4. Recálculo centralizado
Crie uma função central equivalente a:
- `stats_recalculate_all(character)`

Ela deve:
1. recalcular totais primários
2. recalcular atributos derivados
3. aplicar clamps necessários
4. ajustar `hp_current` e `mp_current` caso ultrapassem o novo máximo

### 5. Clamp de recursos atuais
Sempre que houver recálculo:
- se `hp_current > hp_max`, reduzir para `hp_max`
- se `mp_current > mp_max`, reduzir para `mp_max`

Não restaurar automaticamente HP ou MP ao máximo neste prompt, exceto quando estiverem acima do novo limite.

## Arquitetura esperada

Separe pelo menos estas responsabilidades:

### Configuração
Coeficientes e limites de todos os cálculos.

### Estado
Campos base, bônus, totais, derivados e recursos atuais.

### Funções
Exemplos aceitáveis:
- `stats_recalculate_primary_totals(character)`
- `stats_recalculate_derived_values(character)`
- `stats_clamp_current_resources(character)`
- `stats_recalculate_all(character)`

Use outros nomes se forem melhores para o padrão do projeto, mas mantenha o fluxo claro.

## Integração futura obrigatória

O resultado deste prompt deve funcionar bem com:
- distribuição de pontos do sistema base
- level up e bônus automáticos do sistema de XP
- bônus de equipamentos e buffs futuros
- save/load

Se algum sistema ainda não existir, deixe o ponto de integração explícito sem duplicar responsabilidade.

## Critérios de aceite

Garanta que o sistema trate corretamente:
- personagem inicial com atributos básicos
- personagem com bônus externos
- personagem com bônus automáticos de level up
- `hp_current` acima do novo `hp_max`
- `mp_current` acima do novo `mp_max`
- `crit_chance` respeitando mínimo e máximo
- velocidades sem extrapolar valores absurdos

## Formato de resposta esperado

Entregue nesta ordem:

1. Resumo curto da arquitetura adotada
2. Código GML completo, sem pseudo-código
3. Explicação breve de como o sistema conversa com status base, level up e equipamentos futuros

## Restrições importantes

- Não implementar UI
- Não implementar skills
- Não implementar honra
- Não implementar combate completo
- Não implementar inventário
- Não espalhar fórmulas em vários pontos do projeto
- Não omitir partes importantes
