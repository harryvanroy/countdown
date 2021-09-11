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

const OPS: Record<string, (n1: number, n2: number) => number> = {
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
    return n1 / n2;
  },
};
export const generateNumbersSolutions = (numbers: Array<number>, target: number): Array<string> => {
  const permute_numbers = (
    numbers: number[],
    valSums: number,
    equation: string,
    equations: Record<string, string[]>
  ) => {
    for (const m in OPS) {
      for (let i = 0; i < numbers.length; i++) {
        const ni = numbers[i];
        let r = OPS[m](valSums, ni);
        let equi = "(" + equation + ") " + m + " " + ni;
        if (equation == "") {
          r = ni;
          equi = "" + ni;
        }
        if (r > 0 && r < 1000 && r >> 0 == r) {
          equations[r].push(equi + " = " + r);
        }
        permute_numbers(removeItemOnce(numbers, [ni]), r, `${equi}`, equations);
      }
    }
  };

  const yeet: Record<string, string[]> = {};
  for (let i = 0; i < 1000; i++) {
    yeet[i] = [];
  }
  permute_numbers(numbers, 0, "", yeet);


  if (yeet[target].length == 0) {
    for (let i = 1; i < 1000; i++) {
      if (yeet[target + i] != undefined) {
        return yeet[target + i];
      }

      if (yeet[target - i] != undefined) {
        return yeet[target - i];
      }
    }
  }

  return yeet[target];
}