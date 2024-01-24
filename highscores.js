
const highscores = JSON.parse(localStorage.getItem('scores'));
console.log(highscores);
let scores = document.querySelector(".scores-cont");

for (let ele of highscores) {
    let li = `<li>${ele.initial} - ${ele.score} </li>`
    scores.insertAdjacentHTML('beforeend', li);
}

let clearHigh = document.querySelector(".clear-btn");

clearHigh.addEventListener('click', function() {
    localStorage.removeItem('scores');
    scores.innerHTML = "";
})

