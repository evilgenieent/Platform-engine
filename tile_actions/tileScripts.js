var get_death = function () {
    return '++death_counter; if(death_counter === 3) {alert("You died! Start again."); map_counter = 0; death_counter = 0; game.load_map(list_of_maps[map_nr]);} else {game.load_map(list_of_maps[map_nr]);} document.getElementById("death_counter").innerHTML = death_counter;';
}

var get_next_level = function () {
    return ' map_nr++; if(map_nr === list_length) {alert("Yay! You made it through the game! Start all over again."); map_nr = 0; death_counter = 0; game.load_map(list_of_maps[map_nr]); } else {alert("Yay! You made it through the map, onwards to the next!"); game.load_map(list_of_maps[map_nr]);}';
}

var get_unlock = function () {
    return 'game.current_map.keys[10].solid = 0;game.current_map.keys[10].colour = "#888";';
}

var get_change_color = function () {
    return 'game.player.colour = "#"+(Math.random()*0xFFFFFF<<0).toString(16);';
}

