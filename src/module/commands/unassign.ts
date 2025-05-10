import { MODULE_ID, type ChatCommandData } from "../config";
import { getDroneById, getGame, validateDroneId } from "../utils";
import { localizeErrorId } from "../protocol";

export const unassignCommand: ChatCommandData = {
  name: "/unassign",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.unassign.description",
  icon: '<img src="icons/svg/light-off.svg" />',
  callback: unassignCallback,
};

async function unassignCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();

  if (!game.user.getFlag("hexprotocol", "isAdmin")) {
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
  const msg = game.i18n.format("HEXPROTO.dronify.unassign", {
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
