import { MODULE_ID, type ChatCommandData } from "../config";
import { localizeErrorId } from "../protocol";
import { currentUserIsAdmin, getGame } from "../utils";

export const listCommand: ChatCommandData = {
  name: "/hc!list",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.list.description",
  icon: '<img src="icons/svg/pill.svg" />',
  callback: listDronesCallback,
};

function listDronesCallback(
  _chat: ChatLog,
  _parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();
  const isGM = game.user.isGM;

  if (!(isGM || isAdmin)) {
    ui.notifications?.error(localizeErrorId("permissionDenied"));
    return {};
  }

  const drones = game.users.filter(
    (user) => typeof user.getFlag("hexprotocol", "droneId") === "string",
  );

  const droneList = drones.map((drone) => {
    const droneId = drone.getFlag("hexprotocol", "droneId");
    const droneUser = drone.name;

    return `<code>${droneId} :: ${droneUser}</code>`;
  });

  const msg = game.i18n.localize("HEXPROTO.list.header");

  const content = [`<h2>${msg}</h2>`, ...droneList].join("\n");

  return {
    content,
    speaker: {
      alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    whisper: [game.user.id],
  };
}
