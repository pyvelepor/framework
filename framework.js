function Input(){
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

    this.keyDown = function(event){
        let action = mappings[KeyEvent.PRESSED][event.code];
        actions[action] = true;
    };

    this.keyUp = function(event){
        let action = mappings[KeyEvent.RELEASED][event.code];
        actions[action] = true;
    };

    this.reset = function(){
        for(key in actions){
            actions[key] = false;
        }
    };

    this.byName = function(name){
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
        inWorld: new Set(),
        types: {},
        names: {},
        tags: {},
        physics: new Set()
    };

    this.addTypes = function(types_){
        let zeroVector = {x: 0, y: 0};
        
        for(let [name, type] of Object.entries(types_)){
            type = _.cloneDeep(type);

            type = _.assign({}, {postion: {x: 0, y:0}}, type);
            
            if(type.physics){
                type = _.assign({}, {velocity: {x: 0, y:0}}, type);
            }

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

            if(sprite.name !== undefined){
                attrs.names[sprite.name] = guid;
            }

            if(sprite.physics !== undefined){
                attrs.physics.add(guid);
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

    this.withPhysics = function(){
        let objects = [];

        for(let guid of attrs.physics){
            objects.push(sprites[guid]);
        }

        return objects;
    }

    this.inWorld = function(){
        return attrs.inWorld;
    }

    this.byGuid = function(guid){
        return sprites[guid];
    }

    this.byName = function(name){
        let guid = attrs.names[name];
        return sprites[guid];
    }

    this.byType = function(type){
        let guids = attrs.types[type];
        var objects = [];

        for(let guid of guids){
            objects.push(sprites[guid]);
        }

        return objects;
    }

    this.byTag = function(tag){
        let guids = attrs.tags[tags];
        var objects = [];

        for(let guid of guids){
            objects.push(sprites[guid]);
        }

        return objects;
    }
}

function Physics(){
    this.update = function(sprites){
        for(let sprite of sprites){
            sprite.update();
        }
    };
};

var Game = {
    sprites: new Sprites(),
    timers: new Timers(),
    physics: new Physics(),
    input: new Input()
};

Game.setup = function(configuration){
    Game.input.add(configuration.input);
    Game.timers.add(configuration.timers);
    Game.sprites.addTypes(configuration.types);
    Game.sprites.addSprites(configuration.sprites);
    

    window.addEventListener('keydown', Game.input.keyDown);
    window.addEventListener('keyup', Game.input.keyUp);
};

Game.loop = function(){
    Game.physics.update(Game.sprites.withPhysics());
    // this.renderer.draw(this.sprites.withImages());
    // this.sprites.cleanup();
    Game.input.reset();

    window.requestAnimationFrame(Game.loop)
};

Game.start = function(){
    Game.loop();
};
