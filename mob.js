define(['module'], function (module) {
    let lookup = module.config().lookup;
    function Mob(type, start, direction) {
        this.type = type;
        this.pos = start;
        this.dir = direction;
        this.health = 100;
        this.speed = lookup[type][0];
        this.loot = lookup[type][1];
        this.attack = lookup[type][2];
        this.def = lookup[type][3];
        this.sprite = lookup[type][4];
    };

    //every object that can be attached to mouseSelection will have onDrop method
    Mob.prototype.onDrop = function (mouse) {
      mouse.selected = null;
      this.pos = [mouse.y, mouse.x];
      this.dir = [0, 0]
    }
    return Mob;
});
