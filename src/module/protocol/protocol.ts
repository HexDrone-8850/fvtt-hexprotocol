import { getGame } from "../utils";

export type HexProtocolCode = keyof typeof protocolCodes;
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
  201: "response",
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
  414: "error",
  450: "error",
  500: "action",
  510: "action",
  511: "action",
  512: "action",
  513: "action",
  514: "action",
  515: "action",
  516: "action",
  520: "action",
  521: "action",
  522: "action",
  523: "action",
  524: "action",
  525: "action",
  526: "action",
  530: "response",
  531: "response",
  532: "response",
  533: "action",
  534: "action",
  540: "action",
  541: "action",
  542: "action",
  550: "action",
  551: "action",
  560: "query",
  561: "query",
  562: "query",
  563: "query",
  564: "query",
  565: "query",
  566: "query",
  567: "query",
  568: "query",
  600: "ooc",
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
  // Status
  "150",
  // Response
  "250",
  // Mantra
  "350",
  // Error
  "450",
  // Action
  "500",
  // OOC
  "600",
] as const; // These are localized in the i18nInit hook

export const OOC_CODE = "600" as const;

export function isCustomMessageCode(code: unknown): code is CustomProtocolCode {
  return customMessageCodes.includes(code as CustomProtocolCode);
}

export function isValidProtocolCode(
  code: string | number | undefined
): code is HexProtocolCode {
  const settings = getGame().settings;

  const denyOOC = code === OOC_CODE && !settings.get("hexprotocol", "allowOOC");

  return code != undefined && code in protocolCodes && !denyOOC;
}
