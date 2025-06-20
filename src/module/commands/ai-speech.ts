import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

export const aiChatCommand: ChatCommandData = {
  name: "/hc!ai",
  aliases: ["/ai", "/a"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.aiChat.description",
  callback: aiChatCallback,
};

export const aiNarrateCommand: ChatCommandData = {
  name: "/hc!narrate",
  aliases: ["/n"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.narrate.description",
  callback: aiNarrateCallback,
};

function aiChatCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  if (!currentUserIsAdmin()) {
    return generateProtocolError("permissionDenied");
  }

  return generateChatOutput({ msg: parameters.trim(), chatAlias: "hiveAI" });
}

function aiNarrateCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  if (!currentUserIsAdmin()) {
    return generateProtocolError("permissionDenied");
  }
  const narration = getGame().i18n.format("HEXPROTO.cmd.narrate.template", {
    msg: parameters.trim(),
  });

  return generateChatOutput({
    msg: narration,
    chatAlias: "hiveAI",
  });
}
