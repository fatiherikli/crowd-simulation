function Controller(element, simulation) {
  this.element = element;
  this.simulation = simulation;
  this.template = (
    document.getElementById('controller-template').innerHTML
  );
}

Controller.prototype.render = function () {
  this.element.innerHTML = this.template;
  this.bindEvents();
}

Controller.prototype.bindEvents = function () {
  var simulation = this.simulation;
  var element = this.element;
  var resetButton = element.querySelector('.reset');
  var runButton = element.querySelector('.run');

  runButton.addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      simulation.run();
      runButton.innerHTML = (
        simulation.running ? 'Pause' : 'Run'
      );

      if (simulation.running) {
        resetButton.removeAttribute('disabled');
      } else {
        resetButton.setAttribute('disabled', 'disabled');
      }
    }
  );

  resetButton.addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      simulation.reset();

      runButton.innerHTML = 'Run';
      resetButton.setAttribute('disabled', 'disabled');
    }
  );

  element.querySelector(
    '.agents'
  ).addEventListener(
    'input',
    function (event) {
      simulation.spawnCount = Number(event.target.value);
      element.querySelector(
        '.agent-count'
      ).innerHTML = event.target.value;
    }
  )
}
