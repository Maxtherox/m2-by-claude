# Implementar HUD completa de combate, recursos, alvo e feedback visual no GameMaker

## Objetivo

Implementar a HUD principal de gameplay e combate do jogo, conectando vida, mana, XP, honra, alvo atual, hotbar, buffs futuros e feedbacks visuais de dano/uso. Este prompt resolve a camada de leitura e acompanhamento em tempo real do estado do personagem e do combate, sem duplicar a lógica central dos sistemas já implementados.

Este prompt vem depois de:
- `02-sistema-xp-level-up-progressivo.md`
- `03-sistema-atributos-derivados.md`
- `04-interface-de-status.md`
- `05-sistema-honra.md`
- `08-interface-de-skills.md`
- `10-sistema-inventario-completo.md`
- `14-interface-npc-ferreiro.md`
- `15-sistema-combate-base.md`
- `16-hotbar-e-atalhos-de-combate.md`

Este prompt vem antes de:
- prompt de IA dos inimigos
- prompt de buffs/debuffs avançados
- prompt de minimapa
- prompt de menu de configurações e remapeamento
- prompt de feedback visual avançado de bosses, se quiser separar depois

## Escopo

### Implementar neste prompt
- HUD principal de gameplay
- barra de HP do jogador
- barra de MP do jogador
- barra ou indicador de XP
- exibição de nível
- exibição de honra
- integração visual com hotbar já existente
- painel de alvo atual
- barra de HP do alvo atual
- nome do alvo atual
- nível do alvo, se existir
- exibição de gold visível em HUD ou área de interface coerente
- feedback visual de uso inválido de skill/item
- feedback visual de cooldown
- números flutuantes de dano recebidos e causados
- feedback visual de crítico
- feedback visual de cura/recuperação
- exibição de mensagens curtas de sistema em gameplay
- identidade visual coerente com o restante do projeto
- arquitetura pronta para buffs/debuffs e boss HUD no futuro

### Não implementar neste prompt
- lógica central de combate
- lógica central de skills
- lógica central de consumíveis
- IA dos inimigos
- minimapa
- árvore de quests
- chat
- menu de configurações
- inventário completo dentro da HUD
- interface de status completa
- interface de skills completa
- tooltip complexa de item
- boss HUD avançada completa
- sistema de buff/debuff completo
- efeitos visuais pesados
- partículas complexas
- sons
- animações cinematográficas
- sistema de câmera
- remapeamento de teclas

## Dependências e contexto

Este prompt depende de:
- sistema de atributos derivados
- sistema de XP/level up
- sistema de honra
- sistema de combate base
- hotbar já implementada
- sistema de skills
- sistema de inventário/gold

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- `hp_current`
- `hp_max`
- `mp_current`
- `mp_max`
- `level`
- `exp_current`
- `exp_to_next`
- `honor_current`
- `gold_current`
- hotbar funcional
- resultado estruturado de dano/combate
- resultado estruturado de uso de skill/item
- estado vivo/morto do player
- alvo atual ou sistema básico de seleção/último alvo atingido
- dados do alvo:
  - `name`
  - `hp_current`
  - `hp_max`
  - `level` opcional
  - `is_alive`

### Dados que este prompt deve criar
- controlador da HUD principal
- layout da HUD
- widgets de recurso
- widget de alvo atual
- widget de mensagens rápidas
- widget de números flutuantes
- fila de feedbacks visuais
- integração visual da hotbar com a HUD
- estrutura preparada para buff slots futuros

## Requisitos funcionais

### 1. Criar controlador central da HUD
Criar um controlador único da HUD principal.

Responsabilidades:
- inicializar a HUD
- atualizar estados visuais
- desenhar HUD
- reagir a mudanças do personagem e do combate
- centralizar referências de widgets da HUD

Funções esperadas:
- `hud_init()`
- `hud_update()`
- `hud_draw()`
- `hud_refresh_all()`

### 2. Exibir HP e MP do jogador
A HUD deve exibir de forma clara:
- HP atual e máximo
- MP atual e máximo
- barra visual proporcional
- valores numéricos legíveis

Requisitos:
- atualização em tempo real
- clamp visual correto
- leitura fácil durante o combate

Funções esperadas:
- `hud_draw_player_hp()`
- `hud_draw_player_mp()`

### 3. Exibir XP e nível
A HUD deve exibir:
- nível atual
- barra ou indicador de XP
- valor atual de XP e XP necessária, se fizer sentido visualmente

Requisitos:
- refletir level up corretamente
- animar ou destacar level up, se houver solução leve
- não duplicar lógica de XP

Funções esperadas:
- `hud_draw_player_level()`
- `hud_draw_player_xp()`

### 4. Exibir honra atual
A HUD deve exibir honra atual de forma compacta.

Pode ser:
- valor numérico
- nome da faixa de honra
- ou ambos, desde que fique legível

Requisitos:
- refletir alterações vindas do sistema central
- não recalcular faixas dentro da HUD
- usar a nomenclatura já definida no sistema de honra

Função esperada:
- `hud_draw_player_honor()`

### 5. Integrar a hotbar existente à HUD
A hotbar do prompt anterior deve ser incorporada visualmente à HUD principal.

Requisitos:
- manter a mesma lógica central já existente
- apenas integrar layout e draw
- exibir cooldown, quantidade e indisponibilidade
- não recriar o sistema da hotbar dentro da HUD

Funções esperadas:
- `hud_draw_hotbar()`
- `hud_sync_hotbar_state()`

### 6. Criar widget de alvo atual
A HUD deve exibir o alvo atual quando existir.

Informações mínimas:
- nome do alvo
- HP atual / HP máximo
- barra de HP
- nível do alvo, se existir
- estado vivo/morto, quando fizer sentido

Regras:
- ocultar o painel quando não houver alvo válido
- atualizar quando o alvo mudar
- limpar quando o alvo morrer ou sair do contexto

Funções esperadas:
- `hud_set_current_target(target_id)`
- `hud_clear_current_target()`
- `hud_draw_target_frame()`

### 7. Exibir gold em HUD
O jogador deve conseguir ver seu gold sem abrir inventário.

Requisitos:
- exibição discreta, mas legível
- atualização imediata após loot, compra, gasto ou refino
- integração com o valor central do jogador

Função esperada:
- `hud_draw_gold()`

### 8. Implementar números flutuantes de dano e cura
A HUD/sistema visual deve suportar números flutuantes para:
- dano causado
- dano recebido
- cura recebida
- dano crítico

Requisitos:
- spawnar no contexto do alvo ou da entidade atingida
- desaparecer após tempo curto
- suportar múltiplos números simultâneos
- diferenciar visualmente crítico e cura

Funções esperadas:
- `hud_spawn_floating_text(x, y, value, feedback_type, context_data)`
- `hud_update_floating_texts()`
- `hud_draw_floating_texts()`

### 9. Implementar feedback visual de crítico
Quando o dano for crítico:
- o número deve se destacar
- a HUD deve conseguir diferenciar esse evento
- o sistema deve usar o resultado estruturado do combate, sem recalcular crítico

Campos esperados:
- `feedback_type = CRITICAL_DAMAGE` ou equivalente

### 10. Implementar feedback visual de uso inválido
Quando o jogador tentar usar skill/item e a ação falhar, a HUD deve mostrar feedback curto.

Exemplos:
- MP insuficiente
- skill em cooldown
- item indisponível
- alvo inválido
- ação bloqueada

Requisitos:
- mensagens curtas e claras
- sem duplicar regra de validação
- consumir mensagens do sistema central

Funções esperadas:
- `hud_push_system_message(message_text, message_type)`
- `hud_draw_system_messages()`

### 11. Implementar fila de mensagens rápidas de sistema
A HUD deve ter uma pequena fila de mensagens de gameplay.

Casos mínimos:
- level up
- honra aumentou/diminuiu
- item insuficiente
- skill em cooldown
- gold obtido
- item obtido
- refino bem-sucedido/falhou, se a HUD geral receber esse evento

Requisitos:
- fila com limite configurável
- duração configurável
- mensagens não devem ficar permanentes

Funções esperadas:
- `hud_message_queue_add(message_text, message_type)`
- `hud_message_queue_update()`
- `hud_message_queue_draw()`

### 12. Implementar feedback de morte do alvo e do jogador
A HUD deve reagir visualmente quando:
- alvo morre
- jogador morre

Requisitos:
- limpar frame do alvo quando apropriado
- exibir feedback mínimo de morte do player
- não implementar tela completa de game over aqui, apenas a estrutura de reação

Funções esperadas:
- `hud_on_player_death()`
- `hud_on_target_death(target_id)`

### 13. Preparar slots de buff/debuff futuros
Mesmo sem implementar o sistema completo agora, a HUD deve reservar arquitetura para:
- buffs
- debuffs
- ícones temporários
- duração restante

Não precisa exibir buffs reais agora, mas a estrutura do layout e do widget deve existir.

Funções esperadas:
- `hud_draw_status_effect_slots()`
- `hud_refresh_status_effects()` preparado para futuro

### 14. Preparar arquitetura para boss HUD futura
A HUD deve nascer pronta para, no futuro, mostrar:
- barra de boss
- nome do boss
- múltiplas barras
- fases

Não implementar boss HUD completa agora, mas evitar arquitetura que impeça isso depois.

### 15. Aplicar identidade visual inspirada em Elden Ring
A HUD deve seguir a mesma direção visual do projeto.

Direção visual obrigatória:
- aparência sóbria
- fantasia sombria
- molduras discretas
- tons escuros com detalhes em dourado, bronze, chumbo ou marfim queimado
- leitura clara e hierarquia visual forte
- sem aparência mobile genérica
- sem visual sci-fi
- sem excesso de efeitos chamativos

A HUD deve parecer integrada às interfaces de status, skills, inventário e ferreiro.

### 16. Respeitar o combate metroidvania já existente
A HUD deve se adaptar ao combate atual, não o contrário.

Requisitos:
- não atrasar input
- não depender de pausa do jogo para atualizar
- exibir feedback de combate em tempo real
- funcionar com o combo já existente
- refletir skills e hotbar sem travar o fluxo do gameplay

### 17. Separar HUD de regra de negócio
A HUD deve:
- ler estados dos sistemas
- exibir estados
- reagir a eventos/retornos estruturados

A HUD não deve:
- recalcular dano
- recalcular cooldown
- recalcular honra
- recalcular XP
- decidir se um uso é válido ou não
- modificar diretamente lógica central de combate ou inventário

## Arquitetura esperada

### Configuração
Criar local central para:
- layout da HUD
- posições e escalas
- tamanhos das barras
- duração dos feedbacks
- quantidade máxima de mensagens
- estilo dos números flutuantes
- temas visuais da HUD
- flags de exibição de widgets

### Estado
Separar claramente:
- estado principal da HUD
- alvo atual
- fila de mensagens
- números flutuantes ativos
- referências da hotbar integrada
- estados visuais transitórios
- slots reservados para buffs futuros

### Funções centrais
Funções esperadas:
- `hud_init()`
- `hud_update()`
- `hud_draw()`
- `hud_refresh_all()`
- `hud_draw_player_hp()`
- `hud_draw_player_mp()`
- `hud_draw_player_level()`
- `hud_draw_player_xp()`
- `hud_draw_player_honor()`
- `hud_draw_hotbar()`
- `hud_sync_hotbar_state()`
- `hud_set_current_target(target_id)`
- `hud_clear_current_target()`
- `hud_draw_target_frame()`
- `hud_draw_gold()`
- `hud_spawn_floating_text(x, y, value, feedback_type, context_data)`
- `hud_update_floating_texts()`
- `hud_draw_floating_texts()`
- `hud_push_system_message(message_text, message_type)`
- `hud_draw_system_messages()`
- `hud_message_queue_add(message_text, message_type)`
- `hud_message_queue_update()`
- `hud_message_queue_draw()`
- `hud_on_player_death()`
- `hud_on_target_death(target_id)`
- `hud_draw_status_effect_slots()`
- `hud_refresh_status_effects()`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir atributos e recursos do personagem
- consumir hotbar já implementada
- consumir resultados do combate
- consumir resultados de uso de skill/item
- consumir gold, XP e honra dos sistemas centrais
- preparar integração futura com buffs/debuffs
- preparar integração futura com boss HUD
- não depender de IA dos inimigos para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. inicializar HUD principal corretamente
2. exibir HP e MP do jogador corretamente
3. exibir XP e nível corretamente
4. exibir honra corretamente
5. integrar hotbar já existente sem duplicar sua lógica
6. exibir gold corretamente
7. mostrar frame do alvo atual corretamente
8. limpar frame do alvo quando o alvo deixar de ser válido
9. exibir números flutuantes de dano corretamente
10. exibir números flutuantes de cura corretamente
11. destacar crítico visualmente
12. mostrar mensagens rápidas de sistema corretamente
13. reagir a uso inválido de skill/item com feedback claro
14. reagir a level up corretamente
15. reagir à morte do alvo corretamente
16. reagir à morte do jogador corretamente
17. manter separação entre HUD e regra de negócio
18. seguir a identidade visual do projeto
19. manter arquitetura pronta para buffs e boss HUD sem retrabalho

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica da HUD em vários lugares
- não misturar UI com regra de negócio
- não duplicar lógica central de combate, skill, inventário ou hotbar
- não implementar IA dos inimigos neste prompt
- não implementar minimapa neste prompt
- não implementar sistema completo de buffs/debuffs neste prompt
- não criar apenas mock visual sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders