var STREET_COLOR = '#C9C9C9';
var AGENT_COLOR = '#313536';
var STREET_CHAR = ' ';
var SIDEWALK_CHAR = '=';
var BG_CHAR = 'M';
var PIXELS_PER_CHAR = 2;
var PIXEL_DENSITY = 2;  // for retina screen

var DIRECTIONS = ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'];

// agents are oriented for walking top to down
var DIRECTION_CHAIN = {
  'nw': Array.prototype.concat(
    DIRECTIONS,
    Array(30).fill('sw'),
    Array(30).fill('nw'),
    Array(30).fill('w')
  ),
  'n': DIRECTIONS,
  'ne': DIRECTIONS,
  'w': Array.prototype.concat(
    DIRECTIONS,
    Array(10).fill('sw'),
    Array(30).fill('s'),
    Array(10).fill('nw'),
    Array(30).fill('w')
  ),
  'e': DIRECTIONS,
  'sw': Array.prototype.concat(
    DIRECTIONS,
    Array(30).fill('sw'),
    Array(30).fill('s'),
    Array(10).fill('nw'),
    Array(30).fill('w')
  ),
  's': Array.prototype.concat(
    DIRECTIONS,
    Array(30).fill('sw'),
    Array(30).fill('s')
  ),
  'se': DIRECTIONS,
};
