import { MODULE_ID, type ChatCommandData } from "../config";
import { currentUserIsAdmin, getGame, randomString } from "../utils";
import { localizeErrorId } from "../protocol";

export const dronifyCommand: ChatCommandData = {
  name: "/hc!assign",
  aliases: ["/hc!dronify"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.dronify.description",
  icon: '<img src="icons/svg/sun.svg" />',
  callback: dronifyCallback,
};

async function dronifyCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();

  if (!currentUserIsAdmin()) {
    ui.notifications?.error(localizeErrorId("permissionDenied"));
    return {};
  }

  const regex = /^(?<uname>.*)(\s(?<id>\d{4}))$/;

  const { id } = parameters.match(regex)?.groups ?? {};

  const username = id ? parameters.slice(0, -4).trim() : parameters.trim();

  const subject = game.users.getName(username);

  if (!subject) {
    ui.notifications?.error(localizeErrorId("subjectNotFound"));
    return {};
  }

  // Check if user is already a drone (ERROR)
  if (subject.getFlag("hexprotocol", "droneId")) {
    ui.notifications?.error(localizeErrorId("isADrone"));
    return {};
  }

  // Generate a random drone ID if none was given
  const droneId = id ? id : randomString(4, "0123456789");

  // Add flag to drone
  await subject.setFlag("hexprotocol", "droneId", droneId);

  // If the drone is a GM, give it the admin flag
  if (game.user.isGM) {
    await subject.setFlag("hexprotocol", "isAdmin", true);
  }

  // Generate output
  const output = game.i18n.format("HEXPROTO.dronify.assign", {
    droneId,
    username,
  });
  return {
    content: `<code>${output}</code>`,
    speaker: {
      alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    whisper: [game.user.id],
  };
}
