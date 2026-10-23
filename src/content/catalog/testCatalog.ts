import rawTestCatalog from "./test-catalog.json";
import type { TestCatalog } from "./types";

/**
 * Piano dichiarativo dei test. I quesiti restano nel catalogo editoriale e
 * vengono richiamati qui per ID: il JSON non duplica né contiene quiz ministeriali.
 */
export const testCatalog = rawTestCatalog as TestCatalog;
