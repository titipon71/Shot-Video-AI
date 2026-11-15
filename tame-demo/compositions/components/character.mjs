// Re-export the shared flat-people library.
// Source of truth: /shared/flat-people/index.mjs  (no tame-demo dependency).
export {
  character,
  mix,
  createPerson,
  createMale,
  createFemale,
  mountPerson,
  toSvgDocument,
  presets,
  HOOKS,
  FRAME,
  EXPRESSIONS,
} from "../../../shared/flat-people/index.mjs";
