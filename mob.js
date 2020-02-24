define([], function () {
    var returnedMob = function (type, start, direction) {
        this.type = type;
        this.pos = start;
        this.dir = direction;
        this.health = 100;
        this.def = 0;
    };

    return returnedMob;
});
