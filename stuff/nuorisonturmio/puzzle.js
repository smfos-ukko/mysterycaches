const RED = '🔴';
const GREEN = '🟢';
const YELLOW = '🟡';
let timer = null;
const timerInterval = 1000;

const bids = {
    0: '1NT-2C',
    1: '1S-3S-4NT',
    2: '1H-3D-4H',
    3: '1NT-2D-2H',
    4: '(1S)-2S',
    5: '1H-4C',
    6: '1NT-4H-4S',
    7: '4D-4S'
};

let flag = 0;

for (let i = 0; i < 8; i++) {
    document.getElementById('puzzleRows').insertAdjacentHTML('beforeend', `
        <div class="puzzleRow" data-index=${i}>
            <img src="stuff/nuorisonturmio/i${i}.png">
            <div class="stacked">
                <h2>${bids[i]}</h2>
                <div>
                    <input type="text" class="subtext" data-index=${i}>
                    <span>${RED}</span>
                </div>
            </div>
        </div>
    `);
}

let textChanged = (e) => {
    if (flag === 1) return;
    const inputs = document.querySelectorAll('input[data-index]');
    const answ = [];
    let lamp = e.target.nextElementSibling;
    lamp.textContent = YELLOW;
    clearTimeout(timer);
    timer = setTimeout(() => {
        inputs.forEach(input => {
            const index = parseInt(input.dataset.index, 10);
            answ[index] = input.value.trim().toLowerCase();
        });
        fetch('stuff/nuorisonturmio/puzzle.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ msg: answ })
        }).then (res => res.json())
        .then(data => {
            if (data['status'] == 'complete') {
                inputs.forEach((input, i) => {
                    lamp = input.nextElementSibling;
                    lamp.textContent = GREEN;
                });
                document.getElementById('puzzleContainer').insertAdjacentHTML('beforeend', data['elms']);
                let appendix = document.getElementById('appendix');
                appendix.classList.remove('hidden');
                appendix.classList.add('revealed');
                document.getElementById('finalSet').style.visibility = 'visible';
                flag = 1;
                console.log('complete');
            } else {
                inputs.forEach((input, i) => {
                    lamp = input.nextElementSibling;
                    console.log(data.list[i]);
                    if (!lamp) return;
                    if (data.list[i] == 1) {
                        lamp.textContent = GREEN;
                    } else {
                        lamp.textContent = RED;
                    }
                });
            }
        });
    }, timerInterval);
    /*
    if (bidGuess == answers[no]) {
        lamp.textContent = GREEN;
        checkList[no] = 1;
    } else {
        lamp.textContent = RED;
        checkList[no] = 0;
    }
    if (checkList.every(num => num === 0) && flag == 0) {
        document.getElementById('puzzleContainer').insertAdjacentHTML('beforeend', '<div id="appendix" class="hidden"><br/><img src="stuff/nuorisonturmio/b19.png"><h2 id="finalQ">19?</h2></div>');
        let appendix = document.getElementById('appendix');
        appendix.classList.remove('hidden');
        appendix.classList.add('revealed');
    }*/
    
};

let subs = document.getElementsByClassName('subtext');
Array.from(subs).forEach((element, index) => {
    element.addEventListener('input', textChanged);
});


