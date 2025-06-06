const RED = '🔴';
const GREEN = '🟢';

const bids = {
    0: '1NT - 2C',
    1: '1NT - 2D - 2H'
};

const answers = {
    0: 'stayman',
    1: 'jacoby'
};

const checkList = [];
let flag = 0;

for (let i = 0; i < 2; i++) {
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
        document.getElementById('puzzleContainer').insertAdjacentHTML('beforeend', '<h2 id="finalQ">Milloin meillä?</h2>');
    }
    document.getElementById('finalSet').style.visibility = 'visible';
    flag = 1;
};

let subs = document.getElementsByClassName('subtext');
Array.from(subs).forEach((element, index) => {
    element.addEventListener('input', textChanged);
});


