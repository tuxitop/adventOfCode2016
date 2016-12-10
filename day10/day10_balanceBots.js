/*
 * You come upon a factory in which many robots are zooming around handing
 * small microchips to each other.
 *
 * Upon closer examination, you notice that each bot only proceeds when it has
 * two microchips, and once it does, it gives each one to a different bot or
 * puts it in a marked "output" bin. Sometimes, bots take microchips from
 * "input" bins, too.
 *
 * Inspecting one of the microchips, it seems like they each contain a single
 * number; the bots must use some logic to decide what to do with each chip.
 * You access the local control computer and download the bots' instructions
 * (your puzzle input).
 *
 * Some of the instructions specify that a specific-valued microchip should be
 * given to a specific bot; the rest of the instructions indicate what a given
 * bot should do with its lower-value or higher-value chip.
 *
 * For example, consider the following instructions:
 *
 * value 5 goes to bot 2
 * bot 2 gives low to bot 1 and high to bot 0
 * value 3 goes to bot 1
 * bot 1 gives low to output 1 and high to bot 0
 * bot 0 gives low to output 2 and high to output 0
 * value 2 goes to bot 2
 *
 *     Initially, bot 1 starts with a value-3 chip, and bot 2 starts with a
 *     value-2 chip and a value-5 chip.
 *
 *     Because bot 2 has two microchips, it gives its lower one (2) to bot 1
 *     and its higher one (5) to bot 0.
 *
 *     Then, bot 1 has two microchips; it puts the value-2 chip in output 1 and
 *     gives the value-3 chip to bot 0.
 *
 *     Finally, bot 0 has two microchips; it puts the 3 in output 2 and the 5 in output 0.
 *
 * In the end, output bin 0 contains a value-5 microchip, output bin 1 contains
 * a value-2 microchip, and output bin 2 contains a value-3 microchip. In this
 * configuration, bot number 2 is responsible for comparing value-5 microchips
 * with value-2 microchips.
 *
 * Based on your instructions, what is the number of the bot that is
 * responsible for comparing value-61 microchips with value-17 microchips?
 *
 * --- Part Two ---
 *
 * What do you get if you multiply together the values of one chip in each of
 * outputs 0, 1, and 2?
*/
/* jshint esversion: 6 */
const fs = require('fs');

const input = fs.readFileSync("./day10_balanceBots_input.txt", "utf-8");
const testInput = "value 5 goes to bot 2\n" +
                  "bot 2 gives low to bot 1 and high to bot 0\n" +
                  "value 3 goes to bot 1\n" +
                  "bot 1 gives low to output 1 and high to bot 0\n" +
                  "bot 0 gives low to output 2 and high to output 0\n" +
                  "value 2 goes to bot 2\n";

function Bot() {
    this.values = [];
    this.low = null;
    this.high = null;

    this.addValue = function(value) {
        this.values.push(value);
        this.check();
    };

    this.check = function() {
        if (this.low && this.high && this.values.length === 2) {
            this.values.sort((a, b) => (a - b));
            this.low.addValue(this.values[0]);
            this.high.addValue(this.values[1]);
        }
    };
}

function Output() {
    this.values = [];

    this.addValue = function(value) {
        this.values.push(value);
    };
}

function Field() {
    this.bots = new Map();
    this.outputs = new Map();

    // register a bot in the bots Map
    this.regBot = function(botID) {
        if (!this.bots.has(botID)) {
            this.bots.set(botID, new Bot());
        }
    };

    // register an output in the outputs Map
    this.regOutput = function(outputID) {
        if (!this.outputs.has(outputID)) {
            this.outputs.set(outputID, new Output());
        }
    };

    this.runCommand = function(cmd) {
        let words = cmd.split(" ");
        if (words[0] === 'value') {
            this.regBot(+words[5]);
            this.bots.get(+words[5]).addValue(+words[1]);
        } else {
            this.regBot(+words[1]);
            // assign low value delivery point.
            if (words[5] === "bot") {
                this.regBot(+words[6]);
                this.bots.get(+words[1]).low = this.bots.get(+words[6]);
            } else if (words[5] === "output") {
                this.regOutput(+words[6]);
                this.bots.get(+words[1]).low = this.outputs.get(+words[6]);
            }
            // assign high value delivery point.
            if (words[10] === "bot") {
                this.regBot(+words[11]);
                this.bots.get(+words[1]).high = this.bots.get(+words[11]);
            } else if (words[10] === "output") {
                this.regOutput(+words[11]);
                this.bots.get(+words[1]).high = this.outputs.get(+words[11]);
            }
            this.bots.get(+words[1]).check();
        }
    };
}

function runCommands(input) {
    let field = new Field();
    let commands = input.trim().split("\n");
    commands.forEach((cmd) => {
        field.runCommand(cmd);
    });

    // get the answer for part one;
    field.bots.forEach((bot, key) => {
        let sorted = bot.values.sort((a, b) => (a - b));
        if (sorted[0] === 17 && sorted[1] === 61) {
            console.log("bot " + key + " is responsible for comparing 61 and 17");
        }
    });
    
    // get the answer for part two
    let multiply = (field.outputs.get(0).values[0] *
                    field.outputs.get(1).values[0] * 
                    field.outputs.get(2).values[0]);
    console.log("The multiplied amount of the chips is outputs 0, 1 and 2 is: " + multiply);
}

runCommands(input);
