import SearchStrategy from "./SearchStrategy";

export default class RabinKarpSearch extends SearchStrategy {
  search(text, pattern) {
    const prime = 101;
    const base = 256;

    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return pre.result;

    const start = pre.start;

    const m = pattern.length;
    const n = text.length;

    let pHash = 0;
    let tHash = 0;
    let h = 1;

    let comparisons = 0;
    const matches = [];

    // h = base^(m-1) % prime
    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % prime;
    }

    // cálculo inicial dos hashes
    for (let i = 0; i < m; i++) {
      pHash = (base * pHash + pattern.charCodeAt(i)) % prime;
      tHash = (base * tHash + text.charCodeAt(i)) % prime;
    }

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

        if (match) {
          matches.push(i);
        }
      }

      // Rolling hash
      if (i < n - m) {
        tHash =
          (base * (tHash - text.charCodeAt(i) * h) +
            text.charCodeAt(i + m)) %
          prime;

        if (tHash < 0) tHash += prime;
      }
    }

    return this._createResult(matches, comparisons, start);
  }
}