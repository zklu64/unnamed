define(['module'], function (module) {
    let lookup = module.config().lookup;
    function Projectile(type, start, power, target, aoe) {
        this.type = type;
        this.pos = start;
        this.speed = lookup[type][0];
        this.frames = lookup[type][1];
        this.sprite = lookup[type][2];
        this.power = power;
        this.explode = false;
        this.timer = Date.now();
        this.target = target;
        this.aoe = aoe;
        this.rotation = 0;
        let temp = [target.pos[0]+0.5 -start[0], target.pos[1]+0.5 -start[1]];
        let magnitude = Math.sqrt(temp[0] * temp[0] + temp[1] * temp[1]);
        this.dir = [temp[0]/magnitude, temp[1]/magnitude];
        this.rotation = Math.atan2(-this.dir[0], -this.dir[1]);
    };

    Projectile.prototype.chase = function (enemySize) {
      this.pos[0] += (this.dir[0] * this.speed);
      this.pos[1] += (this.dir[1] * this.speed);
      this.pos[0] = Number(this.pos[0].toFixed(3));
      this.pos[1] = Number(this.pos[1].toFixed(3));
      //we hit target, time to prep for deletion
      if ((this.pos[0]-this.target.pos[0] < 0.7 && this.pos[0]-this.target.pos[0] > 0.3
        && this.pos[1]-this.target.pos[1] < 0.7 && this.pos[1]-this.target.pos[1] > 0.3
      || this.target.health < 0) && !this.explode) {
        this.explode = true;
        this.target.health -= this.power;
      }
      if (Date.now() - this.timer >= 500) {
        this.timer = Date.now();
        let temp = [this.target.pos[0]+0.5 - this.pos[0], this.target.pos[1]+0.5 - this.pos[1]];
        let magnitude = Math.sqrt(temp[0] * temp[0] + temp[1] * temp[1]);
        this.dir = [temp[0]/magnitude, temp[1]/magnitude];
        this.rotation = Math.atan2(-this.dir[0], -this.dir[1]);
      }
    }

    return Projectile;
});
