import { MODULE_ID, type ChatCommandData } from "../config";
import {
  currentUserIsAdmin,
  getDroneById,
  getGame,
  validateDroneId,
} from "../utils";
import { localizeErrorId } from "../protocol";

export const unregisterCommand: ChatCommandData = {
  name: "/hc!unregister",
  aliases: ["/hc!undronify"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.unregister.description",
  icon: '<img src="icons/svg/light-off.svg" />',
  callback: unregisterCallback,
};

async function unregisterCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();

  if (!currentUserIsAdmin()) {
    ui.notifications?.error(localizeErrorId("permissionDenied"));
    return {};
  }

  if (!validateDroneId(parameters)) {
    ui.notifications?.error(localizeErrorId("invalidDroneId"));
    return {};
  }

  const drone = game.users.getName(parameters) ?? getDroneById(parameters);

  if (!drone) {
    ui.notifications?.error(localizeErrorId("droneNotFound"));
    return {};
  }

  const username = drone.name;
  const droneId = drone.getFlag("hexprotocol", "droneId");

  if (!droneId) {
    ui.notifications?.error(localizeErrorId("notADrone"));
    return {};
  }

  await drone.unsetFlag("hexprotocol", "droneId");

  // Generate output
  const msg = game.i18n.format("HEXPROTO.unregister", {
    username,
    droneId,
  });

  return {
    content: `<code>${msg}</code>`,
    speaker: {
      alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    whisper: [game.user.id],
  };
}
