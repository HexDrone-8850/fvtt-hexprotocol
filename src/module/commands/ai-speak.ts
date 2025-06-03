import { MODULE_ID, type ChatCommandData } from "../interface-config";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

export const aiChatCommand: ChatCommandData = {
  name: "/hc!ai",
  aliases: ["/ai", "/a"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.aiChat.description",
  callback: aiChatCallback,
};

function aiChatCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  if (!currentUserIsAdmin()) {
    return generateProtocolError("permissionDenied");
  }
  const { i18n } = getGame();

  const msg = parameters.trim();

  const content = `<span class="hexproto-output">${msg}</span>`;

  const alias = i18n.localize("HEXPROTO.chatAlias.hiveAI");

  return {
    content,
    speaker: {
      alias,
    },
    flags: {
      hexprotocol: {
        replaceChatPortrait: "ai",
      },
    },
  };
}
