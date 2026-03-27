# Implementar interface e fluxo de interação do NPC Ferreiro para refino de itens no GameMaker

## Objetivo

Implementar a interface e o fluxo completo de interação do NPC Ferreiro, permitindo selecionar item, visualizar requisitos, escolher o tipo de refino, confirmar a tentativa e receber o resultado. Este prompt resolve a camada de uso prático do sistema de ferreiro já implementado, sem duplicar a lógica central de refino.

Este prompt vem depois de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`

Este prompt vem antes de:
- prompt de combate
- prompt de NPCs/lojas gerais
- prompt de tooltip avançada de itens
- prompt de mapa/cidades e interação com NPCs, se você quiser separar depois

## Escopo

### Implementar neste prompt
- interação com NPC Ferreiro
- abertura e fechamento da janela de refino
- fluxo de selecionar item refinável
- exibição do item atual e nível de refino
- exibição do próximo nível de refino
- exibição de custo em gold
- exibição de materiais exigidos
- exibição da chance de sucesso
- exibição do risco de falha
- escolha do tipo de operação de refino
- suporte a refino normal
- suporte a Pergaminho do Ferreiro
- suporte a Pergaminho da Paz
- confirmação da tentativa
- exibição do resultado do refino
- atualização do inventário/equipamento após o resultado
- bloqueio visual quando a tentativa não for válida
- identidade visual coerente com o restante do projeto

### Não implementar neste prompt
- lógica central de refino
- receitas de refino
- cálculo da chance de sucesso
- consumo real de materiais/gold fora da chamada ao sistema central
- lógica de drops
- sistema de bônus 1–5
- sistema de bônus 6/7
- reroll de bônus
- sockets/pedras
- lojas gerais
- diálogo complexo de NPC
- quests do ferreiro
- árvore de navegação entre cidades/mapas
- sprite final do ferreiro
- voice lines
- animações complexas
- efeitos visuais avançados
- sons
- sistema de múltiplos ferreiros com regras diferentes, além da estrutura para suportar isso no futuro

## Dependências e contexto

Este prompt depende de:
- `10-sistema-inventario-completo.md`
- `11-sistema-itens-e-bonus.md`
- `12-sistema-ferreiro-e-refino.md`
- `13-sistema-drops-e-materiais.md`

Campos e estruturas que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- inventário do jogador
- itens equipados
- gold do jogador
- materiais no inventário
- `refine_can_attempt(instance_id, operation_type)`
- `refine_attempt(instance_id, operation_type)`
- `refine_get_recipe_for_item(instance_id, target_refine_level)`
- `refine_get_success_chance(instance_id, operation_type)`
- `item_get_effective_base_stats(instance_id)`
- dados da instância do item incluindo `refine_level`
- resultado estruturado do sistema de refino

### Dados que este prompt deve criar
- controlador da interface do ferreiro
- estado de interação com o NPC
- item atualmente selecionado para refino
- operação de refino atualmente selecionada
- lista visível de itens refináveis
- painel de requisitos do refino
- painel de resultado da tentativa
- estados visuais de erro/bloqueio/confirmação
- integração de input com mouse/teclado para a janela do ferreiro

## Requisitos funcionais

### 1. Criar controlador de interação com o NPC Ferreiro
Criar um controlador ou fluxo claro de entrada e saída da interface do ferreiro.

Responsabilidades:
- iniciar interação com o NPC
- abrir a janela de refino
- encerrar interação
- impedir abrir múltiplas instâncias
- manter o estado da sessão atual de refino

Funções esperadas:
- `smith_ui_open(npc_id)`
- `smith_ui_close()`
- `smith_ui_toggle(npc_id)`
- `smith_ui_is_open()`

### 2. Criar estrutura de estado da sessão de refino
A interface precisa manter um estado claro da sessão atual.

Campos esperados:
- `selected_item_instance_id`
- `selected_operation_type`
- `selected_recipe`
- `validation_result`
- `last_refine_result`
- `smith_npc_id`
- `active_tab` opcional
- `is_confirmation_open`
- `is_result_popup_open`

### 3. Criar lista visível de itens refináveis
A interface deve mostrar os itens do jogador que podem potencialmente ser refinados.

A lista deve considerar:
- itens do inventário
- itens equipados, se o sistema central permitir refinar equipados
- bloquear visualmente os itens não refináveis
- destacar o item selecionado

Funções esperadas:
- `smith_ui_build_refinable_item_list()`
- `smith_ui_select_item(instance_id)`
- `smith_ui_is_item_selectable(instance_id)`

### 4. Exibir informações do item selecionado
Ao selecionar um item, a interface deve exibir:

- nome do item
- ícone do item
- categoria do item
- nível atual de refino
- nível alvo do próximo refino
- atributos base relevantes
- indicação de item equipado ou no inventário
- estado geral do item para refino

A UI deve consumir dados reais do item e não recalcular regra central.

### 5. Exibir receita do próximo refino
A interface deve mostrar claramente os requisitos do próximo nível.

Informações mínimas:
- gold necessário
- lista de materiais
- quantidade de cada material
- operação selecionada
- chance de sucesso
- tipo de falha esperada
- se o item já está no limite máximo

Funções esperadas:
- `smith_ui_refresh_recipe_view()`
- `smith_ui_get_selected_recipe()`

### 6. Exibir tipos de operação de refino
A interface deve permitir escolher entre os tipos de operação disponíveis.

Operações mínimas:
- refino normal
- refino com Pergaminho do Ferreiro
- refino com Pergaminho da Paz

A disponibilidade dessas opções deve depender do item/receita e do inventário do jogador.

Funções esperadas:
- `smith_ui_get_available_operations(instance_id)`
- `smith_ui_select_operation(operation_type)`

### 7. Validar visualmente se a tentativa pode ocorrer
A interface deve refletir o resultado de validação do sistema central.

Ela deve mostrar claramente quando o refino está bloqueado por:
- falta de gold
- falta de materiais
- item no refino máximo
- operação não compatível
- falta de pergaminho necessário
- item não refinável
- outro motivo retornado pelo sistema central

Funções esperadas:
- `smith_ui_refresh_validation()`
- `smith_ui_get_validation_block_reason()`

### 8. Implementar botão de confirmação do refino
A interface deve permitir confirmar a tentativa de refino.

Regras:
- só habilitar quando a validação permitir
- abrir confirmação final antes de chamar a tentativa
- mostrar claramente risco e custo
- usar a operação atualmente selecionada

Funções esperadas:
- `smith_ui_open_confirm_dialog()`
- `smith_ui_confirm_refine()`

### 9. Integrar a confirmação com o sistema central de refino
Ao confirmar:
- chamar `refine_attempt(instance_id, operation_type)`
- receber o resultado estruturado
- atualizar a interface
- atualizar inventário/equipamento
- atualizar gold e materiais visíveis
- atualizar o item refinado ou removê-lo se destruído

Importante:
- a UI não pode consumir materiais ou gold diretamente por conta própria
- a UI não pode recalcular chance ou comportamento de falha por conta própria

### 10. Exibir resultado da tentativa de refino
Após cada tentativa, a interface deve mostrar um retorno claro.

Casos mínimos:
- sucesso
- falha sem mudança
- falha com downgrade
- falha com destruição
- falha protegida por Pergaminho da Paz

Informações mínimas:
- nome do item
- refino anterior
- refino atual
- gold consumido
- materiais consumidos
- modificador usado
- chance final usada
- comportamento de falha aplicado
- estado final do item

Funções esperadas:
- `smith_ui_show_refine_result(result_struct)`
- `smith_ui_clear_last_result()`

### 11. Atualizar o inventário e equipamento visualmente após a tentativa
Depois do resultado:
- refletir mudança de refino do item
- remover item destruído da lista
- atualizar materiais restantes
- atualizar gold atual
- atualizar dados do item equipado, se aplicável
- atualizar bloqueios visuais se a próxima tentativa mudou de estado

### 12. Criar fluxo de seleção simples e consistente
A interface deve ter fluxo claro:
1. abrir o ferreiro
2. escolher um item
3. escolher o tipo de refino
4. visualizar requisitos
5. confirmar
6. receber resultado
7. continuar ou fechar

A navegação deve funcionar bem com mouse e ficar pronta para suporte futuro a teclado/gamepad.

### 13. Aplicar identidade visual inspirada em Elden Ring
A interface do ferreiro deve seguir a mesma linguagem visual das outras interfaces.

Direção visual obrigatória:
- aparência sóbria
- fantasia sombria
- molduras discretas
- tons escuros
- detalhes em dourado, bronze, chumbo ou marfim queimado
- aparência nobre e antiga
- leitura clara de itens, custos e risco
- sem visual sci-fi
- sem aparência mobile genérica
- sem poluição visual excessiva

A interface deve parecer um painel ritualístico ou de ofício antigo, não um menu técnico moderno.

### 14. Separar UI de regra de negócio
A interface deve:
- exibir dados
- chamar funções centrais
- refletir resultados

A interface não deve:
- decidir regra de falha
- decidir receita
- decidir chance de sucesso
- modificar diretamente instância do item fora do sistema central
- duplicar validações centrais em vários pontos

### 15. Preparar arquitetura para múltiplos ferreiros no futuro
Mesmo que hoje exista apenas um ferreiro genérico, a arquitetura deve aceitar no futuro:
- ferreiros com perfis diferentes
- ferreiros especiais
- eventos com chance alterada
- ferreiros de mapa específico

Campos esperados:
- `smith_npc_id`
- `smith_profile_id` opcional
- `smith_display_name`

A regra central não precisa variar agora, mas a UI não deve nascer limitada.

## Arquitetura esperada

### Configuração
Criar local central para:
- dimensões da janela
- layout da lista de itens
- layout do painel de receita
- layout do painel de resultado
- ícones/labels de operação
- estados visuais de bloqueio
- teclas de abertura/fechamento
- parâmetros visuais do painel do ferreiro

### Estado
Separar claramente:
- janela aberta/fechada
- NPC atual
- item selecionado
- operação selecionada
- receita exibida
- estado de confirmação
- último resultado do refino
- feedback textual temporário
- validação atual

### Funções centrais
Funções esperadas:
- `smith_ui_open(npc_id)`
- `smith_ui_close()`
- `smith_ui_toggle(npc_id)`
- `smith_ui_is_open()`
- `smith_ui_build_refinable_item_list()`
- `smith_ui_select_item(instance_id)`
- `smith_ui_is_item_selectable(instance_id)`
- `smith_ui_get_available_operations(instance_id)`
- `smith_ui_select_operation(operation_type)`
- `smith_ui_refresh_recipe_view()`
- `smith_ui_get_selected_recipe()`
- `smith_ui_refresh_validation()`
- `smith_ui_get_validation_block_reason()`
- `smith_ui_open_confirm_dialog()`
- `smith_ui_confirm_refine()`
- `smith_ui_show_refine_result(result_struct)`
- `smith_ui_clear_last_result()`

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir inventário e itens equipados
- consumir gold do jogador
- consumir receitas e validações do sistema central de refino
- atualizar o estado visual após `refine_attempt(...)`
- refletir destruição, downgrade ou sucesso do item
- preparar integração futura com sistema geral de NPCs
- não depender de combate, drops ou lojas para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. abrir e fechar a interface do ferreiro corretamente
2. impedir duplicação da interface
3. listar itens refináveis corretamente
4. permitir selecionar item válido
5. exibir corretamente o nível atual e o próximo nível de refino
6. exibir corretamente gold, materiais e chance de sucesso
7. mostrar corretamente os tipos de operação disponíveis
8. bloquear visualmente tentativa inválida por falta de gold
9. bloquear visualmente tentativa inválida por falta de materiais
10. bloquear visualmente tentativa inválida por item no nível máximo
11. confirmar tentativa válida chamando o sistema central
12. exibir corretamente resultado de sucesso
13. exibir corretamente resultado de falha sem mudança
14. exibir corretamente resultado de falha com downgrade
15. exibir corretamente resultado de falha com destruição
16. exibir corretamente resultado protegido por Pergaminho da Paz
17. atualizar gold e materiais após a tentativa
18. atualizar ou remover o item corretamente após o resultado
19. manter separação entre UI e regra central de refino
20. seguir a identidade visual do projeto sem virar apenas um mock estático

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica da interface do ferreiro em vários lugares
- não misturar UI com regra de negócio
- não recalcular receitas, chance de sucesso ou comportamento de falha dentro da UI
- não implementar a lógica central de refino novamente neste prompt
- não implementar lojas neste prompt
- não implementar drops neste prompt
- não criar apenas mock sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders