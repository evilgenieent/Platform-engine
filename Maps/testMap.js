/*
 * TEST MAP
 *
 */
var testMap = {

    tile_size: 16,

    /* An array representing the map tiles. Each number corresponds to a key */
    data: [
        [2, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 8, 0, 0, 0, 0, 0, 9, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],

    /* The coordinates at which the player spawns and the colour of the player */
    player: {
        x: 4,
        y: 1,
        colour: '#fff'
    },

    /* scripts referred to by the "script" variable in the tile keys */
    scripts : {}
};