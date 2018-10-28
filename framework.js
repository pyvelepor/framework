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
        let debugFillStyle = "rgb(0, 255, 0)";

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

        if(Game.debug){
            for(let sprite of Game.sprites.withComponent("hitBox")){
                context.strokeStyle = "rgb(0, 255, 0)";

                let x, y, w, h;
                x = sprite.position.x + sprite.hitBox.x;
                y = sprite.position.y + sprite.hitBox.y;
                w = sprite.hitBox.width;
                h = sprite.hitBox.height;
                context.strokeRect(x, y, w - 1.45, h - 1.45);

                context.strokeStyle = "rgb(255, 0, 0)";
               
                if(sprite.physics){
                    let direction = Game.vectors.scale(10, sprite.velocity);
                            
                    w /= 2;
                    h /= 2;
                    x += w;
                    y += h;

                    context.lineWidth = 2;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x + direction.x, y + direction.y);
                    context.stroke();
                }
            }
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
    this.duration = duration;

    this.start = function(){
        startTime = Date.now();
    }

    this.ready = function(){
        return (Date.now() - startTime) > this.duration;
    }

    this.reset = function(){
        startTime = undefined;
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

    this.check = function(){
        for(name in timers){
            if(!timers[name].ready()){
                continue;
            }
            
            timers[name].reset();

            for(let sprite of Game.sprites.withTimerReady()){
                sprite.timerReady(name);
            }

        }
    }
}

function Sprites(){
    var guid = 0;
    var guids = new Set();
    var types = {};
    var sprites = [];
    var _destroy = new Set();
    var _create  = [];
    var attributes = {
        type: {},
        tags: {},
        name: {},
        layer: {}
    };

    var components = {
        hitBox: new Set(),
        body: new Set(),
        physics: new Set(),
        image: new Set(),
        update: new Set(),
        timerReady: new Set()
    };

    var toSpriteIterable = function(guids){
        return {
            *[Symbol.iterator](){
                for(let guid of guids){
                    let sprite = sprites[guid];

                    if(sprite === undefined){
                        continue;
                    }

                    yield sprite;
                }
            }
        };
    }

    this.start = function(){
        for (let sprite of sprites){
            sprite.start();
        }
    };

    this.withAttribute = function(name){
        let guids

        if(name === "tags" || name === "layer" || name === "type"){
            guids = Object.values(attributes[name]);
            guids = new Set([].concat(...guids.map(set => Array.from(set))));
        }

        else if(name === "name"){
            guids = Object.values(attributes[name]);
        }

        else{
            guids = attributes[name];
        }

        return toSpriteIterable(guids);
    };

    this.withComponent = function(name){
        return toSpriteIterable(components[name]);
    };

    this.getObjects = toSpriteIterable;

    this.create = function(sprites_){
        _create.push(...sprites_);
    };

    this.add = function(sprite){
        this.create([sprite]);
    };

    this.remove = function(sprite){
        _destroy.add(sprite.guid);
    };

    this.addTypes = function(types_){      
        for(let [name, type] of Object.entries(types_)){
            type = _.cloneDeep(type);

            type = _.assign({}, {position: {x: 0, y:0}}, type);

            if(type.layer === undefined){
                type.layer = Game.physics.defaultLayer;
            }

            types[name] = type;
        }
    };


   var addSprites = function(sprites_){
        for(let sprite of sprites_){
            // sprite = _.cloneDeep(sprite);
            sprite.guid = guid;

            if(sprite.type !== undefined){
                let type = _.cloneDeep(types[sprite.type]);
                sprite = _.assign(sprite, type, sprite);
            }

            if(sprite.layer === undefined){
                sprite.layer = Game.physics.defaultLayer;
            }

            if(sprite.start === undefined){
                sprite.start = function(){};
            }

            sprite.position = _.assign({}, Game.vectors.zero(), sprite.position);

            for(let [property, value] of Object.entries(sprite)){
                if(property === "type"){
                    if(!(sprite.type in attributes.type)){
                        attributes.type[sprite.type] = new Set();
                    }
                    
                    attributes.type[sprite.type].add(guid);
                }
                
                else if(property === "tags"){
                    for(tag of sprite.tags){
                        if(!(tag in attributes.tags)){
                            attributes.tags[tag] = new Set();
                        }
    
                        attributes.tags[tag].add(guid);
                    }
                }

                else if(property === "layer"){
                    if(attributes.layer[sprite.layer] === undefined){
                        attributes.layer[sprite.layer] = new Set();
                    }

                    attributes.layer[sprite.layer].add(guid);
                }

                else if(property === "name"){
                    attributes.name[sprite.name] = guid;
                }
                
                else if(property === "update"){
                    components.update.add(guid);
                }

                else if(property === "physics"){
                    sprite.body = Game.physics.Body();
                    sprite.velocity =  sprite.body.velocity;
                    sprite.impulse = sprite.body.impulse;
                    components.body.add(guid);
                    components.physics.add(guid);
                }

                else if(property === "image"){
                    let image = new Image(sprite.width, sprite.height);
                    
                    image.src = sprite.image.src;
                    image.onload = function(){
                        components.image.add(sprite.guid);
                    };

                    sprite.image = image;
                }

                else if(property === "hitBox"){
                    sprite.hitBox = Game.physics.HitBox(sprite.hitBox);
                    components.hitBox.add(guid);
                    
                    if(sprite.onCollision === undefined){
                        sprite.onCollision = Game.physics.CollisionListener();
                    }

                    sprite.afterCollision = sprite.onCollision;
                }


                else if(property === "timerReady"){
                    components.timerReady.add(guid);
                }

                else if(typeof value !== "object"){
                    if(attributes[property] === undefined){
                        attributes[property] = new Set();
                    }

                    attributes[property].add(guid);
                }

                else{
                    if(components[property] === undefined){
                        components[property] = new Set();
                    }

                    components[property].add(guid)
                }
            }
                
            guids.add(guid);
            guid += 1;
            sprites.push(sprite);
        }
    }

    this.cleanup = function(){
        for(let guid of _destroy){
            sprites[guid] = undefined;
        }

        addSprites(_create);

        _destroy.clear();
        _create = [];
    };

    this.collidable = function(layer){
        return {
            *[Symbol.iterator](){
                for(let guid of attributes.layer[layer]){
                    if(sprites[guid] === undefined){
                        continue;
                    }

                    if(!components.hitBox.has(guid)){
                        continue;
                    }                    

                    let sprite = sprites[guid];

                    if(!sprite.hitBox.enabled){
                        continue;
                    }

                    yield sprite;
                }
            }
        }
    };

    this.withPhysics = function(){
        return this.withComponent("physics");
    };

    this.withTimerReady = function(){
        return this.withComponent("timerReady");
    };

    
    this.withHitBox = function(){
        return this.withComponent("hitBox");
    };
    
    this.withImage = function(){
        return this.withComponent("image");
    };
    
    this.withUpdate = function(){
        return this.withComponent("update");
    };
    
    this.withLayer = function(layer){
        return toSpriteIterable(attributes.layer[layer]);
    };

    this.withName = function(name){
        return sprites[attributes.name[name]];
    };

    this.withType = function(type){
        return toSpriteIterable(attributes.type[type]);
    };

    this.withTag = function(tag){
        return toSpriteIterable(attributes.tags[tag]);
    };
}

function Physics(){
    this.Body = function(configuration){
        return {
            impulse: Game.vectors.zero(),
            velocity: Game.vectors.zero()
        };
    };
    
    this.CollisionListener = function(){
        return function(sprite){};
    };
    
    this.HitBox = function(configuration){
        let hitBox = _.assign(
            {}, 
            {
                x:0,
                y:0,
                width:configuration.width,
                height:configuration.height, 
                enabled:true,
            },
            configuration
        );
    
        return hitBox;
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

        return ((ax + aw) > bx) &&
               (ax < (bx + bw))  &&
               ((ay + ah) > by) &&
               (ay < (by + bh));
    };

    var collidableLayers = {};
    this.defaultLayer;

    this.setup = function(configuration){
        let defaultConfiguration = {
            defaultLayer: "default",
            collidableLayers: {
                "default": ["default"]
            }
        };

        configuration = _.assign({}, defaultConfiguration, configuration);
        this.defaultLayer = configuration.defaultLayer;
        collidableLayers = configuration.collidableLayers;
    };

    this.update = function(){
        for(let a of Game.sprites.withUpdate()){
            a.update();
        }

        for(let a of Game.sprites.withPhysics()){
            let aForce = Game.vectors.zero();
            aForce.x = a.velocity.x + a.impulse.x;
            aForce.y = a.velocity.y + a.impulse.y;
            a.impulse.x = 0;
            a.impulse.y = 0;

            a.position.x += aForce.x;
            a.position.y += aForce.y;

            for(let layer of collidableLayers[a.layer]){
                for(let b of Game.sprites.collidable(layer)){
                    if(a.guid === b.guid){
                        continue;
                    }
                    
                    if(!areColliding(a, b)){
                        continue;
                    }

                    if(a.isSensor || b.isSensor){
                        a.onCollision(b);
                        b.onCollision(a);
                        continue;
                    }

                    let aDisplacement = {x: 0, y:0};
                    let bDisplacement = {x: 0, y:0};

                    if(!Game.vectors.isZero(aForce)){
                        aDisplacement = Game.vectors.normalize(aForce);
                        aDisplacement = Game.vectors.scale(-1.0, aDisplacement)
                    }

                    if(b.velocity !== undefined){
                        if(!Game.vectors.isZero(b.velocity)){
                            bDisplacement = Game.vectors.normalize(b.velocity);
                            bDisplacement = Game.vectors.scale(-1.0, bDisplacement);
                        }
                    }

                    while(areColliding(a, b)){
                        a.position.x += aDisplacement.x;
                        a.position.y += aDisplacement.y;
                        b.position.x += bDisplacement.x;
                        b.position.y += bDisplacement.y;
                    }

                    a.impulse.x = 0;
                    a.impulse.y = 0;

                    a.afterCollision(b);
                    b.afterCollision(a);

                }
            }
        }
    };
}

function Vectors(){
    this.magnitude = function(u){
        return Math.sqrt(u.x * u.x + u.y * u.y);
    };

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

    this.scale = function(scalar, vector){
        return {
            x: scalar * vector.x,
            y: scalar * vector.y
        }
    }

    this.isZero = function(vector){
        return Math.abs(vector.x) < 1e-3 && Math.abs(vector.y) < 1e-3;
    }

    this.zero = function(){
        return {
            x: 0,
            y: 0
        };
    }
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
    Game.physics.setup(configuration.physics);
    Game.renderer.setup(configuration.canvas);
    Game.actions.setup();

    if(configuration.types !== undefined){
        Game.sprites.addTypes(configuration.types);
    }

    if(configuration.sprites !== undefined){
        Game.sprites.create(configuration.sprites);
    }

    Game.sprites.cleanup();
    Game.sprites.start();
};

Game.loop = function(){
    Game.actions.processInput();
    Game.timers.check();
    Game.physics.update();
    Game.renderer.draw();
    Game.sprites.cleanup();
    window.requestAnimationFrame(Game.loop)
};

Game.start = function(){
    Game.loop();
};
