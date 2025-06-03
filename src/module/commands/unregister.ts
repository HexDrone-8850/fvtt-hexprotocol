import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import {
  currentUserIsAdmin,
  generateProtocolError,
  getDroneById,
  getGame,
  validateDroneId,
} from "../utils";

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
): Promise<ChatMessage.CreateData> {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  if (!validateDroneId(parameters)) {
    return generateProtocolError("invalidDroneId", isAdmin);
  }

  const drone = game.users.getName(parameters) ?? getDroneById(parameters);

  if (!drone) {
    return generateProtocolError("droneNotFound", isAdmin);
  }

  const username = drone.name;
  const droneId = drone.getFlag("hexprotocol", "droneId");

  if (!droneId) {
    return generateProtocolError("notADrone", isAdmin);
  }

  await drone.unsetFlag("hexprotocol", "droneId");

  // Generate output
  const msg = game.i18n.format("HEXPROTO.cmd.unregister.template", {
    username,
    droneId,
  });

  return generateChatOutput({
    msg,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}
