const modal = document.createElement('div');
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.backgroundColor = 'black';
modal.style.color = 'white'; 
modal.style.padding = '20px';
modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
modal.style.zIndex = '1000';
modal.style.cursor = 'move';

const modalContent = `
    <h2>Settings</h2>
    <label for="intervalTime">Interval Time (ms):</label>
    <input type="number" id="intervalTime" value="1000" style="background-color: #555; color: white; border: none; padding: 5px;">
    <br><br>
    <button id="startButton" style="background-color: #444; color: white; border: none; padding: 10px;">Start Logging</button>
    <button id="closeButton" style="background-color: #444; color: white; border: none; padding: 10px;">Close</button>
`;

modal.innerHTML = modalContent;
document.body.appendChild(modal);

let intervalId;

function activewordloglog(intervalTime) {
    intervalId = setInterval(() => {
        const activeWords = document.querySelectorAll('.word.active');
        
        if (activeWords.length === 0) {
            console.log('no word found :(');
            return;
        }

        const words = [];
        activeWords.forEach(word => {
            words.push(word.textContent);
        });

        fetch('http://localhost:5000/receive_words', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ words: words })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }, intervalTime);
}

document.getElementById('startButton').addEventListener('click', () => {
    const intervalTime = parseInt(document.getElementById('intervalTime').value, 10);
    if (intervalId) {
        clearInterval(intervalId);
    }
    activewordloglog(intervalTime);

});

document.getElementById('closeButton').addEventListener('click', () => {
    modal.style.display = 'none'; 
});


let isDragging = false;
let offsetX, offsetY;

modal.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'INPUT') return; 
    isDragging = true;
    offsetX = e.clientX - modal.getBoundingClientRect().left;
    offsetY = e.clientY - modal.getBoundingClientRect().top;
    modal.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
        modal.style.transform = 'none';
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    modal.style.cursor = 'move';
});