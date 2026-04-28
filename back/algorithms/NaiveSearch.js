import SearchStrategy from "./SearchStrategy";

export default class NaiveSearch extends SearchStrategy {
  search(text, pattern) {
    let comparisons = 0;
    const matches = [];

    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return pre.result;
    const start = pre.start;

    for (let i = 0; i <= text.length - pattern.length; i++) {
      let j = 0;

      while (j < pattern.length) {
        comparisons++;
        if (text[i + j] !== pattern[j]) break;
        j++;
      }

      if (j === pattern.length) matches.push(i);
    }

    return this._createResult(matches, comparisons, start);
  }

  *searchStepByStep(text, pattern) {
    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return;

    for (let i = 0; i <= text.length - pattern.length; i++) {
      let j = 0;

      while (j < pattern.length) {
        yield {
          i,
          j,
          textChar: text[i + j],
          patternChar: pattern[j],
        };

        if (text[i + j] !== pattern[j]) break;
        j++;
      }
    }
  }
}