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

