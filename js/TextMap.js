function TextMap(data, width, height) {
  this.data = data;
  this.width = width;
  this.height = height;
  this.sidewalkCoords = this.findSidewalkCoords(data);
}

TextMap.prototype.getPositionFromXY = function (x, y) {
  return y * this.width + x;
}

TextMap.prototype.getCharFromXY = function (x, y) {
  return this.data[this.getPositionFromXY(x, y)];
}

TextMap.prototype.positionToXY = function (position) {
  return [
    Math.floor(position % this.width),
    Math.floor(position / this.width)
  ];
}

TextMap.prototype.setCharWithXY = function (x, y, char) {
  var position = this.getPositionFromXY(x, y);
  this.data = (
    this.data.slice(0, position - 1)
    + char
    + this.data.slice(position)
  );
}

TextMap.prototype.isMovable = function (x, y) {
  return [
    STREET_CHAR,
    SIDEWALK_CHAR,
  ].indexOf(this.getCharFromXY(x, y)) > -1;
}

TextMap.prototype.isStreet = function (x, y) {
  return STREET_CHAR === this.getCharFromXY(x, y);
}

TextMap.prototype.movableDirections = function (x, y) {
  var neighbors = this.mooreNeighbors(x, y);
  return Object.keys(neighbors).filter(
    function (key) {
      var neighbor = neighbors[key];
      return (
        DIRECTION_CHAIN.hasOwnProperty(key) &&
        this.isMovable(neighbor[0], neighbor[1])
      );
    }.bind(this)
  );
};

TextMap.prototype.findSidewalkCoords = function () {
  return Array.prototype.map.call(
    this.data,
    function (char, index) {
      return [index, char];
    }
  ).filter(
    function (line) {
      return line[1] === SIDEWALK_CHAR;
    }
  ).map(
    function (line) {
      return line[0];
    }
  );
};

TextMap.prototype.randomSidewalkCoords = function () {
  var positions = this.sidewalkCoords;
  return this.positionToXY(
    positions[
      Math.floor(Math.random() * positions.length)
    ]
  );
};

TextMap.Directions = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

TextMap.prototype.mooreNeighbors = function (x, y) {
  var map = this.data;
  return {
    'nw': this.positionToXY(
      (y - 1) * this.width + x - 1
    ),
    'n': this.positionToXY(
      (y - 1) * this.width + x
    ),
    'ne': this.positionToXY(
      (y - 1) * this.width + x + 1
    ),
    'w': this.positionToXY(
      y * this.width + x - 1
    ),
    'e': this.positionToXY(
      y * this.width + x + 1
    ),
    'sw': this.positionToXY(
      (y + 1) * this.width + x - 1
    ),
    's': this.positionToXY(
      (y + 1) * this.width + x
    ),
    'se': this.positionToXY(
      (y + 1) * this.width + x + 1
    ),
  };
}
