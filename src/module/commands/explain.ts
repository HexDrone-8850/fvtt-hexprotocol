import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import { getErrorByCode } from "../protocol/error-handling";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

export const explainCommand: ChatCommandData = {
  name: "/hc!explain",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.status.description",
  callback: explainCallback,
};

function explainCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  const code = parameters.trim();

  const error = getErrorByCode(code);

  if (!error) {
    return generateProtocolError("unknownErrorCode", isAdmin);
  }

  return generateChatOutput({
    msg: error,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}
