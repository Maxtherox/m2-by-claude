# Implementar sistema de honra para jogo 2D no GameMaker

Quero que você implemente um sistema completo de honra para um jogo 2D feito em GameMaker, inspirado conceitualmente no Metin2, porém simplificado, modular e adaptado para um projeto single-player offline.

Este prompt deve focar somente em:
- estrutura de honra do personagem
- ganho de honra
- perda de honra
- faixas/títulos de honra
- integração futura com progressão de skills
- suporte futuro a honra negativa
- regras configuráveis de variação de honra

Não quero interface visual neste prompt.
Não quero combate neste prompt.
Não quero inventário neste prompt.
Não quero sistema de crimes completo neste prompt.
Não quero sistema de roubo neste prompt.
Quero apenas a lógica estrutural e funcional do sistema de honra.

---

## Objetivo

Criar um sistema de honra que funcione como um atributo moral/social do personagem, inspirado no espírito do Metin2, mas adaptado à realidade atual do projeto.

Neste momento o jogo é offline e a honra negativa ainda não fará parte ativa do gameplay.
Mesmo assim, quero que a arquitetura já fique pronta para no futuro suportar:

- honra negativa
- crimes
- roubo
- penalidades sociais
- reações de NPCs
- sistemas de risco/recompensa ligados à honra

Atualmente, a honra deve ser implementada com foco nestes comportamentos:

- o personagem pode ganhar honra
- o personagem pode perder honra em ações específicas de progressão de skill
- a honra deve possuir faixas/títulos
- a honra negativa deve existir na estrutura, mas ficar desativada por regra de jogo neste momento
- deve ser fácil ativar a honra negativa no futuro sem refazer o sistema inteiro

---

## Regras atuais do projeto

No estado atual do jogo:

- a honra começa neutra ou positiva baixa
- o jogador pode ganhar honra por ações positivas
- o jogador pode perder honra ao usar Pedra Espiritual em progressão avançada de skills
- a honra negativa ainda não deve impactar o gameplay principal
- o sistema deve impedir ou limitar a queda abaixo de certo ponto se essa proteção estiver ativa

### Regra futura prevista
No futuro, pretendo implementar sistemas como:
- roubo
- crimes
- ações hostis ou moralmente negativas
- perda de honra por escolhas do jogador

Quero que isso fique previsto na arquitetura, mas não implementado de forma funcional agora.

---

## Estrutura geral desejada

O personagem deve possuir pelo menos estes dados de honra:

- honor_current
- honor_min
- honor_max
- honor_state_id
- honor_state_name

Também quero suporte a configuração centralizada para:

- honra inicial
- honra mínima
- honra máxima
- se honra negativa está habilitada ou não
- quanto pode ganhar por evento
- quanto pode perder por evento
- limites por ação
- nomes das faixas de honra

---

## Estado atual desejado

Quero que o sistema seja configurável para dois modos:

### Modo atual
- honra negativa desativada
- o valor pode cair, mas não deve entrar em faixas negativas reais de gameplay
- o sistema continua preparado estruturalmente para isso

### Modo futuro
- honra negativa ativada
- o valor pode cruzar zero
- o personagem pode entrar em estados negativos
- faixas negativas passam a existir plenamente

Não quero dois sistemas separados.
Quero um único sistema com configuração para habilitar ou não a parte negativa.

---

## Faixas de honra

Quero que a honra tenha estados/faixas nomeadas.

No modo atual, pelo menos:
- Neutra
- Respeitada
- Honrada
- Reverenciada
- Lendária

No futuro, deve ser fácil expandir para algo como:
- Corrompida
- Suspeita
- Infame
- Amaldiçoada

A classificação deve ser baseada em intervalos configuráveis, não em ifs espalhados pelo código.

Quero uma estrutura central para as faixas, com algo como:
- valor mínimo da faixa
- valor máximo da faixa
- nome da faixa
- id interno da faixa

A função de atualização de estado deve:
- ler o valor atual de honra
- descobrir em qual faixa o jogador está
- atualizar honor_state_id
- atualizar honor_state_name

---

## Ganho de honra

Quero uma função genérica para ganho de honra, algo como:
- honor_add(amount, source)
ou equivalente melhor

Ela deve:
- aumentar a honra atual
- respeitar o limite máximo
- atualizar a faixa/título da honra
- registrar ou retornar a origem da alteração, se necessário
- ser fácil de reutilizar por outros sistemas

Exemplos futuros de uso:
- recompensa de missão
- derrotar chefes
- completar eventos
- usar item sagrado
- marcos importantes de progressão

Neste prompt não precisa implementar as fontes completas, apenas a estrutura para suportá-las.

---

## Perda de honra

Quero uma função genérica para perda de honra, algo como:
- honor_remove(amount, source)
ou equivalente melhor

Ela deve:
- reduzir a honra atual
- respeitar os limites configurados
- se honra negativa estiver desativada, impedir queda abaixo do limite permitido pelo modo atual
- atualizar a faixa/título da honra
- deixar preparada a lógica futura para perda por crimes e roubo

### Regra atual importante
Neste momento a perda de honra mais importante será usada por:
- progressão de skills com Pedra Espiritual
- talvez outros sistemas avançados futuramente

---

## Regra especial para honra negativa desativada

Como atualmente a honra negativa não será usada de verdade, quero que exista uma configuração clara para isso.

Exemplo conceitual:
- allow_negative_honor = false

Quando isso estiver desativado:
- a honra não deve cair abaixo do piso configurado para o modo atual
- esse piso pode ser 0
ou
- um valor mínimo neutro

A IA deve implementar isso de forma limpa, sem gambiarra.

Importante:
- mesmo com a parte negativa desativada, a estrutura do sistema não pode ficar limitada
- quero que futuramente eu só precise mudar configuração e adicionar regras de gameplay

---

## Integração com skills

Este sistema deve ficar pronto para conversar com o futuro sistema de skills.

Casos previstos:
- leitura de livros pode aumentar progressão de skill sem custo de honra
- uso de Pedra Espiritual em níveis avançados de skill pode reduzir honra
- certas skills ou rituais futuramente podem consumir honra

Neste prompt, não quero o sistema de skill implementado.
Quero apenas que o sistema de honra já possua uma API limpa para isso.

Exemplo:
- honor_remove(config.spirit_stone_honor_cost, "spirit_stone")
- honor_add(config.quest_honor_reward, "quest_reward")

---

## Regras configuráveis

Quero uma configuração central para pelo menos:

- honor_start_value
- honor_min_value
- honor_max_value
- honor_negative_enabled
- honor_floor_when_negative_disabled
- spirit_stone_honor_cost
- default_honor_gain_values
- default_honor_loss_values
- honor_rank_definitions

Os nomes podem ser melhores, mas a lógica deve ser essa.

Não quero números mágicos espalhados.

---

## Comportamento esperado

### Ao iniciar o personagem
- o sistema deve definir honra inicial
- deve definir a faixa inicial corretamente

### Ao ganhar honra
- somar valor
- respeitar máximo
- atualizar faixa

### Ao perder honra
- subtrair valor
- respeitar regras do modo atual
- atualizar faixa

### Ao trocar configuração para modo futuro
- o sistema deve continuar funcional sem reescrita estrutural
- a honra pode atravessar zero se isso estiver habilitado

---

## Casos que devem ser tratados

Garanta que o sistema lide corretamente com:

- personagem iniciando com honra neutra
- ganho pequeno de honra
- ganho grande de honra
- honra chegando exatamente ao máximo
- honra tentando ultrapassar o máximo
- perda pequena de honra
- perda grande de honra
- honra tentando cair abaixo do piso do modo atual
- troca de faixa após ganho
- troca de faixa após perda
- modo com honra negativa desativada
- modo futuro com honra negativa ativada

---

## Organização técnica esperada

Quero separar claramente:

### 1. Configuração do sistema de honra
Valores centrais, limites e faixas.

### 2. Estado do personagem
Valor atual da honra e faixa atual.

### 3. Funções principais
Exemplos esperados:
- honor_init()
- honor_add(amount, source)
- honor_remove(amount, source)
- honor_set(value)
- honor_clamp()
- honor_update_rank()
- honor_get_rank_by_value(value)

Pode usar nomes equivalentes melhores para o padrão do projeto.

---

## Arquitetura

Quero uma implementação:
- modular
- legível
- parametrizada
- fácil de expandir
- sem dependência de interface
- sem dependência de combate
- sem lógica duplicada

Se fizer sentido, pode usar:
- scripts separados
- structs
- enums
- arrays/listas/maps para as faixas

---

## Entrega esperada

Quero que você entregue:

1. Estrutura completa do sistema de honra
2. Configuração centralizada
3. Faixas/títulos de honra configuráveis
4. Lógica de ganho e perda de honra
5. Suporte ao modo atual com honra negativa desativada
6. Estrutura pronta para o modo futuro com honra negativa ativada
7. Integração prevista com progressão de skills
8. Código completo em GameMaker, sem omitir partes
9. Explicação breve de como esse sistema conversa com skills e interface depois

---

## Restrições importantes

- Não implementar interface visual neste prompt
- Não implementar sistema de crimes neste prompt
- Não implementar roubo neste prompt
- Não implementar NPCs reagindo à honra neste prompt
- Não implementar combate
- Não espalhar regras de honra em vários lugares
- Não usar pseudo-código solto
- Não omitir trechos importantes

Quero uma base sólida, configurável e preparada para expansão futura.