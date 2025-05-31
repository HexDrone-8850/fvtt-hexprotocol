import { MODULE_ID, type ChatCommandData } from "../interface-config";
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
  const { i18n } = getGame();

  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied");
  }

  const msg = parameters.trim();

  const message = i18n.format("HEXPROTO.cmd.narrate.template", {
    msg,
  });

  const content = `<span class="hexproto-output">${message}</span>`;

  return {
    content,
    speaker: {
      alias: i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    flags: {
      hexprotocol: {
        replaceChatPortrait: "ai",
      },
    },
  };
}
