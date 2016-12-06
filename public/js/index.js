
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
    document.getElementById('modal-cancel-button').addEventListener('click', hideModal);
    document.getElementById('modal-new-user-button').addEventListener('click', newUser);
    document.getElementById('modal-accept-button').addEventListener('click', logonUser);
}

function logon() {
    removeModal();
}

//need to impliment today!
function newUser() {
    var userId = document.getElementById('login-input-userid').value;
    var password = document.getElementById('login-input-password').value;
    console.log(userId, password);
    if (userId && password) {
        postNewUser(userId, password, function (err) {
            if (err) {
                alert('UserId already taken');
            } else {
                postUserLogin(userId, password, function (err) {
                    if (err) {
                        console.log("there was an error logging in");
                    } else {
                        var url = '/pong/' + userId;
                        window.location = url;
                    }
                });
            }
        });
        hideModal();
    } else {
        alert("Please enter a valid user name and password");
    }
    
}

//This section is a shell for functions we will need to impliment later once we know
//how logging on will work.

//once we know what it means to be loggon it will handle logging off but for now
//redirect to the index page.
function logOff() {
    var userIdHtml = document.getElementById('user-name');
    var userId = userIdHtml.textContent;
    console.log(userId);
    if (userId) {
        url = '/log-out/' + userId;
        req = new XMLHttpRequest();
        req.open('POST', url);
        req.addEventListener('load', function (event) {
            if (event.target.status != 200) {
                console.log("There was an error logging out");
                window.location = '/';
            } else {
                window.location = '/';
            }
        });
        req.send();

    }
}

//Handles logging the user on after the user clicks log on.
function logonUser(UserName) {
    var userNameHTML = document.getElementById('login-input-userid');
    var passwordHTML = document.getElementById('login-input-password');
    var password = passwordHTML.value;
    var userId = userNameHTML.value;
    hideModal();
    postUserLogin(userId, password, function (err) {
        if (err) {
            console.log(err);
        } else {
            var url = '/pong/' + userId;
            window.location = url;
        }
    });

}

//posts the usesr logon
function postUserLogin(userId, password, callback) {
    console.log(userId, password);
    var postUrl = '/login'
    req = new XMLHttpRequest();
    req.open('POST', postUrl);
    req.setRequestHeader('Content-Type', 'application/json');

    req.addEventListener('load', function (event) {
        var error;
        if (event.target.status != 200) {
            error = event.target.response;
        }
        callback(error);
    });

    req.send(JSON.stringify({
        userName: userId,
        password: password
    }));
}

function postNewUser(userId, password, callback) {
    var url = '/newuser';
    var postRequest = new XMLHttpRequest();
    postRequest.open('POST', url);
    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.addEventListener('load', function (event) {
        var error;
        if (event.target.status !== 200) {
             error = event.target.response;
       }
         callback(error);
     });
     postRequest.send(JSON.stringify({
       userId: userId,
         password: password
     }));
  }