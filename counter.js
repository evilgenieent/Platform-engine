var increaseCounter = function() {
    alert(++death_counter);
    if(death_counter === 3) {
        death_counter = 0;
        game.load_map(map1);
    } else {
        game.load_map(map2);
    }
    document.getElementById("death_counter").innerHTML = death_counter;
};