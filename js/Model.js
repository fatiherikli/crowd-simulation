function Model(map) {
  this.map = map;
  this.agents = [];
}

Model.prototype.reset = function () {
  this.agents = [];
}

Model.prototype.tick = function () {
  this.agents.forEach(function (agent, index) {
    if (agent.state === DEAD) {
      this.agents.splice(index, 1);
    } else {
      agent.tick();
    }
  }.bind(this));
}

Model.prototype.spawn = function (count) {
  this.agents = this.agents.concat(
    Array(count).fill(
      null
    ).map(function () {
      var lifetime = Math.floor(Math.random() * 10000);
      var direction = Math.floor(Math.random() * 7);
      return new Agent(
        null,
        null,
        TextMap.Directions[direction],
        this,
        lifetime
      );
    }.bind(this))
  );
}
