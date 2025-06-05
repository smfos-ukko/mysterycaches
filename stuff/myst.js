const params = new URLSearchParams(window.location.search);
const page = params.get('page');
const puzzleContainer = document.getElementById('puzzleContainer');

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

