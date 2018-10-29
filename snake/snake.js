var topWall = {};
var bottomWall = {};
var leftWall = {};
var rightWall = {};
var canvas = {};
var input = {};
var timers = {};

var Food = function(){
    this.position = {};
    this.image = {}
    this.hitBox = {};
    this.tags = ['food'];
    this.width = 1;
    this.height = 1;
    this.isSensor = true;
    this.image.src = "../sprites/pong/ball.png";
    this.position.x = canvas.width / 2 + 1;
    this.position.y = canvas.height / 2;
    this.hitBox.width = 1;
    this.hitBox.height = 1;
};

var Body = function(){
    this.position = {};
    this.image = {};
    this.hitBox = {};
    this.oldPosition = {};
    this.tags = ["body"];
    this.width = 1;
    this.height = 1;
    this.isSensor = true;
    this.image.src = "../sprites/pong/ball.png";
    this.hitBox.width = 1;
    this.hitBox.height = 1;
};

canvas.background = {};
canvas.width = 40;
canvas.height = 40;
canvas.background.color = "rgb(0, 0, 0)";
canvas.id = "canvas";
canvas.scalingFactor =  16;

input.up = "KeyW";
input.left = "KeyA";
input.down = "KeyS";
input.right = "KeyD";

timers.move = 400;

topWall.position = {};
topWall.hitBox = {};
topWall.tags = ["wall"];
topWall.width = canvas.width;
topWall.height = 1;
topWall.position.x = 0;
topWall.position.y = -1;
topWall.hitBox.width = canvas.width;
topWall.hitBox.height = 1;

bottomWall.position = {};
bottomWall.hitBox = {};
bottomWall.tags = ["wall"];
bottomWall.width = canvas.width;
bottomWall.height = 1;
bottomWall.position.x = 0;
bottomWall.position.y = canvas.height;
bottomWall.hitBox.width = canvas.width;
bottomWall.hitBox.height = 1;

leftWall.position = {};
leftWall.hitBox = {};
leftWall.tags = ["wall"];
leftWall.width = 1;
leftWall.height = canvas.height;
leftWall.position.x = -1;
leftWall.position.y = 0;
leftWall.hitBox.width = 1;
leftWall.hitBox.height = canvas.height;

rightWall.position = {};
rightWall.hitBox = {};
rightWall.tags = ["wall"];
rightWall.width = 1;
rightWall.height = canvas.height;
rightWall.position.x = canvas.width;
rightWall.position.y = 0;
rightWall.hitBox.width = 1;
rightWall.hitBox.height = canvas.height;

snake = {};
snake.direction = {};
snake.nextDirection = {};
snake.body = [new Body()];
snake.name = "snake";
snake.direction.x = 1;
snake.direction.y = 0;
snake.nextDirection.x = 1;
snake.nextDirection.y = 0;
snake.tail = snake.body[snake.body.length - 1];
snake.tail.oldPosition.x = canvas.width / 2;
snake.tail.oldPosition.y = canvas.height / 2;
snake.head = snake.body[0];
snake.head.tags = ["head"];
snake.head.position.x = canvas.width / 2;
snake.head.position.y = canvas.height / 2;
snake.head.physics = true;
snake.head.onCollision = function(sprite){
    let snake = Game.sprites.withName("snake");
    let timer = Game.timers.byName("move");
    let food;
    let body; 

    if(sprite.tags.includes("wall") || sprite.tags.includes("body")){
        food = new Food();

        for(let index=1; index<snake.body.length; index++){
            body = snake.body[index];
            Game.sprites.remove(body);
        }

        for(let food of Game.sprites.withTag("food")){
            Game.sprites.remove(food);
        }

        
        snake.direction.x = 1;
        snake.direction.y = 0;
        snake.nextDirection.x = 1;
        snake.nextDirection.y = 0;
        snake.head.position.x = canvas.width / 2;
        snake.head.position.y = canvas.height / 2;
    
        snake.body = [snake.head];
        snake.tail = snake.body[snake.body.length - 1];
        snake.tail.oldPosition.x = canvas.width / 2;
        snake.tail.oldPosition.y = canvas.hegith / 2;
        
        Game.sprites.add(food);

        timer.duration = 400;
        timer.start();
    }

    else if(sprite.tags.includes("food")){
        body = new Body();
        food = new Food();
        
        body.position.x = snake.tail.oldPosition.x;
        body.position.y = snake.tail.oldPosition.y;
        snake.body.push(body);
        snake.tail = snake.body[snake.body.length - 1];
        
        food.position.x = _.random(1, canvas.width - 2);
        food.position.y = _.random(1, canvas.height - 2);
        
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
        this.tail.oldPosition.x = this.tail.position.x;
        this.tail.oldPosition.y = this.tail.position.y;

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
        this.nextDirection.y = -1;
    }

    else if(Game.actions.withName("down") && this.direction.y === 0){
        this.nextDirection.x = 0;
        this.nextDirection.y = 1;
    }

    else if(Game.actions.withName("left") && this.direction.x === 0){
        this.nextDirection.x = -1;
        this.nextDirection.y = 0;
    }

    else if(Game.actions.withName("right") && this.direction.x === 0){
        this.nextDirection.x = 1;
        this.nextDirection.y = 0;
    }
};


var food = new Food();


var sprites = [snake, snake.head, topWall, bottomWall, leftWall, rightWall, food];
var myGame = {};
myGame.canvas = canvas;
myGame.sprites = sprites;
myGame.input = input;
myGame.timers = timers;

Game.setup(myGame);
Game.start();