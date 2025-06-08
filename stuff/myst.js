const params = new URLSearchParams(window.location.search);
const page = params.get('page');
const puzzleContainer = document.getElementById('puzzleContainer');
const finalButton = document.getElementById('finalButton');
const finalInput = document.getElementById('finalText');
const replies = {};

fetch(`stuff/${page}/puzzle.html`)
    .then(response => {
        if (!response.ok) {
            throw new Error('verkkovirhe 1');
        }
        return response.text();
    })
    .then(data => {
        puzzleContainer.innerHTML = data;
        const js = document.createElement('script');
        js.setAttribute('src', `stuff/${page}/puzzle.js`);
        js.type = 'module';
        document.body.appendChild(js);
    })
    .then(() => {
        puzzleContainer.style.visibility = 'visible';
        document.getElementsByClassName('loader')[0].style.display = 'none';
    })
    .catch(error => {
        console.error('HTML haku ei onnistunut', error);
    });

fetch(`stuff/${page}/puzzle.txt`)
    .then(res => res.text())
    .then(text => {
        const lines = text.split(/\r?\n/);
        let currentKey = null;
        lines.forEach(line => {
            if (line.startsWith('#')) {
                currentKey = line.slice(1).toLowerCase();
                replies[currentKey] = [];
            } else if (line && currentKey) {
                if (currentKey === 'taunts') {
                    const [cue, taunt] = line.split('%');
                    replies[currentKey].push({ cue: cue.trim(), taunt: taunt.trim() });
                } else {
                    replies[currentKey].push(line);
                }
            }
        })
        flag = 1;
    }).catch((e) => {
        console.log("txt error: ", e);
    });

const flashMessage = (t, et = '') => {
    console.log(t);
}
    
const checkAnswer = () => {
    let finalGuess = finalInput.value.trim().toLowerCase();
    if (replies.answer.some(ans => ans === finalGuess)) {
        puzzleSolved();
    }
    if (replies.closes.some(close => close === finalGuess)) {
        flashMessage('Polttaa...');
    }
    const taunt = replies.taunts.find(tau => finalGuess.includes(tau.trigger));
    if (taunt) {
        flashMessage('taunts');
    }
}

finalButton.addEventListener('click', checkAnswer);

finalInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
    }
});

const puzzleSolved = () => {
    console.log("solved");
}