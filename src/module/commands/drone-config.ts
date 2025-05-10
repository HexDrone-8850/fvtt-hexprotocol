import {
  MODULE_ID,
  protocolConfigKeys,
  type ChatCommandData,
  type ProtocolConfigKey,
} from "../config";
import { localizeErrorId } from "../protocol";
import {
  getDroneById,
  getDroneConfig,
  getGame,
  setDroneConfig,
  validateDroneId,
} from "../utils";

export const configMsgCommand: ChatCommandData = {
  name: "/hc_config",
  aliases: ["/cfg"],
  module: MODULE_ID,
  description: "HEXPROTO.cmd.config.description",
  icon: '<img src="icons/svg/daze.svg" />',
  callback: droneConfigCallback,
};

async function droneConfigCallback(
  chat: ChatLog,
  parameters: string,
  _messageData: ChatMessage.CreateData,
) {
  const game = getGame();

  if (!(game.user.isGM || game.user.getFlag("hexprotocol", "isAdmin"))) {
    ui.notifications?.error(localizeErrorId("permissionDenied"));
    return {};
  }

  // /^(?<key>droneId|isAdmin)\s+(?<value>true|false|1|0)/

  const protocolKeys = protocolConfigKeys.join("|");
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
    ui.notifications?.error(localizeErrorId("invalidDroneId"));
    return {};
  }

  const drone = getDroneById(droneId);

  if (!drone || !droneId) {
    ui.notifications?.error(localizeErrorId("droneNotFound"));
    return {};
  }

  if (!key || !validateConfigKey(key)) {
    ui.notifications?.error(localizeErrorId("invalidConfigKey"));
    return {};
  }

  const updateDroneId = key === "droneId";

  if (
    value == undefined ||
    !validateConfigValue(value) ||
    (updateDroneId && !validateDroneId(value))
  ) {
    ui.notifications?.error(localizeErrorId("invalidConfigValue"));
    return {};
  }

  // Find a neater way to do this later?
  const newValue = updateDroneId
    ? value
    : ["1", "true"].includes(value.toLowerCase());

  const oldValue =
    getDroneConfig(droneId, key) ??
    game.i18n.localize("HEXPROTO.config.undefined");

  await setDroneConfig(droneId, key, newValue);

  // Generate output
  const msg = game.i18n.format("HEXPROTO.config.template", {
    droneId,
    key,
    oldValue: `${oldValue}`,
    newValue: `${newValue}`,
  });

  return {
    content: `<code>${msg}</code>`,
    speaker: {
      alias: game.i18n.localize("HEXPROTO.chatAlias.hexAI"),
    },
    whisper: [game.user.id],
  };
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
  return key && protocolConfigKeys.includes(key as ProtocolConfigKey);
}
