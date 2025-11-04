// global variables
let level, answer, score, playerName;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
Date.textContent  = time();
guess.disabled = true;


playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

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
    guess.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        if(levelArr[i].checked){
            level = Number(levelArr[i].value);
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = "Hello, " + playerName + "! Guess a number from 1 to " + level + ".";
    answer = Math.floor(Math.random() * level) + 1;
    // guess.placeholder = answer;
}

function makeGuess() {
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Please enter a valid number from 1 to " + level + ".";
        return;
    }
    score++;
    if(userGuess < answer){
        msg.textContent = "You guessed " + userGuess + ". Too low, try again, " + playerName + ".";   
        guess.value = "";
    } else if(userGuess > answer){
        msg.textContent = "You guessed " + userGuess + ". Too high, try again, " + playerName + ".";
        guess.value = "";
    } else {
        if (score === 1){
            msg.textContent = "Correct, " + playerName + "! You got it in " + score + " guess. Great job! Press play to try again.";
        }
        else {
            msg.textContent = "Correct! You got it in " + score + " guesses. Press play to try again.";
        }
        updateScore();
        reset();
        
    } 
}
function reset(){
    playBtn.disabled = false;
    guessBtn.disabled = true;
    guess.disabled = true;
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