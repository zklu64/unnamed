define([], function () {
    function Turrent(type, start) {
        this.type = type;
        this.pos = start;
        this.health = 100;
        this.def = 0;
    };

    Turrent.prototype.onDrag = function (mouse) {
      mouse.selected = this;
    }

    //every object that can be attached to mouseSelection will have onDrop method
    Turrent.prototype.onDrop = function (mouse) {
      mouse.selected = null;
      this.pos = [mouse.y, mouse.x];
    }
    return Turrent;
});
