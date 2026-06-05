const character = document.querySelector('.character');
const spike = document.querySelector('.spike');

// Score do game / Timer 
let score = 0;
let timer = 0;
let intervalId;

// LocalStorage para Recorde
let highScore = localStorage.getItem("gameHighScore") ? parseInt(localStorage.getItem("gameHighScore")) : 0;

if(document.getElementById("record")){
    document.getElementById("record").innerText = highScore;
}

const jump = () => {
    character.classList.add('jump');

    setTimeout(() =>{
        character.classList.remove('jump');

    }, 500);
}

// Loop Verificar Colisao Personagem e obstaculo espinho
function verificarColisao(){
    loop = setInterval(() => {
        const spikePosition = spike.offsetLeft;
        const characterPosition = +window.getComputedStyle(character).bottom.replace('px', '');

        if (spikePosition <= 39 && spikePosition > 0 && characterPosition < 50){
            spike.style.animation = 'none';
            spike.style.left = `${spikePosition}px`;

            character.style.animation = 'none';
            character.style.bottom = `${characterPosition}px`;

            gameOver();
        }
    }, 10);
}

document.addEventListener('keydown', jump);

function iniciarContagem(){
    intervalId = setInterval(function(){
        score+=10;
        timer+=1;
        document.getElementById("score").innerText = score;
        document.getElementById("timer").innerText = `${timer}s`;

       /* if (timer === 100){
            generateBossFight();
            Futura logica de iniciar bossfight.
        }

        if (timer > 15){
            Futura logica de aleatoridade de inimigos.
        }
        */
    }, 1000);
}

/*Futura função de Gerar Bossfight
function generateBossFight(){
     console.log('Boss Fight!');
}
*/

function pararContagem(){
    clearInterval(intervalId);
}

// Função Parar Jogo
function gameOver(){
    pararContagem();
    clearInterval(loop);
    
    document.getElementById("final-score").innerText = score;
    document.getElementById("new-record").style.display = "none";

    if (score > highScore){
        highScore = score;
        localStorage.setItem("gameHighScore", highScore);
        document.getElementById("record").innerText = highScore;
        document.getElementById("new-record").style.display = "block";

    }

    document.getElementById("game-over-screen").style.display = "block";
}

// Reiniciar jogo
function reiniciarJogo() {
    document.getElementById("game-over-screen").style.display = "none";
    timer = 0;
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = `${timer}s`;
    spike.style.left = '';
    character.style.bottom = '';

    spike.style.animation = 'spike-animation 1s infinite linear';
    character.style.animation = '';

    iniciarContagem();
    verificarColisao();

}

iniciarContagem();
verificarColisao();