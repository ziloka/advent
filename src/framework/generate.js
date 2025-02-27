/*
 * This script generates source and test files for a puzzle. Only files that
 * don't already exist will be generated. Run this script with `npm run
 * generate {year} {day}`.
 *
 * TODO Intelligently select the year and day when omitted.
 * Each puzzle is released at midnight EST.
 * Example: Day 17 releases on 16 December at 10:00 pm MST.
 * https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
 */
const fs = require('fs');
const path = require('path');
const ansi = require('./ansi');

const SRC_DIR = path.join(__dirname, '..', 'solutions');
const GREEN = ansi(ansi.FG_GREEN, ansi.BOLD);
const RED = ansi(ansi.FG_RED, ansi.BOLD);
const RESET = ansi(ansi.RESET);
const YELLOW = ansi(ansi.FG_YELLOW, ansi.BOLD);

/**
 * Generates the source and test file for a puzzle.
 */
const run = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // TODO No args; do something smart.
  }

  if (args.length < 2) {
    console.error(`${RED}You must specify a year and day to generate.${RESET}`);
    return 1;
  }

  const year = args[0];
  const day = args[1];
  const paddedDay = day.padStart(2, '0');
  const dir = path.join(SRC_DIR, year);
  fs.mkdirSync(dir, { recursive: true });
  const srcPath = path.join(dir, `day-${paddedDay}.js`);
  writeIfDoesNotExist(srcPath, `/**
 * # [Advent of Code ${year} Day ${day}](https://adventofcode.com/${year}/day/${day})
 *
 * @todo Describe solution
 *
 * @param {string} input - the puzzle input
 * @returns {Array} - the puzzle answers
 */
module.exports = input => {
  return [ undefined, undefined ];
};
`);
  const testPath = path.join(dir, `day-${paddedDay}.test.js`);
  const testSrc = `const solver = require('./day-${paddedDay}');

const EXAMPLES = [
  { input: '', output: [ undefined, undefined ] },
];

EXAMPLES.forEach(({ input, output }, i) => {
  test(\`Day ${day}, example \${i}\`, () => {
    expect(solver(input)).toEqual(output);
  });
});
`;
  writeIfDoesNotExist(testPath, testSrc);
  return 0;
}

/**
 * Writes the given file only if it does not already exist.
 *
 * @param {string} filePath - the path to the file to write
 * @param {string} content - the content to write to the file
 */
const writeIfDoesNotExist = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, { flag: 'wx' });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }

    console.log(`${YELLOW}File already exists: ${filePath}${RESET}`);
    return;
  }

  console.log(`${GREEN}Generated: ${filePath}${RESET}`);
};

(async () => {
  process.exit(await run());
})();
