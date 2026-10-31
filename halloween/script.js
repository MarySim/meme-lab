const plant = document.getElementById('plant');
const stageText = document.getElementById('stageText');
const gameMessage = document.getElementById('gameMessage');
const overlay = document.getElementById('overlay');
const endTitle = document.getElementById('endTitle');
const endDesc = document.getElementById('endDesc');
const gameContainer = document.querySelector('.game-container');

const statusPanel = document.getElementById('statusPanel');
const controlsPanel = document.getElementById('controlsPanel');
const finalScreen = document.getElementById('finalScreen');
const btnLightCandle = document.getElementById('btnLightCandle');
const btnRestartWin = document.getElementById('btnRestartWin');

const btnPause = document.getElementById('btnPause');
const pauseMenu = document.getElementById('pauseMenu');
const btnResume = document.getElementById('btnResume');
const btnRestartPause = document.getElementById('btnRestartPause');
const btnSkip = document.getElementById('btnSkip');
const decorations = document.getElementById('decorations');

const waterBar = document.getElementById('waterBar');
const lightBar = document.getElementById('lightBar');
const soilBar = document.getElementById('soilBar');

let stats = { water: 50, light: 50, soil: 50 };
let growthTick = 0;
let stage = 0; 
let gameLoop = null;
let isGameOver = false;
let isPaused = false;

const stages = [
    { emoji: '🌰', name: 'Семечко' },
    { emoji: '🌱', name: 'Росток' },
    { emoji: '🌿', name: 'Лиана' },
    { emoji: '🎃', name: 'Тыква-Мутант' }
];

function startGame() {
    stats = { water: 50, light: 50, soil: 50 };
    growthTick = 0;
    stage = 0;
    isGameOver = false;
    isPaused = false;
    
    document.body.classList.remove('lights-out');
    gameContainer.classList.remove('lights-out');
    plant.classList.remove('lit-up');
    
    overlay.classList.add('hidden');
    finalScreen.classList.add('hidden');
    pauseMenu.classList.add('hidden');
    btnPause.classList.remove('hidden'); 
    
    statusPanel.classList.remove('hidden');
    controlsPanel.classList.remove('hidden');
    btnLightCandle.classList.remove('hidden');
    btnRestartWin.classList.add('hidden');
    
    gameContainer.classList.remove('danger-mode');
    updatePlantUI();
    updateBars();
    gameMessage.textContent = "Следи, чтобы шкалы не опустели и не переполнились!";
    
    clearInterval(gameLoop);
    gameLoop = setInterval(tick, 500);
}

function tick() {
    if (isGameOver || isPaused) return; 

    let difficultyMultiplier = 2; 
    if (stage === 1) difficultyMultiplier = 3.5; 
    if (stage === 2) difficultyMultiplier = 5.5; 

    stats.water -= 2 * difficultyMultiplier;
    stats.light -= 1.5 * difficultyMultiplier;
    stats.soil -= 1.2 * difficultyMultiplier; 

    growthTick++;
    checkGrowth();
    updateBars();
    checkGameOver();
}

function checkGrowth() {
    if (growthTick >= 20 && stage === 0) setStage(1);
    if (growthTick >= 40 && stage === 1) setStage(2);
    if (growthTick >= 60 && stage === 2) {
        setStage(3);
        winGame();
    }
}

function setStage(newStage) {
    stage = newStage;
    updatePlantUI();
    triggerLightning();
    gameMessage.textContent = "Растение мутирует... Скорость потребления выросла!";
}

function updatePlantUI() {
    plant.textContent = stages[stage].emoji;
    plant.className = `stage-${stage}`;
    stageText.textContent = stages[stage].name;
}

function updateBars() {
    let isInDanger = false;

    Object.keys(stats).forEach(key => {
        const bar = document.getElementById(`${key}Bar`);
        bar.style.width = `${stats[key]}%`;
        
        if (stats[key] < 20 || stats[key] > 80) {
            bar.classList.add('danger');
            isInDanger = true;
        } else {
            bar.classList.remove('danger');
        }
    });

    if (isInDanger && !isGameOver && !isPaused) {
        gameContainer.classList.add('danger-mode');
    } else {
        gameContainer.classList.remove('danger-mode');
    }
}

function checkGameOver() {
    if (stats.water <= 0) endGame("Засуха", "Вы забыли полить семечко. Оно засохло.");
    if (stats.water >= 100) endGame("Гниль", "Вы залили корни. Уровень pH упал, растение сгнило.");
    if (stats.light <= 0) endGame("Тьма", "Без 6500K спектра растение зачахло.");
    if (stats.light >= 100) endGame("Ожог", "Лампа сожгла листья.");
    if (stats.soil <= 0) endGame("Удушье", "Корням не хватило кислорода без пеностекла.");
    if (stats.soil >= 100) endGame("Пустыня", "Слишком много пеностекла! Корни высохли.");
}

function endGame(title, desc) {
    isGameOver = true;
    clearInterval(gameLoop);
    gameContainer.classList.remove('danger-mode'); 
    btnPause.classList.add('hidden'); 
    
    endTitle.textContent = title;
    endTitle.style.color = "#ff3333";
    endDesc.textContent = desc;
    overlay.classList.remove('hidden');
}

function winGame() {
    isGameOver = true;
    clearInterval(gameLoop);
    gameContainer.classList.remove('danger-mode');
    btnPause.classList.add('hidden'); 
    
    statusPanel.classList.add('hidden');
    controlsPanel.classList.add('hidden');
    
    finalScreen.classList.remove('hidden');
    gameMessage.textContent = "Оно ждет...";
}

btnPause.addEventListener('click', () => {
    if (!isGameOver && !isPaused) {
        isPaused = true;
        gameContainer.classList.remove('danger-mode'); 
        pauseMenu.classList.remove('hidden');
    }
});

btnResume.addEventListener('click', () => {
    isPaused = false;
    pauseMenu.classList.add('hidden');
    updateBars(); 
});

btnRestartPause.addEventListener('click', startGame);

btnSkip.addEventListener('click', () => {
    isPaused = false;
    pauseMenu.classList.add('hidden');
    stage = 3;
    updatePlantUI();
    triggerLightning();
    winGame();
});

btnLightCandle.addEventListener('click', () => {
    document.body.classList.add('lights-out');
    gameContainer.classList.add('lights-out');
    plant.classList.add('lit-up');
    
    btnLightCandle.classList.add('hidden');
    btnRestartWin.classList.remove('hidden');
    gameMessage.textContent = "Счастливого Хэллоуина!";
    stageText.textContent = "Светильник Джека";
});

function spawnFloatingText(e, text, color) {
    const floater = document.createElement('div');
    floater.textContent = text;
    floater.className = 'floating-text';
    floater.style.left = `${e.clientX - 20}px`;
    floater.style.top = `${e.clientY - 20}px`;
    floater.style.color = color;
    document.body.appendChild(floater);
    setTimeout(() => floater.remove(), 1000);
}

function triggerLightning() {
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);
}

document.getElementById('btnWater').addEventListener('click', (e) => {
    if(!isGameOver && !isPaused) { stats.water += 10; updateBars(); checkGameOver(); spawnFloatingText(e, "+10 💦", "var(--water-blue)"); }
});
document.getElementById('btnLight').addEventListener('click', (e) => {
    if(!isGameOver && !isPaused) { stats.light += 10; updateBars(); checkGameOver(); spawnFloatingText(e, "+10 💡", "#ffd700"); }
});
document.getElementById('btnSoil').addEventListener('click', (e) => {
    if(!isGameOver && !isPaused) { stats.soil += 10; updateBars(); checkGameOver(); spawnFloatingText(e, "+10 🪨", "#d2b48c"); }
});

document.getElementById('btnRestartFail').addEventListener('click', startGame);
btnRestartWin.addEventListener('click', startGame);

startGame();