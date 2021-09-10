
const numbers = [1, 2, 3, 4, 5, 6];
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
    "/": function (n1, n2) { return n1 / n2 >> 0; },
};

const permute_numbers = (numbers, valSums, equation, equations) => {
    if (numbers.length == 0) {
        return
    } else if (numbers.length == 1) {
        for (var o in OPS) {
            var s = OPS[o](valSums, numbers[0]);
            var term = "(" + equation + ")" + o + numbers[0];
            if (s > 0 && s < 1000) {
                equations[s].push(term);
            }
        }
        return
    }
    for (var m in OPS) {
        for (var i = 0; i < numbers.length - 1; i++) {
            var ni = numbers[i];
            for (var j = i + 1; j < numbers.length; j++) {
                var nj = numbers[j];
                for (var o in OPS) {
                    var r = OPS[o](ni, nj);
                    var s = OPS[m](valSums, r)
                    var term = (equation == "") ? "(" + ni + o + nj + ")" : "(" + equation + ")" + m + "(" + ni + o + nj + ")";
                    if (s > 0 && s < 1000) {
                        equations[s].push(term);
                    }
                    permute_numbers(removeItemOnce(numbers, [ni, nj]), s, term, equations);
                }
            }
        }
    }

}

const yeet = new Map<number, string[]>();
for (var i = 0; i < 1000; i++) {
    yeet[i] = [];
}

permute_numbers(numbers, 0, "", yeet);
for (var c of yeet["10"]) {
    if (eval(c) >> 0 != eval(c) || c.includes("/")) {
        continue;
    }
    console.log(c);
    console.log(eval(c));
}
