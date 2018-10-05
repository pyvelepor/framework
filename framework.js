function Renderer(){
    var canvas;
    var context;
    var background;

    this.setup = function(configuration){
        canvas = document.getElementById(configuration.id);
        canvas.width = configuration.width;
        canvas.height = configuration.height;
        context = canvas.getContext('2d');
        background = configuration.background;

        if(background.image !== undefined){
            let image = new Image();
            image.src = background.image;
            background = image;
        }
    };

    this.draw = function(){
        if(background.color !== undefined){
            context.fillStyle = background.color;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }
        else{
            context.drawImage(0, 0, background.image);
        }

        for(let sprite of Game.sprites.withImage()){
            context.drawImage(sprite.image, sprite.position.x, sprite.position.y, sprite.width, sprite.height);
        }
    };
}

function Actions(){
    var KeyEvent = Object.freeze({
        NOEVENT: 0,
        PRESSED: 1,
        RELEASED: 2,
    });

    var mappings = {
        1: {},
        2: {}
    };

    var actions = {};
    var events = [];

    this.setup = function(){
        window.addEventListener('keypress', keyDown);
        window.addEventListener('keyup', keyUp);
    };

    this.processInput = function(){
        let action;

        for(let code in mappings[KeyEvent.RELEASED]){
            action = mappings[KeyEvent.RELEASED][code];
            actions[action] = false;
        }

        for(let event of events){
            if(event.type === 'keypress'){
                action = mappings[KeyEvent.PRESSED][event.code];
                actions[action] = true;
            }

            if(event.type === 'keyup'){
                action = mappings[KeyEvent.RELEASED][event.code];
                actions[action] = true;
                action = mappings[KeyEvent.PRESSED][event.code];
                actions[action] = false;
            }
        }

        events = [];
    };

    this.add = function(actions_){
        let action;

        for(let name in actions_){
            actions[name] = false;
            action = actions_[name];

            if(typeof action === "string"){
                action = {
                    key: action,
                    event: KeyEvent.PRESSED
                };
            }

            else{
                action.event = KeyEvent[action.event.toUpperCase()];
            }

            mappings[action.event][action.key] = name;
        }
    };

    var keyDown = function(event){
        events.push(event);
    };

    var keyUp = function(event){
        events.push(event);
    };

    this.withName = function(name){
        return actions[name];
    };
};

function Timer(duration){
    var startTime;
    
    this.start = function(){
        this.startTime = Date.now();
    }

    this.ready = function(){
        return (Date.now() - this.startTime) > duration;
    }
}

function Timers(){
    var timers = {};

    this.add = function(config){
        for(name in config){
            timers[name] = new Timer(config[name])
        }
    };

    this.byName = function(name){
        return timers[name];
    };
}

function Sprites(){
    var guid = 0;
    var guids = new Set();
    var types = {};
    var sprites = [];
    var attrs = {
        image: new Set(),
        inWorld: new Set(),
        types: {},
        names: {},
        tags: {},
        hitBox: new Set(),
        physics: new Set(),
        update: new Set()
    };

    var toSpriteIterable = function(guids){
        return {
            *[Symbol.iterator](){
                for(let guid of guids){
                    yield sprites[guid];
                }
            }
        };
    };

    this.addTypes = function(types_){
        let zeroVector = {x: 0, y: 0};
        
        for(let [name, type] of Object.entries(types_)){
            type = _.cloneDeep(type);

            type = _.assign({}, {postion: {x: 0, y:0}}, type);

            types[name] = type;
        }
    };

    this.addSprites = function(sprites_){
        for(let sprite of sprites_){
            sprite = _.cloneDeep(sprite);
            sprite.guid = guid;

            if(sprite.type !== undefined){
                sprite = _.assign({}, types[sprite.type], sprite);

                if(!(sprite.type in attrs.types)){
                    attrs.types[sprite.type] = new Set();
                }
                    
                attrs.types[sprite.type].add(guid);
            }

            sprite.position = _.assign({}, {x: 0, y:0}, sprite.position);


            if(sprite.update !== undefined){
                attrs.update.add(guid);
            }

            if(sprite.name !== undefined){
                attrs.names[sprite.name] = guid;
            }

            if(sprite.physics !== undefined){
                sprite.velocity =  {x: 0, y:0};
                attrs.physics.add(guid);
            }

            if(sprite.image !== undefined){
                let image = new Image(sprite.width, sprite.height);
                
                image.src = sprite.image.src;
                image.onload = function(){
                    attrs.image.add(sprite.guid);
                };

                sprite.image = image;
            }

            if(sprite.hitBox !== undefined){
                attrs.hitBox.add(guid);
                sprite.hitBox = _.assign({}, {x:0, y:0, width:sprite.width, height:sprite.height}, sprite.hitBox);
            }

            if(sprite.tags !== undefined){
                for(tag of sprite.tags){
                    if(!(tag in attrs.tags)){
                        attrs.tags[tag] = new Set();
                    }

                    attrs.tags[tag].add(guid);
                }
            }

            guids.add(guid);
            guid += 1;
            sprites.push(sprite);
        }
    }

    this.withHitBox = function(){
        return toSpriteIterable(attrs.hitBox);
    }
    this.withImage = function(){
        return toSpriteIterable(attrs.image);
    };

    this.withUpdate = function(){
        return toSpriteIterable(attrs.update);
    };

    this.withPhysics = function(){
        return toSpriteIterable(attrs.physics);
    };

    this.withName = function(name){
        return sprites[attrs.names[name]];
    };

    this.withType = function(type){
        return toSpriteIterable(attrs.types[type]);
    };

    this.withTag = function(tag){
        return toSpriteIterable(attrs.tags[tag]);
    };
}

function Physics(){
    var resolveOne = function(a, b){
        let a180 = a.velocity;
        a180 = Game.vectors.normalize(a180);
        a180 = Game.vectors.rotate(180, a180);

        while(areColliding(a, b)){
            a.position.x += a180.x;
            a.position.y += a180.y;
        }

        a.velocity.x = 0;
        a.velocity.y = 0;
    };

    var resolveTwo = function(a , b){
        let a180 = a.velocity;
        a180 = Game.vectors.normalize(a180);
        a180 = Game.vectors.rotate(180, a180);

        let b180 = b.velocity;
        b180 = Game.vectors.normalize(b180);
        b180 = Game.vectors.rotate(180, b180);

        while(areColliding(a, b)){
            a.position.x += a180.x;
            a.position.y += a180.y;
            b.position.x += b180.x;
            b.position.y += b180.y;
        }

        a.velocity.x = 0;
        a.velocity.y = 0;
        b.velocity.x = 0;
        b.velocity.y = 0;
    };

    var areColliding = function(a, b){
        let ax = a.position.x + a.hitBox.x;
        let ay = a.position.y + a.hitBox.y;
        let aw = a.hitBox.width;
        let ah = a.hitBox.height;

        let bx = b.position.x + b.hitBox.x;
        let by = b.position.y + b.hitBox.y;
        let bw = b.hitBox.width;
        let bh = b.hitBox.height;

        return ((ax + aw) >= bx) &&
               (ax < (bx + bw))  &&
               ((ay + ah) >= by) &&
               (ay < (by + bh));
    };

    this.update = function(){
        for(let sprite of Game.sprites.withUpdate()){
            sprite.update();
        }

        for(let sprite of Game.sprites.withPhysics()){
            sprite.position.x += sprite.velocity.x;
            sprite.position.y += sprite.velocity.y;
        }
        
        let sprites = [...Game.sprites.withHitBox()];

        for(let i=0; i<sprites.length; i++){
            let a = sprites[i];

            if(a.velocity === undefined){
                continue;
            }

            for(let j=i+1; j<sprites.length; j++){
                let b = sprites[j];

                if(areColliding(a, b)){
                    if(b.velocity === undefined){
                        resolveOne(a, b);
                    }

                    else{
                       resolveTwo(a, b)
                    }
                }
            }
        }
    };
};

function Vectors(){
    this.distance = function(u, v){
        let x = u.x - v.x;
        let y = u.y - v.y;

        return Math.sqrt(x * x + y * y);
    };

    this.normalize = function(u){
        let x = u.x * u.x;
        let y = u.y * u.y;
        let magnitude = Math.sqrt(x + y);

        return {
            x: u.x / magnitude,
            y: u.y / magnitude
        };
    };

    this.rotate = function(angle, vector){
        angle = Math.PI / 180.0 * angle;

        let x = Math.cos(angle) * vector.x - Math.sin(angle) * vector.y;
        let y = Math.sin(angle) * vector.x + Math.cos(angle) * vector.y;

        return {x: x, y:y};
    };
}

var Game = {
    sprites: new Sprites(),
    timers: new Timers(),
    physics: new Physics(),
    actions: new Actions(),
    renderer: new Renderer(),
    vectors: new Vectors(),
};

Game.setup = function(configuration){
    Game.actions.add(configuration.input);
    Game.timers.add(configuration.timers);
    Game.sprites.addTypes(configuration.types);
    Game.sprites.addSprites(configuration.sprites);
    Game.renderer.setup(configuration.canvas);
    Game.actions.setup();
};

Game.loop = function(){
    Game.actions.processInput();
    Game.physics.update();
    Game.renderer.draw();
    // this.sprites.cleanup();
    // Game.renderer.draw();
    window.requestAnimationFrame(Game.loop)
};

Game.start = function(){
    Game.loop();
};
