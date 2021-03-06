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
//set up app to parse the body of requests
//app.use(bodyParser.urlencoded({ extended: true })); don't need couldn't get
//http request to work from modal HTML
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
    });
});

//renders the highscores page
app.get('/high-scores', function (req, res) {
    //querys the server to sort the scores table in assending order and
    // gets the top 10 scores to out put to the page
    var scores = [];
    //sorts the data base
    mysqlConnection.query(
            'ALTER TABLE `Scores` ORDER BY `Score` DESC', function (err, rows) {//i don't care if the table is already sorted
            });

    //gets the top ten scores
    mysqlConnection.query('SELECT * FROM Scores LIMIT 10', function (err, rows) {
        if (err) {
            console.log("Error fetching scores from data base: ", err);
            res.status('500', 'error fetching scores from the database: ', +err);
        } else {

            //if we are sucessfull render datat in a format the
            // template can use.
            scores = [];
            rows.forEach(function (row) {
                scores.push({
                    userName: row.userName,
                    score: row.Score
                });
            });
            res.render('highscore-page', {
                user: scores,
                pageTitle: 'High-Scores'
            });
        }
    });
});

// need to fix
//renders the userscores page
app.get('/user-scores/:userId', function (req, res) {
    mysqlConnection.query('SELECT * FROM Scores WHERE userName LIKE ? LIMIT 10', [req.params.userId], function(err, rows) {
        if(err){
            console.log("error fetching data from server: ", err);
            res.status('500', 'User Does Not Exists');
        } else {
            var scores = [];
            var i = 0;
            rows.forEach(function(row){
                i++;
                scores.push({
                    userName: i + '.',
                    score: row.Score
                });
            });
            res.render('userscore-page', {
                user: scores,
                pageTitle: req.params.userId,
                userName: req.params.userId
            });

        }
    });
});

//renders the pong page
app.get('/pong', function (req, res) {
    res.render('pong-page', {
        pageTitle: 'Welcome to the Pong Zone'
    });
});

//posts a user scroe.
app.post('/score/:userid', function (req, res, next) {
    if (req.body) {
        mysqlConnection.query(
            'INSERT INTO Scores(userName, Score) VALUES (?, ?)',
            [req.body.userName , req.body.score], 
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

// handles when some one is loggon and wants the pong page
app.get('/pong/:userId', function (req, res) {
    var userId = req.params.userId;
    mysqlConnection.query('SELECT * FROM Users WHERE userName LIKE ?', [userId], function (err, rows) {

        if (err) {
            console.log("SQL ERROR: ", err);
            res.status('500', 'ERROR with Data Base');
        } else {
            if (rows[0].Loggon) {
                res.render('pong-page', {
                    pageTitle: 'Welcome to the Pong Zone!',
                    userName: userId
                });
            } else
                res.redirect('/');
        }
    });

});

//need to fix
//handles when some one wants the high scores page and is loggon
app.get('/high-scores/:userId', function (req, res) {
    userId = req.params.userId
    //querys the server to sort the scores table in assending order and
    // gets the top 10 scores to out put to the page
    var scores = [];
    //sorts the data base
    mysqlConnection.query(
            'ALTER TABLE `Scores` ORDER BY `Score` DESC', function (err, rows) {//i don't care if the table is already sorted
            });

    //gets the top ten scores
    mysqlConnection.query('SELECT * FROM Scores LIMIT 10', function (err, rows) {
        if (err) {
            console.log("Error fetching scores from data base: ", err);
            res.status('500', 'error fetching scores from the database: ', +err);
        } else {

            //if we are sucessfull render datat in a format the
            // template can use.
            scores = [];
            rows.forEach(function (row) {
                scores.push({
                    userName: row.userName,
                    score: row.Score
                });
            });
            res.render('highscore-page', {
                user: scores,
                pageTitle: 'High-Scores',
                userName: userId
            });
        }
    });
});

// handles when the user wants the index page when they are logged on
app.get('/:userId', function (req, res) {
    userId = req.params.userId;
    mysqlConnection.query('SELECT * FROM Users WHERE userName LIKE ?', [userId], function (err, rows) {
        if (rows[0].Loggon) {
            var Welcome = 'Welcome' + userId + '!';
            res.render('index-page', {
                pageTile: 'Welcome!',
                userName: userId
            });
        } else {
            res.redirect('/');
        }
    });
});

app.post('/login', function (req, res, next) {
    var userId = req.body.userName;
    var password = req.body.password;
    if (userId) {
        mysqlConnection.query(
           'SELECT * FROM Users WHERE userName LIKE ?', [userId], function (err, rows) {
               if (err) {
                   console.log("==No Such user");
                   res.status(500).send("NO SUCH USER EXISTS");
               } else if(!rows[0]) {
               res.status(500).send("NO SUCH USER EXISTS");
               } else if (rows[0].Password == password) {
                   mysqlConnection.query('UPDATE Users SET Loggon = TRUE  WHERE userName LIKE ?', [userId], function (err) {
                       if (err) {
                           console.log("server error:", err);
                           res.satus(500).send("Error from data base");
                       } else {
                           res.status(200).send();
                       }
            
                   });
               }

           });
    }
});

//deals with when the user wants to login
app.post('/newuser', function (req, res, next) {
    
    var userId   = req.body.userId;
    var password = req.body.password;

    mysqlConnection.query(
        'INSERT INTO Users (userName, Password) VALUES (?, ?)',
        [userId, password],
        function(err, result) {
            if(err) {
                console.log("== Error Adding User Into Data Base:", err);
                res.status(500).send("USER NAME already taken please enter a different name!");
            } else {
                res.status(200).send();
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

app.post('/log-out/:userId', function (req, res) {
    var userId = req.params.userId;
    mysqlConnection.query('UPDATE Users SET Loggon = false  WHERE userName LIKE ?', [userId], function (err, rows) {
        if (err) {
            console.log("LogOut Error: ", err);
            res.status(500).send("Error logging out");

        } else
            res.status(200).send();
    });
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
