var canvas = {};
var input = {};
var timers = {};
var sprites;

var snake;
var food;
var topWall = {};
var bottomWall = {};
var leftWall = {};
var rightWall = {};

var Food = function(){
    this.position = {};
    this.image = {}
    this.hitBox = {};
    this.tags = ['food'];
    this.width = 1;
    this.height = 1;
    this.isSensor = true;
    this.image.src = "../sprites/pong/ball.png";
    this.position.x = Math.trunc(canvas.width / 2 + 1);
    this.position.y = Math.trunc(canvas.height / 2);
    this.hitBox.width = 1;
    this.hitBox.height = 1;
};

var SnakePiece = function(){
    this.position = {};
    this.image = {};
    this.hitBox = {};
    this.oldPosition = {};
    this.tags = ["snake piece"];
    this.width = 1;
    this.height = 1;
    this.isSensor = true;
    this.image.src = "../sprites/pong/ball.png";
    this.hitBox.width = 1;
    this.hitBox.height = 1;
};

canvas.background = {};
canvas.width = 15;
canvas.height = 15;
canvas.background.color = "rgb(0, 0, 0)";
canvas.id = "canvas";
canvas.scalingFactor =  16;

input.up = "KeyW";
input.left = "KeyA";
input.down = "KeyS";
input.right = "KeyD";

timers.move = 800;

food = new Food();

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

snake = new SnakePiece();
snake.direction = {};
snake.position.x = Math.trunc(canvas.width / 2);
snake.position.y = Math.trunc(canvas.height / 2);
snake.physics = true;
snake.pieces = [snake];
snake.direction.x = 1;
snake.direction.y = 0;

snake.onCollision = function(sprite){
    let timer = Game.timers.byName("move");
    let food;
    let piece; 

    if(sprite.tags.includes("wall") || sprite.tags.includes("snake piece")){
        food = new Food();

        for(let index=1; index<snake.pieces.length; index++){
            piece = this.pieces[index];
            Game.sprites.remove(piece);
        }

        for(let food of Game.sprites.withTag("food")){
            Game.sprites.remove(food);
        }

        this.direction.x = 1;
        this.direction.y = 0;
        this.nextDirection.x = 1;
        this.nextDirection.y = 0;
        this.position.x = Math.trunc(canvas.width / 2);
        this.position.y = Math.trunc(canvas.height / 2);
    
        this.pieces = [this];
        
        Game.sprites.add(food);

        timer.duration = 400;
        timer.start();
    }

    else if(sprite.tags.includes("food")){
        piece = new SnakePiece();
        food = new Food();
        
        piece.position.x = this.tail.oldPosition.x;
        piece.position.y = this.tail.oldPosition.y;
        this.pieces.push(piece);
        this.tail = this.pieces[this.pieces.length - 1];
        
        food.position.x = _.random(1, canvas.width - 2);
        food.position.y = _.random(1, canvas.height - 2);
        
        Game.sprites.add(piece);
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
    let piece;
    let next;

    if(name === "move"){
        this.tail.oldPosition.x = this.tail.position.x;
        this.tail.oldPosition.y = this.tail.position.y;

        for(let index=1; index<; index--){
            piece = this.pieces[index];
            next = this.pieces[index - 1];
            piece.position.x = next.position.x;
            piece.position.y = next.position.y;
        }

        this.position.x += this.direction.x;
        this.position.y += this.direction.y;

        Game.timers.byName("move").start();
    }
};

snake.update = function(){
    if(Game.actions.withName("up")){
        this.direction.x = 0;
        this.direction.y = -1;
    }

    else if(Game.actions.withName("down")){
        this.direction.x = 0;
        this.direction.y = 1;
    }

    else if(Game.actions.withName("left")){
        this.direction.x = -1;
        this.direction.y = 0;
    }

    else if(Game.actions.withName("right")){
        this.direction.x = 1;
        this.direction.y = 0;
    }
};

var sprites = [snake, topWall, bottomWall, leftWall, rightWall, food];
var myGame = {};
myGame.canvas = canvas;
myGame.sprites = sprites;
myGame.input = input;
myGame.timers = timers;

Game.setup(myGame);
Game.start();