/**
 * While snooping around the local network of EBHQ, you compile a list of IP
 * addresses (they're IPv7, of course; IPv6 is much too limited). You'd like to
 * figure out which IPs support TLS (transport-layer snooping).
 *
 * An IP supports TLS if it has an Autonomous Bridge Bypass Annotation, or
 * ABBA. An ABBA is any four-character sequence which consists of a pair of two
 * different characters followed by the reverse of that pair, such as xyyx or
 * abba. However, the IP also must not have an ABBA within any hypernet
 * sequences, which are contained by square brackets.
 *
 * For example:
 *
 *     abba[mnop]qrst supports TLS (abba outside square brackets).
 *
 *     abcd[bddb]xyyx does not support TLS (bddb is within square brackets,
 *     even though xyyx is outside square brackets).
 *
 *     aaaa[qwer]tyui does not support TLS (aaaa is invalid; the interior
 *     characters must be different).
 *
 *     ioxxoj[asdfgh]zxcvbn supports TLS (oxxo is outside square brackets, even
 *     though it's within a larger string).
 *
 *     How many IPs in your puzzle input support TLS?
 */
/* jshint esversion: 6 */
const fs = require('fs');
const testInputP1 = "abba[mnop]qrst\n" +     // Supports TLS
                    "abcd[bddb]xyyx\n" +     // Does not support TLS
                    "aaaa[qwer]tyui\n" +     // Does not suppott TLS
                    "ioxxoj[asdfgh]zxcvbn";  // Supports TLS
const testInputP2 = "aba[bab]xyz\n" +        // Supports SSL
                    "xyx[xyx]xyx\n" +        // Does not support SSL;
                    "aaa[kek]eke\n" +        // Supports SSL
                    "zazbz[bzb]cdb";         // Supports SSL
const input = fs.readFileSync("./day7_internetProtocolVersion7_input.txt", "utf-8");


// Takes a string and return a boolean if it has ABBA.
function hasABBA(word) {
    for (idx = 0; idx <= word.length - 4; idx++) {
        let firstHalf = word.substring(idx, idx+2);
        let secondHalf = word.substring(idx+2, idx+4);
        if (firstHalf !== secondHalf &&
            firstHalf === secondHalf.split("").reverse().join("")) {
            return true;
        }
    }
    return false;
}

// Takes a string and return an array of ABAs if it has ABA or null.
function hasABA (word) {
    abaArray = [];
    for (idx = 0; idx <= word.length - 3; idx++) {
        if (word[idx] === word[idx+2] && word[idx] !== word[idx+1]) {
            abaArray.push(word.substring(idx, idx + 3));
        }
    }
    if (abaArray.length) {
        return abaArray;
    }
    return null;
}

function findTLS_SSL(input) {
    const inputArray = input.trim().split("\n");
    let splittedArray = inputArray.map((ip) => {
        return ip.match(/(\w+)/g);
    });
    let validatedTLSArray = splittedArray.filter((ipArr) => {
        // check the odd indexes (the words inside brackets)
        for (let idx = 1; idx < ipArr.length; idx += 2) {
            if (hasABBA(ipArr[idx])) {
                return false;
            }
        }

        // check the even indexes (the words outside brackets)
        for (let idx = 0; idx < ipArr.length; idx += 2) {
            if (hasABBA(ipArr[idx])) {
                return true;
            }
        }
        return false;
    });
    let validatedSSLArray = splittedArray.filter((ipArr) => {
        // check the even indexes and find all ABA sequences.
        var allABA = [];
        for (let idx = 0; idx < ipArr.length; idx += 2) {
            var aba = hasABA(ipArr[idx]);
            if (aba) {
                allABA.push(...aba);
            }
        }
        // check if the found ABAs has corresponding BABs inside brackets.
        for (let idx = 0; idx < allABA.length; idx++) {
            let bab = allABA[idx][1] + allABA[idx][0] + allABA[idx][1];
            for (let ipIdx = 1; ipIdx < ipArr.length; ipIdx += 2) {
                if (ipArr[ipIdx].includes(bab)) {
                    return true;
                }
            }
        }
        return false;
    });

    console.log("Found " + validatedTLSArray.length + " IP addresses with TLS support.");
    console.log("Found " + validatedSSLArray.length + " IP addresses with SSL support.");
}

findTLS_SSL(input);
// findTLS_SSL(testInputP1);
// findTLS_SSL(testInputP2);
