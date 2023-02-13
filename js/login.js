const splashScreen = document.querySelector('.splash');
setTimeout(() => {
  splashScreen.style.opacity = 0;
    setTimeout(() => {
      splashScreen.classList.add('hidden');
    }, 600);
}, 1000);


function check() {
  const username = document.querySelector('.username').value;
  
  localStorage.setItem("username", username);
  location.href = 'rules.html';
}

const userNames = JSON.parse(localStorage.getItem("highestName"));
const userScores = JSON.parse(localStorage.getItem("highestScore"));
const listName = document.querySelector('.highestName');
const listScore = document.querySelector('.highestScore');

// Sort data from localstorage
// userScores.sort(function(a, b) {
//   return a - b;
// });
// userScores.reverse();
// listName.innerHTML = userNames.map(userName => `<li>${userName}</li>`).join(' ');
// listScore.innerHTML = userScores.map(userScore => `<li>${userScore}</li>`).join(' ');

//1) combine the arrays:
var list = [];
for (var j = 0; j < userNames.length; j++) 
  list.push({'name': userNames[j], 'score': userScores[j]});

//2) sort:
list.sort(function(a, b) {
  return ((a.score > b.score) ? -1 : ((a.score == b.score) ? 0 : 1));
});

//3) separate them back out:
for (var k = 0; k < list.length; k++) {
  userNames[k] = list[k].name;
  userScores[k] = list[k].score;
}

listName.innerHTML = list.map(each => `<li>${each.name} : ${each.score}</li>`).join('');