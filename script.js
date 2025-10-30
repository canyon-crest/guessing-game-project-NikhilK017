// global variables

let level, answer, score;
const levelArray = document.getElementsByName("level")

// add event listeners

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

function play(){

    score = 0; //resets score for every new game

    // Disables play button:
    playBtn.disabled = true;


    // Activates Guess button:
    guessBtn.disabled=false;

    // give up button goes here

    // Disabled levels:
    for (let i = 0; i  <levelArray.length; i ++){
        if(levelArray[i].checked){
            level = levelArray[i].value;
        }
        
        levelArray[i].disabled = true;
    }

    msg.textContent = "Guess a number from 1-" + level;
    answer = Math.floor(Math.random() * level) + 1;

    guess.placeholder = answer;

}


function makeGuess(){
    let userGuess = Number(guess.value);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Please enter a valid number between 1 and " + level;
        guess.value = "";
        return;

    }
    
}
