var gamePiece;
var obstacles = [];
var score;
const scores = [];
let intScores = [];
var slices = [];
// const music = new sound("/assets/audio/theme.wav");
var storedScores = JSON.parse(localStorage.getItem('highscore')) || [];
const arrayString = JSON.stringify(scores);

let currentHighestListName = [...new Set(JSON.parse(localStorage.getItem("highestName")))];
let currentHighestListScore = [...new Set(JSON.parse(localStorage.getItem("highestScore")))];

function initScore() {
  // Get from localstorage
  // storedScores = JSON.parse(localStorage.getItem("highscore"));
  storedScores.sort(function(a, b) {
    return a - b;
  });
  storedScores.reverse();
  slices = storedScores.slice(0, 5);
  // Display localstorage data on html
  var list = document.getElementById("highScores");
  list.innerHTML = slices.map(slice => `<li>${slice}</li>`).join('');

}

function startGame() {
  gamePiece = new component(30, 30, "red", 10, 120);
  // gamePiece.gravity = 0.05;
  score = new component("30px", "Arial", "lightblue", 280, 40, "text");
  music.play();
  gameArea.start();
};

// function sound(src) {
//   this.sound = document.createElement("audio");
//   this.sound.src = src;
//   this.sound.setAttribute("preload", "auto");
//   this.sound.setAttribute("controls", "none");
//   this.sound.style.display = "none";
//   document.body.appendChild(this.sound);
//   this.play = function(){
//     this.sound.play();
//   }
//   this.stop = function(){
//     this.sound.pause();
//   }
// }

var gameArea = {
  canvas : document.createElement("canvas"),
    start: function() {
      this.canvas.width = 600;
      this.canvas.height = 400;
      this.canvas.className = "canvas";
      this.context = this.canvas.getContext("2d");

      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);

      window.addEventListener('keydown', function(e) {
        gameArea.key = e.keyCode;
      });
      window.addEventListener('keyup', function(e) {
        gameArea.key = false;
      })
    },
    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
      clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type) {
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;

  this.update = function() {
    ctx = gameArea.context;
    if(this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  this.newPos = function() {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  }

  this.hitBottom = function() {
    var rockBottom = gameArea.canvas.height - this.height;
    if(this.y > rockBottom) {
      this.y = rockBottom;
      this.gravitySpeed = 0;
    }
  }

  this.crashWith = function(otherObj) {
    var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    var otherLeft = otherObj.x;
    var otherRight = otherObj.x + (otherObj.width);
    var otherTop = otherObj.y;
    var otherBottom = otherObj.y + (otherObj.height);
    var crash = true;

    if((bottom < otherTop) || (top > otherBottom) || (right < otherLeft) || (left > otherRight)) {
      crash = false;
    }

    return crash;
  }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  
  for(i = 0; i < obstacles.length; i += 1) {
    if(gamePiece.crashWith(obstacles[i])) {
      gameArea.stop();
      getScore();
      music.stop();
      return;
    }
  }

  gameArea.clear();

  // Arrow keys controller
  gamePiece.speedX = 0;
  gamePiece.speedY = 0;
  // Left Arrow
  if(gameArea.key && gameArea.key == 37) {
    gamePiece.speedX = -2;
  }
  // Right Arrow
  if(gameArea.key && gameArea.key == 39) {
    gamePiece.speedX = 2;
  }
  // Up Arrow
  if(gameArea.key && gameArea.key == 38) {
    gamePiece.speedY = -2;
  }
  // Down Arrow
  if(gameArea.key && gameArea.key == 40) {
    gamePiece.speedY = 2;
  }

  gameArea.frameNo += 1;
  if(gameArea.frameNo == 1 || everyInterval(150)) {
    x = gameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    minGap = 50;
    maxGap = 200;

    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    obstacles.push(new component(10, height, "green", x, 0));
    obstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  } 

  for(i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -1;
    obstacles[i].update();
  }

  score.text = "Score: " + gameArea.frameNo;
  score.update();
  gamePiece.newPos();
  gamePiece.update();  
};

function everyInterval(n) {
  if((gameArea.frameNo / n) % 1 == 0) { return true };
  return false;
}

// function accelerate(n) {
//   gamePiece.gravity = n;
// }

// Get Score 
// gameArea.frameNo

function restart() {
  // gameArea.stop();
  // gameArea.clear();
  // startGame();
  document.location.reload(true);
}

function getScore() { 
  // Store to localstorage
  storedScores.push(gameArea.frameNo);
  localStorage.setItem("highscore", JSON.stringify(storedScores));

  // Get from localstorage
  storedScores = JSON.parse(localStorage.getItem("highscore"));
  
  
  // Add limit to localstorage
  if(storedScores.length > 5) {
    // highScore = [];
    // localStorage.clear();
    storedScores.push(gameArea.frameNo);
    
    // storedScores.pop();
    // return;
  }

  // Sort data from localstorage
  storedScores.sort(function(a, b) {
    return a - b;
  });
  storedScores.reverse();
  slices = storedScores.slice(0, 5);
  
  // Display localstorage data on html
  var list = document.getElementById("highScores");
  list.innerHTML = slices.map(slice => `<li>${slice}</li>`).join('');
}

let user = localStorage.getItem("username");

const name = document.querySelector('.user');
name.innerHTML = user + " High Score";


////////////////////////////////////
// Change Background 
const backgroundImage = document.querySelectorAll('.background__option img');

backgroundImage.forEach((e) => {
  e.addEventListener('click', () => {
    let clickedImage =  e.src;
    document.querySelector('.canvas').style.backgroundImage = 'url(' + clickedImage + ')';
  })
});



////////////////////////////////////
// Logout Function
function logout() {
  // Get current username
  let currentUsername = localStorage.getItem("username");
  // Get the first index of current player score
  let currentHighest = slices[0];
  // Get the highest score from localstorage
  let highestList = JSON.parse(localStorage.getItem("highestScore")) || [];
  // Compare the score
  if(highestList.length === 0) {
    currentHighestListScore.push(currentHighest);
    currentHighestListName.push(currentUsername);
  } else {
    highestList.map(highest => {
      // Store the highest score with username
      // if the score more high store it from first index
      if(highest > currentHighest) {
        currentHighestListScore.push(currentHighest);
        currentHighestListName.push(currentUsername);
      } else {
        // else store it from last index
        currentHighestListScore.unshift(currentHighest);
        currentHighestListName.unshift(currentUsername);
      }
    })
  }
  
  console.log(highestList);
  // Store Highest Score & Name to Localstorage
  localStorage.setItem("highestScore", JSON.stringify([...new Set(currentHighestListScore)]));
  localStorage.setItem("highestName", JSON.stringify([...new Set(currentHighestListName)]));

  window.localStorage.removeItem('highscore');
  window.location.href = 'index.html';
}