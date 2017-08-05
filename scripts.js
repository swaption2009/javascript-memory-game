// initialize game board components
var gameBoard = document.getElementById("placeholder");
var messageTop = document.getElementById("message");
var starRating = document.getElementById("star");
var countMove = document.getElementById("move");
var buttonMessage = document.getElementById("gamecontrol");
var gameTime = document.getElementById("gametime");

// initialize game variables
var timer = "", seconds = 0, mseconds = 0, minutes = 0, hours = 0, t = 0;
var mess = "";
var moves = 0, score = 0;

// initialize game logic
var cardImages = ['angular.svg', 'backbone.svg', 'ember.svg', 'javascript.svg', 'meteor.svg', 'node.svg', 'react.svg', 'vue.svg'];
var solutionArray = cardImages.concat(cardImages);      // create game problem array
var flipArray = [];                                     // create array for comparing 2 open cards
var flippedCard = 0, lastPick = -1;                     // first card index and second card index in flipArray

// start a game
buttonMessage.addEventListener("click", startGame);
startGame();

function startGame() {
  // reset timer for game message and playtime
  clearInterval(timer);
  clearTimeout(t);
  timerX();

  // reset game variables
  seconds = 0, mseconds = 0, minutes = 0, hours = 0, moves = 0, score = 0;

  // shuffle game cards
  shuffleCard(solutionArray);

  // clear HTML DOM and display initial game message & restart button
  gameBoard.innerHTML = "";
  buttonMessage.innerHTML = "Restart Game";
  messageText("Click a card to start");

  // place 16 cards into game board placeholder
  for (var i = 0; i <= ((solutionArray.length) - 1); i++) {
    gameBoard.innerHTML += '<div class="col-md-3 col-xs-4">' +
                            '<div class="col-xs-12 gametile">' +
                            '<img id="card' + i + '" src="img/clickme.png" onclick="pickCard(\'' + solutionArray[i] + '\',\'' + i + '\', this);return false;" class="flipimage">' +
                            '</div>';
  }
}

// implement game logic
function pickCard(a, b, c) { // take 3 parameters from the selected card, ie. a: name in the cards array, b: index in the cards array, c: img html object
  if (flippedCard < 2 && lastPick != b) {       // set only 2 cards can be flipped at the same time and 2nd pick can't be the same as 1st pick
    flipArray[flippedCard] = solutionArray[b];  // store the value of 2 flipped cards into an array
    flipArray[(flippedCard + 2)] = c.id;
    flippedCard++;                              // check how many cards are opened at the same time (1 or 2)
    c.src = "img/" + solutionArray[b];          // show picked card

    if (flippedCard == 2) {
      moves++;                                  // increment number of moves everytime a pair of cards is opened
      if (flipArray[0] == flipArray[1]) {       // check if the value of 1st pick and 2nd pick are the same
        messageText("MATCH FOUND");
        pickAgain();
        score++;

        if (cardImages.length <= score) {
          gameDone();
          }
        } else {
          timer = setInterval(hideCard, 1000);   // if the pair doesn't match, close both cards within 1 second
          messageText("NOT FOUND");
          }
        }

    lastPick = b;
  }
}

// reset flipArray after a pair of cards matches
function pickAgain() {
  flippedCard = 0;
  flipArray = [];
  lastPick = -1;
  clearInterval(timer);
}

// close card & show the back image of card when the pair doesn't match
function hideCard() {
  document.getElementById(flipArray[2]).src = document.getElementById(flipArray[3]).src = "img/clickme.png";
  pickAgain();
}

// reshuffle cards at the beginning of the game
function shuffleCard(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

  // Pick a remaining element...
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;

  // And swap it with the current element.
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
  }
  return array;
}

// check if game is completed. If yes, popup alert window with completed game stats
function gameDone() {
  clearTimeout(t);
  alert("Game Over\n" +
        "Thanks for playing\n" +
        "You finished in " + gameTime.textContent + "\n" +
        "in " + moves + " moves."
  );
}

// display game info
function messageText(message){
  // game message controller
  clearInterval(mess);
  messageTop.innerHTML = message;
  if(message!='Find a match'){
    mess = setInterval(messageText,1000,'Find a match');}

  // star rating controller
  starRating.innerHTML = "";

  if (moves <= 10) {
    starRating.innerHTML += '<p class="glyphicon glyphicon-star"></p>' +
                          '<p class="glyphicon glyphicon-star"></p>' +
                          '<p class="glyphicon glyphicon-star"></p>';
  } else if (moves <= 15) {
    starRating.innerHTML += '<p class="glyphicon glyphicon-star"></p>' +
                          '<p class="glyphicon glyphicon-star"></p>' +
                          '<p class="glyphicon glyphicon-star-empty"></p>';
  } else if (moves <= 20) {
    starRating.innerHTML += '<p class="glyphicon glyphicon-star"></p>' +
                          '<p class="glyphicon glyphicon-star-empty"></p>' +
                          '<p class="glyphicon glyphicon-star-empty"></p>';
  } else {
    starRating.innerHTML += '<p class="glyphicon glyphicon-star-empty"></p>' +
                          '<p class="glyphicon glyphicon-star-empty"></p>' +
                          '<p class="glyphicon glyphicon-star-empty"></p>';
  }

  // number of moves
  countMove.innerHTML = "moves: " + moves;
}

// increment and display game time
function addTime() {
  seconds++;

  if(seconds >= 60) {
    seconds=0;
    minutes++;
    if(minutes >= 60) {
      minutes =0;
      hours++;
    }
  }

  gameTime.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
                          (minutes ? ( minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
                          (seconds > 9 ? seconds : "0" + seconds);
  timerX();
}

// increment time per second
function timerX() {
  t = setTimeout(addTime,1000);
}