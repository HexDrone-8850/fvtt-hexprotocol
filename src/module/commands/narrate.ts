import { MODULE_ID, type ChatCommandData } from "../interface-config";
import { NARRATION_CODE, protocolCodes } from "../protocol/protocol";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

export const narrateCommand: ChatCommandData = {
  name: "/n",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.narrate.description",
  callback: narrateCallback,
};

function narrateCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  const { user, i18n, settings } = getGame();

  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied");
  }

  const droneId = user.getFlag("hexprotocol", "droneId");

  if (!droneId) {
    return generateProtocolError("droneNotFound", isAdmin);
  }

  const code = NARRATION_CODE;

  const category = protocolCodes[code];

  const details = parameters.trim();

  const message = i18n.format("HEXPROTO.protocol.template", {
    droneId,
    code,
    category,
    details,
  });

  const content = `<span class="hexproto-output">${message}</span>`;

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
