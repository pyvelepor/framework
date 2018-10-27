var head = {};
var topWall = {};
var bottomWall = {};
var leftWall = {};
var rightWall = {};
var tail = {};
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
    food.onCollision = function(sprite){
        Game.sprites.remove(this);
    };

    return food;
};

canvas.background = {};
canvas.width = 640;
canvas.height = 640;
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
topWall.width = 640;
topWall.height = 16;
topWall.position.x = 0;
topWall.position.y = 0;
topWall.image.src = "../sprites/pong/paddle.png";
topWall.hitBox.width = 640;
topWall.hitBox.height = 16;

bottomWall.position = {};
bottomWall.hitBox = {};
bottomWall.image = {};
bottomWall.tags = ["wall"];
bottomWall.width = 640;
bottomWall.height = 16;
bottomWall.position.x = 0;
bottomWall.position.y = 624;
bottomWall.image.src = "../sprites/pong/paddle.png";
bottomWall.hitBox.width = 640;
bottomWall.hitBox.height = 16;

leftWall.position = {};
leftWall.hitBox = {};
leftWall.image = {};
leftWall.tags = ["wall"];
leftWall.width = 16;
leftWall.height = 640;
leftWall.position.x = 0;
leftWall.position.y = 0;
leftWall.image.src = "../sprites/pong/paddle.png";
leftWall.hitBox.width = 16;
leftWall.hitBox.height = 640;

rightWall.position = {};
rightWall.hitBox = {};
rightWall.image = {};
rightWall.tags = ["wall"];
rightWall.width = 16;
rightWall.height = 640;
rightWall.position.x = 624;
rightWall.position.y = 0;
rightWall.image.src = "../sprites/pong/paddle.png";
rightWall.hitBox.width = 16;
rightWall.hitBox.height = 640;

head.position = {};
head.image = {};
head.direction = {};
head.oldPosition = {};
head.hitBox = {};
head.tail = [];
head.name = "head";
head.width = 16;
head.height = 16;
head.physics = true;
head.image.src = "../sprites/pong/ball.png";
head.position.x = 320;
head.position.y = 320;
head.oldPosition.x = 320;
head.oldPosition.y = 320;
head.hitBox.width = 16;
head.hitBox.height = 16;
head.direction.x = 16;
head.direction.y = 0;
head.start = function(){
    Game.timers.byName("move").start();
};

head.timerReady = function(name){
    if(name === "move"){
        this.oldPosition.x = this.position.x;
        this.oldPosition.y = this.position.y;
        this.impulse.x = this.direction.x;
        this.impulse.y = this.direction.y;

        let newPosition = Game.vectors.zero();
        newPosition.x = this.oldPosition.x;
        newPosition.y = this.oldPosition.y;

        for(let body of this.tail){
            body.oldPosition.x = body.position.x;
            body.oldPosition.y = body.position.y;

            body.position.x = newPosition.x;
            body.position.y = newPosition.y;

            newPosition.x = body.oldPosition.x;
            newPosition.y = body.oldPosition.y;
        }

        Game.timers.byName("move").start();
    }
};


head.update = function(){
    if(Game.actions.withName("up") && this.direction.y === 0){
        this.direction.x = 0;
        this.direction.y = -16;
    }

    else if(Game.actions.withName("down") && this.direction.y === 0){
        this.direction.x = 0;
        this.direction.y = 16;
    }

    else if(Game.actions.withName("left") && this.direction.x === 0){
        this.direction.x = -16;
        this.direction.y = 0;
    }

    else if(Game.actions.withName("right") && this.direction.x === 0){
        this.direction.x = 16;
        this.direction.y = 0;
    }
};

head.onCollision = function(sprite){
    if(sprite.tags.includes("wall") || sprite.tags.includes("body")){
        this.position.x = 320;
        this.position.y = 320;
        this.direction.x = 16;
        this.direction.y = 0;

        for(let body of this.tail){
            Game.sprites.remove(body);
        }

        this.tail = [];
    }

    if(sprite.tags.includes("food")){
        let body = {};
        let food = Food();

        body.position = {};
        body.image = {};
        body.hitBox = {};
        body.oldPosition = {};
        body.tags = ["body"];
        body.width = 16;
        body.height = 16;
        body.isSensor = true;

        if(this.tail.length === 0){
            body.position.x = this.oldPosition.x;
            body.position.y = this.oldPosition.y;
        }

        else{
            body.position.x = this.tail[this.tail.length-1].oldPosition.x;
            body.position.y = this.tail[this.tail.length-1].oldPosition.y;
        }

        body.oldPosition.x = body.position.x;
        body.oldPosition.y = body.position.y;
        body.image.src = "../sprites/pong/ball.png";
        body.hitBox.width = 16;
        body.hitBox.height = 16;
        this.tail.push(body);

        food.position.x = _.random(1, 38) * 16;
        food.position.y = _.random(1, 38) * 16;

        Game.sprites.add(body);
        Game.sprites.add(food);
    }
};

var food = Food();
food.position.x = 480;
food.position.y = 320; 

var sprites = [head, topWall, bottomWall, leftWall, rightWall, food];
var myGame = {};
myGame.canvas = canvas;
myGame.sprites = sprites;
myGame.input = input;
myGame.timers = timers;

Game.debug =  true;
Game.setup(myGame);
Game.start();