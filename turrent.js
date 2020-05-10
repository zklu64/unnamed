define(['module'], function (module) {
    let lookup = module.config().lookup;
    function Turrent(type, enemies, start = [-1, -1]) {
        this.type = type;
        this.pos = start;
        this.enemies = enemies; //reference to enemies array for target calculations
        this.target = null;
        this.rotation = 0;
        this.interval = lookup[type][0]; //attack interval in miliseconds;
        this.power = lookup[type][1];
        this.cost = lookup[type][2];
        this.range = lookup[type][3];
        this.aoe = lookup[type][4];
        this.sprite = lookup[type][5];
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
        if (Math.abs(enemy.pos[0] - self.pos[0]) <= self.range && Math.abs(enemy.pos[1] - self.pos[1]) <= self.range) {
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
    Turrent.prototype.attack = function (projectiles) {
      if (this.target == null) {
        this.findTarget();
      } else {
        if (Math.abs(this.target.pos[0] - this.pos[0]) > this.range || Math.abs(this.target.pos[1] - this.pos[1]) > this.range  || this.target.health <= 0) {
          this.target = null;
        } else {
          this.rotation = Math.atan2(-(this.target.pos[0] - this.pos[0]), -(this.target.pos[1] - this.pos[1]));
          let startTileCopy = this.pos.slice();
          //calculate bullet start location w.r.t enemy
          let temp = [this.target.pos[0] - this.pos[0], this.target.pos[1] - this.pos[1]];
          let magnitude = 2*Math.sqrt(temp[0] * temp[0] + temp[1] * temp[1]);
          startTileCopy[0] += (0.5 + temp[0]/magnitude);
          startTileCopy[1] += (0.5 + temp[1]/magnitude);

          let context = this;
          require(['projectile'], function(projectile) {
            projectiles.push(new projectile("basic", startTileCopy, context.power, context.target, context.aoe));
          });
        }
      }
    }

    return Turrent;
});
