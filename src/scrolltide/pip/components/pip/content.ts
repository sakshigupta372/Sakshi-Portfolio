/** Pip — copy, shapes, eye styles, finishes and colours. */
export const COPY = {
  title: 'Say hi to Pip.',
  line: 'Round, quiet and paying attention. Usually.',
  hint: 'Give it a tap.',
  asleep: 'Shh. Pip is napping — move to wake it.',
};

/** Shape ids match `shape()` in the shader; eyeY is where the face sits on that shape. */
export const SHAPES = [
  {label: 'Bun', id: 0, eyeY: 0.02},
  {label: 'Pebble', id: 1, eyeY: -0.27},
  {label: 'Cube', id: 2, eyeY: 0.0},
  {label: 'Drop', id: 3, eyeY: -0.24},
];
/** rx, ry (body units), separation from the centre line. */
export const EYES = [
  {label: 'Dots', rx: 0.084, ry: 0.084, sep: 0.27},
  {label: 'Pills', rx: 0.054, ry: 0.105, sep: 0.25},
  {label: 'Ovals', rx: 0.074, ry: 0.112, sep: 0.3},
  {label: 'Beads', rx: 0.048, ry: 0.048, sep: 0.22},
];
export const FINISHES = [
  {label: 'Matte', rough: 0.95, gloss: 0},
  {label: 'Satin', rough: 0.55, gloss: 0},
  {label: 'Gloss', rough: 0.14, gloss: 0.6},
];
export const COLOURS = [
  {label: 'Chalk', hex: '#f2eee7'},
  {label: 'Apricot', hex: '#ffb48c'},
  {label: 'Sage', hex: '#a9c49f'},
  {label: 'Lilac', hex: '#bdb0f2'},
  {label: 'Ink', hex: '#2c2f3a'},
];
