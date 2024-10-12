// Seleciona os elementos do DOM
const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const themeSound = document.getElementById('theme-sound'); 
const endSound = new Audio('src/audios/sound-effect_1.mp3');
const resetButton = document.getElementById('reset-button');
const scoreDisplay = document.getElementById('score-display');
const highScoreDisplay = document.getElementById('score-record');

// Variáveis de controle e estado
let score = 0;
let scoreInterval;
let gameOver = false;

/**
 * Função para reproduzir um som
 * @param {HTMLAudioElement} sound - O elemento de som a ser reproduzido
 */
const playSound = (sound) => {
    sound.play();
}

/**
 * Função para pausar um som e reiniciá-lo para o início
 * @param {HTMLAudioElement} sound - O elemento de som a ser pausado
 */
const pauseSound = (sound) => {
    sound.pause();
    sound.currentTime = 0;
}

/**
 * Função para ajustar o volume de um som
 * @param {HTMLAudioElement} sound - O elemento de som
 * @param {number} volume - O volume desejado (entre 0.0 e 1.0)
 */
const setVolume = (sound, volume) => {
    sound.volume = volume; 
}

// Recupera e define volumes salvos
const savedThemeVolume = localStorage.getItem('themeVolume') || 0.5; 
setVolume(themeSound, savedThemeVolume);

const savedEndVolume = localStorage.getItem('endVolume') || 0.5; 
setVolume(endSound, savedEndVolume);

/**
 * Função para atualizar a pontuação do jogo
 */
const updateScore = () => {
    score++;
    scoreDisplay.innerText = score;
}

/**
 * Função para iniciar o jogo
 */
const startGame = () => {
    score = 0;
    scoreDisplay.innerText = score;
    resetButton.classList.add('hidden');
    gameOver = false;
    scoreInterval = setInterval(updateScore, 1000);
    playSound(themeSound);
    updateHighScoreDisplay(); // Atualiza a exibição do high score no início do jogo
}

/**
 * Função para reiniciar o jogo (recarregar a página)
 */
const restartGame = () => {
    location.reload(); 
}

// Adiciona evento de clique ao botão de reset
resetButton.addEventListener('click', restartGame);

// Adiciona evento de pressionar tecla para reiniciar com 'Space' após o jogo terminar
document.addEventListener('keydown', (event) => {
    if (gameOver && event.code === 'Space') { 
        restartGame();
    }
});

/**
 * Função para fazer o Mario pular
 */
const jump = () => {
    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}

/**
 * Função para salvar o High Score no localStorage
 * @param {number} newHighScore - A nova pontuação a ser salva como High Score
 */
const saveHighScore = (newHighScore) => {
    localStorage.setItem('highScore', newHighScore);
}

/**
 * Função para obter o High Score do localStorage
 * @returns {number} - O High Score atual
 */
const getHighScore = () => {
    return localStorage.getItem('highScore') || 0;
}

/**
 * Função para atualizar a exibição do High Score
 */
const updateHighScoreDisplay = () => {
    highScoreDisplay.innerText = `HI: ${getHighScore()}`;
}

// Loop principal do jogo, verifica colisões e atualiza estados
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft; 
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = 'src/images/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';
      
        clearInterval(loop);
        clearInterval(scoreInterval);

        pauseSound(themeSound);
        playSound(endSound);
        
        if (score > getHighScore()) {
            saveHighScore(score);
        }
        
        gameOver = true;
        resetButton.classList.remove('hidden');
        updateHighScoreDisplay(); // Atualiza a exibição do high score no final do jogo
    }
}, 10);

// Adiciona evento de pressionar tecla para pular
document.addEventListener('keydown', jump);

// Inicia o jogo quando a página carrega
window.addEventListener('load', startGame);

// Salva os volumes antes de sair da página
window.addEventListener('beforeunload', () => {
    localStorage.setItem('themeVolume', themeSound.volume);
    localStorage.setItem('endVolume', endSound.volume);
});
