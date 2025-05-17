import { MODULE_ID, type ChatCommandData } from "../interface-config";
import { protocolCodes, type HexProtocolCode } from "../protocol/protocol";
import { type HexProtocolErrorId } from "../protocol/error-handling";

import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";
import { isValidProtocolCode, isCustomMessageCode } from "../protocol/protocol";

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
): ChatMessage.CreateData {
  const isAdmin = currentUserIsAdmin();
  const { droneId, code, message, error } = validateParams(parameters, isAdmin);

  // If error is set at all, we've got an error
  if (error) {
    return generateProtocolError(error, isAdmin);
  }

  const { i18n, settings } = getGame();

  // Otherwise, we have valid data
  const isCustomCode = isCustomMessageCode(code);
  const category = protocolCodes[code];
  // For some reason it thinks the type of `code` is `never`???
  // Hence the `as string`
  const details = isCustomCode
    ? message
    : i18n.localize(`HEXPROTO.protocol.details.${code as string}`);

  let output = i18n.format("HEXPROTO.protocol.template", {
    droneId,
    code: `${code}`,
    category,
    details,
  });

  if (message && !isCustomCode) {
    output += ` :: ${message}`;
  }

  const content = `<span class="hexproto-output">${output}</span>`;

  const chatAlias = settings.get("hexprotocol", "useIdentifyingAlias")
    ? "hexDrone"
    : "transmission";

  return {
    content,
    speaker: {
      alias: i18n.format(`HEXPROTO.chatAlias.${chatAlias}`, { droneId }),
    },
    flags: {
      hexprotocol: {
        replaceChatPortrait: "drone",
      },
    },
  };
}

function validateParams(params: string, isAdmin = false): ProtocolMsgParams {
  const regex = /^((?<id>\d{4}) )??(?<msgCode>\d{3})(?: (?<msg>.*))?$/;

  const { id, msgCode, msg } = params.match(regex)?.groups ?? {};

  const code = msgCode ?? "";
  const message = msg ?? "";

  const user = getGame().user;

  // If an ID was provided, use that; otherwise, use the stored one
  const storedID = user.getFlag("hexprotocol", "droneId");
  const droneId = id ?? storedID ?? "";

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
  if (msgCode == undefined || !isValidProtocolCode(msgCode)) {
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
