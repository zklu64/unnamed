define([], function () {
    function Mob(type, start, direction) {
        this.type = type;
        this.pos = start;
        this.dir = direction;
        this.health = 100;
        this.def = 0;
    };

    Mob.prototype.onDrag = function (mouse) {
      mouse.selection = this;
    }

    //every object that can be attached to mouseSelection will have onDrop method
    Mob.prototype.onDrop = function (mouse) {
      mouse.selection = null;
      this.pos = mouse.pos;
      this.dir = [0, 0]
    }
    return Mob;
});
