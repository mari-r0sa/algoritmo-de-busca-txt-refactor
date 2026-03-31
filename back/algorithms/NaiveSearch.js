import SearchStrategy from "./SearchStrategy";

export default class NaiveSearch extends SearchStrategy {
  search(text, pattern) {
    let comparisons = 0;
    const matches = [];

    const start = performance.now();

    for (let i = 0; i <= text.length - pattern.length; i++) {
      let j = 0;

      while (j < pattern.length) {
        comparisons++;
        if (text[i + j] !== pattern[j]) break;
        j++;
      }

      if (j === pattern.length) matches.push(i);
    }

    return {
      matches,
      comparisons,
      time: performance.now() - start,
    };
  }

  *searchStepByStep(text, pattern) {
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