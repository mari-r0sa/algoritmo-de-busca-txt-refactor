<script setup>
import { ref } from "vue";

import { strategies } from "../../back";
import { SearchContext } from "../../back/SearchContext.js";

// ===============================
// STATE
// ===============================
const text = ref("");
const pattern = ref("");
const selectedAlgorithm = ref("default");

const output = ref(null);
const stepLog = ref([]);

let stepIterator = null;

// ===============================
// FILE READER
// ===============================
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    text.value = e.target.result;
  };
  reader.readAsText(file);
}

// ===============================
// EXECUÇÃO NORMAL
// ===============================
function executar() {
  if (!text.value || !pattern.value || selectedAlgorithm.value === "default") {
    alert("Preencha todos os campos!");
    return;
  }

  const strategy = strategies[selectedAlgorithm.value];

  if (!strategy) {
    alert("Algoritmo inválido!");
    return;
  }

  const context = new SearchContext(strategy);

  const result = context.execute(text.value, pattern.value);

  output.value = {
    ...result,
    textLength: text.value.length,
    patternLength: pattern.value.length,
    complexity: getComplexity(selectedAlgorithm.value),
  };

  stepLog.value = [];
}

// ===============================
// STEP BY STEP
// ===============================
function iniciarPassoAPasso() {
  if (!text.value || !pattern.value || selectedAlgorithm.value === "default") {
    alert("Preencha todos os campos!");
    return;
  }

  const strategy = strategies[selectedAlgorithm.value];

  const context = new SearchContext(strategy);

  stepIterator = context.executeStepByStep(
    text.value,
    pattern.value
  );

  stepLog.value = [];
}

function proximoPasso() {
  if (!stepIterator) return;

  const step = stepIterator.next();

  if (!step.done) {
    stepLog.value.push(step.value);
  }
}

// ===============================
// COMPLEXIDADE
// ===============================
function getComplexity(algo) {
  switch (algo) {
    case "buscaNaive":
      return "O(n * m)";
    case "rabinKarp":
      return "O(n + m) (médio)";
    case "kmp":
      return "O(n + m)";
    case "boyerMoore":
      return "O(n / m) (melhor caso)";
    default:
      return "-";
  }
}
</script>

<template>
  <header>
    <h1 class="centralizar">
      Comparação de Algoritmos de Busca em Strings
    </h1>

    <div class="centralizar coluna">
      <!-- Upload -->
      <input type="file" @change="handleFileUpload" />

      <!-- Pattern -->
      <div>
        <p>Digite a string a ser buscada:</p>
        <input v-model="pattern" type="text" />
      </div>

      <!-- Algoritmo -->
      <div>
        <p>Selecione o algoritmo:</p>
        <select v-model="selectedAlgorithm">
          <option value="default">Nenhum valor selecionado</option>
          <option value="buscaNaive">Busca Naive</option>
          <option value="rabinKarp">Rabin-Karp</option>
          <option value="kmp">KMP</option>
          <option value="boyerMoore">Boyer-Moore</option>
        </select>
      </div>

      <!-- Botões -->
      <div class="column">
        <button @click="executar">Executar</button>
        <button @click="iniciarPassoAPasso">
          Iniciar passo a passo
        </button>
        <button @click="proximoPasso">
          Próximo passo
        </button>
      </div>
    </div>
  </header>

  <div class="container">
    <!-- RESULTADO -->
    <div class="box">
      <h2>Dados da execução</h2>

      <div v-if="output">
        <p><b>Tempo:</b> {{ output.time.toFixed(4) }} ms</p>
        <p><b>Comparações:</b> {{ output.comparisons }}</p>
        <p><b>Tamanho texto:</b> {{ output.textLength }}</p>
        <p><b>Tamanho padrão:</b> {{ output.patternLength }}</p>
        <p><b>Complexidade:</b> {{ output.complexity }}</p>
        <p><b>Ocorrências:</b> {{ output.matches }}</p>
      </div>
    </div>

    <!-- STEP BY STEP -->
    <div class="box">
      <h2>Passo a passo</h2>

      <div class="log">
        <div v-for="(step, index) in stepLog" :key="index">
          <pre>{{ step }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centralizar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.coluna {
  flex-direction: column;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.box {
  flex: 1;
  border: 1px solid #ccc;
  padding: 15px;
  height: 400px;
  overflow: auto;
}

.log {
  font-size: 12px;
  background: #111;
  color: #0f0;
  padding: 10px;
}
</style>