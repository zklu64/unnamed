define(['module'], function (module) {
    let lookup = module.config().lookup;
    function Projectile(type, start, power, target) {
        this.type = type;
        this.pos = start;
        this.speed = lookup[type][0];
        this.frames = lookup[type][1];
        this.sprite = lookup[type][2];
        this.power = power;
        this.explode = false;
        this.timer = Date.now();
        this.target = target;
        let temp = [target.pos[0]-start[0], target.pos[1]-start[1]];
        let magnitude = Math.sqrt(temp[0] * temp[0] + temp[1] * temp[1]);
        this.dir = [temp[0]/magnitude, temp[1]/magnitude];
    };

    Projectile.prototype.chase = function () {
      console.log(this);
      this.pos[0] += (this.dir[0] * this.speed);
      this.pos[1] += (this.dir[1] * this.speed);
      if (Date.now() - this.timer >= 500) {
        this.timer = Date.now();
        let temp = [this.target.pos[0] -this.pos[0], this.target.pos[1] -this.pos[1]];
        let magnitude = Math.sqrt(temp[0] * temp[0] + temp[1] * temp[1]);
        this.dir = [temp[0]/magnitude, temp[1]/magnitude];
      }
    }

    return Projectile;
});
