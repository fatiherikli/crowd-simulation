var WALK = 0;
var TURN_BACK = 1;
var DEAD = 2;

function Agent(x, y, direction, model, lifetime) {
  this.direction = direction;
  this.model = model;
  this.map = model.map;
  this.age = 0;
  this.state = WALK;
  this.lifetime = lifetime || 100;

  if (x || y) {
    this.x = x;
    this.y = y;
  } else {
    var coords = this.map.randomSidewalkCoords();
    this.x = coords[0];
    this.y = coords[1];
  }

  this.path = [
    [this.x, this.y],
  ];
}

Agent.prototype.forward = function () {
  switch (this.direction) {
    case 'w':
      this.x -= 1;
      break;

    case 'nw':
      this.x -= 1;
      this.y -= 1;
      break;

    case 'n':
      this.y -= 1;
      break;

    case 'ne':
      this.x += 1;
      this.y -= 1;
      break;

    case 'e':
      this.x += 1;
      break;

    case 'se':
      this.x += 1;
      this.y += 1;
      break;

    case 's':
      this.y += 1;
      break;

    case 'sw':
      this.x -= 1;
      this.y += 1;
      break;
  }
}

Agent.prototype.findMovableDirection = function () {
  var possibleDirections = this.map.movableDirections(this.x, this.y);

  if (!DIRECTION_CHAIN[this.direction]) {
    return;
  }

  var chain = DIRECTION_CHAIN[this.direction].filter(
    function (direction) {
      return possibleDirections.indexOf(direction) > -1;
    }
  );

  var uniqueDirections = chain.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });

  var multipier = 100 / chain.length;

  var possibilites = uniqueDirections.map(function (directionA) {
    return [
      chain.filter(function (directionB) {
        return directionA === directionB;
      }).length * multipier / 100,
      directionA
    ]
  });

  var next = this.weightedRandom(possibilites);

  if (!next) {
    // turn back if there is no possible action
    next = possibleDirections[0];
  }

  return next;
}

Agent.prototype.weightedRandom = function (spec) {
  var sum = 0,
      random = Math.random();

  for (var i in spec) {
    var state = spec[i];
    sum += state[0];
    if (random <= sum) {
      return state[1];
    };
  }
};

Agent.prototype.tick = function () {
  if (this.state === DEAD) {
    return;
  }

  if (this.age > this.lifetime / 2) {
    this.state = TURN_BACK;
  }

  if (this.state === WALK) {
    var direction = this.findMovableDirection();
    if (direction) {
      this._prevPosition = {
        x: this.x,
        y: this.y,
      };
      this.direction = direction;
      this.forward();
    } else {
      this.turnBack();
    }

    this.path.push([this.x, this.y]);
  } else {
    var prev = this.path.pop();
    if (!prev) {
      this.state = DEAD;
    } else {
      this.x = prev[0];
      this.y = prev[1];
    }
  }

  this.age++;
}

Agent.prototype.turnBack = function () {
  var prev = this._prevPosition;
  if (prev) {
    this.x = prev.x;
    this.y = prev.y;
  }
}
