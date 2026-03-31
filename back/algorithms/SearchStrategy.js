export default class SearchStrategy {
  search(text, pattern) {
    throw new Error("Método search() deve ser implementado");
  }

  *searchStepByStep(text, pattern) {
    throw new Error("Método step-by-step deve ser implementado");
  }
}