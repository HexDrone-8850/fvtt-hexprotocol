import { MODULE_ID } from "../config";
import { getDroneById, getGame, localizeErrorMessage } from "../utils";

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
    const errorMsg = localizeErrorMessage("adminOnly");
    ui.notifications?.error(errorMsg);
    return {};
  }

  const user = game.users.getName(parameters) ?? getDroneById(parameters);

  if (!user) {
    const errorMsg = localizeErrorMessage("userNotFound");
    ui.notifications?.error(errorMsg);
    return {};
  }

  const username = user.name;
  const droneId = user.getFlag("hexprotocol", "droneId");

  if (!droneId) {
    const errorMsg = localizeErrorMessage("notADrone");
    ui.notifications?.error(errorMsg);
    return {};
  }

  await user.unsetFlag("hexprotocol", "droneId");

  // Generate output
  const msg = game.i18n.format("HEXPROTO.dronify.unassign", {
    username,
    droneId,
  });
  return {
    content: `<code>${msg}</code>`,
    alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
  };
}
