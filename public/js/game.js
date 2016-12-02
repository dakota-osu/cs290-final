
// so we can add event listeners later
var gameButton = document.getElementById('start-pong-game-button');
var gameStarted = false;



    //gets user name for future posts to the server.
    //thomas: not elegent but will do the job
    var userNameHtml = document.getElementById('user-name');
    var userName = userNameHtml.textContent;
    console.log(userNameHtml);
    console.log(userName);

    const BALL_SPEED_MIN = 3;
    const BALL_SPEED_MAX = 6;

    const PADDLE_SPEED = 3;


    function Entity(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // these values should be clamped between -1 and 1
        this.vx = 0;
        this.vy = 0;

        this.speed = 0;
        this.color = "#000";

        this.update = function() {
            this.x += this.vx * this.speed;
            this.y += this.vy * this.speed;
        }; 

        this.draw = function(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        };

        this.collidesWith = function(other) {
            return this.y + this.height > other.y  &&
                this.y < other.y + other.height &&
                this.x + this.width > other.x   &&
                this.x < other.x + other.width;
        };
    };

    var game = {
        ctx: 0,
        canvas: 0,
        entities: [],
        score: 0
    };

    function getRand(min, max) {
        var rand = Math.random();
        var speed = min + rand * (max - min);
        if(rand > 0.5)
            speed *= -1;
        return speed;
    }

    function startGame() {
        gameStarted = true;
        game.canvas = document.getElementById("pong-canvas");

    
        game.ctx    = game.canvas.getContext("2d");

        var ball = new Entity(game.canvas.width / 2 - 5, game.canvas.height / 2 - 5, 10, 10);
        ball.vx  = getRand(-1, 1) + 0.2; 
        ball.vy  = getRand(-1, 1);
        ball.speed = getRand(BALL_SPEED_MIN, BALL_SPEED_MAX);

        var player = new Entity(0, 0, 10, 60);
        player.y = game.canvas.height / 2 - player.height / 2;
        player.speed = PADDLE_SPEED;

        window.addEventListener('keydown', (e) => {
            switch(e.code) {
                case "KeyS":
                case "ArrowDown":
                    player.vy = 1;
                    break;
                case "KeyW":
                case "ArrowUp":
                    player.vy = -1;
                    break;
                default:
                    break;
            };
        });

        window.addEventListener('keyup', (e) => {
            player.vy = 0;
        }); 

        game.entities.push(ball);
        game.entities.push(player);
        game.entities.push(new Entity(game.canvas.width - 10, game.canvas.height / 2 - 30, 10, 60));

        setInterval(run, 20)
    }

    function run() {
    
        // have some check for playing the game or not

        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.entities.forEach(function(entity){
            entity.update();
            entity.draw(game.ctx);
        });

        // ball checks
        // check for out of bounds
        if (game.entities[0].x < 0 || game.entities[0].x > game.canvas.width) {
            //postScore(userName);
            gameButton.disabled = false;
            postScore(userName);

        }

        // check collision with paddles
        if(game.entities[0].collidesWith(game.entities[1]) || game.entities[0].collidesWith(game.entities[2])) {
            if(game.entities[0].speed <= BALL_SPEED_MAX)
                game.entities[0].speed += 0.05;
            game.entities[0].vx *= -1;
            game.score++; 
        }

        // check for hit top and bottom
        if(game.entities[0].y < 0 || game.entities[0].y > game.canvas.height - game.entities[0].height) {
            game.entities[0].vy *= -1;
        }

        // perfect AI, 'cuase lazy <-thomas: lol
        game.entities[2].y = game.entities[0].y - game.entities[2].height / 2 + game.entities[0].height / 2;

        // make sure that paddels are in bounds fully
        for(var i = 1; i < 3; i++) {
            if(game.entities[i].y < 0)
                game.entities[i].y = 0;
            else if(game.entities[i].y + game.entities[i].height >= game.canvas.height)
                game.entities[i].y = game.canvas.height - game.entities[i].height;
        }

        game.ctx.fillStyle = "#00FF00";
        game.ctx.fillText("Score: " + game.score, 8, 20);
    }

//Posts the user score to the server
    function postScore(user) {
        if (user) {
            var postRequest = new XMLHttpRequest();
            var url = "/score/" + user;
            postRequest.open('POST', url);
            postRequest.setRequestHeader('Content-Type', 'application/json');
            postRequest.addEventListener('load', function (event) {
                var error;
                if (event.target.status !== 200) {
                    error = event.target.response;
                    console.log("there was an issue posting the score: ", error);
                } 
            });

            postRequest.send(JSON.stringify({
                userName: user,
                score: game.score
            }));
        } //else do nothing because we can't post a score with out a user name
    }


    function restartGame() {
        game.score = 0;
        game.entities[0].x = game.canvas.width / 2 - game.entities[0].width / 2;
        game.entities[0].vx = getRand(-1, 1);
        game.entities[0].y = game.canvas.height / 2 - game.entities[0].height / 2;
        game.entities[0].vy = getRand(-1, 1);
        game.entities[0].speed = getRand(BALL_SPEED_MIN, BALL_SPEED_MAX);
        gameButton.disabled = true;
    }

    gameButton.addEventListener('click', function () {
        if (gameButton.disable != true) {
            if (gameStarted == false) {
                startGame();
                gameButton.disabled = true;
            } else {
                restartGame();
            }
        }
    });