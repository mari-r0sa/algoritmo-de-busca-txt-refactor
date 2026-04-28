export default class SearchStrategy {
  search(text, pattern) {
    throw new Error("Método search() deve ser implementado");
  }

  *searchStepByStep(text, pattern) {
    throw new Error("Método step-by-step deve ser implementado");
  }

  // Valida inputs comuns e retorna um objeto com start ou um resultado antecipado
  _ensureInputs(text, pattern) {
    const start = performance.now();

    if (text == null || pattern == null) {
      return { skip: true, result: this._createResult([], 0, start) };
    }

    if (pattern.length === 0) {
      return { skip: true, result: this._createResult([], 0, start) };
    }

    if (text.length < pattern.length) {
      return { skip: true, result: this._createResult([], 0, start) };
    }

    return { skip: false, start };
  }

  // Cria objeto de retorno consistente
  _createResult(matches = [], comparisons = 0, start = performance.now(), extra = {}) {
    return {
      matches,
      comparisons,
      time: performance.now() - start,
      ...extra
    };
  }
}