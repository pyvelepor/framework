var canvas = {};
canvas.background = {};
canvas.id = "canvas";
canvas.width = 640;
canvas.height = 640;
canvas.background.color = "rgb(0, 0, 0)";

//actions to move paddles
input = {};
input.leftPaddleUp = "KeyW";
input.leftPaddleDown = "KeyS";
input.rightPaddleUp = "ArrowUp";
input.rightPaddleDown = "ArrowDown";

//left paddle
var leftPaddle = {};
leftPaddle.hitBox = {};
leftPaddle.position = {};
leftPaddle.image = {};
leftPaddle.name = "left paddle";
leftPaddle.width = 16;
leftPaddle.height = 96;
leftPaddle.image.src = "sprites/pong/paddle.png";
leftPaddle.position.x = 64 + 48;
leftPaddle.position.y = 256;
leftPaddle.hitBox.width = 16;
leftPaddle.hitBox.height = 96;
leftPaddle.physics = true;
leftPaddle.update = function(){
    this.velocity.x = 0;
    this.velocity.y = 0;

    if(Game.actions.withName("leftPaddleUp")){
        this.velocity.y = -1.5;
    }

    else if(Game.actions.withName("leftPaddleDown")){
        this.velocity.y = 1.5;
    }
};

//right paddle
var rightPaddle = {};
rightPaddle.image = {};
rightPaddle.position = {};
rightPaddle.hitBox = {};
rightPaddle.name = "right paddle";
rightPaddle.width = 16;
rightPaddle.height = 96;
rightPaddle.image.src = "sprites/pong/paddle.png";
rightPaddle.position.x = 511;
rightPaddle.position.y = 256;
rightPaddle.hitBox.width = 16;
rightPaddle.hitBox.height = 96;
rightPaddle.physics = true;
rightPaddle.update = function(){
    this.velocity.x = 0;
    this.velocity.y = 0;

    if(Game.actions.withName("rightPaddleUp")){
        this.velocity.y = -1.5;
    }

    else if(Game.actions.withName("rightPaddleDown")){
        this.velocity.y = 1.5;
    }
};

//ball
var ball = {};
ball.image = {};
ball.position = {};
ball.hitBox = {};
ball.name = "ball";
ball.width = 16;
ball.height = 16;
ball.image.src = "sprites/pong/ball.png";
ball.position.x = 320;
ball.position.y = 320;
ball.hitBox.width = 16;
ball.hitBox.height = 16;
ball.physics = true;
ball.start = function(){
    let number = Math.random();

    if(number < 0.5){
        this.velocity.x = -0.5;
        this.velocity.y = -0.5;
    }

    else{
        this.velocity.x = 0.5;
        this.velocity.y = 0.5;
    }
}

ball.onCollision = function(sprite){
    if(sprite.name === "left paddle"){
        this.velocity.x *= -1;

        //Prevents ball from moving faster than ~4 pixels per frame
        if(Game.vectors.magnitude(this.velocity) < 4){
            this.velocity = Game.vectors.scale(1.25, this.velocity);
        }
    }

    else if(sprite.name === "right paddle"){
        this.velocity.x *= -1;

        //Prevents ball from moving faster than ~4 pixels per frame
        if(Game.vectors.magnitude(this.velocity) < 4){
            this.velocity = Game.vectors.scale(1.25, this.velocity);

        }
    }

    else if(sprite.name === "top wall"){
        this.velocity.y *= -1;
    }

    else if(sprite.name === "bottom wall"){
        this.velocity.y *= -1;
    }

    else{
        this.position.x = 320;
        this.position.y = 320;
    }
};

//top wall
var topWall = {};
topWall.position = {};
topWall.hitBox = {};
topWall.name = "top wall";
topWall.position.x = 0;
topWall.position.y = 0;
topWall.hitBox.width = 640;
topWall.hitBox.height = 16;

//bottom wall
var bottomWall = {};
bottomWall.position = {};
bottomWall.hitBox = {};
bottomWall.name = "bottom wall";
bottomWall.position.x = 0;
bottomWall.position.y = 624;
bottomWall.hitBox.width = 640;
bottomWall.hitBox.height = 16;

//left wall
var leftWall = {};
leftWall.position = {};
leftWall.hitBox = {};
leftWall.name = "left wall";
leftWall.position.x = 0;
leftWall.position.y = 0;
leftWall.hitBox.width = 64;
leftWall.hitBox.height = 640;

//right wall
var rightWall = {};
rightWall.position = {};
rightWall.hitBox = {};
rightWall.name = "right wall";
rightWall.position.x = 640 - 64;
rightWall.position.y = 0;
rightWall.hitBox.width = 64;
rightWall.hitBox.height = 640;

sprites = [];
sprites.push(leftPaddle);
sprites.push(rightPaddle);
sprites.push(ball);
sprites.push(topWall);
sprites.push(bottomWall);
sprites.push(leftWall);
sprites.push(rightWall);

myGame = {};
myGame.canvas  = canvas;
myGame.input = input;
myGame.sprites = sprites;

Game.debug = true;
Game.setup(myGame);
Game.start();