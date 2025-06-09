const params = new URLSearchParams(window.location.search);
const page = params.get('page');
const container = document.getElementById('container');
const puzzleContainer = document.getElementById('puzzleContainer');
const finalButton = document.getElementById('finalButton');
const finalInput = document.getElementById('finalText');
const replies = {};
let answerPage = '';
let coords = [];
let flag = 0;

const CSSlink = document.createElement('link');
CSSlink.rel = 'stylesheet';
CSSlink.type = 'text/css';
CSSlink.href = `stuff/${page}/puzzle.css`;
document.getElementsByTagName('head')[0].appendChild(CSSlink); 

fetch(`stuff/${page}/solved.html`)
    .then(response => {
        if (!response.ok) {
            throw new Error('verkkovirhe 0');
        }
        return response.text();
    })
    .then(data => {
        answerPage = `<div id="answerPage">${data}</div>`;
    });

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
        flag++;
        removeLoader();
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
                } else if (currentKey === 'coords') {
                    coords.push(line);
                } else {
                    replies[currentKey].push(line);
                }
            }
        })
    }).then(() => {
        flag++;
        removeLoader();
    }).catch((e) => {
        console.log("txt error: ", e);
    });

const flashMessage = (t, et = '') => {
    const resLines = document.getElementsByClassName('response');
    resLines[0].textContent = t;
    resLines[1].textContent = et;
    Array.from(resLines).forEach((rl) => {
        rl.classList.remove('hiding');
        rl.classList.add('revealed');
    });
    setTimeout(() => {
        Array.from(resLines).forEach((rl) => {
            rl.classList.remove('revealed');
            rl.classList.add('hiding');
        });
    }, 3000);
    setTimeout(() => {
        Array.from(resLines).forEach((rl) => {
            rl.textContent = '';
        });
    }, 4000);
}
    
const checkAnswer = () => {
    let finalGuess = finalInput.value.trim().toLowerCase();
    const taunt = replies.taunts.find(tau => finalGuess.includes(tau.cue));
    if (replies.answer.some(ans => ans === finalGuess)) {
        puzzleSolved();
    } else if (replies.closes.some(close => close === finalGuess)) {
        flashMessage('Polttaa...');
    } else if (taunt) {
        flashMessage('Polttaa...', taunt.taunt);
    } else {
        flashMessage('hmm...');
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
    const all = container.querySelectorAll('*');
    Array.from(all).forEach((e) => {
        e.classList.add('hiding');
    });
    setTimeout(() => {
        container.classList.add('hiding');
   }, 1000);
    setTimeout(() => {
        container.innerHTML = answerPage;
        let cd = document.createElement('div');
        cd.setAttribute('id', 'coordinates');
        cd.innerHTML = `<a href="https://geocaching.com/map#?ll=${coords[0]}.${coords[1]}${coords[2]},${coords[3]}.${coords[4]}${coords[5]}" target="_blank">N${coords[0]}° ${coords[1]}.${coords[2]} E${coords[3]}° ${coords[4]}.${coords[5]}</a>`;
        container.appendChild(cd);
    }, 2000);
    setTimeout(() => {
        container.classList.remove('hiding');
        container.classList.add('revealed');
    }, 3000);
}

const removeLoader = () => {
    console.log(flag);
    if (flag < 2) return;
    setTimeout(() => {
        puzzleContainer.style.visibility = 'visible';
        document.getElementsByClassName('loader')[0].style.display = 'none';   
    }, 200);
}