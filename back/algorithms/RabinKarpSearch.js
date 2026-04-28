import SearchStrategy from "./SearchStrategy";

export default class RabinKarpSearch extends SearchStrategy {
  static PRIME = 101;
  static BASE = 256;

  search(text, pattern) {
    const pre = this._ensureInputs(text, pattern);
    if (pre.skip) return pre.result;

    const start = pre.start;

    const m = pattern.length;
    const n = text.length;

    const base = RabinKarpSearch.BASE;
    const prime = RabinKarpSearch.PRIME;

    let h = this._computeH(m, base, prime);

    const { pHash, tHash: initialTHash } =
      this._computeInitialHashes(text, pattern, m, base, prime);

    let tHash = initialTHash;

    let comparisons = 0;
    const matches = [];

    for (let i = 0; i <= n - m; i++) {
      if (pHash === tHash) {
        const { isMatch, comps } = this._checkMatch(text, pattern, i, m);
        comparisons += comps;

        if (isMatch) {
          matches.push(i);
        }
      }

      if (i < n - m) {
        tHash = this._updateHash(tHash, text, i, m, h, base, prime);
      }
    }

    return this._createResult(matches, comparisons, start);
  }

  _computeH(m, base, prime) {
    let h = 1;
    for (let i = 0; i < m - 1; i++) {
      h = (h * base) % prime;
    }
    return h;
  }

  _computeInitialHashes(text, pattern, m, base, prime) {
    let pHash = 0;
    let tHash = 0;

    for (let i = 0; i < m; i++) {
      pHash = (base * pHash + pattern.charCodeAt(i)) % prime;
      tHash = (base * tHash + text.charCodeAt(i)) % prime;
    }

    return { pHash, tHash };
  }

  _updateHash(tHash, text, i, m, h, base, prime) {
    let newHash =
      (base * (tHash - text.charCodeAt(i) * h) +
        text.charCodeAt(i + m)) %
      prime;

    return newHash < 0 ? newHash + prime : newHash;
  }

  _checkMatch(text, pattern, startIndex, m) {
    let comparisons = 0;

    for (let j = 0; j < m; j++) {
      comparisons++;
      if (text[startIndex + j] !== pattern[j]) {
        return { isMatch: false, comps: comparisons };
      }
    }

    return { isMatch: true, comps: comparisons };
  }
}