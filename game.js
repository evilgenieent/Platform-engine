window.requestAnimFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||  window.msRequestAnimationFrame ||
    function(callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

/* General map setup */


/* Game setup */
var game = new Labyrinth();
var list_of_maps = [map1, map2, map3];

// list_of_maps.forEach(function (map) {
//     map.scripts.death = get_death();
//     map.scripts.change_colour = get_change_color();
//     map.scripts.next_level = get_next_level();
//     map.scripts.unlock = get_unlock();
// });
var map_nr = 0;
var list_length = list_of_maps.length;
for(var i = 0; i < list_length; i++) {
    list_of_maps[i].scripts.death = get_death();
    list_of_maps[i].scripts.change_colour = get_change_color();
    list_of_maps[i].scripts.next_level = get_next_level();
    list_of_maps[i].scripts.unlock = get_unlock();
}

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

