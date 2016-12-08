/**
 * You come across a door implementing what you can only assume is an
 * implementation of two-factor authentication after a long game of
 * requirements telephone.
 *
 * To get past the door, you first swipe a keycard (no problem; there was one
 * on a nearby desk). Then, it displays a code on a little screen, and you type
 * that code on a keypad. Then, presumably, the door unlocks.
 *
 * Unfortunately, the screen has been smashed. After a few minutes, you've
 * taken everything apart and figured out how it works. Now you just have to
 * work out what the screen would have displayed.
 *
 * The magnetic strip on the card you swiped encodes a series of instructions
 * for the screen; these instructions are your puzzle input. The screen is 50
 * pixels wide and 6 pixels tall, all of which start off, and is capable of
 * three somewhat peculiar operations:
 *
 *     rect AxB turns on all of the pixels in a rectangle at the top-left of
 *     the screen which is A wide and B tall.
 *
 *     rotate row y=A by B shifts all of the pixels in row A (0 is the top
 *     row) right by B pixels. Pixels that would fall off the right end
 *     appear at the left end of the row.
 *
 *     rotate column x=A by B shifts all of the pixels in column A (0 is the
 *     left column) down by B pixels. Pixels that would fall off the bottom
 *     appear at the top of the column.
 *
 * For example, here is a simple sequence on a smaller screen:
 *
 *     rect 3x2 creates a small rectangle in the top-left corner:
 *     ###....
 *     ###....
 *     .......
 *
 *     rotate column x=1 by 1 rotates the second column down by one pixel:
 *     #.#....
 *     ###....
 *     .#.....
 *
 *     rotate row y=0 by 4 rotates the top row right by four pixels:
 *     ....#.#
 *     ###....
 *     .#.....
 *
 *     rotate column x=1 by 1 again rotates the second column down by one
 *     pixel, causing the bottom pixel to wrap back to the top:
 *
 *     .#..#.#
 *     #.#....
 *     .#.....
 *
 * As you can see, this display technology is extremely powerful, and will soon
 * dominate the tiny-code-displaying-screen market. That's what the
 * advertisement on the back of the display tries to convince you, anyway.
 *
 * There seems to be an intermediate check of the voltage used by the display:
 * after you swipe your card, if the screen did work, how many pixels should be
 * lit?
 *
 * --- Part Two ---
 *
*  You notice that the screen is only capable of displaying capital letters; in
*  the font it uses, each letter is 5 pixels wide and 6 tall.
*
*  After you swipe your card, what code is the screen trying to display?
*
 */
/* jshint esversion: 6 */
const fs = require('fs');
const input = fs.readFileSync("./day8_two-factorAuthentication_input.txt", "utf-8");
const testInput = "rect 3x2\n" +
                  "rotate column x=1 by 1\n" +
                  "rotate row y=0 by 4\n" +
                  "rotate column x=1 by 1\n";

function Display (width, height) {
    this.width = width;
    this.height = height;
    // initialize display grid;
    this.grid = [];
    for (let row = 0; row < this.height; row++ ) {
        let rowContent = [];
        for (let col = 0; col < this.width; col++) {
            rowContent.push(0);
        }
        this.grid.push(rowContent);
    }

    this.rect = function(a, b) {
        for (let row = 0; row < b; row++) {
            for (let col = 0; col < a; col++) {
                this.grid[row][col] = 1;
            }
        }

    };

    this.rotateRow = function(a, b) {
        let row = this.grid[a].slice();
        for (let idx = 0; idx < this.width; idx++) {
            row[(idx + b) % this.width] = this.grid[a][idx];
        }
        this.grid[a] = row;
    };

    this.rotateCol = function(a, b) {
        let oldCol = [];
        this.grid.forEach((row) => {
            oldCol.push(row[a]);
        });
        let newCol = oldCol.slice();
        for (let idx = 0; idx < this.height; idx++) {
            newCol[(idx + b) % this.height] = oldCol[idx];
        }
        this.grid.forEach((row, idx) => {
            row[a] = newCol[idx];
        });
    };

    this.decodeCmd = function(command) {
        if (command.startsWith("rect")) {
            let [fullMatch, a, b] = command.match(/(\d+)x(\d+)/);
            return ["rect", +a, +b];
        } else if (command.startsWith("rotate row")) {
            let [fullMatch, a, b] = command.match(/y=(\d+)\s+by\s+(\d+)/);
            return ["rotateRow", +a, +b];
        } else if (command.startsWith("rotate column")) {
            let [fullMatch, a, b] = command.match(/x=(\d+)\s+by\s+(\d+)/);
            return ["rotateCol", +a, +b];
        }
    };

    this.runCmd = function(command) {
        decodedCmd = this.decodeCmd(command);
        if (decodedCmd[0] === "rect") {
                this.rect(decodedCmd[1], decodedCmd[2]);
        } else if (decodedCmd[0] === "rotateRow") {
            this.rotateRow(decodedCmd[1], decodedCmd[2]);
        } else if (decodedCmd[0] === "rotateCol") {
            this.rotateCol(decodedCmd[1], decodedCmd[2]);
        }
    };

    this.printGrid = function() {
        for (let row = 0; row < this.height; row++ ) {
            let rowContent = "";
            for (let col = 0; col < this.width; col++) {
                let char = this.grid[row][col] === 1 ? "#" : ".";
                rowContent += char;
            }
            console.log(rowContent);
        } 
    };

    this.getLitPixelsCount = function() {
        let count = 0;
        for (let row = 0; row < this.height; row++ ) {
            for (let col = 0; col < this.width; col++) {
                if (this.grid[row][col] === 1) {
                    count++;
                }
            }
        }
        return count;
    };
}

function runInput(input, width, height) {
    let disp = new Display(width, height);
    input.trim().split("\n").forEach((command) => {
        disp.runCmd(command);
    });
    console.log("There are " + disp.getLitPixelsCount() + " pixels lit in this display.");
    console.log("The final display for answering part two is:");
    disp.printGrid();
}

// runInput(testInput, 7, 3);
runInput(input, 50, 6);
