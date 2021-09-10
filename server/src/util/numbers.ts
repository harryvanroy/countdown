const numbers = [1, 2, 3, 4, 5, 6];
const operators = ["+", "-", "*", "//"];

function removeItemOnce(arr: number[], items: number[]) {
  arr = arr.map((x) => x);
  for (const item of items) {
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }
  return arr;
}

const OPS = {
  "+": function (n1: number, n2: number) {
    return n1 + n2;
  },
  "-": function (n1: number, n2: number) {
    return n1 - n2;
  },
  "*": function (n1: number, n2: number) {
    return n1 * n2;
  },
  "/": function (n1: number, n2: number) {
    return (n1 / n2) >> 0;
  },
};

const permute_numbers = (
  numbers: number[],
  valSums: number,
  equation: string,
  equations: Map<number, string[]>
) => {
  if (numbers.length == 0) {
    return;
  } else if (numbers.length == 1) {
    for (var o in OPS) {
      let s = OPS[o](valSums, numbers[0]);
      let term = "(" + equation + ")" + o + numbers[0];
      if (s > 0 && s < 1000) {
        equations[s].push(term);
      }
    }
    return;
  }
  for (let m in OPS) {
    for (let i = 0; i < numbers.length - 1; i++) {
      let ni = numbers[i];
      for (let j = i + 1; j < numbers.length; j++) {
        let nj = numbers[j];
        for (let o in OPS) {
          const r = OPS[o](ni, nj);
          const s = OPS[m](valSums, r);
          const term =
            equation == ""
              ? "(" + ni + o + nj + ")"
              : "(" + equation + ")" + m + "(" + ni + o + nj + ")";
          if (s > 0 && s < 1000) {
            equations[s].push(term);
          }
          permute_numbers(
            removeItemOnce(numbers, [ni, nj]),
            s,
            term,
            equations
          );
        }
      }
    }
  }
};

const yeet = new Map<number, string[]>();
for (let i = 0; i < 1000; i++) {
  yeet[i] = [];
}

permute_numbers(numbers, 0, "", yeet);
for (const c of yeet["10"]) {
  if (eval(c) >> 0 != eval(c) || c.includes("/")) {
    continue;
  }
  console.log(c);
  console.log(eval(c));
}
