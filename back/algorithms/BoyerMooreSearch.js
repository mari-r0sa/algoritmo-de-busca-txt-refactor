import SearchStrategy from "./SearchStrategy";

export default class BoyerMooreSearch extends SearchStrategy {
  buildBadChar(pattern) {
    const table = {};

    for (let index = 0; index < pattern.length; index++) {
      table[pattern[index]] = index;
    }

    return table;
  }

  search(text, pattern) {
    const start = performance.now();
    const result = this.executeSearch(text, pattern, false);

    return {
      matches: result.matches,
      comparisons: result.comparisons,
      time: performance.now() - start,
      badChar: result.badChar,
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
        badChar: pattern ? this.buildBadChar(pattern) : {},
        steps,
      };
    }

    const badChar = this.buildBadChar(pattern);
    const patternLength = pattern.length;
    const textLength = text.length;
    let shift = 0;

    while (shift <= textLength - patternLength) {
      let patternIndex = patternLength - 1;

      while (patternIndex >= 0) {
        const textIndex = shift + patternIndex;
        const textChar = text[textIndex];
        const patternChar = pattern[patternIndex];
        const isMatch = textChar === patternChar;

        comparisons++;

        if (collectSteps) {
          steps.push({
            algorithm: "Boyer-Moore",
            shift,
            textIndex,
            patternIndex,
            textChar,
            patternChar,
            match: isMatch,
            comparisons,
            badChar: { ...badChar },
            action: isMatch ? "MATCH_MOVE_LEFT" : "MISMATCH_SHIFT",
          });
        }

        if (!isMatch) {
          break;
        }

        patternIndex--;
      }

      if (patternIndex < 0) {
        matches.push(shift);

        if (collectSteps) {
          steps.push({
            algorithm: "Boyer-Moore",
            action: "MATCH_FOUND",
            matchStart: shift,
            comparisons,
            badChar: { ...badChar },
          });
        }

        shift += this.calculateFullMatchShift(text, patternLength, shift, badChar);
      } else {
        const mismatchedChar = text[shift + patternIndex];
        const lastOccurrence = this.getLastOccurrence(badChar, mismatchedChar);
        const shiftAmount = Math.max(1, patternIndex - lastOccurrence);

        if (collectSteps) {
          steps.push({
            algorithm: "Boyer-Moore",
            action: "SHIFT_APPLIED",
            previousShift: shift,
            shiftAmount,
            nextShift: shift + shiftAmount,
            mismatchedChar,
            lastOccurrence,
            comparisons,
          });
        }

        shift += shiftAmount;
      }
    }

    return {
      matches,
      comparisons,
      badChar,
      steps,
    };
  }

  calculateFullMatchShift(text, patternLength, shift, badChar) {
    const nextTextIndex = shift + patternLength;

    if (nextTextIndex >= text.length) {
      return 1;
    }

    const nextChar = text[nextTextIndex];
    const lastOccurrence = this.getLastOccurrence(badChar, nextChar);

    return patternLength - lastOccurrence;
  }

  getLastOccurrence(badChar, char) {
    return Object.prototype.hasOwnProperty.call(badChar, char)
      ? badChar[char]
      : -1;
  }
}