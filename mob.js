define([], function () {
    var returnedMob = function (type, start) {
        this.type = type;
        this.tile = start;
        this.dir = 0;
    };

    return returnedMob;
});
