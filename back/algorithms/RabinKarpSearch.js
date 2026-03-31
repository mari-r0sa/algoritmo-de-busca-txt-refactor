import SearchStrategy from "./SearchStrategy";

export default class RabinKarpSearch extends SearchStrategy {
  search(text, pattern) {
    const prime = 101, base = 256;
    let m = pattern.length, n = text.length;

    let pHash = 0, tHash = 0, h = 1;
    let comparisons = 0;
    const matches = [];

    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % prime;
    }

    for (let i = 0; i < m; i++) {
      pHash = (base * pHash + pattern.charCodeAt(i)) % prime;
      tHash = (base * tHash + text.charCodeAt(i)) % prime;
    }

    const start = performance.now();

    for (let i = 0; i <= n - m; i++) {
      if (pHash === tHash) {
        let match = true;

        for (let j = 0; j < m; j++) {
          comparisons++;
          if (text[i + j] !== pattern[j]) {
            match = false;
            break;
          }
        }

        if (match) matches.push(i);
      }

      if (i < n - m) {
        tHash =
          (base * (tHash - text.charCodeAt(i) * h) +
            text.charCodeAt(i + m)) %
          prime;

        if (tHash < 0) tHash += prime;
      }
    }

    return {
      matches,
      comparisons,
      time: performance.now() - start
    };
  }
}