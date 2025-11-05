// global variables
let level, answer, score, playerName, startTime, timerInterval, gameTimes;
const levelArr = document.getElementsByName("level");
rating = document.getElementById("rating");

const scoreArr = [];
const date = document.getElementById("date");
const clock = document.getElementById("clock");

gameTimes = [];
date.textContent  = time();
setInterval(updateClock, 1000); 
guess.disabled = true;
updateClock();


playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

function play() {
    



    let nameInput = document.getElementById("name");
    let rawName = nameInput.value.trim();


    if (!rawName) {
        msg.textContent = "Please enter your name to play!";
        return;
    }


    playBtn.disabled = true;
    nameInput.disabled = true;
    for (let i = 0; i < levelArr.length; i++) {
        levelArr[i].disabled = true;
    }

    let countdown = 3;
    msg.textContent = "Game starting in " + countdown + "...";

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            msg.textContent = "Game starting in " + countdown + "...";
        } else {
            clearInterval(countdownInterval);
            startGame(rawName);
        }
    }, 1000);
}

function startGame(rawName) {
    startTime = Date.now();
    document.getElementById("timer").textContent = "00:00";
    timerInterval = setInterval(updateTimerDisplay, 10);

    rating.textContent = "";
    playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    document.getElementById("name").value = playerName;

    score = 0;

    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;

    for (let i = 0; i < levelArr.length; i++) {
        if (levelArr[i].checked) {
            level = Number(levelArr[i].value);
        }
    }

    msg.innerHTML = "Hello, <span class='player-name'>" + playerName + "</span>! Guess a number from 1 to " + level + ".";
    answer = Math.floor(Math.random() * level) + 1;
    guess.placeholder = answer;
}


function makeGuess() {
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Please enter a valid number from 1 to " + level + ".";
        return;
    }


    let difference = Math.abs(userGuess - answer);
    let feedback = "";

    if (difference <= level * 0.15) {
        feedback = " You're hot!";
    } else if (difference <= level * 0.3) {
        feedback = " You're warm...";
    } else {
        feedback = " You're cold.";
    }

    score++;

    if(userGuess < answer){
        msg.innerHTML = "You guessed " + userGuess + ". Too low, try again, <span class='player-name'>" + playerName + "</span>.";
        msg.innerHTML += feedback; 
        guess.value = "";
    } else if(userGuess > answer){
        msg.innerHTML = "You guessed " + userGuess + ". Too high, try again, <span class='player-name'>" + playerName + "</span>.";
        msg.innerHTML += feedback; 
        guess.value = "";
    } else {
        clearInterval (timerInterval);
        if (score === 1){
            msg.innerHTML = "Correct, <span class='player-name'>" + playerName + "</span>! You got it in " + score + " guess. Press play to try again.";
            rating.textContent = "Your score was PERFECT! Great job.";
        }
        else {
            msg.innerHTML = "Correct, <span class='player-name'>" + playerName + "</span>! You got it in " + score + " guesses. Press play to try again.";

            z = (score/level * 100)
            z = Math.round(z);
            if (z >= 75){
                rating.textContent = "Your score was good. Try to get it perfect!"
            }
            else if ( z >= 50){
                rating.textContent = "Your score as okay. You can do better."
            }
            else {
                rating.textContent = "Your score was pretty bad. You might need some coaching."
            }

        }
        updateTimers(Date.now());
        updateScore();
        reset();
        
    } 
    
}

function giveUp() {
    clearInterval(timerInterval)
    score = level;
    msg.innerHTML = "<span class='player-name'>" + playerName + "</span>, you gave up! The answer was " + answer + ". Your score was " + score + ". Press play to try again.";

    rating.textContent = "Your score was horrible - you gave up!"
    updateTimers(Date.now());
    updateScore();
    reset();
}

function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.disabled = true;

    
    rating.value = "";
    rating.placeholder = "";

    guess.value = "";
    guess.placeholder = "";

    document.getElementById("name").disabled = false;

    for (let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }

}

function updateScore() {    
    scoreArr.push(score);
    scoreArr.sort((a,b)=> a - b);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Wins: " + scoreArr.length;
    let sum = 0;
    for( let i=0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i<lb.length){
            lb[i].textContent = " " + scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);

}

function updateTimers(end) {
    const dur = end - startTime;
    gameTimes.push(dur);

    const min = Math.min(...gameTimes);
    document.getElementById("fastest").textContent = "Fastest Game: " + (min / 1000).toFixed(2) + "s";

    const sum = gameTimes.reduce((total, time) => total + time, 0);
    const avg = sum / gameTimes.length;
    document.getElementById("avgTime").textContent = "Average Time: " + (avg / 1000).toFixed(2) + "s";
}

function time(){
    let d = new Date();
    let month = d.getMonth() + 1;
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthName = monthNames[month - 1];
    let day = d.getDate();
    let year = d.getFullYear();

    let suffix = ""

    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    } else {
        suffix = "th";
    }


    return monthName + " " + day + suffix + ", " + year;
    
}

function updateClock(){
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}


    

function updateTimerDisplay(){
    const elapsedTime = Date.now() - startTime;
    const seconds = String(Math.floor(elapsedTime / 1000)).padStart(2, '0');
    const hundredths = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, '0');

    document.getElementById("timer").textContent = "Timer: " + seconds + ":" + hundredths;
}