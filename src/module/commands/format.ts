import { MODULE_ID } from "../config";
import { protocolCodes } from "../protocol";
import {
  isProtocolCode,
  isCustomProtocolCode,
  getGame,
  localizeErrorMessage,
} from "../utils";

interface ProtocolMsgParams {
  droneID: string;
  code: HexProtocolCode;
  message: string;
  error?: FormatCommandError;
}

export const formatMsgCommand: ChatCommandData = {
  name: "/hex",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.hex.description",
  aliases: ["/h", "/d"],
  icon: '<img src="icons/svg/sound.svg" />',
  callback: formatMsgCallback,
};

export function formatMsgCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const { droneID, code, message, error } = validateParams(parameters);

  // If error is set at all, we've got an error
  if (error) {
    const errorMsg = localizeErrorMessage(error);
    ui.notifications?.error(errorMsg);
    return {};
  }

  const i18n = getGame().i18n;

  // Otherwise, we have valid data
  const category = protocolCodes[code];
  const details = i18n.localize(`HEXPROTO.messageDetails.${code}`);

  const baseOutput = i18n.format("HEXPROTO.baseMessage", {
    droneID,
    code: `${code}`,
    category,
    details,
  });

  const addedOutput = message ? ` :: ${message}` : "";

  const content = `<code>${baseOutput}${addedOutput}</code>`;

  return {
    content,
    speaker: {
      alias: `⬡-Drone #${droneID}`,
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
  const storedID = user.getFlag("hexprotocol", "droneID");
  const droneID = id ?? storedID;
  const isAdmin = user.getFlag("hexprotocol", "isAdmin");

  const speechOptimized =
    user.getFlag("hexprotocol", "speechOptimized") && !isAdmin;
  const forceIdPrepend =
    user.getFlag("hexprotocol", "forceIdPrepend") && !isAdmin;

  const isCustomProtocol = isCustomProtocolCode(code);

  // We can cheat here with that `as` since if the code is invalid it'll never get checked
  const output: ProtocolMsgParams = {
    droneID,
    code: code as HexProtocolCode,
    message,
  };

  // Make sure the user is even a drone
  // If there is no stored or given drone ID, we can't do anything
  if (!droneID) {
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
  if (forceIdPrepend && id !== storedID) {
    output.error ??= "idNotPrepended";
  }

  // Is its speech optimized and it's a forbidden code?
  if (speechOptimized && isCustomProtocol) {
    output.error ??= "speechOptimized";
  }

  // Is this a message that needs custom output, but none was provided?
  if (isCustomProtocol && !message) {
    output.error ??= "contentMissing";
  }

  // An error should be loaded up by here if anything went wrong,
  // so it doesn't matter

  // Wrap it up
  return output;
}
