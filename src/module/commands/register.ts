import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import {
  currentUserIsAdmin,
  generateProtocolError,
  getGame,
  randomString,
} from "../utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

export const registerCommand: ChatCommandData = {
  name: "/hc!register",
  aliases: ["/hc!dronify"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.register.description",
  icon: '<img src="icons/svg/sun.svg" />',
  callback: registerCallback,
};

async function registerCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): Promise<ChatMessage.CreateData> {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  const regex = /^(?<uname>.*)(\s(?<id>\d{4}))$/;

  const { id } = parameters.match(regex)?.groups ?? {};

  const username = id ? parameters.slice(0, -4).trim() : parameters.trim();

  const subject = game.users.getName(username);

  if (!subject) {
    return generateProtocolError("subjectNotFound", isAdmin);
  }

  // Check if user is already a drone (ERROR)
  if (subject.getFlag("hexprotocol", "droneId")) {
    return generateProtocolError("isADrone", isAdmin);
  }

  // Generate a random drone ID if none was given
  const droneId = id ? id : randomString(4, "0123456789");

  // Add flag to drone
  await subject.setFlag("hexprotocol", "droneId", droneId);

  // If the drone is a GM, give it the admin flag
  if (subject.isGM) {
    await subject.setFlag("hexprotocol", "isAdmin", true);
  }

  // Generate output
  const msg = game.i18n.format("HEXPROTO.cmd.register.template", {
    droneId,
    username,
  });

  return generateChatOutput({
    msg,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}
