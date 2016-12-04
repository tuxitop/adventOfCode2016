/**
 * Finally, you come across an information kiosk with a list of rooms. Of
 * course, the list is encrypted and full of decoy data, but the instructions
 * to decode the list are barely hidden nearby. Better remove the decoy data
 * first.
 *
 * Each room consists of an encrypted name (lowercase letters separated by
 * dashes) followed by a dash, a sector ID, and a checksum in square brackets.
 *
 * A room is real (not a decoy) if the checksum is the five most common letters
 * in the encrypted name, in order, with ties broken by alphabetization. For
 * example:
 *
 *     aaaaa-bbb-z-y-x-123[abxyz] is a real room because the most common
 *     letters are a (5), b (3), and then a tie between x, y, and z, which are
 *     listed alphabetically. 
 *     a-b-c-d-e-f-g-h-987[abcde] is a real room because although the letters
 *     are all tied (1 of each), the first five are listed alphabetically.
 *     not-a-real-room-404[oarel] is a real room. 
 *     totally-real-room-200[decoy] is not.
 *
 * Of the real rooms from the list above, the sum of their
 * sector IDs is 1514.
 *
 * What is the sum of the sector IDs of the real rooms?
 *
 * --- Part Two ---
 *
*  With all the decoy data out of the way, it's time to decrypt this list and
*  get moving.
*
*  The room names are encrypted by a state-of-the-art shift cipher, which is
*  nearly unbreakable without the right software. However, the information
*  kiosk designers at Easter Bunny HQ were not expecting to deal with a master
*  cryptographer like yourself.
*
*  To decrypt a room name, rotate each letter forward through the alphabet a
*  number of times equal to the room's sector ID. A becomes B, B becomes C, Z
*  becomes A, and so on. Dashes become spaces.
*
*  For example, the real name for qzmt-zixmtkozy-ivhz-343 is very encrypted
*  name.
*
*  What is the sector ID of the room where North Pole objects are stored?
*
**/
/* jshint esversion:6 */

const fs = require('fs');

// callback function for filtering the decoys.
var isReal = ([name, id, checksum]) => {
    // remove dashes from the name
    var joinedName = name.replace(/-/g, "");
    var uniqChars = joinedName.split("").filter((char, idx) => {
        return joinedName.indexOf(char) === idx;
    });
    // add a count for each character
    var occurances = uniqChars.map((char) => {
        re = new RegExp(char, "g");
        return [char, name.match(re).length];
    });
    // sort the array in the required way.
    var sortedOc = occurances.sort(function (a, b) {
        if (b[1] - a[1]) {
            return b[1] - a[1];
        }
        return a[0].charCodeAt() - b[0].charCodeAt();
    });
    var calcChecksum = sortedOc.slice(0, 5).map((arr)=>arr[0]).join("");
    return calcChecksum === checksum;
};

// function to rotate chars in the name field id times.
var rotate = ([name, id, checksum]) => {
    var words = name.split("-");
    var rotatedName = words.map((word) => {
        let rotated = word.split("").map((ch) => {
            let alphabetIdx = ch.charCodeAt() - 97;
            let rotatedCharCode = (alphabetIdx + id) % 26 + 97;
            return String.fromCharCode(rotatedCharCode);
        }).join("");
        return rotated;
    }).join(" ");
    return [rotatedName, id];
};

function sumOfIDs (inputFile) {
    var input = fs.readFileSync(inputFile, "utf-8");
    
    // produce an array of arrays with splitted information
    // [["aaaaa-bbb-z-y-x", 123, "abxyz"], ...]
    var parsedRooms = input.trim().split("\n").map((room) => {
        return [room.match(/[a-z-]+/)[0],
                +room.match(/\d+/)[0],
                room.substring(room.length - 6, room.length - 1)];
    });
    
    var realRooms = parsedRooms.filter(isReal);
    // Calculate the sum of sector IDs.
    var realRoomsIdSum = parsedRooms.filter(isReal).reduce((prev, cur) => {
        return prev + cur[1];
    }, 0);

    var rotatedRealRooms = realRooms.map(rotate);

    console.log("Sum of the sector IDs of the real rooms are: " + realRoomsIdSum);
    
    // search for the North Pole objects room.
    rotatedRealRooms.forEach((room) => {
        if (room[0].indexOf("northpole") > -1) {
            console.log("the id for \'" + room[0].trim() + "\' room is " + room[1]);
        }
    });
}

sumOfIDs("./day4_securityThroughObscurity_input.txt");
