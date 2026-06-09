const canvas = document.getElementById('window-game');
const ctx = canvas.getContext("2d");

// Score do game / Timer 
let score = 0;
let timer = 0;
let intervalId;
let jogoAtivo = true;

const characterImage = new Image();
characterImage.src = './sprites/Walk-sheet.png';

const spikeImage = new Image();
spikeImage.src = './sprites/Spike.png';

// Character
let character = {
    x: 50,
    y: 200,
    largura: 64,
    altura: 64,
    velocidadeY: 0,
    gravidade: 2500,
    jumpForce: -850,
    inGround: false
};

// Spike
let spike = {
    x: 800,
    y: 332,          
    largura: 32,
    altura: 32
};

// LocalStorage 
let highScore = localStorage.getItem("gameHighScore") ? parseInt(localStorage.getItem("gameHighScore")) : 0;
if(document.getElementById("record")){
    document.getElementById("record").innerText = highScore;
}

// frame e sprite 
let frameAtual = 0;
let contadorFrames = 0;
const velocidadeAnimacao = 20;
const totalFrames = 4;

function desenharCharacter(){
    contadorFrames++;
    if (contadorFrames >= velocidadeAnimacao){
        frameAtual = (frameAtual + 1) % totalFrames;
        contadorFrames = 0;
    }
    
    let larguraSprite = 64;
    let posX = frameAtual * larguraSprite;
    
    ctx.drawImage(
        characterImage,
        posX, 0, larguraSprite, 64,
        character.x, character.y, character.largura, character.altura
    );
}

function desenharSpike(){
    ctx.drawImage(spikeImage, spike.x, spike.y, spike.largura, spike.altura);
}

let velocidadeJogo = 350;

function atualizarJogo(deltaTempo){
    velocidadeJogo += 10 * deltaTempo;
    spike.x -= velocidadeJogo * deltaTempo;

    
    if (spike.x < -spike.largura){
        spike.x = canvas.width + Math.random() * 150;
    }

    character.velocidadeY += character.gravidade * deltaTempo;
    character.y += character.velocidadeY * deltaTempo;

    let posicaoChao = 300; 
    
    if (character.y >= posicaoChao) {
        character.y = posicaoChao;
        character.velocidadeY = 0;
        character.inGround = true;
    }

    if (verificarColisao(character, spike)){
        gameOver();
    }
}

// Loop Principal
let ultimoTempo = 0;
let gameLoopId;

function loopPrincipal(tempoAtual){
    if (!jogoAtivo) return;

    let deltaTempo = (tempoAtual - ultimoTempo) / 1000;
    ultimoTempo = tempoAtual;

    if (deltaTempo > 0.1) deltaTempo = 0.1;

    atualizarJogo(deltaTempo);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1e272e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 364);
    ctx.lineTo(canvas.width, 364);
    ctx.stroke();

    desenharCharacter();
    desenharSpike();

    gameLoopId = requestAnimationFrame(loopPrincipal);

}

function verificarColisao(char, spk){
    let margemCharacter = 12;
    let margemSpike = 6;

    return(
        char.x + margemCharacter < (spk.x + spk.largura) - margemSpike &&
        (char.x + char.largura) - margemCharacter > spk.x + margemSpike &&
        char.y + margemCharacter < (spk.y + spk.altura) - margemSpike &&
        (char.y + char.altura) - margemCharacter > spk.y + margemSpike
    );
}

// Keyboard (tecla Space)
let teclaPressionada = false;

window.addEventListener('keydown', event => {
    if (event.code === 'Space' && !teclaPressionada && jogoAtivo){
        if (character.inGround){
            character.velocidadeY = character.jumpForce;
            character.inGround = false;
        }
        teclaPressionada = true;
    }
});

window.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        teclaPressionada = false;
    }
});

// Sistema de Score e Timer
function iniciarContagem(){
    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(function(){
      if (jogoAtivo && !document.hidden){
        score += 10;
        timer += 1;

        let elementoScore = document.getElementById("score");
        let elementoTimer = document.getElementById("timer");

        if(elementoScore) elementoScore.innerText = score;
        if(elementoTimer) elementoTimer.innerText = timer + "s";

    }
  }, 1000);
}

function pararContagem(){
    clearInterval(intervalId);
    intervalId = null;
}

// Impedir que o ganho de pontos e timer fora da tela
document.addEventListener("visibilitychange", () => {
    if (document.hidden){
        pararContagem();
    }else {
        if(jogoAtivo){
            ultimoTempo = performance.now();
            iniciarContagem();
        }
    }
});

// função identificar record, restart e congelar tela
function gameOver(){
    jogoAtivo = false;
    pararContagem();
    cancelAnimationFrame(gameLoopId);

    pararContagem();
    cancelAnimationFrame(gameLoopId);

    if(document.getElementById("final-score")) {
        document.getElementById("final-score").innerText = score;
    }

    if(score > highScore){
        highScore = score;
        localStorage.setItem("gameHighScore", highScore);
        if(document.getElementById("record")) document.getElementById("record").innerText = highScore;
        if(document.getElementById("new-record")) document.getElementById("new-record").style.display = "block";
    }

    if(document.getElementById("game-over-screen")) {
        document.getElementById("game-over-screen").style.display = "block";
    }
}

// Resetar valor inicio
function reiniciarJogo(){
    if(document.getElementById("game-over-screen")) document.getElementById("game-over-screen").style.display = "none";
    if(document.getElementById("new-record")) document.getElementById("new-record").style.display = "none";
    
    timer = 0;
    score = 0;
    velocidadeJogo = 350;

    if(document.getElementById("score")) document.getElementById("score").innerText = score;
    if(document.getElementById("timer")) document.getElementById("timer").innerText = "0s";

    spike.x = 800;
    character.velocidadeY = 0;

    jogoAtivo = true;
    ultimoTempo = performance.now();

    iniciarContagem();
    gameLoopId = requestAnimationFrame(loopPrincipal); 
}

iniciarContagem();
gameLoopId = requestAnimationFrame(loopPrincipal);