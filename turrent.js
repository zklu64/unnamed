define([], function () {
    function Turrent(type, enemies, start = [-1, -1]) {
        this.type = type;
        this.pos = start;
        this.enemies = enemies; //reference to enemies array for target calculations
        this.power = 10;
        this.target = null;
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
      } else if (Math.abs(this.target.pos[0] - this.pos[0]) > 1 || Math.abs(this.target.pos[1] - this.pos[1]) > 1) {
        this.target = null;
      }
    }

    return Turrent;
});
