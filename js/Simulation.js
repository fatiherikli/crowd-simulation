function Simulation(canvas, width, height, mapData, controllerElement) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.controllerElement = controllerElement;
  this.height = height;
  this.width = width;

  this.map = new TextMap(mapData, width, height);
  this.model = new Model(this.map, width, height);

  this.tick = this.tick.bind(this);
  this.handleMouseDown = this.handleMouseDown.bind(this);
  this.running = false;
  this.iterations = 0;
  this.spawnCount = 10;
}

Simulation.prototype.drawSquare = function (x, y, color, size) {
  var context = this.context;
  context.beginPath();
  context.fillStyle = color;
  size = size || PIXELS_PER_CHAR;
  context.rect(
    PIXELS_PER_CHAR * PIXEL_DENSITY * x,
    PIXELS_PER_CHAR * PIXEL_DENSITY * y,
    PIXEL_DENSITY * size,
    PIXEL_DENSITY * size
  );
  context.fill();
}

Simulation.prototype.drawCircle = function (x, y, color, size) {
  var context = this.context;
  context.beginPath();
  context.fillStyle = color;
  var radius = size || PIXELS_PER_CHAR;
  context.arc(
    PIXELS_PER_CHAR * PIXEL_DENSITY * x + (radius/2),
    PIXELS_PER_CHAR * PIXEL_DENSITY * y + (radius/2),
    radius,
    0,
    2 * Math.PI,
    false
  );
  context.fill();
}

Simulation.prototype.getContextState = function () {
  var context = this.context;
  var canvas = this.canvas;

  return context.getImageData(
    0,
    0,
    canvas.width * PIXEL_DENSITY,
    canvas.height * PIXEL_DENSITY * 2
  );
}

Simulation.prototype.restoreContextState = function (state) {
  this.context.putImageData(state, 0, 0);
}

Simulation.prototype.clear = function (state) {
  var context = this.context;
  var canvas = this.canvas;
  context.clearRect(
    0,
    0,
    canvas.width * PIXEL_DENSITY,
    canvas.height * PIXEL_DENSITY
  );
}

Simulation.prototype.drawMap = function () {
  var canvas = this.canvas;
  var context = this.context;
  for (var row = 0; row <= this.height; row++) {
    for (var column = 0; column <= this.width; column++) {
      if (
        this.map.isMovable(column, row)
      ) {
        this.drawSquare(column, row, STREET_COLOR);
      }
    }
  }
  this._mapCache = this.getContextState();
}

Simulation.prototype.render = function () {
  this.bindEvents();
  this.renderController();
  this.drawMap();
  this.draw();
}

Simulation.prototype.renderController = function () {
  new Controller(
    this.controllerElement,
    this
  ).render();
}

Simulation.prototype.draw = function () {
  this.model.agents.forEach(function (agent) {
    this.drawSquare(agent.x, agent.y, AGENT_COLOR);
  }.bind(this));
}

Simulation.prototype.tick = function () {
  this.model.tick();
  this.clear();
  this.restoreContextState(this._mapCache);
  this.draw();

  if (this.iterations % 10 === 0) {
    this.model.spawn(this.spawnCount);
  }

  if (this.running) {
    requestAnimationFrame(this.tick);
  }

  this.iterations++;
}

Simulation.prototype.reset = function () {
  this.running = false;
  this.iterations = 0;
  this.model.reset();
}

Simulation.prototype.run = function () {
  this.running = !this.running;
  this.tick();
}

Simulation.prototype.bindEvents = function (event) {
  this.canvas.addEventListener(
    'mousemove',
    this.handleMouseMove.bind(this)
  );

  this.canvas.addEventListener(
    'mousedown',
    this.handleMouseDown.bind(this)
  );

  this.canvas.addEventListener(
    'mouseup',
    this.handleMouseUp.bind(this)
  );
};

Simulation.prototype.handleMouseMove = function (event) {
  if (this.mousePressed) {
    this.drawStreet(event)
  }
};

Simulation.prototype.drawStreet = function (event) {
  var bbox = this.canvas.getBoundingClientRect();
  var clientX = event.clientX;
  var clientY = event.clientY;
  var top = bbox.top;
  var left = bbox.left;

  var mapX = Math.floor((clientX - left) / PIXEL_DENSITY);
  var mapY = Math.floor((clientY - top) / PIXEL_DENSITY);

  var char = this.map.isStreet(mapX, mapY) ? BG_CHAR : STREET_CHAR;

  this._mapCache = false;
  this.clear();
  this.map.setCharWithXY(mapX, mapY, char);
  this.drawMap();
}

Simulation.prototype.handleMouseDown = function (event) {
  this.mousePressed = true;
  this.drawStreet(event);
};

Simulation.prototype.handleMouseUp = function (event) {
  this.mousePressed = false;
};
