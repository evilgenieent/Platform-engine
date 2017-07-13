/**
 * GAME FILE
 *
 * Main file is runned in concurrence with index.html when opening the game
 *
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

//Add 'testMap' for testing
var list_of_maps = [map1, map2, map3];

/* Setup map setting s*/
list_of_maps.forEach(function (map) {

    /* Set map setting */
    set_keys(map);
    set_gravity(map);
    set_vel_limit(map);
    set_movement_speed(map);

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


/* BUTTON FUNCTIONS */

/* Resets the number of deaths */
function reset_death_counter() {
    if(death_counter > 0 && death_counter < list_length){
        death_counter = 0;
        document.getElementById("death_counter").innerHTML = death_counter;
        game.load_map(list_of_maps[map_nr]);
    }
}

/* Goes to the next map */
function go_next_map() {
    if (map_nr < list_length-1) game.load_map(list_of_maps[++map_nr]);
}

/* Goes to the previous map */
function go_previous_map() {
    if(map_nr > 0) game.load_map(list_of_maps[--map_nr]);
}

/* Resets game */
function reset_game() {
    map_nr = 0;
    death_counter = 0;
    document.getElementById("death_counter").innerHTML = death_counter;
    game.load_map(list_of_maps[map_nr]);
}