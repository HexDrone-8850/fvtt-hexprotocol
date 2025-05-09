import { getGame } from "./utils";

export type HexProtocolCode = keyof typeof protocolCodes;
export type HexProtocolErrorId = keyof typeof errorIds;
export type CustomProtocolCode = (typeof customMessageCodes)[number];

export const protocolCodes = {
  "000": "statement",
  "001": "signal",
  "002": "signal",
  "003": "signal",
  "007": "beep",
  "050": "statement",
  "051": "commentary",
  "052": "query",
  "053": "answer",
  "097": "status",
  "098": "status",
  "099": "status",
  100: "status",
  101: "status",
  104: "statement",
  105: "statement",
  108: "response",
  109: "error",
  110: "statement",
  111: "statement",
  112: "statement",
  113: "statement",
  114: "statement",
  115: "statement",
  120: "statement",
  121: "statement",
  122: "statement",
  123: "response",
  124: "response",
  130: "status",
  131: "status",
  132: "status",
  133: "status",
  150: "status",
  151: "query",
  152: "status",
  153: "status",
  154: "status",
  155: "status",
  156: "status",
  200: "response",
  210: "response",
  211: "response",
  212: "response",
  213: "response",
  214: "response",
  221: "response",
  222: "response",
  223: "response",
  224: "response",
  225: "response",
  226: "response",
  230: "status",
  231: "status",
  232: "status",
  233: "status",
  234: "status",
  235: "status",
  250: "response",
  300: "mantra",
  301: "mantra",
  302: "mantra",
  303: "mantra",
  304: "mantra",
  350: "mantra",
  400: "error",
  401: "error",
  402: "error",
  403: "error",
  404: "error",
  405: "error",
  406: "error",
  407: "error",
  408: "error",
  409: "error",
  410: "fatalError",
  411: "error",
  412: "error",
  413: "error",
  450: "error",
  500: "response",
};
export const customMessageCodes = [
  // Statement
  "050",
  // Commentary
  "051",
  // Query
  "052",
  // Answer
  "053",
  // Statement :: Addressing: Drone.
  "110",
  // Statement :: Addressing: Admin.
  "111",
  // Statement :: Addressing: Associate.
  "112",
  // Status
  "150",
  // Response
  "250",
  // Mantra
  "350",
  // Error
  "450",
] as const; // These are localized in the i18nInit hook

export const errorIds = {
  notADrone: "",
  isADrone: "",
  invalidProtocolCode: "",
  noInlineID: "",
  speechOptimized: "",
  idNotPrepended: "",
  droneIdMismatch: "",
  contentMissing: "",
  subjectNotFound: "",
  droneNotFound: "",
  permissionDenied: "",
  invalidDroneId: "",
  invalidConfigKey: "",
  invalidConfigValue: "",
};

export function localizeErrorId(error: HexProtocolErrorId) {
  const game = getGame();
  const userCategory = game.user.getFlag("hexprotocol", "isAdmin")
    ? "admin"
    : "user";

  const prefix = game.i18n.localize("HEXPROTO.error.prefix");
  const code = game.i18n.localize(`HEXPROTO.error.${error}.code`);
  const errorDesc = game.i18n.localize(`HEXPROTO.error.${error}.description`);
  const templateString = `HEXPROTO.error.template.${userCategory}`;

  return game.i18n.format(templateString, {
    prefix,
    errorDesc,
    code,
  });
}

export function isCustomMessageCode(code: unknown): code is CustomProtocolCode {
  return customMessageCodes.includes(code as CustomProtocolCode);
}

export function isProtocolCode(
  code: string | number | undefined,
): code is HexProtocolCode {
  return code != undefined && code in protocolCodes;
}

export function isErrorID(id: string): id is HexProtocolErrorId {
  return id in errorIds;
}
