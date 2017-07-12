/*

 Key variables:

 id       [required] - an integer that corresponds with a tile in the data array.
 colour   [required] - any javascript compatible colour variable.
 solid    [optional] - whether the tile is solid or not, defaults to false.
 bounce   [optional] - how much velocity is preserved upon hitting the tile, 0.5 is half.
 jump     [optional] - whether the player can jump while over the tile, defaults to false.
 friction [optional] - friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
 gravity  [optional] - gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
 fore     [optional] - whether the tile is drawn in front of the player, defaults to false.
 script   [optional] - refers to a script in the scripts section, executed if it is touched.

 color-schemes: http://www.color-hex.com/
 */

window.requestAnimFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||  window.msRequestAnimationFrame ||
    function(callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

/* GENERAL GAME SETUP */

/* Game setup */
var game = new Labyrinth();
var list_of_maps = [map1, map2, map3];

/* Setup map setting s*/
list_of_maps.forEach(function (map) {

    /* Sets tile keys */
    map.keys = [
        {id: 0, colour: '#333', solid: 0},
        {id: 1, colour: '#888', solid: 0},
        {id: 2, colour: '#555', solid: 1, bounce: 0.35},
        {id: 3, colour: 'rgba(121, 220, 242, 0.4)', friction: {x: 0.9,y: 0.9}, gravity: {x: 0,y: 0.1}, jump: 1, fore: 1},
        {id: 4, colour: '#777', jump: 1},
        {id: 5, colour: '#E373FA', solid: 1, bounce: 1.1},
        {id: 6, colour: '#666', solid: 1, bounce: 0},
        {id: 7, colour: '#73C6FA', solid: 0, script: 'change_colour'},
        {id: 8, colour: '#67e534', solid: 0, script: 'next_level'},
        {id: 9, colour: '#C93232', solid: 0, script: 'death'},
        {id: 10, colour: '#555', solid: 1},
        {id: 11, colour: '#f1f218', solid: 0,script: 'unlock'}
    ];

    /* Sets map gravity */
    map.gravity = {
        x: 0,
        y: 0.3
    };

    /* Sets velocity limit */
    map.vel_limit ={
        x: 2,
        y: 16
    };

    /* Sets movement speed */
    map.movement_speed = {
        jump: 6,
        left: 0.3,
        right: 0.3
    };

    /* Sets scripts that will be run when you go on a certain tile type */
    map.scripts.death = get_death();
    map.scripts.change_colour = get_change_color();
    map.scripts.next_level = get_next_level();
    map.scripts.unlock = get_unlock();

});


/* Variable holds which map the player is currently on*/
var map_nr = 0;
/* Holds the number of deaths*/
var death_counter = 0;
var list_length = list_of_maps.length;
game.set_viewport(canvas.width, canvas.height);
game.load_map(list_of_maps[0]);

/* Limit the viewport to the confines of the map */
game.limit_viewport = true;
var Loop = function () {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    window.requestAnimFrame(Loop);
};
Loop();

