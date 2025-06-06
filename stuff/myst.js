const params = new URLSearchParams(window.location.search);
const page = params.get('page');
const puzzleContainer = document.getElementById('puzzleContainer');
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
    }).catch((e) => {
        console.log("txt error: ", e);
    });