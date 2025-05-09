import { MODULE_ID, type ChatCommandData } from "../config";
import { getDroneById, getDroneData, getGame } from "../utils";
import { localizeErrorId } from "../protocol";

export const statusCommand: ChatCommandData = {
  name: "/drone_status",
  aliases: ["/dstatus"],
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
  const userIsAdmin = game.user.getFlag("hexprotocol", "isAdmin");
  const currentUserDroneId = game.user.getFlag("hexprotocol", "droneId");
  const droneId = parameters.trim();

  if (currentUserDroneId !== droneId && !userIsAdmin) {
    ui.notifications?.error(localizeErrorId("noStatusPermission"));
    return {};
  }

  const droneUser = getDroneById(droneId);

  if (!droneUser) {
    ui.notifications?.error(localizeErrorId("userNotFound"));
    return {};
  }

  const username = droneUser.name;

  const isAdmin = getDroneData(droneId, "isAdmin");
  const optimizeSpeech = getDroneData(droneId, "optimizeSpeech");
  const forcePrependId = getDroneData(droneId, "forcePrependId");

  const templatePath = "modules/hexprotocol/templates/drone-status.hbs";

  const content = await renderTemplate(templatePath, {
    droneId,
    username,
    isAdmin,
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
