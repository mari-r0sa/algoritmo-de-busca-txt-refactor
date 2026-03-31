import SearchStrategy from "./SearchStrategy";

export default class KMPSearch extends SearchStrategy {
  buildLPS(pattern) {
    const lps = Array(pattern.length).fill(0);
    let len = 0, i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        lps[i++] = ++len;
      } else {
        len ? (len = lps[len - 1]) : i++;
      }
    }

    return lps;
  }

  search(text, pattern) {
    const lps = this.buildLPS(pattern);
    let i = 0, j = 0;
    let comparisons = 0;
    const matches = [];

    const start = performance.now();

    while (i < text.length) {
      comparisons++;

      if (pattern[j] === text[i]) {
        i++; j++;
      }

      if (j === pattern.length) {
        matches.push(i - j);
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        j ? (j = lps[j - 1]) : i++;
      }
    }

    return {
      matches,
      comparisons,
      time: performance.now() - start,
      lps
    };
  }
}