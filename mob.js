define(['module'], function (module) {
    let lookup = module.config().lookup;
    function Mob(type, start, direction) {
        this.type = type;
        this.pos = start;
        this.dir = direction;
        this.health = 100;
        this.speed = Math.round(lookup[type][0]/0.02)*0.02;
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

    Mob.prototype.nearby = function (enemies, dist) {
      let nearby = [];
      let self = this;
      enemies.forEach(function(enemy) {
        if (enemy != self) {
          let delta = Math.sqrt(Math.pow(Math.abs(enemy.pos[0] - self.pos[0]),2) + Math.pow(Math.abs(enemy.pos[1] - self.pos[1]), 2));
          if (delta < dist) {
            nearby.push(enemy);
          }
        }
      });
      return nearby;
    }

    return Mob;
});
