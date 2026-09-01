# <div align=center> <img src="./sprites/portraitst.gif" height="40" >BugFix

# O que esperar na Branch
Versão mais instável, onde será testado novas funcionalidades, lógicas que ainda serão implementadas e correções de Bugs que estão presentes na branch principal.

Qualquer caixa que esteja preenchida com essa imagem |<img src="./sprites/confirm.png" height="22" width="22">| , significa que já foi corrigido, com o tempo os Bugs corrigidos estarão em uma parte específica.

## Bugs que faltam corrigir

<div align=left>[<img src="./sprites/confirm.png" height="14" width="12">] Personagem pula infinitamente ao ponto de fica presa no chão.

[<img src="./sprites/confirm.png" height="14" width="12">] Tamanho da tela para resoluções maiores fica muito esticado.

[ ] Monitores acima de 60 FPS sofrem com jogo rodando mais rápido, o que deixa injogavel. *Código feito, Falta Testar*
</div>

## Features em Desenvolvimento
<div align=left>

[ ] MenuPrincipal: Tela inicial com botão de Play e instruções.

[ ] Gerenciamento de Save: Opção para Resetar o Best Score.

[ ] Batalha de Chefe(Boss): Ativar um Boss especial assim que o Timer atingir uma marca especifica de segundos.

[ ] Variedade de Inimigos: Adicionar mais 2 tipos de inimigos diferentes, para quebrar a previsibilidade.

[ ] Sistema de Aleatoriedade: Gerar espinhos e novos inimigos em intervalos diferentes e randomicos.

[ ] Arte Background Dinâmico: Implementação de um cenario de fundo, para trazer um visual mais atraente.

[<img src="./sprites/confirm.png" height="14" width="12">] Keyboard e Opções do Jogador: Por enquanto por falta de opções não existe botões específicos, então qualquer tecla serve para pular, sendo assim futuramente terá mais opções do jogador usar para sobreviver, como agachar, guarda 2 items, e uma arma.
</div>

## ChangeLog (Histórico de Correção)

**Corrigido (Fixed):**
- **Física de Pulo:** Corrigido o bug onde o personagem pulava infinitamente e atravessava o chão.

- **Parar Jogo:** Adicionado bloqueio com a API visibilitychange para pausar os pontos quando o jogador muda de aba no navegador.