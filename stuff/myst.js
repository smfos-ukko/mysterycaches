const params = new URLSearchParams(window.location.search);
const page = params.get('page');
const container = document.getElementById('container');
const puzzleContainer = document.getElementById('puzzleContainer');
const finalButton = document.getElementById('finalButton');
const finalInput = document.getElementById('finalText');
const replies = {};
let answerPage = '';
let coords = [];

const CSSlink = document.createElement('link');
CSSlink.rel = 'stylesheet';
CSSlink.type = 'text/css';
CSSlink.href = `stuff/${page}/puzzle.css`;
document.getElementsByTagName('head')[0].appendChild(CSSlink); 

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
        removeLoader();
    })
    .catch(error => {
        console.error('HTML haku ei onnistunut', error);
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
    fetch('stuff/myst.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ guess: finalGuess, page: page })
    }).then (res => res.json())
    .then(data => {
        if (data['status'] === 'correct') {
            answerPage = data['ap'];
            coords = data['coords'];
            puzzleSolved();
        } else if (data['status'] === 'cheater') {
            console.log(data);
        } else {
            flashMessage(data['message']);
        }
    });
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
    setTimeout(() => {
        puzzleContainer.style.visibility = 'visible';
        document.getElementsByClassName('loader')[0].style.display = 'none';   
    }, 200);
}