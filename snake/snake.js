var topWall = {};
var bottomWall = {};
var leftWall = {};
var rightWall = {};
var canvas = {};
var input = {};
var timers = {};

var Food = function(){
    let food = {};
    food.position = {}
    food.image = {}
    food.hitBox = {};
    food.tags = ['food'];
    food.width = 16;
    food.height = 16;
    food.isSensor = true;
    food.image.src = "../sprites/pong/ball.png";
    food.position.x = 0;
    food.position.y = 0;
    food.hitBox.width = 16;
    food.hitBox.height = 16;

    return food;
};

var Body = function(){
    let body = {};
    body.position = {};
    body.image = {};
    body.hitBox = {};
    body.oldPosition = {};
    body.tags = ["body"];
    body.width = 16;
    body.height = 16;
    body.isSensor = true;
    body.image.src = "../sprites/pong/ball.png";
    body.hitBox.width = 16;
    body.hitBox.height = 16;

    return body;
};

canvas.background = {};
canvas.width = 320;
canvas.height = 320;
canvas.background.color = "rgb(0, 0, 0)";
canvas.id = "canvas";

input.up = "KeyW";
input.left = "KeyA";
input.down = "KeyS";
input.right = "KeyD";

timers.move = 200;

topWall.position = {};
topWall.hitBox = {};
topWall.image = {};
topWall.tags = ["wall"];
topWall.width = 320;
topWall.height = 16;
topWall.position.x = 0;
topWall.position.y = 0;
topWall.image.src = "../sprites/pong/paddle.png";
topWall.hitBox.width = 320;
topWall.hitBox.height = 16;

bottomWall.position = {};
bottomWall.hitBox = {};
bottomWall.image = {};
bottomWall.tags = ["wall"];
bottomWall.width = 320;
bottomWall.height = 16;
bottomWall.position.x = 0;
bottomWall.position.y = 304;
bottomWall.image.src = "../sprites/pong/paddle.png";
bottomWall.hitBox.width = 320;
bottomWall.hitBox.height = 16;

leftWall.position = {};
leftWall.hitBox = {};
leftWall.image = {};
leftWall.tags = ["wall"];
leftWall.width = 16;
leftWall.height = 320;
leftWall.position.x = 0;
leftWall.position.y = 0;
leftWall.image.src = "../sprites/pong/paddle.png";
leftWall.hitBox.width = 16;
leftWall.hitBox.height = 320;

rightWall.position = {};
rightWall.hitBox = {};
rightWall.image = {};
rightWall.tags = ["wall"];
rightWall.width = 16;
rightWall.height = 320;
rightWall.position.x = 304;
rightWall.position.y = 0;
rightWall.image.src = "../sprites/pong/paddle.png";
rightWall.hitBox.width = 16;
rightWall.hitBox.height = 320;

snake = {};
snake.direction = {};
snake.nextDirection = {};
snake.body = [Body()];
snake.name = "snake";
snake.direction.x = 16;
snake.direction.y = 0;
snake.nextDirection.x = 16;
snake.nextDirection.y = 0;
snake.tail = snake.body[0];
snake.head = snake.body[snake.body.length - 1];
snake.head.tags = ["head"];
snake.head.position.x = 160;
snake.head.position.y = 160;
snake.head.oldPosition.x = 160;
snake.head.oldPosition.y = 160;
snake.head.physics = true;
snake.head.onCollision = function(sprite){
    let snake = Game.sprites.withName("snake");
    let timer = Game.timers.byName("move");
    let food;
    let body; 

    if(sprite.tags.includes("wall") || sprite.tags.includes("body")){
        food = Food();

        for(let index=1; index<snake.body.length; index++){
            body = snake.body[index];
            Game.sprites.remove(body);
        }

        for(let food of Game.sprites.withTag("food")){
            Game.sprites.remove(food);
        }

        
        snake.direction.x = 16;
        snake.direction.y = 0;
        snake.nextDirection.x = 16;
        snake.nextDirection.y = 0;
        snake.head.position.x = 160;
        snake.head.position.y = 160;
    
        snake.body = [snake.head];
        snake.tail = snake.body[snake.body.length - 1];

        food.position.x = 192;
        food.position.y = 160;
        

        Game.sprites.add(food);

        timer.duration = 200;
        timer.start();
    }

    if(sprite.tags.includes("food")){
        body = Body();
        food = Food();
        
        body.position.x = snake.tail.oldPosition.x;
        body.position.y = snake.tail.oldPosition.y;
        snake.body.push(body);
        snake.tail = snake.body[snake.body.length - 1];
        
        food.position.x = _.random(1, 18) * 16;
        food.position.y = _.random(1, 18) * 16;
        
        Game.sprites.add(body);
        Game.sprites.add(food);
        Game.sprites.remove(sprite);

        timer.duration *= 0.95;
        timer.start();
    }
};

snake.start = function(){
    Game.timers.byName("move").start();
};

snake.timerReady = function(name){
    if(name === "move"){
        this.tail.oldPosition.x = this.position.x;
        this.tail.oldPosition.y = this.position.y;

        for(let index=this.body.length-1; index>0; index--){
            let body = this.body[index];
            let next = this.body[index - 1];
            body.position.x = next.position.x;
            body.position.y = next.position.y;
        }

        this.direction.x = this.nextDirection.x;
        this.direction.y = this.nextDirection.y;
        this.head.position.x += this.direction.x;
        this.head.position.y += this.direction.y;

        Game.timers.byName("move").start();
    }
};

snake.update = function(){
    if(Game.actions.withName("up") && this.direction.y === 0){
        this.nextDirection.x = 0;
        this.nextDirection.y = -16;
    }

    else if(Game.actions.withName("down") && this.direction.y === 0){
        this.nextDirection.x = 0;
        this.nextDirection.y = 16;
    }

    else if(Game.actions.withName("left") && this.direction.x === 0){
        this.nextDirection.x = -16;
        this.nextDirection.y = 0;
    }

    else if(Game.actions.withName("right") && this.direction.x === 0){
        this.nextDirection.x = 16;
        this.nextDirection.y = 0;
    }
};


var food = Food();
food.position.x = 192;
food.position.y = 160; 

var sprites = [snake, snake.head, topWall, bottomWall, leftWall, rightWall, food];
var myGame = {};
myGame.canvas = canvas;
myGame.sprites = sprites;
myGame.input = input;
myGame.timers = timers;

Game.setup(myGame);
Game.start();