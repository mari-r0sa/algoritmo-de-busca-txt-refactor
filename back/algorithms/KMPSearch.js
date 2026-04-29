import SearchStrategy from "./SearchStrategy";

export default class KMPSearch extends SearchStrategy {
  buildLPS(pattern) {
    const lps = Array(pattern.length).fill(0);
    let prefixLength = 0;
    let patternIndex = 1;

    while (patternIndex < pattern.length) {
      if (pattern[patternIndex] === pattern[prefixLength]) {
        prefixLength++;
        lps[patternIndex] = prefixLength;
        patternIndex++;
      } else if (prefixLength !== 0) {
        prefixLength = lps[prefixLength - 1];
      } else {
        lps[patternIndex] = 0;
        patternIndex++;
      }
    }

    return lps;
  }

  search(text, pattern) {
    const start = performance.now();
    const result = this.executeSearch(text, pattern, false);

    return {
      matches: result.matches,
      comparisons: result.comparisons,
      time: performance.now() - start,
      lps: result.lps,
    };
  }

  *searchStepByStep(text, pattern) {
    const result = this.executeSearch(text, pattern, true);

    for (const step of result.steps) {
      yield step;
    }
  }

  executeSearch(text, pattern, collectSteps = false) {
    const matches = [];
    const steps = [];
    let comparisons = 0;

    if (!text || !pattern || pattern.length > text.length) {
      return {
        matches,
        comparisons,
        lps: pattern ? this.buildLPS(pattern) : [],
        steps,
      };
    }

    const lps = this.buildLPS(pattern);
    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < text.length) {
      const currentTextIndex = textIndex;
      const currentPatternIndex = patternIndex;
      const textChar = text[textIndex];
      const patternChar = pattern[patternIndex];
      const isMatch = textChar === patternChar;

      comparisons++;

      if (isMatch) {
        textIndex++;
        patternIndex++;
      } else if (patternIndex !== 0) {
        patternIndex = lps[patternIndex - 1];
      } else {
        textIndex++;
      }

      if (collectSteps) {
        steps.push({
          algorithm: "KMP",
          textIndex: currentTextIndex,
          patternIndex: currentPatternIndex,
          textChar,
          patternChar,
          match: isMatch,
          comparisons,
          nextTextIndex: textIndex,
          nextPatternIndex: patternIndex,
          lps: [...lps],
          action: isMatch ? "MATCH_ADVANCE" : "MISMATCH_FALLBACK_OR_ADVANCE",
        });
      }

      if (patternIndex === pattern.length) {
        const matchStart = textIndex - patternIndex;
        matches.push(matchStart);

        if (collectSteps) {
          steps.push({
            algorithm: "KMP",
            action: "MATCH_FOUND",
            matchStart,
            comparisons,
            lps: [...lps],
          });
        }

        patternIndex = lps[patternIndex - 1];
      }
    }

    return {
      matches,
      comparisons,
      lps,
      steps,
    };
  }
}