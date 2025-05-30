window.onload = () => {
    for (let i = 0; i < 4; i++) {
        document.getElementById('puzzleRows').insertAdjacentHTML('beforeend', `
            <div id="row${i}" class="puzzleRow">
                <img src="stuff/i${i}.png">
                <input id="input${i}" type="text">
                <span>&#128308;</span>
            </div>
        `);
    }
}