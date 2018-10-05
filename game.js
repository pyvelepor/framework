Game.setup({
    canvas: {
        id: 'canvas',
        width: 320,
        height: 320,
        background: {
            color: 'rgb(0, 0, 0)'
        }
    },

    timers: {
        'hero': 3.0,
        'dragon': 5.0
    },

    input: {
        'walkUp': 'KeyW',
        'walkLeft': 'KeyA',
        'walkDown': 'KeyS',
        'walkRight': 'KeyD',
        'attack': {
            key: 'Space',
            event: 'released'
        }
    },

    types: {
        'hero': {
            hitBox: {},
            width: 32,
            height: 32,
            damage: 5,
            health: 40,
            poisoned: false,
            count: 0,
            physics: true,
            image: {
                src: "sprites/archer/Stand/0.png",
            },

            collisions: {
                'dragon attack': this.takeDamage,
            },

            takeDamage(attack){
                this.health -= attack.damage;
                console.log(`hit by ${sprite.type}. Taking ${sprite.damage}`);

                if(attack.status === 'poison'){
                    this.poisoned = true;
                    Game.timers.withName('hero').start();
                    console.log("The hero is poisoned. That sucks.");
                }
            },

            update(){
                this.velocity.x = 0;
                this.velocity.y = 0;

                if(Game.actions.withName('walkLeft')){
                    this.velocity.x = -1.0;
                }

                if(Game.actions.withName('walkRight')){
                    this.velocity.x = 1.0;
                }

                if(Game.actions.withName('walkUp')){
                    this.velocity.y = -1.0;
                }

                if(Game.actions.withName('walkDown')){
                    this.velocity.y = 1.0;
                }

                if(Game.actions.withName('attack')){
                }

                // if(this.count === 5.0){
                //     this.poisoned = false;
                //     Game.timers.withName('hero').reset();
                // }

                // if(this.poisoned === true && Game.timers('hero').ready()){
                //     this.count += 1;
                // }
            }
        },

        'dragon': {
            health: 20,
            attacks: {
                firestorm: {
                    speed: 3.0,
                    spread: 15
                }
            },

            attack(hero){
                var firestorm = this.attacks.firestorm;
                var vector = Game.vectors.subtract(this, hero);
                vector = Game.vectors.normalize(vector);
                vector = Game.vectors.scale(this.attacks.fSpeed, vector);
                
                Game.sprites.add({
                    type:this.attackType,
                    velocity: Game.vectors.rotate(-this.attack.spread, vector)
                });

                Game.sprites.add({
                    type:this.attackType,
                    velocity: vector
                });

                Game.sprites.add({
                    type:this.attackType,
                    velocity: Game.vectors.rotate(this.attack.spread, vector)
                });

                console.log("The dragon attacks.\nDon't get singed");
            },

            update(){
                var direction;
                var vector;
                var hero = Game.sprites.withName('hero')
                
                if(Game.vectors.distance(this, hero) < 5.0 ){
                    this.attack(hero);
                }
            }
        },

        'firestorm': {
            damage: 10,
            tags: ["dragon attack"]
        },

        'acid': {
            damage: 1,
            tag: ["dragon attack"]
        }
    },

    sprites:[
        {
            type: 'hero',
            name: 'hero',
            position: {
                x: 50,
                y: 50
            }
        },
        {
            type: 'dragon',
            position: {
                x: 240,
                y: 240
            }
        },
        {
            hitBox:{
                width:10,
                height:320
            }
        }
    ]
});

Game.start();