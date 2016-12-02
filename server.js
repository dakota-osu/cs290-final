// sets up various modeules I will need to run the server
var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

// sets up the app and tells the server what port to listen on
var app = express();
var port = process.env.port || 3000;

//setting up server to connect to sql data base
var mysqlHost = "mysql.cs.orst.edu";
var mysqlUser = "cs290_noelcket";
var mysqlPassword = "9959";
var mysqlDB = "cs290_noelcket";

var mysqlConnection = mysql.createConnection({
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDB
});

//make a connection to our data base, connection will persist for as long as
// our server is running
mysqlConnection.connect(function (err) {
    if (err) {
        console.log("== Unable to make connection to MySQL Database.");
        throw err;
    } else {
        console.log("== Connected to: ", mysqlHost, " using user: ", mysqlUser);
    }
});

//sets up the view engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


//creates a variable to test charts in userscores and highscors
var users = {
    "bob": {
        "userName": "bob123",
        "score": "12345"
    },
    "don": {
        "userName": "donE",
        "score": "2"
    }
}

//statically serves files from public
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// required to use sessions
app.use(session({
    secret: 'thisisaverywellkeptsecret',
    resave: false,
    saveUninitialized: true
}));

// add some middlewear to check to see if a user is logged in
// app.use(function(req, res, next) {
// 
//     if(session.loggedIn && session.loggedIn == true) 
//         next();   
//     
//     // the user is not logged in so we take them to the login page
//     res.redirect("")
// });

//rendres the index page
app.get('/', function (req, res) {
    res.render('index-page', {
        pageTitle: 'Welcome!',
        loggedIn: session.loggedIn
    });
});

//renders the highscores page
app.get('/high-scores', function (req, res) {
    res.render('highscore-page', {
        user: users,
        pageTitle: 'High-Scores'
    });
});

//renders the userscores page
app.get('/user-scores', function (req, res) {
    res.render('userscore-page', {
        pageTitle: 'test',
        user: users
    });
});

//renders the pong page
app.get('/pong', function (req, res) {
    res.render('pong-page', {
        pageTitle: 'Welcome to the Pong Zone',
        userName: 'Test'
    });
});

app.post('/score/:userid', function (req, res, next) {
    if (req.body) {
        mysqlConnection.query(
            'INSERT INTO Scores(userName, Score) VALUES (?, ?)',
            [userid, req.body.score], 
                function (err, result) {
                    if (err) {
                        console.log("==Error Adding score into Data Base: " + err)
                        res.status(500).send("error adding score into DB: " + error)
                    }
                    res.status(200).send();
                });
    } else {
        res.status(400).send("no score sent!");
    }
});

app.post('/login', function (req, res, next) {
    
    var userId   = req.params.userId;
    var password = req.params.password;

    console.log(userId, password);
    console.log(req);

    mysqlConnection.query(
        'INSERT INTO PongGame (userName, Password) VALUES (?, ?)',
        [userId, password],
        function(err, result) {
            if(err) {
                console.log("== Error Adding User Into Data Base:", err);
                res.status(500).send("USER NAME already taken please enter a different name!");
            } else {
                session.loggedIn = true;
                res.redirect("/");
            }
        }
    );
    // console.log(req.body);

    // if (req.body) {
    //     mysqlConnection.query(
    //     'INSERT INTO PongGame (userName, Password) VALUES (?,?)', [req.body.userId, req.body.password],
    //     function (err, result) {
    //         if (err) {
    //             console.log("==Error Adding User into Data Base: ", err);
    //             res.status(500).send("USER NAME already taken please enter a different name");
    //         }
    //         res.status(200).send();
    //     });
    // } else {
    //     res.status(400).send("Incompleate data");
    // }
});

//render the 404 page for any page that doesn't exists
app.get('*', function (req, res) {
    res.status(404).render('404-page', {
        pageTitle: '404'
    });
});

// tells the server to listen on the specified port
app.listen(port, function () {
    console.log("==Listening on port ", port)
});
