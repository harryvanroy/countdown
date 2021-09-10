import e from "express";

const numbers = [75, 100, 25, 50, 9, 2];
const operators = ["+", "-", "*", "//"];

function removeItemOnce(arr, items) {
    arr = arr.map((x) => x);
    for (const item of items) {
        var index = arr.indexOf(item);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }
    return arr;
}

var OPS = {
    "+": function (n1, n2) { return n1 + n2; },
    "-": function (n1, n2) { return n1 - n2; },
    "*": function (n1, n2) { return n1 * n2; },
    "/": function (n1, n2) { return n1 / n2; },
};

const permute_numbers = (numbers, valSums, equation, equations) => {
    if (numbers.length == 0) {
        return
    } else if (numbers.length == 1) {
        for (var o in OPS) {
            var s = OPS[o](valSums, numbers[0]);
            var term = "(" + equation + ")" + o + numbers[0];
            if (s > 0 && s < 1000 && s >> 0 == s) {
                equations[s].push(term);
            }
        }
        return
    }

    for (var m in OPS) {
        for (var i = 0; i < numbers.length; i++) {
            var ni = numbers[i];
            var r = OPS[m](valSums, ni);
            var equi = "(" + equation + ")" + m + ni;
            if (equation == "") {
                r = ni;
                equi = "" + ni;
            }
            if (r > 0 && r < 1000 && r >> 0 == r) {
                equations[r].push(equi);
            }
            permute_numbers(removeItemOnce(numbers, [ni]), r, `${equi}`, equations);
        }
    }

}

const yeet = new Map<number, string[]>();
for (var i = 0; i < 1000; i++) {
    yeet[i] = [];
}

permute_numbers(numbers, 0, "", yeet);
// console.log(yeet)
for (var c of yeet["334"]) {
    console.log(c);
    console.log(eval(c));
}
