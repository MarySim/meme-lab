const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');

const editorScreen = document.getElementById('editorScreen');
const resultScreen = document.getElementById('resultScreen');
const container = document.querySelector('.container');

let memeData = null;
const img = new Image();

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        memeData = data;
        img.src = memeData.templateImage;
    })
    .catch(err => console.error("Ошибка загрузки.", err));

generateBtn.addEventListener('click', () => {
    if (canvas.width !== img.width) {
        canvas.width = img.width;
        canvas.height = img.height;
    }
    
    drawMeme();
    
    editorScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    container.classList.add('wide'); 
});

backBtn.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    editorScreen.classList.remove('hidden');
    container.classList.remove('wide');
});

function drawMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const fontSize = Math.floor(canvas.height * 0.035);
    ctx.font = `${memeData.fontSettings.weight} ${fontSize}px ${memeData.fontSettings.family}`;
    ctx.fillStyle = memeData.fontSettings.color;
    ctx.textAlign = memeData.fontSettings.textAlign;
    ctx.textBaseline = 'top';

    const awesomeValue = document.getElementById('awesome_thing').value || document.getElementById('awesome_thing').placeholder;
    const crazyValue = document.getElementById('crazy_idea').value || document.getElementById('crazy_idea').placeholder;
    const truthValue = document.getElementById('terrible_truth').value || document.getElementById('terrible_truth').placeholder;
    const easyValue = document.getElementById('easyly_way').value || document.getElementById('easyly_way').placeholder;

    const topText = memeData.layout.topBlock.templateText
        .replace('{awesome_thing}', awesomeValue)
        .replace('{crazy_idea}', crazyValue)
        .replace('{terrible_truth}', truthValue);
        
    const bottomText = memeData.layout.bottomBlock.templateText
        .replace('{easyly_way}', easyValue);

    const centerX = canvas.width * 0.25; 
    const maxWidth = canvas.width * 0.46;
    const lineHeight = fontSize * 1.3;

    const topLines = getWrappedLines(topText, maxWidth);
    const bottomLines = getWrappedLines(bottomText, maxWidth);

    const topBlockHeight = topLines.length * lineHeight;
    const bottomBlockHeight = bottomLines.length * lineHeight;

    const topTextY = (canvas.height / 2 - topBlockHeight) / 2;
    const bottomTextY = (canvas.height / 2) + (canvas.height / 2 - bottomBlockHeight) / 2;

    topLines.forEach((line, i) => ctx.fillText(line, centerX, topTextY + (i * lineHeight)));
    bottomLines.forEach((line, i) => ctx.fillText(line, centerX, bottomTextY + (i * lineHeight)));
}

function getWrappedLines(text, maxWidth) {
    const lines = text.split('\n');
    let result = [];

    lines.forEach(line => {
        const words = line.split(' ');
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== '') {
                result.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        result.push(currentLine.trim());
    });
    
    return result;
}

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'maomao_lab.png';
    link.href = canvas.toDataURL('image/png'); 
    link.click();
});