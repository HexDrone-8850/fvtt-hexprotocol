import { getGame } from "./utils";

declare module "fvtt-types/configuration" {
  interface SettingConfig {
    "hexprotocol.allowNarration": boolean;
    "hexprotocol.allowOOC": boolean;
    "hexprotocol.bullyMode": boolean;
  }
}

export function registerModuleSettings() {
  const { i18n, settings } = getGame();

  settings.register("hexprotocol", "allowNarration", {
    name: i18n.localize("HEXPROTO.settings.allowNarration.name"),
    hint: i18n.localize("HEXPROTO.settings.allowNarration.hint"),
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });

  settings.register("hexprotocol", "allowOOC", {
    name: i18n.localize("HEXPROTO.settings.allowOOC.name"),
    hint: i18n.localize("HEXPROTO.settings.allowOOC.hint"),
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });

  settings.register("hexprotocol", "bullyMode", {
    name: i18n.localize("HEXPROTO.settings.bullyMode.name"),
    hint: i18n.localize("HEXPROTO.settings.bullyMode.hint"),
    scope: "world",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: true,
  });
}
