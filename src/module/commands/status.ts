import { MODULE_ID, type ChatCommandData } from "../interface-config";
import {
  currentUserIsAdmin,
  generateProtocolError,
  getDroneById,
  getDroneConfig,
  getGame,
} from "../utils";

export const statusCommand: ChatCommandData = {
  name: "/hc!status",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.status.description",
  icon: '<img src="icons/svg/pill.svg" />',
  callback: statusCallback,
};

async function statusCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();
  const currentUserDroneId = game.user.getFlag("hexprotocol", "droneId");
  const droneId = parameters.trim();

  if (currentUserDroneId !== droneId && !isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  const drone = getDroneById(droneId);

  if (!drone) {
    return generateProtocolError("droneNotFound", isAdmin);
  }

  const username = drone.name;

  const droneIsAdmin = getDroneConfig(droneId, "isAdmin");
  const optimizeSpeech = getDroneConfig(droneId, "optimizeSpeech");
  const forcePrependId = getDroneConfig(droneId, "forcePrependId");

  const templatePath = "modules/hexprotocol/templates/drone-status.hbs";

  const content = await renderTemplate(templatePath, {
    droneId,
    username,
    isAdmin: droneIsAdmin,
    optimizeSpeech,
    forcePrependId,
  });

  return {
    content,
    speaker: {
      alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    whisper: [game.user.id],
  };
}
