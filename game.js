Game.setup({
    window: {
        canvas: '#canvas',
        width: 320,
        height: 320
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
            damage: 5,
            health: 40,
            poisoned: false,
            count: 0,
            physics: true,
            image: 'hero.png',
            collider: {
                type: 'box', 
            },

            collisions: {
                'dragon attack': this.takeDamage,
            },

            takeDamage(attack){
                this.health -= attack.damage;
                console.log(`hit by ${sprite.type}. Taking ${sprite.damage}`);

                if(attack.status === 'poison'){
                    this.poisoned = true;
                    Game.timers.byName('hero').start();
                    console.log("The hero is poisoned. That sucks.");
                }
            },

            update(){
                this.velocity.x = 0;
                this.velocity.y = 0;

                if(Game.input.byName('walkLeft')){
                    console.log('hero walking left');
                    this.velocity.x = -1.0;
                }

                if(Game.input.byName('walkRight')){
                    console.log('hero walking right');
                    this.velocity.x = 1.0;
                }

                if(Game.input.byName('walkUp')){
                    console.log('hero walking up');
                    this.velocity.y = -1.0;
                }

                if(Game.input.byName('walkDown')){
                    console.log('hero walking down');
                    this.velocity.y = 1.0;
                }

                if(Game.input.byName('attack')){
                    console.log("hero is attacking.");
                }

                // if(this.count === 5.0){
                //     this.poisoned = false;
                //     Game.timers.byName('hero').reset();
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
                var hero = Game.sprites.byName('hero')
                
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
        }
    ]
});

Game.start();