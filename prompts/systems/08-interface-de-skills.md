# Implementar interface de skills do personagem para jogo 2D no GameMaker

## Objetivo

Implementar a interface de skills do personagem, permitindo visualizar, desbloquear, evoluir e acompanhar a progressão avançada das skills no estilo Metin2. Este prompt resolve a camada visual e interativa do sistema de skills, conectando a UI aos sistemas já criados sem duplicar regra de negócio.

Este prompt vem depois de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `05-sistema-honra.md`

Este prompt vem antes de:
- prompt de hotbar/atalhos de skills
- prompt de itens consumíveis de skill, se você decidir separar isso depois

## Escopo

### Implementar neste prompt
- janela de skills
- abertura e fechamento da interface
- listagem das skills do personagem
- exibição de skill bloqueada, desbloqueada e evoluível
- exibição de nível e estágio atual da skill
- exibição de label de progressão como `1`, `17`, `M1`, `M10`, `G1`, `G10`, `P`
- botão de desbloqueio
- botão de evoluir skill com ponto normal quando aplicável
- botão de leitura de livro quando aplicável
- botão de uso de Pedra Espiritual quando aplicável
- exibição de custo, requisito e estado da skill
- exibição de descrição e tipo da skill
- exibição de cooldown atual de forma informativa
- exibição de pontos de skill disponíveis
- feedback visual de disponibilidade e bloqueio
- integração com identidade visual inspirada em Elden Ring

### Não implementar neste prompt
- hotbar
- uso da skill em combate
- efeitos visuais
- animações complexas
- inventário completo
- drop de livros
- obtenção de Pedra Espiritual
- tooltips avançadas fora da própria janela
- árvore de talentos complexa
- drag and drop de skills
- combate
- lógica central de skills já implementada nos prompts anteriores

## Dependências e contexto

Este sistema depende de:
- `06-sistema-skills-base.md`
- `07-progressao-skills-estilo-metin2.md`
- `05-sistema-honra.md`
- sistema de status/UI geral do projeto

Campos e dados que já devem existir ou precisam ser criados se ainda não existirem:

### Dados já existentes esperados
- catálogo global de skills
- estado individual da skill do jogador
- `skill_points`
- `progress_stage`
- `base_level`
- `master_stage_level`
- `grand_stage_level`
- `perfect_stage_level` ou equivalente
- `cooldown_remaining`
- `is_unlocked`
- `required_level`
- `description`
- `type`
- `scaling_stat`
- `skills_get_definition(skill_id)`
- `skills_get_player_skill(skill_id)`
- `skills_get_progression_label(skill_id)`
- `skills_can_unlock(skill_id)`
- `skills_unlock(skill_id)`
- `skills_can_level_up(skill_id)`
- `skills_level_up(skill_id)`
- `skills_can_read_book(skill_id)`
- `skills_read_book(skill_id)`
- `skills_can_use_spirit_stone(skill_id)`
- `skills_use_spirit_stone(skill_id)`
- `honor_current`

### Dados que este prompt deve criar
- controlador da interface de skills
- estado visual da janela
- skill selecionada
- layout da lista de skills
- layout do painel de detalhes
- botões de ação da skill
- feedback visual e textual de resultado da ação

## Requisitos funcionais

### 1. Criar controlador da janela de skills
A interface deve possuir controle claro de abertura, fechamento e estado interno.

Responsabilidades:
- abrir a janela por tecla
- fechar a janela por tecla ou botão
- impedir duplicação de instância
- manter estado de skill selecionada
- atualizar a janela corretamente após ações

Funções esperadas:
- `ui_skills_open()`
- `ui_skills_close()`
- `ui_skills_toggle()`

### 2. Criar layout principal da interface
A interface deve possuir estrutura clara e legível.

Blocos obrigatórios:
- cabeçalho da janela
- lista de skills
- painel de detalhes da skill selecionada
- área de ações
- área de recursos relacionados

Informações mínimas no cabeçalho:
- título da janela
- pontos de skill disponíveis
- honra atual
- botão de fechar

### 3. Exibir lista de skills do personagem
A janela deve listar todas as skills cadastradas no catálogo ou todas as skills relevantes da classe atual, conforme a arquitetura adotada.

Cada entrada de skill deve mostrar ao menos:
- nome
- estado bloqueada/desbloqueada
- label de progressão atual
- tipo da skill
- indicativo de cooldown se existir
- indicativo visual de selecionada

Funções esperadas:
- `ui_skills_build_visible_list()`
- `ui_skills_select(skill_id)`

### 4. Exibir painel de detalhes da skill selecionada
Ao selecionar uma skill, o painel lateral ou inferior deve mostrar:

- nome da skill
- descrição
- tipo
- atributo principal de escala
- requisito de nível
- custo de MP
- cooldown
- estado atual
- progressão atual
- próximo método de evolução disponível
- motivos de bloqueio quando aplicável

A exibição deve usar os dados reais do sistema, sem recalcular regra na UI.

### 5. Exibir corretamente os estágios de progressão
A UI deve mostrar a progressão da skill de forma clara e consistente.

Exemplos válidos:
- `Nv. 5`
- `17`
- `M1`
- `M5`
- `G1`
- `G10`
- `P`

A função central da UI deve consumir:
- `skills_get_progression_label(skill_id)`

A interface não deve montar essa string manualmente em vários pontos.

### 6. Permitir desbloqueio de skill
Se a skill estiver bloqueada, a interface deve permitir tentar desbloqueá-la.

Comportamento esperado:
- botão de desbloqueio visível apenas quando fizer sentido
- botão desabilitado se não houver requisito
- ao clicar, chamar o sistema central
- atualizar a UI após sucesso
- exibir feedback em caso de falha

Funções esperadas:
- `ui_skills_try_unlock_selected()`

### 7. Permitir evolução por ponto normal quando aplicável
Se a skill ainda estiver no estágio normal e puder evoluir por ponto de skill:

- mostrar botão de evoluir normal
- mostrar custo em ponto de skill
- validar disponibilidade antes do clique
- atualizar a janela após a evolução

Funções esperadas:
- `ui_skills_try_level_up_selected()`

### 8. Permitir leitura de livro quando aplicável
Se a skill estiver em estágio `MASTER`:

- mostrar botão de leitura de livro
- esconder ou desabilitar o botão quando a regra não permitir
- ao clicar, chamar o sistema central
- exibir resultado de sucesso ou falha
- atualizar progressão na tela

Funções esperadas:
- `ui_skills_try_read_book_selected()`

### 9. Permitir uso de Pedra Espiritual quando aplicável
Se a skill estiver em estágio `GRAND_MASTER`:

- mostrar botão de Pedra Espiritual
- exibir custo de honra associado
- validar se a skill pode tentar progressão
- ao clicar, chamar o sistema central
- exibir resultado de sucesso ou falha
- atualizar honra na tela
- atualizar progressão na tela

Funções esperadas:
- `ui_skills_try_use_spirit_stone_selected()`

### 10. Exibir claramente o motivo de indisponibilidade
Quando uma ação não puder ser realizada, a interface deve informar o motivo de forma objetiva.

Exemplos:
- nível insuficiente
- sem skill points
- skill bloqueada
- estágio incorreto
- honra insuficiente, se essa regra existir
- já está no máximo
- em cooldown
- já está em Perfect Master

Função esperada:
- `ui_skills_get_action_block_reason(skill_id, action_type)`

### 11. Exibir cooldown de forma informativa
A interface deve mostrar o cooldown da skill quando existir.

Pode ser exibido como:
- número em segundos
- estado “em recarga”
- overlay visual simples na lista

A UI não deve controlar o cooldown por conta própria, apenas exibir.

### 12. Exibir pontos de skill e honra atuais
A janela deve mostrar, de forma destacada:
- `skill_points`
- `honor_current`

Isso é importante porque essas duas moedas de progressão influenciam diretamente a evolução das skills.

### 13. Implementar feedback visual e textual das ações
Após qualquer ação relevante, a interface deve atualizar e exibir feedback curto.

Casos:
- skill desbloqueada
- skill evoluída com ponto normal
- leitura de livro com sucesso
- leitura de livro com falha
- uso de Pedra Espiritual com sucesso
- uso de Pedra Espiritual com falha
- honra consumida
- ação bloqueada

A UI pode usar:
- mensagem curta
- banner interno
- log temporário dentro da janela

Não precisa criar sistema global de notificações neste prompt.

### 14. Separar UI da regra de negócio
A interface deve:
- ler dados do sistema de skills
- acionar funções centrais do sistema de skills
- refletir o estado atualizado

A interface não deve:
- recalcular progressão internamente
- consumir honra por conta própria
- decidir regras centrais de evolução
- duplicar validações em vários lugares

### 15. Aplicar direção visual inspirada em Elden Ring
A interface deve seguir a identidade visual definida para o projeto.

Direção visual obrigatória:
- aparência sóbria
- fantasia sombria
- molduras discretas
- fundo escuro ou semitransparente escuro
- detalhes em dourado, bronze, cinza envelhecido ou marfim queimado
- tipografia clássica e legível
- layout limpo e elegante
- sem visual mobile genérico
- sem aparência sci-fi
- sem poluição visual excessiva

A UI deve parecer parte do mesmo conjunto visual da interface de status.

## Arquitetura esperada

### Configuração
Criar local central para:
- dimensões da janela
- margens e espaçamentos
- tamanho dos slots/lista
- cores e elementos visuais
- labels de ações
- teclas de abertura/fechamento
- enum de ações da UI se necessário

### Estado
Separar claramente:
- janela aberta/fechada
- skill selecionada
- lista visível de skills
- feedback textual temporário
- estado de hover/click dos botões
- scroll da lista, se necessário

### Funções centrais
Funções esperadas:
- `ui_skills_open()`
- `ui_skills_close()`
- `ui_skills_toggle()`
- `ui_skills_build_visible_list()`
- `ui_skills_select(skill_id)`
- `ui_skills_try_unlock_selected()`
- `ui_skills_try_level_up_selected()`
- `ui_skills_try_read_book_selected()`
- `ui_skills_try_use_spirit_stone_selected()`
- `ui_skills_get_action_block_reason(skill_id, action_type)`
- funções auxiliares de draw e input seguindo o padrão do projeto

Pode adaptar os nomes ao padrão do projeto, mantendo consistência.

### Integração com outros sistemas
- consumir catálogo e estado do sistema de skills
- consumir labels de progressão do sistema avançado
- consumir honra do sistema de honra
- refletir `skill_points`
- atualizar automaticamente após cada ação
- não depender de combate para funcionar

## Critérios de aceite

Os casos abaixo devem funcionar obrigatoriamente:

1. abrir e fechar a janela de skills corretamente
2. impedir duplicação da janela
3. listar skills corretamente
4. selecionar skill e exibir seus detalhes corretamente
5. mostrar skill bloqueada e desbloqueada de forma distinta
6. mostrar corretamente o label de progressão da skill
7. desbloquear skill válida a partir da interface
8. impedir desbloqueio inválido com feedback claro
9. evoluir skill normal quando permitido
10. impedir evolução normal quando não permitido
11. permitir leitura de livro apenas em `MASTER`
12. atualizar UI corretamente após leitura de livro com sucesso
13. atualizar UI corretamente após leitura de livro com falha
14. permitir Pedra Espiritual apenas em `GRAND_MASTER`
15. atualizar progressão e honra corretamente após uso de Pedra Espiritual
16. exibir `skill_points` e `honor_current` corretamente
17. mostrar cooldown de forma informativa
18. manter separação entre UI e regra de negócio
19. seguir a identidade visual inspirada em Elden Ring
20. funcionar sem depender de hotbar, combate ou inventário completo

## Formato de resposta esperado

Quero que você responda com:

1. resumo curto da arquitetura
2. código completo em GML
3. explicação breve da integração com os sistemas anteriores

## Restrições importantes

- não usar pseudo-código
- não omitir partes importantes
- não espalhar lógica de UI em vários lugares sem organização
- não duplicar regra de negócio do sistema de skills
- não implementar hotbar neste prompt
- não implementar combate neste prompt
- não implementar inventário completo neste prompt
- não criar apenas mock visual sem funcionalidade
- manter consistência de nomes entre prompts
- salvar o arquivo em UTF-8
- não deixar arquivo vazio ou com placeholders