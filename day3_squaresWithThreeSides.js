/** Now that you can think clearly, you move deeper into the labyrinth of
 * hallways and office furniture that makes up this part of Easter Bunny HQ.
 * This must be a graphic design department; the walls are covered in
 * specifications for triangles.
 *
 * Or are they?
 *
 * The design document gives the side lengths of each triangle it describes,
 * but... 5 10 25? Some of these aren't triangles. You can't help but mark the
 * impossible ones.
 *
 * In a valid triangle, the sum of any two sides must be larger than the
 * remaining side. For example, the "triangle" given above is impossible,
 * because 5 + 10 is not larger than 25.
 *
 * In your puzzle input, how many of the listed triangles are possible?
 *
 * --- Part Two ---
 *
*  Now that you've helpfully marked up their design documents, it occurs to you
*  that triangles are specified in groups of three vertically. Each set of
*  three numbers in a column specifies a triangle. Rows are unrelated.
*
*  For example, given the following specification, numbers with the same
*  hundreds digit would be part of the same triangle:
*
*  101 301 501 
*  102 302 502 
*  103 303 503 
*  201 401 601 
*  202 402 602 
*  203 403 603
*
*  In your puzzle input, and instead reading by columns, how many of the
*  listed triangles are possible?
*
**/
/* jshint esversion: 6 */
const fs = require('fs');

function validTriangles(inputFile) {
    var input = fs.readFileSync(inputFile, "utf-8"); 
    var testInput = "  785  516  744\n" +
                    "  272  511  358\n" +
                    "  801  791  693\n" +
                    "  572  150   74\n" +
                    "  644  534  138\n" +
                    "  191  396  196\n";
    var validTris = 0; // counter for horizontal triangle sides.
    var vertValidTris = 0; // counter for vertival triangle sides.

    // Parse the input to an array of arrays with side lengthes of each trianlge
    // split the lines (\.+\) -> split the numbers -> make strings to numbers
    // I used match(/.+/) to split the lines in order to ignore empty lines.
    var trisArray = input.match(/.+/g).map((line) => {
        return line.match(/\d+/g).map((val => Number(val)));
    });
    
    // Parse the trisArray vertically
    var vertTrisArray = [];
    var counter = 0;
    var tempArray = [];
    for (var col = 0; col < 3; col++) {
        for (var row = 0; row < trisArray.length; row++) {
            counter++;
            tempArray.push(trisArray[row][col]);
            if (counter === 3) {
                vertTrisArray.push(tempArray);
                tempArray = [];
                counter = 0;
            }
        }
    }

    // test the possiblility of each triangle.
    trisArray.forEach((triangle) => {
        var a = triangle[0];
        var b = triangle[1];
        var c = triangle[2];
        if ( (a + b > c) && (a + c > b) && (b + c > a) ) {
            validTris++;
        }
    });

    // test the possibility of each vertical triangles.
    vertTrisArray.forEach((triangle) => {
        var a = triangle[0];
        var b = triangle[1];
        var c = triangle[2];
        if ( (a + b > c) && (a + c > b) && (b + c > a) ) {
            vertValidTris++;
        }
    });

    console.log("Horizantaly there are " + validTris + " possible triangles.");
    console.log("Vertically there are " + vertValidTris + " possible triangles.");
}

validTriangles("./day3_squaresWithThreeSides_input.txt");
