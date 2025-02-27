const solver = require('./day-19');

const EXAMPLE = `#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5`;

test('Day 19', () => {
  expect(solver(EXAMPLE)).toEqual([ 7, 12 ]);
});
