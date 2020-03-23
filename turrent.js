define([], function () {
    let lookup = {
      //type of turrent: interval, power, cost TODO:range
      ninja1: [100, 10, 40]
    };
    function Turrent(type, enemies, start = [-1, -1]) {
        this.type = type;
        this.pos = start;
        this.enemies = enemies; //reference to enemies array for target calculations
        this.target = null;
        this.rotation = 0;
        this.interval = lookup[type][0] //attack interval in miliseconds;
        this.power = lookup[type][1];
        this.cost = lookup[type][2];
        this.timer = Date.now();
    };
    //every object that can be attached to mouseSelection will have onDrop method
    Turrent.prototype.onDrop = function (start) {
      this.pos = start;
    }

    Turrent.prototype.findTarget = function() {
      let closest = null;
      let closestDist = Infinity;
      let self = this;
      enemies.forEach(function(enemy) {
        if (Math.abs(enemy.pos[0] - self.pos[0]) <= 1 && Math.abs(enemy.pos[1] - self.pos[1]) <= 1) {
          if (closest == null) {
            closest = enemy;
          } else {
            let dist = Math.sqrt(Math.pow(Math.abs(enemy.pos[0] - self.pos[0]),2) + Math.pow(Math.abs(enemy.pos[1] - self.pos[1]), 2));
            if (dist < closestDist) {
              closest = enemy;
              closestDist = dist;
            }
          }
        }
      });
      self.target = closest;
    }

    //update function called from main
    Turrent.prototype.attack = function () {
      if (this.target == null) {
        this.findTarget();
      } else {
        if (Math.abs(this.target.pos[0] - this.pos[0]) > 1 || Math.abs(this.target.pos[1] - this.pos[1]) > 1  || this.target.health <= 0) {
          this.target = null;
          this.rotation = 0;
        } else {
          this.rotation = Math.atan2(-(this.target.pos[0] - this.pos[0]), -(this.target.pos[1] - this.pos[1]));
          this.target.health -= this.power;
        }
      }
    }

    return Turrent;
});
