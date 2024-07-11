function initMatrix(s1: string, s2: string): number[][] {
  let d: number[][] = [];
  for (var i = 0; i <= s1.length; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (var j = 0; j <= s2.length; j++) {
    d[0][j] = j;
  }

  return d;
}

function damerau(
  i: number,
  j: number,
  s1: string,
  s2: string,
  d: number[][],
  cost: number
) {
  if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
    d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
  }
}

function distance(s1: string, s2: string) {
  let d = initMatrix(s1, s2);
  for (var i = 1; i <= s1.length; i++) {
    let cost;
    for (var j = 1; j <= s2.length; j++) {
      if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        cost = 0;
      } else {
        cost = 1;
      }

      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );

      damerau(i, j, s1, s2, d, cost);
    }
  }

  return d[s1.length][s2.length];
}

export default distance;
