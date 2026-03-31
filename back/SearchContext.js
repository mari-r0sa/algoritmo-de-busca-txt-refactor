export class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(text, pattern) {
    if (!this.strategy) {
      throw new Error("Strategy não definida");
    }

    return this.strategy.search(text, pattern);
  }

  executeStepByStep(text, pattern) {
    if (!this.strategy) {
      throw new Error("Strategy não definida");
    }

    return this.strategy.searchStepByStep(text, pattern);
  }
}