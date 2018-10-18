var canvas = {};
canvas.id = "canvas";
canvas.width = 640;
canvas.height = 640;
canvas.background = {};
canvas.background.color = "rgb(0, 0, 0)";

//actions to move paddles
input = {};
input.leftPaddleUp = "KeyW";
input.leftPaddleDown = "KeyS";
input.rightPaddleUp = "ArrowUp";
input.rightPaddleDown = "ArrowDown";

//left paddle
var leftPaddle = {};
leftPaddle.name = "left paddle";
leftPaddle.width = 64;
leftPaddle.height = 128;
leftPaddle.image = {};
leftPaddle.image.src = "sprites/pong/paddle.png";
leftPaddle.position = {};
leftPaddle.position.x = 64;
leftPaddle.position.y = 256;
leftPaddle.hitBox = {};
leftPaddle.hitBox.width = 64;
leftPaddle.hitBox.height = 128;
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
rightPaddle.name = "right paddle";
rightPaddle.width = 64;
rightPaddle.height = 128;
rightPaddle.image = {};
rightPaddle.image.src = "sprites/pong/paddle.png";
rightPaddle.position = {};
rightPaddle.position.x = 512;
rightPaddle.position.y = 256;
rightPaddle.hitBox = {};
rightPaddle.hitBox.width = 64;
rightPaddle.hitBox.height = 128;
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
ball.name = "ball";
ball.width = 32;
ball.height = 32;
ball.image = {};
ball.image.src = "sprites/pong/ball.png";
ball.position = {};
ball.position.x = 320;
ball.position.y = 320;
ball.hitBox = {};
ball.hitBox.width = 32;
ball.hitBox.height = 32;
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
    }

    else if(sprite.name === "right paddle"){
        this.velocity.x *= -1;
    }
};

//top wall
var topWall = {};
topWall.name = "top wall";
topWall.position = {};
topWall.hitBox = {};

//bottom wall
var bottomWall = {};
bottomWall.name = "bottom wall";
bottomWall.position = {};
bottomWall.hitbox = {};

//left wall
var leftWall = {};
leftWall.name = "left wall";
leftWall.position = {};
leftWall.hitBox = {};

//right wall
var rightWall = {};
rightWall.name = "right wall";
rightWall.position = {};
rightWall.hitBox = {};

sprites = [];
sprites.push(leftPaddle);
sprites.push(rightPaddle);
sprites.push(ball);

myGame = {};
myGame.canvas  = canvas;
myGame.input = input;
myGame.sprites = sprites;

Game.setup(myGame);
Game.start();