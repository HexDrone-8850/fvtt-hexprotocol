import {
  generateChatOutput,
  MODULE_ID,
  PROTOCOL_CONFIG_KEYS,
  type ChatCommandData,
  type ProtocolConfigKey,
} from "../interface-config";

import {
  currentUserIsAdmin,
  generateProtocolError,
  getDroneById,
  getDroneConfig,
  getGame,
  setDroneConfig,
  validateDroneId,
} from "../utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

export const configMsgCommand: ChatCommandData = {
  name: "/hc!config",
  module: MODULE_ID,
  description: "HEXPROTO.cmd.config.description",
  icon: '<img src="icons/svg/daze.svg" />',
  callback: droneConfigCallback,
};

async function droneConfigCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
): Promise<ChatMessage.CreateData> {
  const game = getGame();
  const isAdmin = currentUserIsAdmin();

  if (!isAdmin) {
    return generateProtocolError("permissionDenied", isAdmin);
  }

  // /^(?<key>droneId|isAdmin)\s+(?<value>true|false|1|0)/

  const protocolKeys = PROTOCOL_CONFIG_KEYS.join("|");
  const regex = new RegExp(
    `^(?<droneId>\\d{4})\\s+(?<key>${protocolKeys})\\s+(?<value>true|false|1|0|\\d{4})`,
  );

  const {
    droneId,
    key,
    value,
  }: { droneId?: string; key?: ProtocolConfigKey; value?: string } =
    parameters.match(regex)?.groups ?? {};

  if (!validateDroneId(droneId)) {
    return generateProtocolError("invalidDroneId", isAdmin);
  }

  const drone = getDroneById(droneId);

  if (!drone || !droneId) {
    return generateProtocolError("droneNotFound", isAdmin);
  }

  if (!key || !validateConfigKey(key)) {
    return generateProtocolError("invalidConfigKey", isAdmin);
  }

  const updateDroneId = key === "droneId";

  if (
    value == undefined ||
    !validateConfigValue(value) ||
    (updateDroneId && !validateDroneId(value))
  ) {
    return generateProtocolError("invalidConfigValue", isAdmin);
  }

  // Find a neater way to do this later?
  const newValue = updateDroneId
    ? value
    : ["1", "true"].includes(value.toLowerCase());

  const oldValue =
    getDroneConfig(droneId, key) ??
    game.i18n.localize("HEXPROTO.cmd.config.undefined");

  await setDroneConfig(droneId, key, newValue);

  // Generate output
  const msg = game.i18n.format("HEXPROTO.cmd.config.template", {
    droneId,
    key,
    oldValue: `${oldValue}`,
    newValue: `${newValue}`,
  });

  return generateChatOutput({
    msg,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}

function validateConfigValue(value: string | undefined) {
  return (
    value === "true" ||
    value === "false" ||
    value === "1" ||
    value === "0" ||
    validateDroneId(value)
  );
}

function validateConfigKey(key: string | undefined) {
  return key && PROTOCOL_CONFIG_KEYS.includes(key as ProtocolConfigKey);
}
