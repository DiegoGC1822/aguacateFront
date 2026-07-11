import MockAdapter from "axios-mock-adapter";
import api from "../../data/api/api";

// Mockea el *adapter* de la instancia `api`, POR DEBAJO de los interceptores,
// de modo que los interceptores de auth/refresh de `api.ts` sí se ejecutan en los tests.
export const mock = new MockAdapter(api, { onNoMatch: "throwException" });
