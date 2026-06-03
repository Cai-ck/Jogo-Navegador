const character = document.querySelector('.character');
const spike = document.querySelector('.spike');

//
const jump = () => {
    character.classList.add('jump');

    setTimeout(() =>{
        character.classList.remove('jump');

    }, 500);
}

// Loop Verificar Colisao Personagem e obstaculo espinho
const loop = setInterval(() => {

    console.log('loop')
    
    const spikePosition = spike.offsetLeft;
    const characterPosition = +window.getComputedStyle(character).bottom.replace('px', '');

    console.log(characterPosition);

    if (spikePosition <= 39 && spikePosition > 0 && characterPosition < 64){

        spike.style.animation = 'none';
        spike.style.left = `${spikePosition}px`;

        character.style.animation = 'none';
        character.style.bottom = `${characterPosition}px`;

        //character.src = '../sprites/game-over.png';
        //character.style.width = '64px'
        //character.style.marginLeft = '50px';

        clearInterval(loop);
    }

}, 10);

document.addEventListener('keydown', jump);

// Score do game(Em andamento)
