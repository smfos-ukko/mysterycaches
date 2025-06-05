const RED = "&#128308;";
const GREEN = "&#x1f7e2;";

const params = new URLSearchParams(window.location.search);
const page = params.get('page');

fetch(`stuff/${page}.html`)
    .then(response => {
        if (!response.ok) {
            throw new Error('verkkovirhe 1');
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('puzzleContainer').innerHTML = data;
    })
    .catch(error => {
        console.error('HTML haku ei onnistunut', error);
    });

const js = document.createElement('script');
js.setAttribute('src', `stuff/${page}.js`);
document.body.appendChild(js);