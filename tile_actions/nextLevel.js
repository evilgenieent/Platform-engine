/* Gravity */
var set_gravity = function (map) {
    map.gravity = {
        x: 0,
        y: 0.3
    }
};

/* Velocity limits */
var set_vel_limit = function (map) {
    map.vel_limit = {
        x: 2,
        y: 16
    }
};


/* Movement speeds */
var set_movement_speed = function (map) {
    map.movement_speed = {
        jump: 6,
        left: 0.3,
        right: 0.3
    }
};