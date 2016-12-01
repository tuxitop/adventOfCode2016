/**You're airdropped near Easter Bunny Headquarters in a city somewhere. "Near",
 * unfortunately, is as close as you can get - the instructions on the Easter
 * Bunny Recruiting Document the Elves intercepted start here, and nobody had
 * time to work them out further.
 *
 * The Document indicates that you should start at the given coordinates (where
 * you just landed) and face North. Then, follow the provided sequence: either
 * turn left (L) or right (R) 90 degrees, then walk forward the given number of
 * blocks, ending at a new intersection.
 *
 * There's no time to follow such ridiculous instructions on foot, though, so
 * you take a moment and work out the destination. Given that you can only walk
 * on the street grid of the city, how far is the shortest path to the
 * destination?
 *
 * For example:
 *
 *  Following R2, L3 leaves you 2 blocks East and 3 blocks North, or 5 blocks away.
 *  R2, R2, R2 leaves you 2 blocks due South of your starting position, which is 2 blocks away.
 *  R5, L5, R5, R3 leaves you 12 blocks away.
 *
 * How many blocks away is Easter Bunny HQ?
 *
 * --- Part Two ---
 *
 * Then, you notice the instructions continue on the back of the Recruiting
 * Document. Easter Bunny HQ is actually at the first location you visit twice.
 *
 *  For example, if your instructions are R8, R4, R4, R8, the first location
 *  you visit twice is 4 blocks away, due East.
 *
 * How many blocks away is the first location you visit twice?
 *
**/
/* jshint shadow:true */

// this is the given input.
var input = "R5, L2, L1, R1, R3, R3, L3, R3, R4, L2, R4, L4, R4, R3, L2, L1, L1, " +
    "R2, R4, R4, L4, R3, L2, R1, L4, R1, R3, L5, L4, L5, R3, L3, L1, L1, R4, R2, " +
    "R2, L1, L4, R191, R5, L2, R46, R3, L1, R74, L2, R2, R187, R3, R4, R1, L4, " +
    "L4, L2, R4, L5, R4, R3, L2, L1, R3, R3, R3, R1, R1, L4, R4, R1, R5, R2, R1, " +
    "R3, L4, L2, L2, R1, L3, R1, R3, L5, L3, R5, R3, R4, L1, R3, R2, R1, R2, L4, " +
    "L1, L1, R3, L3, R4, L2, L4, L5, L5, L4, R2, R5, L4, R4, L2, R3, L4, L3, L5, " +
    "R5, L4, L2, R3, R5, R5, L1, L4, R3, L1, R2, L5, L1, R4, L1, R5, R1, L4, L4, " +
    "L4, R4, R3, L5, R1, L3, R4, R3, L2, L1, R1, R2, R2, R2, L1, L1, L2, L5, L3, " +
    "L1";

var testInput1 = "R2, L3";
var testInput2 = "R2, R2, R2";
var testInput3 = "R5, L5, R5, R3";
var testInput4 = "R8, R4, R4, R8"; // test input for part 2

// define modulu for js.
function mod(n, m) {
    return ((n % m) + m) % m;
}

function findBlocks(input){
    var direction = 0;  // North = 0, East = 1, South = 2, West = 3
    var position = [0, 0];
    var visitedPos = [[0, 0]]; // array of visited positions until the position that was visited twice.
    var foundVisetedTwice = false; // is the visited twice position found?
    var visitedTwice; // it will be defined if the first twice met position found.

    //parse input
    var inputArray = input.split(", ");
    
    inputArray.forEach(function(value){
        // first change the direction
        if (value[0] === "R") {
            direction = mod((direction + 1), 4);
        } else if (value[0] === "L") {
            direction = mod((direction - 1), 4);
        }

        // then go for it and update visitedPos if necessary.
        if (direction === 0) {
            // update visitedPos if necessary
            if (foundVisetedTwice === false) {
                for (var i = 1; i <= value.slice(1); i++) {
                    var newPos = [position[0], position[1] + i];
                    if (visitedPos.indexOf(newPos.toString()) === -1) {
                        visitedPos.push(newPos.toString());
                    } else {
                        foundVisetedTwice = true;
                        visitedTwice = newPos;
                    }
                }
            }
            // go to the position.
            position[1] += Number(value.slice(1));
        } else if (direction === 1) {
            // update visitedPos if necessary
            if (foundVisetedTwice === false) {
                for (var i = 1; i <= value.slice(1); i++) {
                    var newPos = [position[0] + i, position[1]];
                    if (visitedPos.indexOf(newPos.toString()) === -1) {
                        visitedPos.push(newPos.toString());
                    } else {
                        foundVisetedTwice = true;
                        visitedTwice = newPos;
                    }
                }
            }
            // go to the position.
            position[0] += Number(value.slice(1));
        } else if (direction === 2) {
            // update visitedPos if necessary
            if (foundVisetedTwice === false) {
                for (var i = 1; i <= value.slice(1); i++) {
                    var newPos = [position[0], position[1] - i];
                    if (visitedPos.indexOf(newPos.toString()) === -1) {
                        visitedPos.push(newPos.toString());
                    } else {
                        foundVisetedTwice = true;
                        visitedTwice = newPos;
                    }
                }
            }
            // go to the position.
            position[1] -= Number(value.slice(1));
        } else if (direction === 3) {
            // update visitedPos if necessary
            if (foundVisetedTwice === false) {
                for (var i = 1; i <= value.slice(1); i++) {
                    var newPos = [position[0] - i, position[1]];
                    if (visitedPos.indexOf(newPos.toString()) === -1) {
                        visitedPos.push(newPos.toString());
                    } else {
                        foundVisetedTwice = true;
                        visitedTwice = newPos;
                    }
                }
            }
            // go to the position.
            position[0] -= Number(value.slice(1));
        } 
    });

    blocks = Math.abs(position[0]) + Math.abs(position[1]);

    console.log("Final position: " + position);
    console.log("We are " + blocks + " blocks away from final position.");
    if (visitedTwice) {
        console.log("This is the first position we visited twice: " + visitedTwice);
        var blocksFromVisited = Math.abs(visitedTwice[0]) + Math.abs(visitedTwice[1]);
        console.log("At the beginning, we were " + blocksFromVisited + " blocks away from the first position we visited twice.");
    }
}

// findBlocks(testInput1);   // 5
// findBlocks(testInput2);   // 2
// findBlocks(testInput3);   // 12
// findBlocks(testInput4);


findBlocks(input);
