# Contrato de Arquitetura do Projeto

## Objetivo

Este arquivo deve ser mantido pelo `ArquitetoPrincipal`.

Ele serve para registrar os contratos que os proximos prompts precisam respeitar. Sempre que um prompt principal for concluido, atualize este arquivo antes de seguir para o proximo.

## Stack Real do Projeto

Este projeto NAO e GameMaker/GML. O stack real e:

- **Backend**: Node.js + Express + Knex + SQLite (better-sqlite3)
- **Frontend**: React 18 + Vite + Redux Toolkit + Phaser 3 + Tailwind CSS
- **Linguagem**: JavaScript (sem TypeScript)
- **DB**: SQLite via Knex migrations

Prompts escritos para GML devem ser interpretados como especificacao funcional, NAO como obrigacao de linguagem.

## Estado Atual

### Prompts concluidos (Fase 1)
- `01-sistema-status-base.md` — implementado
- `02-sistema-xp-level-up-progressivo.md` — implementado
- `03-sistema-atributos-derivados.md` — implementado
- `04-interface-de-status.md` — implementado

### Prompts bloqueados por estarem vazios
- `07-progressao-skills-estilo-metin2.md`
- `09-itens-consumiveis-progressao-skill.md`
- `24-mapa-areas-marcadores-e-navegacao.md`

## Contrato Central do Personagem

### Mapeamento de nomes (contrato -> projeto real)

O contrato original usa nomes estilo GML (`for_base`, `def_base`). O projeto real usa nomes descritivos em ingles. Este mapeamento e autoritativo:

### Identidade e progressao
- `character_name` -> `characters.name`
- `level` -> `characters.level`
- `exp_current` -> `characters.exp`
- `exp_to_next` -> `derived_stats.exp_for_next_level` (calculado, nao persistido)
- `exp_total` -> `characters.exp_total`
- `status_points` -> `characters.status_points`
- `honor_value` -> `characters.honor`
- `honor_rank` -> calculado por `honorSystem.resolveHonorRank(honor)`

### Atributos base (4 stats, nao 5 — projeto segue Metin2 original)
- `for_base` -> `characters.strength`
- `int_base` -> `characters.intelligence`
- `dex_base` -> `characters.dexterity`
- `vit_base` -> `characters.vitality`
- `def_base` -> NAO EXISTE como atributo base. Defesa e derivada de vitality + level.

### Bonus externos (equipamento)
- `bonus_for` -> `equipment_bonuses.strength`
- `bonus_int` -> `equipment_bonuses.intelligence`
- `bonus_dex` -> `equipment_bonuses.dexterity`
- `bonus_vit` -> `equipment_bonuses.vitality`
- `bonus_def` -> `equipment_bonuses.defense`

### Bonus permanentes de progressao (auto-growth lvl >= 70)
- `level_bonus_attack_physical` -> `characters.level_bonus_attack_physical`
- `level_bonus_attack_magic` -> `characters.level_bonus_attack_magic`
- `level_bonus_defense` -> `characters.level_bonus_defense`
- `level_bonus_hp` -> `characters.level_bonus_hp`

### Recursos
- `hp_current` -> `characters.hp`
- `hp_max` -> `characters.max_hp` (persistido) / `derived_stats.max_hp` (recalculado)
- `mp_current` -> `characters.mp`
- `mp_max` -> `characters.max_mp` (persistido) / `derived_stats.max_mp` (recalculado)
- `stamina_current` -> `characters.stamina`
- `stamina_max` -> `characters.max_stamina` (persistido) / `derived_stats.max_stamina` (recalculado)

### Totais e derivados (todos via `derivedStats.recalculateAll()`)
- `for_total` -> `derived_stats.strength_total`
- `int_total` -> `derived_stats.intelligence_total`
- `dex_total` -> `derived_stats.dexterity_total`
- `vit_total` -> `derived_stats.vitality_total`
- `attack_physical` -> `derived_stats.attack`
- `attack_magic` -> `derived_stats.magic_attack`
- `defense_total` -> `derived_stats.defense`
- `magic_defense` -> `derived_stats.magic_defense`
- `crit_chance` -> `derived_stats.critical`
- `dodge_chance` -> `derived_stats.dodge`
- `accuracy` -> `derived_stats.accuracy`
- `speed` -> `derived_stats.speed`
- `penetration` -> `derived_stats.penetration`
- `attack_speed` -> `derived_stats.attack_speed`
- `move_speed` -> `derived_stats.move_speed`
- `hp_regen` -> `derived_stats.hp_regen`
- `mp_regen` -> `derived_stats.mp_regen`

## Funcoes Centrais

### Status base
- inicializacao: `characterService.createCharacter(data)`
- leitura completa: `characterService.getCharacter(id)`
- aplicacao de pontos: `characterService.allocateStatusPoints(charId, points)`
- adicionar honra: `characterService.addHonor(charId, amount)`

### XP e level up
- obter xp por nivel: `xpSystem.getExpForLevel(level)` / `derivedStats.calcExpForLevel(level)`
- adicionar xp com auto-level: `characterService.addExperience(charId, amount, source)`
- processamento puro: `xpSystem.addExperience(charState, amount, source)` (retorna mutations)
- auto-growth (lvl >= 70): bonus permanentes em vez de status_points
- milestones: a cada 10 niveis

### Atributos derivados
- recalculo completo: `derivedStats.recalculateAll(char, classData, equipBonuses)`
- formulas individuais: `derivedStats.calcMaxHP()`, `calcAttack()`, etc.
- coeficientes centralizados: `statusConfig.js` (nenhum numero magico em formulas)

### Honra
- resolucao de rank: `honorSystem.resolveHonorRank(honorValue)`
- adicao: `honorSystem.addHonor(currentHonor, amount)`
- ranks: Infame < Desonrada < Neutra < Honrada < Respeitada < Nobre < Lendaria

### UI de status (frontend)
- componente: `StatusPanel.jsx`
- abrir/fechar: via Redux `uiSlice.closePanel()`
- confirmar distribuicao: `characterSlice.allocatePoints({ id, points })`
- cancelar distribuicao: reset local do state `tempAlloc`
- exibe: HP/MP/Stamina/EXP bars, 4 atributos com +/-, stats derivados, regen, honra, ouro

## Contrato de Inventario e Itens

Preencher depois da fase 3.

### Estruturas principais
- definicao global de item: tabela `items`
- instancia de item: tabela `character_inventory` (com refinement, bonuses)
- slot de inventario: `character_inventory.slot` (0-44, 45 slots)
- slot de equipamento: `character_inventory.equipped` + `equipment_slot`

### Funcoes centrais
- mover item: (a definir)
- empilhar item: `inventoryService.addItem()` com logica de stack
- equipar: `inventoryService.equipItem()`
- desequipar: `inventoryService.unequipItem()`
- recalcular bonus de item: inline em `characterService.getCharacter()` (loop de equipment)

## Contrato de Combate

Preencher depois da fase 4.

### Estruturas principais
- dano: `combatService.calcDamage()` via `formulas.calcPhysicalDamage/calcMagicDamage`
- alvo: mob object
- skill em combate: `character_skills` + `skills` table
- efeito: `constants.EFFECT_TYPES`

### Funcoes centrais
- calcular dano: `formulas.calcPhysicalDamage/calcMagicDamage/calcHybridDamage`
- aplicar dano: `combatService._executePlayerAction/MobAction`
- validar uso de skill: `combatService` (mp, stamina, cooldown check)
- aplicar buff/debuff: `combatService` (effect system)

## Contrato de Persistencia

Preencher depois da fase 5.

### Entidades serializadas
- personagem: tabela `characters`
- inventario: tabela `character_inventory`
- equipamentos: `character_inventory` com `equipped=true`
- skills: tabela `character_skills`
- quests: (a implementar)
- flags: (a implementar)
- mapa: `characters.current_area_id`

### Funcoes centrais
- salvar: `PUT /api/characters/:id`
- carregar: `GET /api/characters/:id` (retorna tudo recalculado)
- versionar: via Knex migrations

## Decisoes Arquiteturais

Registrar aqui decisoes que nao podem mudar no meio da fila.

- **4 atributos base** (STR/INT/VIT/DEX), nao 5. DEF nao e atributo base — segue Metin2 original.
- **Auto-growth a partir do nivel 70**: niveis >= 70 dao bonus permanentes em vez de status_points.
- **Coeficientes centralizados** em `statusConfig.js`. Nenhuma formula deve ter numeros magicos.
- **formulas.js mantido** para backward compatibility. Servicos de combate/refine/bonus continuam usando.
- **derivedStats.js** e o modulo autoritativo para recalculo de stats do personagem.
- **xpSystem.js** e o modulo autoritativo para processamento de XP/level up.
- **Honor rank** e calculado, nao persistido. Apenas `honor` (inteiro) e salvo no banco.

## Historico de Execucao

- `2026-03-26` - Fase 1 completa (01-04) - contrato do personagem definido, modulos centralizados criados, StatusPanel atualizado - nenhum risco aberto
