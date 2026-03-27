# Implementar interface de status do personagem para jogo 2D no GameMaker

Use GML moderno (GameMaker 2.3+), com `structs`, `functions`, `enums` e código real. A interface deve ser funcional e pronta para produção, não apenas um mock visual.

## Objetivo

Implementar a janela de status do personagem, incluindo:
- abertura e fechamento
- leitura dos dados do personagem
- exibição de atributos base, derivados e recursos
- distribuição temporária de pontos
- confirmação e cancelamento das alterações
- separação entre estado, interação e renderização

Não implementar neste prompt:
- skills
- inventário
- combate
- sistema completo de equipamentos
- sistema completo de honra

## Dependências e contexto

Considere que a UI deve consumir os dados dos prompts anteriores:

### Progressão e identidade
- `character_name`
- `level`
- `exp_current`
- `exp_to_next`
- `status_points`
- `honor_value`
- `honor_rank`

### Recursos
- `hp_current`
- `hp_max`
- `mp_current`
- `mp_max`

### Atributos base
- `for_base`
- `int_base`
- `dex_base`
- `def_base`
- `vit_base`

### Totais e derivados
- `for_total`
- `int_total`
- `dex_total`
- `def_total`
- `vit_total`
- `attack_physical`
- `attack_magic`
- `defense_total`
- `crit_chance`
- `attack_speed`
- `move_speed`
- `hp_regen`
- `mp_regen`

A interface deve apenas ler e enviar comandos. Não duplicar regras de negócio do sistema de status ou do sistema de atributos.

## Direção visual

A estética deve ser inspirada em RPG sombrio, com clima próximo de Elden Ring, mas sem copiar telas literalmente.

Prioridades visuais:
- legibilidade alta
- aparência sóbria e elegante
- tons escuros com acentos dourado, bronze ou marfim queimado
- moldura discreta
- hierarquia visual clara
- layout limpo, sem aspecto de debug tool

Evite:
- visual futurista
- aparência mobile genérica
- excesso de saturação
- ornamentos exagerados que prejudiquem leitura

Se o projeto não tiver assets próprios de UI, implemente com `draw_gui`, primitivas, cores centralizadas e fontes existentes no projeto.

## Estrutura mínima da tela

### Cabeçalho
Exibir:
- nome do personagem
- nível atual
- barra de XP
- valor atual e necessário de XP
- honra numérica
- título textual de honra

### Coluna esquerda
Exibir:
- `HP atual / HP máximo`
- `MP atual / MP máximo`
- atributos base distribuíveis
- pontos disponíveis
- pontos temporariamente alocados
- pontos restantes

### Coluna direita
Exibir:
- dano físico
- dano mágico
- defesa final
- chance crítica
- velocidade de ataque
- velocidade de movimento
- regeneração de HP
- regeneração de MP

### Rodapé
Exibir:
- botão `Confirmar`
- botão `Cancelar`
- botão `Fechar`

## Comportamento obrigatório

### 1. Abertura e fechamento
Implementar:
- tecla dedicada para abrir/fechar
- botão de fechar
- prevenção de múltiplas instâncias da mesma janela

Ao fechar a janela com alterações pendentes:
- cancelar automaticamente a alocação temporária

### 2. Estado temporário da distribuição
A UI deve manter um estado temporário separado do personagem real.

Esse estado deve guardar:
- pontos temporários por atributo
- total temporariamente gasto
- indicador de mudanças pendentes

### 3. Distribuição temporária
Para cada atributo `FOR`, `INT`, `DEX`, `DEF` e `VIT`, a interface deve permitir:
- adicionar ponto temporário
- remover apenas ponto temporário

Regras:
- não alterar permanentemente o personagem ao clicar em `+`
- não remover abaixo do valor base real
- não gastar mais pontos do que o disponível
- não permitir confirmar sem mudanças pendentes

### 4. Confirmação e cancelamento
Ao confirmar:
- enviar a alocação para uma função central do sistema base
- limpar o estado temporário
- atualizar a exibição

Ao cancelar:
- descartar toda a alocação temporária
- restaurar o estado visual sem efeitos colaterais

### 5. Feedback visual
Implementar feedback claro para:
- botão disponível
- botão pressionado
- botão desabilitado
- atributo com alteração pendente
- falta de pontos restantes

## Arquitetura esperada

Separe pelo menos estas responsabilidades:

### Controle da janela
Abrir, fechar, alternar visibilidade e controlar estado.

### Estado temporário
Guardar alocações pendentes e flags de alteração.

### Interação
Mouse, teclado, hitboxes e acionamento de botões.

### Renderização
Painel, moldura, seções, textos, barras, botões e destaques.

### Integração com sistemas
Leitura de dados do personagem e envio da confirmação/cancelamento para funções centrais.

Evite concentrar tudo em um único evento gigante.

## Requisitos de layout e manutenção

Centralize em configuração:
- dimensões do painel
- margens
- espaçamentos
- cores
- tamanhos de texto
- estilos de botão

O layout deve se adaptar de forma estável à viewport do jogo e evitar coordenadas rígidas espalhadas.

## Critérios de aceite

Garanta que a interface trate corretamente:
- abrir com zero pontos disponíveis
- abrir com pontos disponíveis
- adicionar pontos em vários atributos
- tentar adicionar sem pontos restantes
- remover pontos temporários
- confirmar distribuição
- cancelar distribuição
- fechar com alterações pendentes
- reabrir após cancelar
- reabrir após confirmar
- exibir valores corretos após level up
- exibir XP correto após ganho de experiência
- exibir honra mesmo ainda simplificada

## Formato de resposta esperado

Entregue nesta ordem:

1. Resumo curto da arquitetura adotada
2. Código GML completo, sem pseudo-código
3. Explicação breve de como a UI se conecta aos sistemas anteriores

## Restrições importantes

- Não implementar sistema completo de skills
- Não implementar inventário
- Não implementar combate
- Não implementar sistema completo de honra
- Não criar apenas mock visual sem funcionalidade
- Não espalhar regra de negócio de status pela interface
- Não omitir partes importantes
