//Will pull code out of game.js that isn't needed in game.js
//that code will go here and this file will be included only in the index page
var isLoggedIn = false;
var logOnButton = document.getElementById('login-button');
// creats an event listener if the button exists
if (logOnButton) {
    logOnButton.addEventListener('click', logon);
}


// creats event listener if the button exists
var logOffButton = document.getElementById('logout-button');
if (logOffButton) {
    logOffButton.addEventListener('click', logOff);
}

//hides modal from the user
function hideModal() {
    document.getElementById("modal-backdrop").setAttribute('class', 'hidden');
    document.getElementById("add-note-modal").setAttribute('class', 'hidden');

    //clears input of modal
    var modalIn = document.querySelectorAll('input');
    for (var i = 0; i < modalIn.length; i++) {
        modalIn[i].value = '';
    }
}


// makes the modal visable to the user and sets up event listeners that go with the modal
function removeModal() {
    //makes modal visable
    var t = document.querySelectorAll('.hidden');
    console.log('clicked');
    for (var i = 0; i < t.length; i++) {
        t[i].removeAttribute('class');
    }
    //sets up event listeners on modal buttons
    document.querySelector('.modal-close-button').addEventListener('click', hideModal);
    document.querySelector('.modal-cancel-button').addEventListener('click', hideModal);
    document.querySelector('.modal-accept-button').addEventListener('click', logonUser);
    document.querySelector('.modal-newuser-button').addEventListener('click', newUser);
}

function newUser() {
    hideModal();
    console.log("==you have attempted to create a new user");
}

//This section is a shell for functions we will need to impliment later once we know
//how logging on will work.

//once we know what it means to be loggon it will handle logging off but for now
//redirect to the index page.
function logOff() {
    window.location = '/';
}

// once we know what logging on actully means we will call this function and do the work
// for right now pull up the modal. and add an event listeners to the accept buttons.
function logon() {
    removeModal();
    console.log("== attempted to log on");
}


//Handles logging the user on after the user clicks log on.
function logonUser() {
    hideModal();
    console.log("==sent info to server");
}
