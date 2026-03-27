# Implementar sistema base de skills para jogo 2D no GameMaker

## Objetivo

Implementar a base estrutural do sistema de skills do personagem, separando definição de skill, estado aprendido, uso, custo, cooldown, progressão básica e classificação por tipo. Este prompt resolve a fundação sobre a qual a progressão estilo Metin2 será construída depois, sem ainda entrar na evolução para M1, G e P.

Este prompt vem depois de:
- `01-sistema-status-base.md`
- `02-sistema-xp-level-up-progressivo.md`
- `03-sistema-atributos-derivados.md`
- `05-sistema-honra.md`

Este prompt vem antes de:
- `07-progressao-skills-estilo-metin2.md`
- prompt de interface de skills

## Escopo

### Implementar neste prompt
- estrutura de definição de skills
- estrutura de estado das skills do jogador
- classificação por tipo de skill
- classificação por escala principal
- desbloqueio de skill
- subida básica de nível da skill
- custo de MP
- cooldown
- validação de uso
- execução estrutural da skill
- preparação para integração com dano físico, mágico e buffs
- preparação para progressão futura estilo Metin2

### Não implementar neste prompt
- interface visual de skills
- árvore visual de skills
- progressão M1, G1~G10, P
- leitura de livros
- uso de Pedra Espiritual
- efeitos visuais da skill
- animações
- sistema completo de combate
- sistema de alvo complexo
- inteligência artificial
- atalhos/hotbar
- sistema de equipamento

## Dependências e contexto

Este sistema depende de:
- sistema de status base
- sistema de atributos derivados
- sistema de XP/level
- sistema de honra, apenas como integração futura
- sistema de HP/MP atual do personagem

Campos e dados que já devem existir ou precisam ser criados se ainda não existirem:

### Dados do personagem
- `level`
- `hp_current`
- `mp_current`
- `for_total`
- `int_total`
- `dex_total`
- `def_total`
- `vit_total`
- `attack_physical`
- `attack_magic`

### Dados que este prompt deve criar
- coleção de definições de skills
- coleção de estado de skills do jogador
- `skill_points`
- controle de cooldown por skill
- flags de desbloqueio/aprendizado
- nível básico da skill
- função de uso de skill
- função de validação de uso
- função de cálculo base de power/escala da skill

## Requisitos funcionais

### 1. Definir estrutura central de dados de skill
Criar uma struct ou estrutura equivalente para definição de skill com campos consistentes.

Campos esperados por skill:
- `id`
- `name`
- `type`
- `scaling_stat`
- `max_level`
- `base_power`
- `power_per_level`
- `mp_cost_base`
- `mp_cost_per_level`
- `cooldown_base`
- `required_level`
- `is_unlocked_by_default`
- `description`

`type` deve suportar ao menos:
- `physical`
- `magical`
- `support`

`scaling_stat` deve suportar ao menos:
- `FOR`
- `INT`
- `DEX`
- `DEF`
- `VIT`
- `NONE`

### 2. Criar catálogo central de skills
Criar uma estrutura central para registrar todas as skills disponíveis no jogo.

Responsabilidade:
- cadastrar skills em um local único
- permitir lookup por `id`
- evitar definição espalhada

Funções esperadas:
- `skills_build_catalog()`
- `skills_get_definition(skill_id)`

### 3. Criar estado de skill do jogador
Cada skill do jogador deve possuir estado separado da definição global.

Campos esperados por skill aprendida:
- `skill_id`
- `is_unlocked`
- `level`
- `cooldown_remaining`
- `times_used`
- `last_use_time` opcional

Funções esperadas:
- `skills_init_player_state()`
- `skills_get_player_skill(skill_id)`

### 4. Implementar skill points
Criar estrutura base para pontos de skill do personagem.

Campos esperados:
- `skill_points`

Funções esperadas:
- `skills_add_points(amount)`
- `skills_spend_point(skill_id)`

Neste prompt, a regra de ganho de `skill_points` pode ficar simples e configurável.
Exemplo:
- ganhar 1 ponto em intervalos de nível
- ou 1 por nível

A regra deve ficar em configuração centralizada.

### 5. Implementar desbloqueio de skills
Uma skill pode estar:
- bloqueada
- desbloqueada
- upável

O sistema deve validar:
- nível mínimo do personagem
- disponibilidade de skill point
- existência da skill no catálogo

Funções esperadas:
- `skills_can_unlock(skill_id)`
- `skills_unlock(skill_id)`

### 6. Implementar subida básica de nível da skill
Antes da progressão estilo Metin2, a skill precisa ter um nível base funcional.

Regras:
- skill começa no nível 0 ou 1, conforme design adotado, desde que seja consistente
- skill sobe até um `max_level_basic` configurável ou até o `max_level` definido
- consumo de `skill_points`
- não permitir ultrapassar o máximo

Funções esperadas:
- `skills_can_level_up(skill_id)`
- `skills_level_up(skill_id)`

Importante:
- esta é apenas a progressão base
- a progressão M1/G/P será implementada no próximo prompt sem quebrar esta base

### 7. Implementar cálculo base da força da skill
Cada skill deve ter um valor de poder final calculado a partir de:
- `base_power`
- nível da skill
- atributo principal de escala

Exemplo de responsabilidade:
- skill física escalar com `attack_physical` e/ou `for_total`
- skill mágica escalar com `attack_magic` e/ou `int_total`
- skill de suporte usar escala própria

Função esperada:
- `skills_calculate_power(skill_id)`

O sistema deve ser configurável e centralizado.
Não espalhar fórmulas em vários pontos.

### 8. Implementar custo de MP
Cada skill deve possuir custo de MP baseado em:
- custo base
- crescimento por nível da skill

Função esperada:
- `skills_get_mp_cost(skill_id)`

Ao usar a skill:
- validar se `mp_current` é suficiente
- descontar o MP corretamente

### 9. Implementar cooldown
Cada skill deve possuir cooldown individual.

Responsabilidades:
- iniciar cooldown ao usar
- atualizar cooldown com o tempo
- impedir uso enquanto cooldown estiver ativo

Funções esperadas:
- `skills_get_cooldown(skill_id)`
- `skills_is_on_cooldown(skill_id)`
- `skills_start_cooldown(skill_id)`
- `skills_update_cooldowns(delta_time)` ou equivalente ao padrão do projeto

### 10. Implementar validação de uso da skill
Antes de usar uma skill, validar:
- skill existe
- skill está desbloqueada
- skill não está em cooldown
- personagem tem MP suficiente
- personagem cumpre requisitos mínimos

Função esperada:
- `skills_can_use(skill_id)`

Essa função deve retornar resultado claro e, se possível, motivo da falha.

### 11. Implementar uso estrutural da skill
Criar função central para uso da skill.

Função esperada:
- `skills_use(skill_id, target)` ou equivalente

Responsabilidades:
- validar uso
- calcular poder final
- descontar MP
- iniciar cooldown
- registrar uso
- retornar resultado estruturado da execução

Mesmo sem combate completo, o retorno deve estar pronto para integração futura.
Exemplo de retorno:
- `success`
- `skill_id`
- `type`
- `power`
- `target`
- `cost_mp`
- `cooldown_applied`

### 12. Preparar suporte para skills físicas, mágicas e de suporte
O sistema deve diferenciar tipos de skill desde já.

Comportamento esperado:
- `physical`: usa escala física
- `magical`: usa escala mágica
- `support`: usa efeito utilitário, buff, cura ou outro comportamento futuro

Neste prompt, não precisa implementar buff/cura completos, mas a estrutura já deve permitir isso.

### 13. Preparar integração futura com honra e progressão avançada
A arquitetura deve deixar claro que, no próximo prompt, skills poderão:
- entrar em estágio Mestre
- evoluir com livros
- evoluir com Pedra Espiritual
- consumir honra em certas etapas

Campos auxiliares podem ser preparados se fizer sentido, mas sem implementar a regra agora.

## Arquitetura esperada

### Configuração
Criar local central para:
- regra de ganho de skill points
- valores padrão de progressão de skill
- tipos de skill
- tipos de escala
- limites de nível de skill
- parâmetros de cálculo de poder
- parâmetros de cooldown
- parâmetros de custo de MP

### Estado
Separar claramente:
- catálogo global de skills
- estado individual das skills do personagem
- skill points do jogador
- cooldowns ativos

### Funções centrais
Funções esperadas:
- `skills_build_catalog()`
- `skills_init_player_state()`
- `skills_get_definition(skill_id)`
- `skills_get_player_skill(skill_id)`
- `skills_can_unlock(skill_id)`
- `skills_unlock(skill_id)`
- `skills_can_level_up(skill_id)`
- `skills_level_up(skill_id)`
- `skills_get_mp_cost(skill_id)`
- `skills_get_cooldown(skill_id)`
- `skills_is_on_cooldown(skill_id)`
- `skills_start_cooldown(skill_id)`
- `skills_update_cooldowns(...)`
- `skills_calculate_power(skill_id)`
- `skills_can_use(skill_id)`
- `skills_use(skill_id, target)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- ler atributos do sistema de status/atributos derivados
- consumir `mp_current`
- respeitar `level`
- preparar integração futura com honra
- preparar integração futura com interface de skills
- preparar integração futura com combate e hotbar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. criar catálogo de skills com definições centralizadas
2. inicializar corretamente o estado das skills do jogador
3. desbloquear skill válida quando houver requisitos
4. impedir desbloqueio sem requisitos
5. subir nível básico de skill consumindo `skill_points`
6. impedir subir skill acima do limite
7. calcular corretamente poder base de uma skill física
8. calcular corretamente poder base de uma skill mágica
9. calcular custo de MP com base no nível da skill
10. impedir uso de skill sem MP suficiente
11. impedir uso de skill em cooldown
12. iniciar cooldown corretamente após uso
13. descontar MP corretamente após uso
14. registrar uso da skill corretamente
15. retornar resultado estruturado ao usar skill
16. manter arquitetura pronta para progressão M1/G/P sem retrabalho estrutural

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de skill em vários lugares
- não misturar UI com regra de negócio
- não implementar interface visual neste prompt
- não implementar hotbar neste prompt
- não implementar progressão M1/G/P neste prompt
- não implementar leitura de livros neste prompt
- não implementar Pedra Espiritual neste prompt
- não implementar combate completo neste prompt
- não deixar catálogo de skill hardcoded de forma caótica
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders