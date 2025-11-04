// global variables
let level, answer, score, playerName;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
Date.textContent  = time();
guess.disabled = true;


playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

function play() {
    let nameInput = document.getElementById("name");
    let rawName = nameInput.value.trim();

    if (rawName === "") {
        msg.textContent = "Please enter your name to play!";
        return;
    }

    playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
    nameInput.value = playerName;
    nameInput.disabled = true;

    score = 0;
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = Number(levelArr[i].value);
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = "Hello, " + playerName + "! Guess a number from 1 to " + level + ".";
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
        msg.textContent = "You guessed " + userGuess + ". Too low, try again, " + playerName + ".";
        msg.textContent += feedback; 
        guess.value = "";
    } else if(userGuess > answer){
        msg.textContent = "You guessed " + userGuess + ". Too high, try again, " + playerName + ".";
        msg.textContent += feedback; 
        guess.value = "";
    } else {
        if (score === 1){
            msg.textContent = "Correct, " + playerName + "! You got it in " + score + " guess. Press play to try again.";
            rating.textContent = "Your score was PERFECT! Great job.";
        }
        else {
            msg.textContent = "Correct! You got it in " + score + " guesses. Press play to try again.";

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
        updateScore();
        reset();
        
    } 

}

function giveUp() {
    score = level;
    msg.textContent = playerName + ", you gave up! The answer was " + answer + ". Your score was " + score + ". Press play to try again.";

    rating.textContent = "Your score was horrible - you gave up!"
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
function time(){
    let d = new Date();
    d = d.getFullYear + "" + d.getTime();
    return d;
}