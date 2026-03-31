import NaiveSearch from "./algorithms/NaiveSearch";
import KMPSearch from "./algorithms/KMPSearch";
import RabinKarpSearch from "./algorithms/RabinKarpSearch";
import BoyerMooreSearch from "./algorithms/BoyerMooreSearch";

export const strategies = {
  buscaNaive: new NaiveSearch(),
  kmp: new KMPSearch(),
  rabinKarp: new RabinKarpSearch(),
  boyerMoore: new BoyerMooreSearch(),
};