import { MODULE_ID, type ChatCommandData } from "../interface-config";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

export const aiCommand: ChatCommandData = {
  name: "/ai",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.ai.description",
  callback: aiCallback,
};

function aiCallback(
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

  const content = `<span class="hexproto-output">${msg}</span>`;

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
