import SearchStrategy from "./SearchStrategy";

export default class BoyerMooreSearch extends SearchStrategy {
  buildBadChar(pattern) {
    const table = {};
    for (let i = 0; i < pattern.length; i++) {
      table[pattern[i]] = i;
    }
    return table;
  }

  search(text, pattern) {
    const badChar = this.buildBadChar(pattern);

    let m = pattern.length, n = text.length;
    let s = 0, comparisons = 0;
    const matches = [];

    const start = performance.now();

    while (s <= n - m) {
      let j = m - 1;

      while (j >= 0 && pattern[j] === text[s + j]) {
        comparisons++;
        j--;
      }

      if (j < 0) {
        matches.push(s);
        s += m - (badChar[text[s + m]] || -1);
      } else {
        comparisons++;
        s += Math.max(1, j - (badChar[text[s + j]] || -1));
      }
    }

    return {
      matches,
      comparisons,
      time: performance.now() - start,
      badChar
    };
  }
}