import SearchStrategy from "./SearchStrategy";

export default class NaiveSearch extends SearchStrategy {
  search(text, pattern) {
    let comparisons = 0;
    const matches = [];

    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return pre.result;
    const start = pre.start;

    const n = text.length;
    const m = pattern.length;

    for (let i = 0; i <= n - m; i++) {
      let j = 0;

      while (j < m) {
        const textChar = text[i + j];
        const patternChar = pattern[j];

        comparisons++;
        if (textChar !== patternChar) break;

        j++;
      }

      if (j === m) {
        matches.push(i);
      }
    }

    return this._createResult(matches, comparisons, start);
  }

  *searchStepByStep(text, pattern) {
    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return;

    const n = text.length;
    const m = pattern.length;

    for (let i = 0; i <= n - m; i++) {
      let j = 0;

      while (j < m) {
        const textChar = text[i + j];
        const patternChar = pattern[j];

        yield {
          i,
          j,
          textChar,
          patternChar,
        };

        if (textChar !== patternChar) break;

        j++;
      }
    }
  }
}