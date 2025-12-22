export const UNIT_TYPES = [
  "UNIDADE",
  "CAIXA",
  "LITRO",
  "POTE_VIDRO",
  "POTE_PLASTICO",
  "PACOTE",
  "EMBALAGEM",
  "CAIXA_PLASTICA",
  "DUZIA",
  "KG",
  "GRAMA",
  "OUTRO"
] as const;

export type UnitType = typeof UNIT_TYPES[number];