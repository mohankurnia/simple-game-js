let user = localStorage.getItem("username");

const name = document.querySelector('.welcome');
name.innerHTML = "Welcome " + user;