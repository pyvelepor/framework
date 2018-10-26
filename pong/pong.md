# Pong #
Let's review what we've learned so far:
 1. We've learned how to setup the size of the canvas - where everything is drawn - and give it a background color.
 2. We've learned know how to setup actions which are triggered based off keyboard input.
 3. We've learned how to create sprites, giving them the ability to move and collide with other objects.
 4. We've learned how to give a sprite the ability to detect collisions, and inspect what the sprite has collided with.

Which is fantastic! We've learned everything that's needed to make our first game: pong. Pong is a fun, and simple tennis-like game. Each player controls a paddle and tries to use it to return a ball past their opponent's paddle. The first player to succeeds wins.

In order to create our game, we'll walkthrough:

1. The gameplay.  
A very basic description of how pong works.  

2. Framework needs.  
The information we'll need to pass to the framework to run the game. We'll list out the canvas attributes, actions, and different sprites needed for the game.

3. Sprites' initial values. 
Details about sprites at the start of the game. We'll list out the different attributes and components for each sprite, and their initial values.

4. Sprites' dynamic values. 
Details about sprites that can change as we play the game. We'll look at values that need to be changed to make our sprites move or react to collisions with other objects in the game.

## 1. the gameplay ##

The game has two paddles, each controlled by a different players. Players are able to move the paddles up and down only. At the start of the game, the ball moves in a random direction towards eiter the left or right paddle. The ball makes contacts with paddles, it bounces off, at an angle, in the opposite direction. The game also has two invisible walls: one at the top, one at the bottom. When the ball makes contact with these walls, it bounces off in the same direction. When the ball moves past a paddle, the opposing player wins the game.

## 2. what the framework needs ##

For our game, there's three major items we'll need to provide to the framework:

 1. `canvas`
 2. `input`
 3. `sprites`

### `canvas` ###
We'll setup a canvas that has a black background, a width of `640pixesl`, and a height of `640pixels`.

 - background color: `rgb(0, 0, 0)`
 - width: `640`
 - height: `640`

### `input` ###
Since each paddle can move in only two directions, and since we have two paddles, we'll need to setup a total of four actions. Two actions - `leftPaddleUp`, `leftPaddleDown` - will be assigned to keys `W` and `S` for moving the left paddle up and down. Similarly, two other other actions - `rightPaddleUp`, `rightPaddleDown` - will be assigned to the up and down arrow keys for movingthe right paddle up and down.

| action name       | key code    |
|-------------------|-------------|
| `leftPaddleUp`    | `KeyW`      |
| `leftPaddleDown`  | `KeyS`      |
| `rightPaddleUp`   | `ArrowUp`   |
| `rightPaddleDown` | `ArrowDown` |

### `sprites` ###

The obvious sprites are the visible ones: the left paddle, the right paddle, and the ball. The not so obvious sprites are the non-visible ones. In the gameplay section, we mentioned that there are two invisible walls at the top and bottom of the game. These two walls - the top wall and bottom wall - are two other sprites that we'll need, bringing us up to a total of 5 sprites. Lastly, there's two more invisible sprites that we'll need for the game. In the gameplay section, we mention that the objective is to return the ball past our opponent's paddle. A good example would be the ball getting past the top of the left paddle. This means we need some of way knowing when the ball travels past the left or right paddle.  You may have played games that use invisible walls to prevent players from moving off screen. For our pong game, we can setup similar walls. But instead of using them to prevent the ball from moving off screen, we can use them to detect when the ball has travelled past one of the paddles. This means we'll need two more invisible walls: a left wall for detecting when the ball has travelled past the left paddle, and a right wall for detecting when the ball has travelled past the right paddle. This brings us to a final total of 7 sprites that we need for the game:

 1. left paddle
 2. right paddle
 3. ball
 4. top wall
 5. bottom wall
 6. left wall
 7. right wall

### 3. sprites' initial values ###
For Pong, here is a list of *all* the different attributes and components we'll use, and basic descriptions of each.
 - attributes
   - *name*: name of the sprite
   - *width*: the width of the sprite, in pixels
   - *height*: the height of the sprite, in pixels
 - components
   - *position*: the x and y coordinate, in pixels, for where the sprite is positioned 
   - *image*: the image to use for the sprite
   - *hitBox*: the dimensions of the box used for detecting collisions
   - *physics*: allows the sprite to have a x and y velocity, in pixels per frame
   - *start*: a function which can change a sprite's values right before the game starts
   - *update*: a function which can change a sprite's values each frame
   - *onCollision*: a function to:  
     1. check what a sprite has collided with and 
     2. change the sprite's values based off of the collision

It's okay if the descriptions, or certain words are new or don't make sense. There's a lot of topics we haven't covered. What's most important is:
    1. the bolded words and
    2. knowing which are considered attributes and which are considered components

All of our sprites will have a name, a width and a height. Additionally, all of our sprites will have a position, and a hit box. And, the sprite's hit box will have the same width and height as the sprite. 

From here, we'll look at the intial values that we'll use for attributes and components needed for our 7 sprites.

#### left and right paddles ####
Both of our paddles will have a width of `16`, a height of `96`. They will both have images, `sprites/pong/paddle.png`. The sprites will have a hit box, with a width and height of `16` and `96`. The sprites will have physics. And, the sprites will have an `update` function.

Two of the most important things about these sprites are the name and position. For collisions, it's really important that we're able to easily tell which paddle is involved, so the name should be clear and descriptive. While we could use names like `player 1` and `player 2`, these don't do a good job of describing whether the left or right paddle is involved. The best, and maybe the simplest, names we can use are `left paddle` and `right paddle`. 

Now let's go over the positions. Earlier we mentioned that we'll use two invisible walls to detect when the ball moves past the paddles. To make that work, we can position our paddles so that we create a gap between them and these invisible side walls. We'll also make sure the gap is wide enough so that the walls, ball, and paddles can all never collide at the same time. We know this will work because the paddles will only be able to move up and down, so not being able to move the paddles left to right makes it impossible to decrease the width of the gap. You might think this a lot of planning just over some spacing. If you're wondering "why does this gap even mattter?", that's a great question! Here's two reasons why this is a good exercise in planning our game.

 1. The gap creates a visual element for the player. They'll notice the spacing between backside of the paddles and edge of the game, and it gets them thinking about the gameplay and to see what happens if the ball gets past the paddles.
 2. The gap also solves some game development challenges. Let's pretend that we position the paddles so that the backside is right alongside the walls. This would cause constant collisions between the paddles and side walls, and prevent the paddles from being able to move. The gap prevents this, and makes sure that the ball can collide either only with the side wall, or the paddle, not both.

With all of that figured out, we can now choose an initial position for both paddles. For the left paddle, the initial position will be `(100, 272)`. For the right paddle, the initial position will be `(540, 272)`.

| attributes             | left padde               | right paddle              |
|-----------------------:|-------------------------:|--------------------------:|
| name                   |`left paddle`             | `right paddle`            |
| width                  | 16                       | 16                        |
| height                 | 96                       | 96                        |

| components             | left paddle              | right paddle              |
|-----------------------:|-------------------------:|--------------------------:|
| x position             | 100                      | 540                       |
| y position             | 272                      | 272                       |
| image source (src)     | `sprites/pong/paddle.png`| `sprites/pong/paddle.png` |
| physics                | `yes`                    | `yes`                     |
| hit box width          | 16                       | 16                        |
| hit box height         | 96                       | 96                        |
| `start` function       | `no`                     | `no`                      |
| `update` function      | `yes`                    | `yes`                     |
| `onCollision` function | `no`                     | `no`                      |

#### ball ####
The ball will be named `ball`. It will have a width of `16` and a height of `16`. Its initial position will be `(320, 320)` and the image will be `sprites/pong/ball.png`. It will have a hit box, with a width of `16` and a height of `16`. It will also have physics.

What's unique to the ball is that it will have `onCollision` and `start` functions. `start` allows us to set the ball's initial velocity before the game begins. When the ball collides with anything, `onCollision` allows us to learn more about the other sprite in the collision and also allows us to react. Remember that we mentioned that the ball bounces off of walls and paddles? These are examples of how `onCollision` would be used. We look at attributes of the other sprite, and use them to determine how to change the ball's direction. We'll look at this more in the section on dynamic values for sprites.

| attributes | ball  |
|-----------:|------:|
| name       |`ball` |
| width      | 16    |
| height     | 16    |

| components             | ball                    |
|-----------------------:|------------------------:|
| x position             | 320                     |
| y position             | 320                     |
| image source (src)     | `sprites/pong/ball.png` |
| physics                | `yes`                   |
| hit box width          | 16                      |
| hit box height         | 16                      |
| `start` function       | `yes`                   |
| `update` function      | `no`                    |
| `onCollision` function | `yes`                   |

#### walls ####
The walls are really simple. They will only have a name, a position, a width, a height, and a hit box. Since the walls never move, we don't need physics. Since they're invisible, we don't need an image. And all of the game logic will be kept in the paddles and the ball, so walls don't need `start`, `update` or `onCollision` functions.

|atttributes|bottom wall  |top wall  |left wall  |right wall  |
|----------:|------------:|---------:|----------:|-----------:|
|name       |`bottom wall`|`top wall`|`left wall`|`right wall`|
|width      |640          |640       |64         |64          |
|height     |16           |16        |640        |640         |


|**components**          | **bottom wall**   | **top wall**  | **left wall**  | **right wall**  |
|-----------------------:|------------------:|--------------:|---------------:|----------------:|
|x position              |0                  |0              |0               |576              |
|y position              |576                |0              |0               |0                |
|image source (src)      | -           |-         |-          |-           |
|physics                 |`false`      | `false`  |`false`    |`false`     |
| hit box width          |640          |640       |64         |64          |
| hit box height         |16           |16        |640        |640         |
| `start` function       |`no`         |`no`      |`no`       |`no`        |
| `update` function      |`no`         |`no`      |`no`       |`no`        |
| `onCollision` function |`no`         |`no`      |`no`       |`no`        |

### 4. sprites' dynamic values ###

While a game is played, sprites can have values that change over time. These changes can be caused by keyboard input, or other events like sprites colliding. In our game, we have two major events that cause values to change:

 1. Keyboard input to move paddles
 2. Ball colliding with other sprites

In all of our events, we update either the x or y velocity, or the position of one of the sprites. To walkthrough each event, we'll look at the sprite affectd, the event that causes a value to change, the sprite attribute that will be changed, and the actual value before and after the event. If the table has a `-` in the before column, it just means that value before the event doesn't matter. 

|sprite affected|event                       | attribute         | before | after             |
|--------------:|---------------------------:|------------------:|-------:|------------------:|
|left paddle    |action leftPaddleUp         | `this.velocity.y` | 0      | -1.5              |
|left paddle    |action leftPaddleDown       | `this.velocity.y` | 0      |  1.5              |
|right paddle   |action rightPaddleUp        | `this.velocity.y` | 0      | -1.5              |
|right paddle   |action rightPaddleDown      | `this.velocity.y` | 0      | 1.5               |
|ball           |start of game               | `this.velocity.x` | -      | -0.5              |
|ball           |start of game               | `this.velocity.y` | -      | -0.5              |
|ball           |collided with left paddle   | `this.velocity.x` | -      | `-this.velocity.x`|
|ball           |collided with right paddle  | `this.velocity.x` | -      | `-this.velocity.x`|
|ball           |collided with top wall      | `this.velocity.y` | -      | `-this.velocity.y`|
|ball           |collided with bottom wall   | `this.velocity.y` | -      | `-this.velocity.y`|
|ball           |collided with left wall     | `this.position.x` | -      | 320               |
|ball           |collided with left wall     | `this.position.y` | -      | 320               |
|ball           |collided with left wall     | `this.velocity.x` | -      | -0.5              |
|ball           |collided with left wall     | `this.velocity.y` | -      | -0.5              |





