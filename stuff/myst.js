const RED = "&#128308;";
const GREEN = "&#x1f7e2;";

const params = new URLSearchParams(window.location.search);
const page = params.get('page');
console.log(page);

window.onload = () => {
    for (let i = 0; i < 4; i++) {
        document.getElementById('puzzleRows').insertAdjacentHTML('beforeend', `
            <div class="puzzleRow" data-index=${i}>
                <img src="stuff/i${i}.png">
                <input type="text">
                <span>${RED}</span>
            </div>
        `);
    }
}