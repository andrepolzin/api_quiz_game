// Once the person clicks the Start Quiz button, the timer should go off from 60seconds
// Also, the question should pop up right away with the options 
// If the person answers correctly the msg "Correct" is displayed and he can move forward to the next question
// Otherwise, the msg "Wrong" is displayed and  but he will be thrown to the next question anyways
// Every time the person answers incorrectly, the time is decreased by 10 seconds
// Once he answers all the questions, the timer will stop, and his initials will be asked
// after that his score will be printed out

let timer = 60;
let questions = [];
let idx = 0;
let timerId;
let correctCount = 0;
let scores = [];


function getQuestions() {

    fetch("https://the-trivia-api.com/v2/questions/").then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        questions = data;
        showQuestion();
    }).catch(function (error) {
        console.log(error);
    });


}


let timerEl = document.querySelector("#timer");
let startButton = document.querySelector(".start-btn");
let welcomeSec = document.querySelector(".welcome-screen");
let questCont = document.querySelector(".question-container");
let questParagraph = document.querySelector(".question-container p")
let questOl = document.querySelector(".question-container ol")
let finalSection = document.querySelector(".final-section");


startButton.addEventListener('click', function () {
    getQuestions();
    welcomeSec.style.display = "none";
    questCont.style.display = "block";
    startTimer();
    correctCount = 0;

})



function showQuestion() {

    if (idx < questions.length) {

        const quiz = questions[idx];
        let eachQuestion = quiz.question.text;
        questParagraph.innerHTML = eachQuestion;

        let answers = quiz.incorrectAnswers.concat(quiz.correctAnswer);
        shuffleArr(answers);

        // This reset the current question/answers
        questOl.innerHTML = "";

        // Populates the lis
        for (let i = 0; i < answers.length; i++) {
            let answer = answers[i];

            let li = `<li class="color-li">${answer}</li>`;
            questOl.insertAdjacentHTML('beforeend', li)
        }

        rightOrWrong()

    }

}


function shuffleArr(arr) {
    let sortedArr = arr.sort((a, b) => b.length - a.length)
    return sortedArr;
}


function rightOrWrong() {
    let questLis = document.querySelectorAll(".question-container ol li")
    let displayMsg = document.querySelector(".right-wrong");

    questLis.forEach(function (li) {

        li.addEventListener('click', function (event) {
            let selectedLi = event.target.innerText;
            let correct = questions[idx].correctAnswer;

            if (selectedLi === correct) {
                displayMsg.innerHTML = "Correct answer";
                correctCount++;
            } else {
                displayMsg.innerHTML = "Wrong answer"
                timer = timer - 5;
            }

            setTimeout(() => {
                if (idx < questions.length - 1) {
                    idx++;
                    showQuestion();
                    displayMsg.innerText = "";
                } else {
                    gameOver();
                }

            }, 1000)
        })
    })

}


function startTimer() {

    timerEl.innerHTML = timer;

    timerId = setInterval(() => {
        if (timer > 0) {
            timer -= 1
        } else {
            timer = 0;
            gameOver();
        }
        timerEl.innerHTML = timer;
    }, 1000);

}


function gameOver() {

    if (timer <= 0) {
        console.log('Game Over');
    }

    clearInterval(timerId);
    questCont.style.display = "none"
    finalSection.style.display = "block";

    let finalScore = document.querySelector(".final-score")
    finalScore.innerText = correctCount * 10;

}


function saveToLocalStorage() {
    let userInitial = document.querySelector(".initials").value;

    if (userInitial.length !== 0) {

        const highscores = JSON.parse(localStorage.getItem('scores')) || [];
        highscores.push({
            initial: userInitial,
            score: correctCount * 10
        });
    
        localStorage.setItem('scores', JSON.stringify(highscores));
    
        // It takes us to a different location
        window.location.replace("/highscores.html");
    } else {
        let h4 = document.querySelector(".final-section h4");

        h4.innerText = "Please fill it out with your initials!"

    }

}

let submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener('click', saveToLocalStorage)