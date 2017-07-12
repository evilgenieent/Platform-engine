/*
 Copyright (c) 2013 dissimulate at codepen

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Have used the basic platform engine code. Restructured the code,
 added documentation and explanations. Retracted map settings to a external file
 in the Maps directory. Added and changed dialogs and user interactions.
 */

/*
* LABYRINTH ENGINE
*/

var Labyrinth = function () {

    this.alert_errors   = false;
    this.log_info       = true;
    this.tile_size      = 16;
    this.limit_viewport = false;
    this.jump_switch    = 0;

    this.viewport = {
        x: 200,
        y: 200
    };

    this.camera = {
        x: 0,
        y: 0
    };

    this.key = {
        left: false,
        right: false,
        up: false
    };

    this.player = {
        loc: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0
        },
        can_jump: true
    };

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup   = this.keyup.bind(this);
};


/*
* ERROR FUNCTION
* @param {string} message
*/
Labyrinth.prototype.error = function (message) {
    if (this.alert_errors) {
        alert(message);
    }
    if (this.log_info) {
        console.log(message);
    }
};


/*
* LOG FUNCTION
* @param {string} message
*/
Labyrinth.prototype.log = function (message) {
    if (this.log_info) {
        console.log(message);
    }
};


/*
* SETS THE VIEWPORT
* @param {number} x
* @param {number} y
 */
Labyrinth.prototype.set_viewport = function (x, y) {
    this.viewport.x = x;
    this.viewport.y = y;
};


/*
* KEYDOWN
* @param e (keypress)
*/
Labyrinth.prototype.keydown = function (e) {
    var _this = this;
    switch (e.keyCode) {
        case 37:
            _this.key.left = true;
            break;
        case 38:
            _this.key.up = true;
            break;
        case 39:
            _this.key.right = true;
            break;
    }
};


/*
* KEYUP
* @param e (keypress)
*/                     
Labyrinth.prototype.keyup = function (e) {
    var _this = this;
    switch (e.keyCode) {
        case 37:
            _this.key.left = false;
            break;
        case 38:
            _this.key.up = false;
            break;
        case 39:
            _this.key.right = false;
            break;
    }
};


/*
* LOADS MAP
* Required: keys, data (of tiles), velocity, gravity, player, and scripts
* @param {variable} map (variable from external file, the map to be used)
* @return (boolean} true if map exists, else false
*/
Labyrinth.prototype.load_map = function (map) {
    if (typeof map === 'undefined' || typeof map.data === 'undefined' || typeof map.keys === 'undefined') {
        this.error('Error: Invalid map data!');
        return false;
    }

    this.current_map = map;

    this.current_map.background = map.background || '#333';
    this.current_map.gravity = map.gravity || {x: 0, y: 0.3};
    this.tile_size = map.tile_size || 16;

    var _this = this;

    this.current_map.width = 0;
    this.current_map.height = 0;

    map.keys.forEach(function (key) {

        map.data.forEach(function (row, y) {

            _this.current_map.height = Math.max(_this.current_map.height, y);

            row.forEach(function (tile, x) {

                _this.current_map.width = Math.max(_this.current_map.width, x);

                if (tile === key.id)
                    _this.current_map.data[y][x] = key;
            });
        });
    });

    this.current_map.width_p = this.current_map.width * this.tile_size;
    this.current_map.height_p = this.current_map.height * this.tile_size;

    this.player.loc.x = map.player.x * this.tile_size || 0;
    this.player.loc.y = map.player.y * this.tile_size || 0;
    this.player.colour = map.player.colour || '#000';

    this.key.left  = false;
    this.key.up    = false;
    this.key.right = false;

    this.camera = {
        x: 0,
        y: 0
    };

    this.player.vel = {
        x: 0,
        y: 0
    };
    this.log('Successfully loaded map data.');
    return true;
};


/*
* GET TILE
* @param {number} x (x-coordinate of tile)
* @param {number} y (y-coordinate of tile)
* @return {number} tile-type
*/
Labyrinth.prototype.get_tile = function (x, y) {
    return (this.current_map.data[y] && this.current_map.data[y][x]) ? this.current_map.data[y][x] : 0;
};


/* Draws a tile with a (x,y) position */
/*
 * DRAWS TILE
 * @param {number} x (x-coordinate of tile)
 * @param {number} y (y-coordinate of tile)
 * @param {number} tile
 * @param {context}
 */
Labyrinth.prototype.draw_tile = function (x, y, tile, context) {

    if (!tile || !tile.colour){
        return;
    }
    context.fillStyle = tile.colour;
    context.fillRect(
        x,
        y,
        this.tile_size,
        this.tile_size
    );
};


/*
 * DRAWS THE MAP
 * @param {context}
 * @param {number} fore (used to check if its a water tile)
 */
Labyrinth.prototype.draw_map = function (context, fore) {

    for (var y = 0; y < this.current_map.data.length; y++) {
        for (var x = 0; x < this.current_map.data[y].length; x++) {

            if ((!fore && !this.current_map.data[y][x].fore) || (fore && this.current_map.data[y][x].fore)) {
                var t_x = (x * this.tile_size) - this.camera.x;
                var t_y = (y * this.tile_size) - this.camera.y;

                if(t_x < -this.tile_size
                    || t_y < -this.tile_size
                    || t_x > this.viewport.x
                    || t_y > this.viewport.y) continue;

                this.draw_tile(
                    t_x,
                    t_y,
                    this.current_map.data[y][x],
                    context
                );
            }
        }
    }

    if (!fore) this.draw_map(context, true);
};


/*
 * MOVES PLAYER ON THE MAP
 */
Labyrinth.prototype.move_player = function () {

    var tX = this.player.loc.x + this.player.vel.x;
    var tY = this.player.loc.y + this.player.vel.y;
    var offset = Math.round((this.tile_size / 2) - 1);

    var tile = this.get_tile(
        Math.round(this.player.loc.x / this.tile_size),
        Math.round(this.player.loc.y / this.tile_size)
    );

    // Have to check if the tile the player is on has gravity else use map gravity
    if(tile.gravity) {
        this.player.vel.x += tile.gravity.x;
        this.player.vel.y += tile.gravity.y;

    } else {
        this.player.vel.x += this.current_map.gravity.x;
        this.player.vel.y += this.current_map.gravity.y;
    }

    //Checks if player is on the "road" of the map, then adds movement friction
    if (tile.friction) {
        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }

    var t_y_up   = Math.floor(tY / this.tile_size);
    var t_y_down = Math.ceil(tY / this.tile_size);
    var y_near1  = Math.round((this.player.loc.y - offset) / this.tile_size);
    var y_near2  = Math.round((this.player.loc.y + offset) / this.tile_size);

    var t_x_left  = Math.floor(tX / this.tile_size);
    var t_x_right = Math.ceil(tX / this.tile_size);
    var x_near1   = Math.round((this.player.loc.x - offset) / this.tile_size);
    var x_near2   = Math.round((this.player.loc.x + offset) / this.tile_size);

    var top1    = this.get_tile(x_near1, t_y_up);
    var top2    = this.get_tile(x_near2, t_y_up);
    var bottom1 = this.get_tile(x_near1, t_y_down);
    var bottom2 = this.get_tile(x_near2, t_y_down);
    var left1   = this.get_tile(t_x_left, y_near1);
    var left2   = this.get_tile(t_x_left, y_near2);
    var right1  = this.get_tile(t_x_right, y_near1);
    var right2  = this.get_tile(t_x_right, y_near2);

    if (tile.jump && this.jump_switch > 15) {
        this.player.can_jump = true;
        this.jump_switch = 0;

    } else this.jump_switch++;


    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);
    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;
    this.player.vel.x *= .9;
    var bounce;

    if (left1.solid || left2.solid || right1.solid || right2.solid) {

        /* fix overlap */
        while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
        || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x += 0.1;

        while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
        || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
            this.player.loc.x -= 0.1;

        /* tile bounce */
        bounce = 0;

        if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
        if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
        if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
        if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;

        this.player.vel.x *= -bounce || 0;

    }

    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

        /* fix overlap */
        while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
        || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y += 0.1;

        while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
        || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
            this.player.loc.y -= 0.1;

        /* tile bounce */
        bounce = 0;

        if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
        if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;
        this.player.vel.y *= -bounce || 0;

        if ((bottom1.solid || bottom2.solid) && !tile.jump) {
            this.player.on_floor = true;
            this.player.can_jump = true;
        }
    }

    /* Adjusts the camera based on player movement */

    var c_x = Math.round(this.player.loc.x - this.viewport.x/2);
    var c_y = Math.round(this.player.loc.y - this.viewport.y/2);
    var x_dif = Math.abs(c_x - this.camera.x);
    var y_dif = Math.abs(c_y - this.camera.y);
    var mag;

    if(x_dif > 5) {
        mag = Math.round(Math.max(1, x_dif * 0.1));

        if(c_x !== this.camera.x) {
            this.camera.x += c_x > this.camera.x ? mag : -mag;

            if(this.limit_viewport) {
                this.camera.x = Math.min(this.current_map.width_p - this.viewport.x + this.tile_size, this.camera.x);
                this.camera.x = Math.max(0, this.camera.x);
            }
        }
    }

    if(y_dif > 5) {
        mag = Math.round(Math.max(1, y_dif * 0.1));

        if(c_y !== this.camera.y) {
            this.camera.y += c_y > this.camera.y ? mag : -mag;

            if(this.limit_viewport) {
                this.camera.y = Math.min(this.current_map.height_p - this.viewport.y + this.tile_size, this.camera.y);
                this.camera.y = Math.max(0, this.camera.y);
            }
        }
    }

    if(this.last_tile !== tile.id && tile.script) {
        eval(this.current_map.scripts[tile.script]);
    }
    this.last_tile = tile.id;
};

/*
 * UPDATES THE PLAYER
 */
Labyrinth.prototype.update_player = function () {
    if (this.key.left) {
        if (this.player.vel.x > -this.current_map.vel_limit.x)
            this.player.vel.x -= this.current_map.movement_speed.left;
    }

    if (this.key.up) {
        if (this.player.can_jump && this.player.vel.y > -this.current_map.vel_limit.y) {
            this.player.vel.y -= this.current_map.movement_speed.jump;
            this.player.can_jump = false;
        }
    }

    if (this.key.right) {
        if (this.player.vel.x < this.current_map.vel_limit.x)
            this.player.vel.x += this.current_map.movement_speed.left;
    }
    this.move_player();
};


/*
 * DRAWS THE PLAYER
 * @param {context}
 */
Labyrinth.prototype.draw_player = function (context) {
    context.fillStyle = this.player.colour;
    context.beginPath();
    context.arc(
        this.player.loc.x + this.tile_size / 2 - this.camera.x,
        this.player.loc.y + this.tile_size / 2 - this.camera.y,
        this.tile_size / 2 - 1,
        0,
        Math.PI * 2
    );
    context.fill();
};


/*
* UPDATE FUNCTION
*/
Labyrinth.prototype.update = function () {
    this.update_player();
};


/*
 * DRAW FUNCTION
 * @param {context}
 */
Labyrinth.prototype.draw = function (context) {
    this.draw_map(context, false);
    this.draw_player(context);
};