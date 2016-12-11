/**
 * Something is jamming your communications with Santa. Fortunately, your
 * signal is only partially jammed, and protocol in situations like this is to
 * switch to a simple repetition code to get the message through.
 *
 * In this model, the same message is sent repeatedly. You've recorded the
 * repeating message signal (your puzzle input), but the data seems quite
 * corrupted - almost too badly to recover. Almost.
 *
 * All you need to do is figure out which character is most frequent for each
 * position. For example, suppose you had recorded the following messages:
 *
 * eedadn
 * drvtee
 * eandsr
 * raavrd
 * atevrs
 * tsrnev
 * sdttsa
 * rasrtv
 * nssdts
 * ntnada
 * svetve
 * tesnvt
 * vntsnd
 * vrdear
 * dvrsen
 * enarar
 *
 * The most common character in the first column is e; in the second, a; in the
 * third, s, and so on. Combining these characters returns the error-corrected
 * message, easter.
 *
 * Given the recording in your puzzle input, what is the error-corrected
 * version of the message being sent?
**/ 
/* jshint esversion: 6 */

const fs = require('fs');

function errorCorrection(input) {
    let inputArray = input.trim().split("\n");
    let messageP1 = "";
    let messageP2 = "";
    for (let col = 0; col < inputArray[0].length; col++) {
        let chCount = new Map(); // a map of each char and it's count
        for (let row = 0; row < inputArray.length; row++) {
            if (chCount.has(inputArray[row][col])) {
                chCount.set(inputArray[row][col], chCount.get(inputArray[row][col]) + 1);
            } else {
                chCount.set(inputArray[row][col], 1);
            }
        }
        
        let maxChar = null;
        let maxRepeat = 0;
        let minChar = null;
        let minRepeat = Number.POSITIVE_INFINITY;
        for (let [char, count] of chCount) {
            // check if it's the maximum so far:
            if (maxRepeat < count) {
                maxChar = char;
                maxRepeat = count;
            }
            // check if it's the minimum so far:
            if (minRepeat > count) {
                minChar = char;
                minRepeat = count;
            }

        }
        messageP1 += maxChar;
        messageP2 += minChar;
    }
    console.log(messageP1);
    console.log(messageP2);
}

const input = fs.readFileSync("./day6_signalsAndNoise_input.txt", "utf-8");
const testInput = 'eedadn\n' +
                'drvtee\n' +
                'eandsr\n' +
                'raavrd\n' +
                'atevrs\n' +
                'tsrnev\n' +
                'sdttsa\n' +
                'rasrtv\n' +
                'nssdts\n' +
                'ntnada\n' +
                'svetve\n' +
                'tesnvt\n' +
                'vntsnd\n' +
                'vrdear\n' +
                'dvrsen\n' +
                'enarar\n';

// errorCorrection(testInput); // easter
errorCorrection(input);
