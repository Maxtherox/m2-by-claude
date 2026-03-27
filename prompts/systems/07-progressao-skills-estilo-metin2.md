# Implementar progressão avançada de skills no estilo Metin2 para jogo 2D no GameMaker

## Objetivo

Implementar a camada avançada de progressão de skills inspirada no Metin2, com transição do nível normal para Mestre, progressão por livros até G1, progressão por Pedra Espiritual de G1 até G10 e evolução final até Perfect Master. Este prompt resolve a progressão longa e identitária das skills, separando claramente a base funcional da skill da progressão especial.

Este prompt vem depois de:
- `06-sistema-skills-base.md`
- `05-sistema-honra.md`

Este prompt vem antes de:
- prompt de interface de skills
- prompt de itens consumíveis relacionados às skills, se você quiser separar depois

## Escopo

### Implementar neste prompt
- estágios de progressão de skill
- transição do nível normal para Mestre
- estrutura de ranks M, G e P
- leitura de livros para progressão após Mestre
- uso de Pedra Espiritual para progressão avançada
- perda de honra ao usar Pedra Espiritual
- chance de sucesso configurável por etapa
- controle de tentativas e progresso interno da skill
- bloqueios de progressão por estágio
- integração com o sistema base de skills
- integração com o sistema de honra

### Não implementar neste prompt
- interface visual de skills
- hotbar
- combate
- animações
- efeitos visuais
- drop de livros
- obtenção de Pedra Espiritual
- inventário completo
- tooltips
- árvore visual de skills
- sistema de tempo real entre leituras, a menos que seja implementado apenas como estrutura opcional configurável
- honra negativa funcional no gameplay além da perda numérica já prevista

## Dependências e contexto

Este sistema depende de:
- `06-sistema-skills-base.md`
- `05-sistema-honra.md`
- sistema de level do personagem
- sistema de MP e atributos derivados, apenas como contexto da skill já existente

Campos e dados que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de skills
- estado individual da skill do jogador
- `skill_id`
- `is_unlocked`
- `level`
- `skill_points`
- `skills_level_up(...)`
- `skills_get_definition(...)`
- `skills_get_player_skill(...)`
- `honor_current`
- `honor_remove(amount, source)`

### Dados que este prompt deve criar
- `progress_stage`
- `master_stage_level`
- `master_book_reads`
- `grand_stage_level`
- `perfect_stage_level`
- `last_progression_result` opcional
- `can_read_book`
- `can_use_spirit_stone`
- configuração de chances por estágio
- configuração de custos de honra por Pedra Espiritual

## Requisitos funcionais

### 1. Criar enum ou estrutura para os estágios de progressão
A skill deve possuir estágios claros e nomeados.

Estági os esperados:
- `NORMAL`
- `MASTER`
- `GRAND_MASTER`
- `PERFECT_MASTER`

Observação importante:
- o estágio `NORMAL` cobre a evolução básica até o nível 17 da skill
- ao atingir o nível 17, a skill deixa de evoluir pelo método comum e entra em `MASTER`

Enums esperados:
- `SkillProgressStage`
ou equivalente consistente com o projeto

### 2. Definir regra de transição do nível normal para Mestre
A skill deve evoluir normalmente até o nível 17.

Ao atingir o nível 17:
- não sobe mais com skill point comum
- entra em estágio `MASTER`
- habilita progressão por leitura de livro
- passa a usar progresso próprio separado do level comum

Funções esperadas:
- `skills_is_master_transition_reached(skill_id)`
- `skills_promote_to_master(skill_id)`

### 3. Separar level básico da skill do progresso avançado
A arquitetura deve deixar claro que existem duas camadas:

#### Camada 1
Nível normal da skill:
- vai até 17

#### Camada 2
Progressão avançada:
- `MASTER`: M1 até M10
- `GRAND_MASTER`: G1 até G10
- `PERFECT_MASTER`: P1 ou estado final equivalente

A skill não deve depender apenas de um único inteiro confuso para tudo.
Quero estado explícito.

Campos esperados por skill:
- `base_level`
- `progress_stage`
- `master_stage_level`
- `grand_stage_level`
- `perfect_stage_level` ou `is_perfect_master`

Pode adaptar os nomes, mas a separação deve ficar clara.

### 4. Implementar progressão Mestre por leitura de livros
Após entrar em `MASTER`, a progressão deve ser feita por leitura de livros.

Regras:
- o estágio `MASTER` vai de M1 até M10
- cada leitura de livro tenta avançar 1 ponto dentro do estágio Mestre
- a leitura pode ter chance de sucesso configurável
- falha não deve quebrar a skill
- leitura bem-sucedida aumenta `master_stage_level`
- ao atingir M10, a skill promove para `GRAND_MASTER`

Funções esperadas:
- `skills_can_read_book(skill_id)`
- `skills_read_book(skill_id)`
- `skills_try_master_progress(skill_id)`

Campos/configurações esperadas:
- `book_success_chance_master`
- `book_reads_cooldown_enabled` opcional
- `book_required_stage = MASTER`

### 5. Implementar transição de Mestre para Grand Master
Quando `master_stage_level` atingir o máximo configurado:
- a skill deve migrar de `MASTER` para `GRAND_MASTER`
- o progresso de Mestre deve ficar preservado apenas como histórico ou consolidado
- a partir daí livros não devem mais evoluir a skill
- a skill passa a aceitar Pedra Espiritual

Funções esperadas:
- `skills_can_promote_to_grand_master(skill_id)`
- `skills_promote_to_grand_master(skill_id)`

### 6. Implementar progressão G1 até G10 com Pedra Espiritual
No estágio `GRAND_MASTER`, a progressão deve usar Pedra Espiritual.

Regras:
- vai de G1 até G10
- cada uso tenta avançar 1 ponto
- deve ter chance de sucesso configurável
- ao usar Pedra Espiritual, a skill consome honra
- a perda de honra ocorre mesmo que a tentativa falhe, se essa for a regra adotada
- o custo de honra deve ser centralizado em configuração
- não permitir uso se a skill ainda não estiver em `GRAND_MASTER`

Funções esperadas:
- `skills_can_use_spirit_stone(skill_id)`
- `skills_use_spirit_stone(skill_id)`
- `skills_try_grand_master_progress(skill_id)`

Configurações esperadas:
- `spirit_stone_success_chance`
- `spirit_stone_honor_cost`
- `spirit_stone_consumes_honor_on_fail`

### 7. Integrar perda de honra ao uso de Pedra Espiritual
Ao tentar progressão com Pedra Espiritual:
- chamar o sistema central de honra
- usar algo como `honor_remove(...)`
- registrar origem como `"spirit_stone"` ou equivalente

Requisitos:
- não espalhar a lógica de honra dentro do sistema de skills
- usar integração limpa com o sistema de honra
- respeitar as regras atuais do sistema de honra

Função esperada:
- `skills_apply_spirit_stone_honor_cost(skill_id)`

### 8. Implementar transição para Perfect Master
Ao atingir G10:
- a skill deve poder entrar em `PERFECT_MASTER`
- `PERFECT_MASTER` pode ser tratado como estado final fechado
ou
- como `P1` único

Quero a estrutura pronta para estado final claro e inequívoco.

Funções esperadas:
- `skills_can_promote_to_perfect_master(skill_id)`
- `skills_promote_to_perfect_master(skill_id)`

### 9. Bloquear progressão inadequada por estágio
O sistema deve impedir:
- usar livro antes da skill entrar em `MASTER`
- usar livro depois que a skill já estiver em `GRAND_MASTER`
- usar Pedra Espiritual antes de `GRAND_MASTER`
- usar Pedra Espiritual após atingir `PERFECT_MASTER`
- subir skill normal após entrar em `MASTER`

Funções esperadas:
- `skills_can_progress_with_normal_point(skill_id)`
- `skills_can_read_book(skill_id)`
- `skills_can_use_spirit_stone(skill_id)`

### 10. Criar representação textual do progresso da skill
Quero uma função central para gerar a representação do estado da skill.

Exemplos esperados:
- `17`
- `M1`
- `M5`
- `G1`
- `G10`
- `P`

Função esperada:
- `skills_get_progression_label(skill_id)`

Essa função será importante para a futura interface.

### 11. Criar regras configuráveis por estágio
Toda a progressão deve ser parametrizada.

Configuração esperada:
- `skill_normal_max_level`
- `skill_master_max_level`
- `skill_grand_master_max_level`
- `skill_perfect_master_enabled`
- `book_success_chance_master`
- `spirit_stone_success_chance`
- `spirit_stone_honor_cost`
- `spirit_stone_consumes_honor_on_fail`
- `books_required_for_master_progress` se quiser permitir expansão futura
- `master_transition_level`

Mesmo que hoje a regra seja simples, quero tudo centralizado para balanceamento.

### 12. Retornar resultado estruturado em cada tentativa de progressão
Leitura de livro e uso de Pedra Espiritual devem retornar um resultado claro.

Estrutura esperada:
- `success`
- `skill_id`
- `previous_stage`
- `previous_progress`
- `new_stage`
- `new_progress`
- `honor_spent`
- `consumed_item_type`
- `failure_reason`

Funções que devem retornar resultado estruturado:
- `skills_read_book(skill_id)`
- `skills_use_spirit_stone(skill_id)`

### 13. Manter compatibilidade com o sistema base de skills
A implementação não pode quebrar o sistema do prompt anterior.

Regras:
- skill ainda deve poder ser usada normalmente em qualquer estágio permitido
- cálculo de poder da skill deve considerar sua progressão total
- a arquitetura deve continuar consistente

Se fizer sentido, a força final da skill pode considerar:
- nível base
- estágio atual
- progressão avançada

Função esperada:
- `skills_get_effective_progress_value(skill_id)`

### 14. Preparar integração futura com interface e itens
O sistema deve ficar pronto para:
- interface mostrar `M1`, `G4`, `P`
- consumo futuro real de item livro
- consumo futuro real de item Pedra Espiritual
- tooltips de progressão
- feedback de sucesso/falha

Não implementar essas interfaces agora, apenas deixar a estrutura pronta.

## Arquitetura esperada

### Configuração
Criar local central para:
- limites de estágio
- chances de sucesso
- custos de honra
- regras de transição
- nomenclatura de progressão
- flags opcionais de cooldown ou restrição futura

### Estado
Cada skill do jogador deve possuir, além do estado base:
- `base_level`
- `progress_stage`
- `master_stage_level`
- `grand_stage_level`
- `perfect_stage_level` ou equivalente
- histórico/resumo opcional do último resultado de progressão

### Funções centrais
Funções esperadas:
- `skills_is_master_transition_reached(skill_id)`
- `skills_promote_to_master(skill_id)`
- `skills_can_read_book(skill_id)`
- `skills_read_book(skill_id)`
- `skills_try_master_progress(skill_id)`
- `skills_can_promote_to_grand_master(skill_id)`
- `skills_promote_to_grand_master(skill_id)`
- `skills_can_use_spirit_stone(skill_id)`
- `skills_use_spirit_stone(skill_id)`
- `skills_try_grand_master_progress(skill_id)`
- `skills_apply_spirit_stone_honor_cost(skill_id)`
- `skills_can_promote_to_perfect_master(skill_id)`
- `skills_promote_to_perfect_master(skill_id)`
- `skills_get_progression_label(skill_id)`
- `skills_get_effective_progress_value(skill_id)`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir o estado base do sistema de skills
- chamar o sistema de honra ao usar Pedra Espiritual
- preparar integração futura com inventário para consumir itens reais
- preparar integração futura com interface de skills
- não depender de UI para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. skill evolui normalmente até o nível 17
2. ao atingir 17, a skill entra corretamente em `MASTER`
3. skill não aceita mais progressão normal após entrar em `MASTER`
4. leitura de livro funciona apenas em `MASTER`
5. leitura de livro respeita chance de sucesso configurada
6. progresso Mestre sobe corretamente de M1 até M10
7. ao atingir o máximo de Mestre, a skill entra corretamente em `GRAND_MASTER`
8. Pedra Espiritual só funciona em `GRAND_MASTER`
9. Pedra Espiritual respeita chance de sucesso configurada
10. o uso de Pedra Espiritual consome honra corretamente
11. a skill progride corretamente de G1 até G10
12. ao atingir o máximo de Grand Master, a skill entra corretamente em `PERFECT_MASTER`
13. skill em `PERFECT_MASTER` não aceita progressão adicional inadequada
14. `skills_get_progression_label(skill_id)` retorna corretamente `17`, `M1`, `M10`, `G1`, `G10` e `P`
15. o sistema retorna resultado estruturado em leitura de livro e uso de Pedra Espiritual
16. a arquitetura continua compatível com o sistema base de skills sem retrabalho estrutural

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de progressão em vários lugares
- não misturar UI com regra de negócio
- não implementar interface visual neste prompt
- não implementar hotbar neste prompt
- não implementar inventário completo neste prompt
- não implementar drop de livros ou Pedra Espiritual neste prompt
- não quebrar o sistema base de skills
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders