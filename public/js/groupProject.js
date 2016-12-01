//sets up globals to manage user loggin
// var userName = [];
// var password = [];
// var isLoggedIn = false;
// 

//sets up modal when the login button is clicked.
// var hiddenA = document.getElementById('login');
// hiddenA.addEventListener('click', handleLogin);
// 
// var hiddenB = document.getElementById('new-user');
// hiddenB.addEventListener('click', handleCreateNewUser);

function handleLogin() {
    removeModal();
    document.querySelector('.modal-accept-button').addEventListener('click', login);
    button.removeEventListener('click', null);
}

function handleCreateNewUser() {
    removeModal();
    var button = document.querySelector('.modal-accept-button');
    button.addEventListener('click', createNewUser);
    button.removeEventListener('click', null);
}

function getPongPage(userId, password, callback) {
    //sets up get request
    var url = '/pong';
    var getRequest = new XMLHttpRequest();
    getRequest.open('GET', url, true, userId, password);
    //sets up data to pass back in body.
    getRequest.send();
    getRequest.addEventListener("readystatechange", function (e) {
        if (getRequst.readyState == 4 && getRequest.status == 200) {
            alert("It worked!...some how?")
        }

    }, false);

}

// function login() {
//     var user = getModalData();
//     getPongPage(user.userId, user.password, function (err) {
//         if (err) {
//             console.log("error: " + err);
//         }
//     });
// }



// function createNewUser(callback) {
//     var user = getModalData();
//     postNewUser(user,function (err){
//         if (err) {
//             console.log("There was an error posting the new user: " + err);
//         }
//     })
// }
// 
// function postNewUser(user, callback) {
//     var url = '/newuser';
//     var postRequest = new XMLHttpRequest();
//     postRequest.open('POST', url);
//     postRequest.setRequestHeader('Content-Type', 'application/json');
//     console.log(user.userId, user.password);
// 
//     postRequest.addEventListener('load', function (event) {
// 
//         var error;
//         if (event.target.status !== 200) {
//             error = event.target.response;
//         }
//         callback(error);
//     });
// 
//     postRequest.send(JSON.stringify({
//         userId: user.userId,
//         password: user.password
//     }));
// }

