const RED = '🔴';
const GREEN = '🟢';

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

const answers = {
    0: 'stayman',
    1: 'blackwood',
    2: 'bergen',
    3: 'jacoby',
    4: 'michaels',
    5: 'splinter',
    6: 'texas',
    7: 'namyats'
};

const checkList = [];
let flag = 0;

for (let i = 0; i < 8; i++) {
    document.getElementById('puzzleRows').insertAdjacentHTML('beforeend', `
        <div class="puzzleRow" data-index=${i}>
            <img src="stuff/i${i}.png">
            <div class="stacked">
                <h2>${bids[i]}</h2>
                <div>
                    <input type="text" class="subtext">
                    <span>${RED}</span>
                </div>
            </div>
        </div>
    `);
    checkList.push(0);
}

let textChanged = (e) => {
    let no = e.target.closest('.puzzleRow').getAttribute('data-index');
    let bidGuess = e.target.value.toLowerCase();
    let lamp = e.target.nextElementSibling;
    if (bidGuess == answers[no]) {
        lamp.textContent = GREEN;
        checkList[no] = 1;
    } else {
        lamp.textContent = RED;
        checkList[no] = 0;
    }
    if (checkList.every(num => num === 0) && flag == 0) {
        document.getElementById('puzzleContainer').insertAdjacentHTML('beforeend', '<div id="appendix" class="hidden"><br/><img src="stuff/b19.png"><h2 id="finalQ">19?</h2></div>');
        let appendix = document.getElementById('appendix');
        appendix.classList.remove('hidden');
        appendix.classList.add('revealed');
    }
    document.getElementById('finalSet').style.visibility = 'visible';
    flag = 1;
};

let subs = document.getElementsByClassName('subtext');
Array.from(subs).forEach((element, index) => {
    element.addEventListener('input', textChanged);
});


