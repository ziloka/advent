# Advent of Code Solutions

## Introduction

This repository contains my solutions for [Advent of Code](https://adventofcode.com). Most solution repositories you'll find on GitHub contain quick-and-dirty code. That's fine for earning stars as fast as possible, but I wanted something that would be more useful for people wanting to learn from the code. So my solutions are written in a way that is more like what you would do for code that you were intending to maintain for a long period of time: more readable, maintainable, and reusable, and with a lot of test code. It also includes significantly more documentation than I would normally write in order to be more helpful for newer programmers.

Note that I use the word _answer_ to refer to what you actually enter in the Advent of Code site to earn a star. The word _solution_ refers to the code that I write to generate the answer.

## First-Time Setup

After cloning the repository, install dependencies with:

```bash
npm install
```

To enable automatic input download, run:

```bash
npm run session {session-cookie}
```

...where `session-cookie` is the value of your `session` cookie from the Advent of Code web site. If your session cookie changes, you will need to run the command again.

Your session cookie is never transmitted to any location except the Advent of Code web site in order to download your puzzle input. You can confirm this with an inspection of the code. If you're still uncomfortable with providing your session cookie, you can instead provide puzzle input manually. Simply create a file named `input/{year}/{day}.txt` (padding the day with a leading `0` if it's only one digit), and paste your puzzle input into the file.

## Usage

The `npm start` script runs solutions. You can specify the year and day of the solution to run. If the year is omitted, the most recent year that has a directory under `src/solutions` is assumed. If the day is omitted, the most recent day for which a solution module exists in that year folder is assumed. An asterisk (`*`) in place of a year or day means "all".

Run the most recent solution:

```bash
npm start
```

Run the solution for a specific day in the most recent year:

```bash
npm start {day}
```

Run the most recent solution for a specific year:

```bash
npm start {year}
```

Run the solution for a specific year and day:

```bash
npm start {year} {day}
```

Run all solutions for a specific year:

```bash
npm start {year} *
```

Run all solutions for all years:

```bash
npm start *
```

Generate a skeleton solution file and test file for a particular day:

```bash
npm run generate {year} {day}
```

Lint the code:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

Run all tests for a particular year's solutions:

```bash
npm test {year}
```

Run tests for a specific day:

```bash
npm test {year}/day-{day}
```

Run the interactive program from 2019 day 25:

```bash
npm run 2019-25
```

## Project Structure

- **Solution code**: These files are code that actually solves the puzzles. They are found under `src/solutions`:
  - Most puzzle solutions are implemented in a single module at `src/solutions/{year}/day-{day}.js`. (The `day` parameter is zero-padded, if needed.)
  - Some solutions are complex enough that I've broken them apart into multiple modules. The support modules for a single day's puzzle will have names like `src/solutions/{year}/day-{day}.{submodule}.js`.
  - Sometimes code gets reused across multiple days in the same year, like the Intcode interpreter in 2019. In that case, the module will be found at `src/solutions/{year}/{name}.js` (no `day-` prefix).
- **Utility code**: Some code is techically part of the solution code, but it is generally useful for Advent of Code regardless of the year. These modules are found under `src/solutions` rather than under the directory for a specific year.
- **Framework code**: This is code that isn't actually part of the solutions themselves, but is support code to generate or run the solutions. These are found under `src/framework`.
- **Test code**: These are unit tests, found adjacent to the code they test. They end with `.test.js` instead of just `.js`.
- **Input files**: These are files that the framework code reads to execute the solutions. They are found under the `input` directory. This directory is empty (apart from a small `README.md` file) in the repository because they are unique per user. When the framework fetches your input for a puzzle from the Advent of Code site, it will automatically create a cache file containing the input at `input/{year}/{day}.txt`. This way, it never has to retrieve it from the site again. To enable this, you must provide your Advent of Code session cookie to the framework by running `npm run session {cookie-value}`. (The cookie value is stored in `input/.session`.) As long as your session remains valid, you only have to this once. If you'd prefer, you can retrieve your input yourself and store it as described earlier rather than let the framework fetch it for you.

## Bootstrapping a Puzzle Solution

When I begin a puzzle day, I execute `npm run generate {year} {day}` to build the skeleton files:

- **Solution module:** This module file is named `src/solutions/{year}/day-{day}.js`. It exports a function that accepts the test input string and returns an array with two elements: the answer to each part of that day's puzzle. When the solution module code is first generated, it simply returns `[ undefined, undefined ]`. (Often some or all of the work done to solve part one is useful in part two, so this approach allows me to capitalize on that.) My solution will replace the `undefined` values with the actual answers. (Day 25 only has one part, so the second element will always be `undefined` for that day.)
- **Test module:** This module file is named `src/solutions/{year}/day-{day}-test.js`. It allows me to run test input through my solution to see if it produces the expected answers for each part.

## Workflow for Developing a Puzzle Solution

I follow test-driven development when tackling each day's puzzle. The first thing I do after reading the puzzle description is to take any example data given in the puzzle and put it into the test module. Then I write in the expected answer(s) for the example data for part one, leaving part two as `undefined`. There will sometimes be examples that only work for one part or the other; in this case, I will often make it so that you can pass the part you want solved into the solution module, and it will return just that part instead of both.

From there I start work on the actual solution. Once I think I have it, I run the test and check to see if it passes. If it fails, the failure output usually gives me a reasonable idea of where to look for the problem. I continue the fix-test cycle until the test passes. I will occasionally add more test cases to help me troubleshoot bugs in my solution.

Once my solution for part one is working against the test data, I'll run `npm start`, which will download my puzzle input for that day (if it hasn't already), run it through the solution, and print the result to the console. I can then enter the answer for part one into the Advent of Code web site to see if it's correct. Often, it is, but sometimes the actual data has an important difference from the test data that I will find during this step.

When I have the correct answer for part one, I repeat the procedure for part two of the day's puzzle. Often part two will reveal a new wrinkle that will require some refactoring of the code. I generally try to isolate the part that differs between the two parts, then refactor the code to make the rest of it work for both parts.

Sometimes a solution is complex enough that I find it useful to break it apart into more modules, which allows me to develop and test each part independently. These sub-modules will have an additional descriptive suffix added to the filename, like `day-20.grid.js` and `day-20.grid.test.js`. The main solution module can then import the sub-modules and use them to solve the puzzle.

Other times, I might want to be able to test some code independently, but maybe I feel it's too small to peel off into a separate module. In those cases, I might expose that function for testing as a property of the exported function.

After I have solved each day's puzzle, I will go back and make improvements:

- I take a look at performance. The `npm start` script will time each solution run and print the elapsed time for running both parts to the console. It's normally printed in gray, but turns yellow if it takes at least five seconds to run, and red if it takes at least 15 seconds. Depending on how long it takes the test to run, I may attempt to optimize it:
  - _Less than a second:_ Acceptable; no further changes.
  - _Between one and five seconds:_ I'm usually happy with that, but if I see a way to speed it up that doesn't add much in the way of complexity, I'll probably do it.
  - _Between five and fifteen seconds:_ I will definitely spend some time considering how to speed it up, and will be more willing to accept increased complexity as a tradeoff. However, I will still consider it acceptable if I don't think of a good way to improve it.
  - _Fifteen seconds or more:_ My solution is unacceptably "brute force" and that I may need to completely reconsider my approach. However, in some cases I have decided that it's too hard to be worth redoing and have just left it as is.
  - All solutions that take at least five seconds to run on my machine are listed in the **TODO** section below.
- I refactor code as needed to improve readability and testability.
- I add documentation. The comments for each day's module will describe the solution algorithm. In more complicated cases, I may divide that description up across the documentation for the various functions in the solution, but in that case the main documentation for the module will always describe where to look for the details.
- Somtimes I'll identify some piece of code as being useful across multiple puzzles and refactor it into a separate module.
  - If the code would only be useful for that year, I will put the module under `src/solutions/{year}`. The Intcode interpreter used repeatedly in 2019 is a great example of this; you can find it at `src/solutions/2019/intcode.js`.
  - If it's a utility that is generally useful for any Advent of Code year, it will be located under `src/solutions` instead.

## Utility Classes and Functions

A bunch of modules that help with recurring tasks in Advent of Code are included under `src/solutions`:

### `a-star`

A generic implementation of the [A* algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm).

### `abstract-infinite-grid`

This module exports the `AbstractInfiniteGrid` class, which is extended by `BooleanInfiniteGrid` and `InfiniteGrid`. These classes are useful where arrays are less desireable for working with a grid because of any of the following reasons:

- The coordinate space doesn't begin with zero (and may be negative).
- You don't know the size of the grid before you create it.
- The grid is large but sparsely populated.
- You're dealing with more than two dimensions.

These classes solve the problem by concatenating the coordinate values for an element into a string, which is then used as a key under which the data for that element is stored. A class which extends `AbstractInfiniteGrid` must provide a storage object which implements a specific interface to store the data.

These classes use arrays to represent coordinates, which get converted to strings to use as keys. (I'll probably change this to use [tuples](https://github.com/tc39/proposal-record-tuple) once that feature is available.) In `BooleanInfiniteGrid`, these keys are stored in a `Set`; a key's presence in the `Set` indicates that the value at those coordinates is `true`; otherwise, the value is `false`. For `InfiniteGrid`, the elements are stored in a `Map` under those keys. You can create your own infinite grid implementation by extending `AbstractInfiniteGrid`.

### `boolean-infinite-grid`

An `AbstractInfiniteGrid` implementation where the elements are boolean values which default to `false`. It is implemented with a `Set` containing the keys for the elements which are `true`.

### `bounds`

This module contains the `Bounds` class, which is used to represent the bounds of an `n`-dimensional space. This class is used by `AbstractInfiniteGrid` to keep track of the grid bounds, but you can also use it independently.

### `circular-linked-list`

The `CircularLinkedList` class is a doubly-linked list where the first and last elements are linked together to form a ring. You can rotate the pointer around the list, inspect the element at the pointer, remove that element, or insert elements before or after that element. The advantage this class has over arrays is that insertions and removals are much less expensive because there is no need to shift elements, and you don't need to write any code to deal with the fact that the list wraps around.

### `grid-to-graph`

This takes a two-dimensional array of characters representing a maze and converts it to a graph. You specify the characters that represent walls and empty space, and any other character is converted to a graph node, and distances are computed for the edges.

### `infinite-grid`

An `AbstractInfiniteGrid` implemenation where the elements can be any value and which default to `undefined`. It is implemented with a `Map` where each element value is stored under its coordinate key.

### `math2`

Additional math functions on top of those present in the built-in `Math` object.

### `priority-queue`

A `PriorityQueue` class implements a queue where elements are dequeued in order of priority rather than insertion. Priority is determined on insertion and is computed by a comparator function provided when the queue is created.

### `simple-grid`

In cases where the more powerful `InfiniteGrid` or `BooleanInfiniteGrid` classes are not needed, this `SimpleGrid` class provides a simpler, more performant grid implementation which can automatically parse the usual grid representation found in puzzle inputs.

### `summed-area-table`

This class is useful for quickly calculating the sum of all values in a rectangular area of a two-dimensional array.

### `util`

Miscellaneous utility functions.

## TODO

Things I'd like to improve:

- Make code generator script intelligently select the year and day when omitted
- Refactor solutions that I wrote before the `InfiniteGrid` class to use it
  - 2020-20
  - 2021-05
- 2019-25: Try combinations of inventory items using [Gray code](https://en.wikipedia.org/wiki/Gray_code)
- Long runtimes:
  - 2016-11: 64.936 s
  - 2018-21: 57.588 s
  - 2018-22: 22.599 s
  - 2018-14: 15.992 s
  - 2019-18: 15.733 s
  - 2018-03: 7.816 s
