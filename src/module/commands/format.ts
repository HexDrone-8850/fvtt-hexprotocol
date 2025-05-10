import { MODULE_ID, type ChatCommandData } from "../config";
import {
  protocolCodes,
  type HexProtocolCode,
  type HexProtocolErrorId,
} from "../protocol";

import { getGame } from "../utils";
import {
  isProtocolCode,
  isCustomMessageCode,
  localizeErrorId,
} from "../protocol";

interface ProtocolMsgParams {
  droneId: string;
  code: HexProtocolCode;
  message: string;
  error?: HexProtocolErrorId;
}

export const formatMsgCommand: ChatCommandData = {
  name: "/hc!protocol",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.hex.description",
  aliases: ["/h", "/d"],
  icon: '<img src="icons/svg/sound.svg" />',
  callback: formatMsgCallback,
};

function formatMsgCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const { droneId: droneId, code, message, error } = validateParams(parameters);

  // If error is set at all, we've got an error
  if (error) {
    ui.notifications?.error(localizeErrorId(error));
    return {};
  }

  const i18n = getGame().i18n;

  // Otherwise, we have valid data
  const isCustomCode = isCustomMessageCode(code);
  const category = protocolCodes[code];
  // For some reason it thinks the type of `code` is `never`???
  // Hence the `as string`
  const details = isCustomCode
    ? message
    : i18n.localize(`HEXPROTO.protocol.details.${code as string}`);

  const baseOutput = i18n.format("HEXPROTO.protocol.template", {
    droneId,
    code: `${code}`,
    category,
    details,
  });

  const addedOutput = message && !isCustomCode ? ` :: ${message}` : "";

  const content = `<code>${baseOutput}${addedOutput}</code>`;

  return {
    content,
    speaker: {
      alias: i18n.format("HEXPROTO.chatAlias.hexDrone", { droneId }),
    },
  };
}

function validateParams(params: string): ProtocolMsgParams {
  const regex = /^((?<id>\d{4}) )??(?<msgCode>\d{3})(?: (?<msg>.*))?$/;

  const { id, msgCode, msg } = params.match(regex)?.groups ?? {};

  const code = msgCode ?? "";
  const message = msg ?? "";

  const user = getGame().user;

  // If an ID was provided, use that; otherwise, use the stored one
  const storedID = user.getFlag("hexprotocol", "droneId");
  const droneId = id ?? storedID;
  const isAdmin = user.getFlag("hexprotocol", "isAdmin");

  const optimizeSpeech =
    user.getFlag("hexprotocol", "optimizeSpeech") && !isAdmin;
  const forcePrependId =
    user.getFlag("hexprotocol", "forcePrependId") && !isAdmin;

  const isCustomProtocol = isCustomMessageCode(code);

  // We can cheat here with that `as` since if the code is invalid it'll never get checked
  const output: ProtocolMsgParams = {
    droneId,
    code: code as HexProtocolCode,
    message,
  };

  // Make sure the user is even a drone
  // If there is no stored or given drone ID, we can't do anything
  if (!droneId) {
    output.error ??= "notADrone";
  }

  // Is this a valid code?
  if (msgCode == undefined || !isProtocolCode(msgCode)) {
    output.error ??= "invalidProtocolCode";
  }

  // Did it prepend a non-matching ID and it isn't an admin?
  if (id && !isAdmin && id !== storedID) {
    output.error ??= "droneIdMismatch";
  }

  // Did it forget to prepend its ID when it's supposed to?
  if (forcePrependId && id !== storedID) {
    output.error ??= "idNotPrepended";
  }

  // Is its speech optimized and it's a forbidden code?
  if (optimizeSpeech && (isCustomProtocol || msg)) {
    output.error ??= "speechOptimized";
  }

  // Is this a message that needs custom output, but none was provided?
  if (isCustomProtocol && !message) {
    output.error ??= "contentMissing";
  }

  // Wrap it up
  return output;
}
