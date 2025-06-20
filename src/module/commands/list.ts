import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import { currentUserIsAdmin, generateProtocolError, getGame } from "../utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

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
): ChatMessage.CreateData {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  const drones = game.users.filter(
    (user) => typeof user.getFlag("hexprotocol", "droneId") === "string",
  );

  const droneList = drones.map((drone) => {
    const droneId = drone.getFlag("hexprotocol", "droneId");
    const droneUser = drone.name;

    return `<span class="hexproto-output">${droneId} :: ${droneUser}</span>`;
  });

  const header = game.i18n.localize("HEXPROTO.cmd.list.header");

  const msg = [`<h2>${header}</h2>`, ...droneList].join("\n");

  return generateChatOutput({
    msg,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}
