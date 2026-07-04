const canvas = document.getElementById('window-game');
const ctx = canvas.getContext("2d");

// Score / Timer 
let score = 0;
let timer = 0;
let intervalId;
let jogoAtivo = true;

// Sprites 
const characterWalkImage = new Image();
characterWalkImage.src = './sprites/Walk-sheet.png';

const characterJumpImage = new Image();
characterJumpImage.src = './sprites/jump-character.png'; 

const spikeImage = new Image();
spikeImage.src = './sprites/Spike.png';

const batImage = new Image();
batImage.src = './sprites/bat.png'; 

// Backgrounds
const bgCeu = new Image();
bgCeu.src = './sprites/ceu.png';
const bgNuvens = new Image();
bgNuvens.src = './sprites/nuvens.png';
const bgMontanhas = new Image();
bgMontanhas.src = './sprites/montanhas.png';
const bgMuro = new Image();
bgMuro.src = './sprites/muro.png';
const bgChao = new Image();
bgChao.src = './sprites/chao.png';

// Posição das sprites do background X
let posX_nuvens = 0;
let posX_montanhas = 0;
let posX_muro = 0;
let posX_chao = 0;

// Character
let character = {
    x: 50,
    y: 200,
    largura: 64,
    altura: 64,
    velocidadeY: 0,
    gravidade: 2500,
    fallForce: 7000, 
    jumpForce: -850,
    inGround: false
};

// Obstáculos
let spike = {
    x: 800,
    y: 332,          
    largura: 32,
    altura: 32,
    ativo: true 
};

let bat = {
    x: 1200, 
    y: 200,  
    largura: 32,
    altura: 32,
    ativo: false,
    frame: 0,
    contadorFrames: 0,
    velocidadeAnimacao: 15 
};

// Aleatoridade e Intervalo 
let listaObstaculos = [];
let tempoUltimoSpawn = 0; 
let intervaloSpawnMinimo = 1.2;

// LocalStorage 
let highScore = localStorage.getItem("gameHighScore") ? parseInt(localStorage.getItem("gameHighScore")) : 0;
if(document.getElementById("record")){
    document.getElementById("record").innerText = highScore;
}

// frames do Character
let frameAtual = 0;
let contadorFrames = 0;
const velocidadAnimacao = 20;
const totalFrames = 4;

function desenharBackground(deltaTempo) {
  ctx.imageSmoothingEnabled = false;

  // Céu 
  ctx.drawImage(bgCeu, 0, 0, canvas.width, canvas.height);
  
  // Nuvens 
  posX_nuvens -= (velocidadeJogo * 0.05) * deltaTempo; 
  if (posX_nuvens <= -canvas.width) posX_nuvens = 0;
  ctx.drawImage(bgNuvens, posX_nuvens, 0, canvas.width, canvas.height);
  ctx.drawImage(bgNuvens, posX_nuvens + canvas.width, 0, canvas.width, canvas.height); 
  
  // Montanhas 
  posX_montanhas -= (velocidadeJogo * 0.2) * deltaTempo;
  if (posX_montanhas <= -canvas.width) posX_montanhas = 0;
  ctx.drawImage(bgMontanhas, posX_montanhas, 0, canvas.width, canvas.height);
  ctx.drawImage(bgMontanhas, posX_montanhas + canvas.width, 0, canvas.width, canvas.height);
  
  // Muro 
  posX_muro -= (velocidadeJogo * 0.5) * deltaTempo;
  if (posX_muro <= -canvas.width) posX_muro = 0;
  ctx.drawImage(bgMuro, posX_muro, 0, canvas.width, canvas.height);
  ctx.drawImage(bgMuro, posX_muro + canvas.width, 0, canvas.width, canvas.height);

  // Chão 
  posX_chao -= velocidadeJogo * deltaTempo;
  if (posX_chao <= -canvas.width) posX_chao = 0;
  ctx.drawImage(bgChao, posX_chao, 0, canvas.width, canvas.height);
  ctx.drawImage(bgChao, posX_chao + canvas.width, 0, canvas.width, canvas.height);
}

function desenharCharacter(){
    contadorFrames++;
    if (contadorFrames >= velocidadAnimacao){
        frameAtual = (frameAtual + 1) % totalFrames;
        contadorFrames = 0;
    }
    
    let larguraSprite = 64;
    let posX = frameAtual * larguraSprite;
    let imagemAtual = character.inGround ? characterWalkImage : characterJumpImage;
    
    ctx.drawImage(
        imagemAtual,
        posX, 0, larguraSprite, 64,
        character.x, character.y, character.largura, character.altura
    );
}

function desenharInimigos(){
    if (spike.ativo) {
        ctx.drawImage(spikeImage, spike.x, spike.y, spike.largura, spike.altura);
    }
    
    if (bat.ativo) {
        bat.contadorFrames++;
        if(bat.contadorFrames >= bat.velocidadeAnimacao) {
            bat.frame = (bat.frame + 1) % 2; // Alterna entre frame 0 e 1
            bat.contadorFrames = 0;
        }
        let posXMorcego = bat.frame * 32;
        ctx.drawImage(
            batImage, 
            posXMorcego, 0, 32, 32, 
            bat.x, bat.y, bat.largura, bat.altura
        );
    }
}

let velocidadeJogo = 350;

function atualizarJogo(deltaTempo){
    velocidadeJogo += 10 * deltaTempo;

    if (spike.ativo) {
        spike.x -= velocidadeJogo * deltaTempo;
    }
    if (bat.ativo) {
        bat.x -= velocidadeJogo * deltaTempo;
    }

    // Lógica de Random / Respawn 
    if ((spike.ativo && spike.x < -spike.largura) || (bat.ativo && bat.x < -bat.largura)) {
        let novaPosicaoX = canvas.width + Math.random() * 200;
        
        //  50% (Spike e Bat)
        if (Math.random() < 0.5) {
            spike.ativo = true;
            spike.x = novaPosicaoX;
            bat.ativo = false;
        } else {
            bat.ativo = true;
            bat.x = novaPosicaoX;
            spike.ativo = false;
        }
    }

    // Forçar Queda
    let gravidadeAplicada = character.gravidade;
    if (teclasPressionadas['KeyS'] || teclasPressionadas['ArrowDown']) {
        if (!character.inGround) {
            gravidadeAplicada = character.fallForce;
        }
    }

    character.velocidadeY += gravidadeAplicada * deltaTempo;
    character.y += character.velocidadeY * deltaTempo;

    let posicaoChao = 300; 
    
    if (character.y >= posicaoChao) {
        character.y = posicaoChao;
        character.velocidadeY = 0;
        character.inGround = true;
    }

    // Colisões Dinamicas
    if (spike.ativo && verificarColisao(character, spike, 12, 6)) {
        gameOver();
    }
    if (bat.ativo && verificarColisao(character, bat, 12, 10)) {
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

    desenharBackground(deltaTempo);

    ctx.strokeStyle = "#1e272e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 364);
    ctx.lineTo(canvas.width, 364);
    ctx.stroke();

    desenharCharacter();
    desenharInimigos();

    gameLoopId = requestAnimationFrame(loopPrincipal);
}

function verificarColisao(char, obstaculo, margemChar, margemObstaculo){
    return(
        char.x + margemChar < (obstaculo.x + obstaculo.largura) - margemObstaculo &&
        (char.x + char.largura) - margemChar > obstaculo.x + margemObstaculo &&
        char.y + margemChar < (obstaculo.y + obstaculo.altura) - margemObstaculo &&
        (char.y + char.altura) - margemChar > obstaculo.y + margemObstaculo
    );
}

// Keyboard (Space, Seta pra baixo, tecla S)
let teclasPressionadas = {};

window.addEventListener('keydown', event => {
    teclasPressionadas[event.code] = true;

    if (event.code === 'Space' && character.inGround && jogoAtivo){
        character.velocidadeY = character.jumpForce;
        character.inGround = false;
    }
});

window.addEventListener('keyup', event => {
    teclasPressionadas[event.code] = false;
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

document.addEventListener("visibilitychange", () => {
    if (document.hidden){
        pararContagem();
    } else {
        if(jogoAtivo){
            ultimoTempo = performance.now();
            iniciarContagem();
        }
    }
});

function gameOver(){
    jogoAtivo = false;
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

function reiniciarJogo(){
    if(document.getElementById("game-over-screen")) document.getElementById("game-over-screen").style.display = "none";
    if(document.getElementById("new-record")) document.getElementById("new-record").style.display = "none";
    
    timer = 0;
    score = 0;
    velocidadeJogo = 350;

    if(document.getElementById("score")) document.getElementById("score").innerText = score;
    if(document.getElementById("timer")) document.getElementById("timer").innerText = "0s";

    spike.ativo = true;
    spike.x = 800;
    bat.ativo = false;
    bat.x = 1200;

    character.y = 200;
    character.velocidadeY = 0;
    
    posX_nuvens = 0; 
    posX_montanhas = 0;
    posX_muro = 0;
    posX_chao = 0;
   
    jogoAtivo = true;
    ultimoTempo = performance.now();

    iniciarContagem();
    gameLoopId = requestAnimationFrame(loopPrincipal); 
}

iniciarContagem();
gameLoopId = requestAnimationFrame(loopPrincipal);