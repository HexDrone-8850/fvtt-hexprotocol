import type { EmptyObject, MaybePromise } from "fvtt-types/utils";
import { protocolCodes, type HexProtocolCode } from "./protocol/protocol";
import { errorIds } from "./protocol/error-handling";
import { getGame } from "./utils";

declare module "fvtt-types/configuration" {
  interface FlagConfig {
    User: {
      hexprotocol: HexProtocolConfig;
    };
  }
}

export type ProtocolConfigKey = keyof HexProtocolConfig;
export type ProtocolConfigValue = string | boolean;

export interface ChatCommandData {
  name: string;
  module: typeof MODULE_ID;
  aliases?: string[];
  // <= 80 chars
  description?: string;
  // e.g. `<i class="fas fa-dice-d20"></i>`
  icon?: string;
  requiredRole?: keyof typeof CONST.USER_ROLES;
  // callback
  callback?: (
    chat: ChatLog,
    parameters: string,
    messageData: ChatMessage.CreateData,
  ) => MaybePromise<ChatCommandCallbackResult>;
  // Check this if it's actually used
  // autocompleteCallback?: (
  //   menu: unknown,
  //   alias: string,
  //   parameters: string,
  // ) => string[];
  closeOnComplete?: boolean;
}

// TODO: Figure out a more DRY way to do this
// As of now, protocolConfigKeys and HexProtocolConfig have to be in sync
export const PROTOCOL_CONFIG_KEYS = [
  "droneId",
  "isAdmin",
  "optimizeSpeech",
  "forcePrependId",
] as const;

interface HexProtocolConfig {
  // 4 digits
  droneId?: string;
  isAdmin?: boolean;
  optimizeSpeech?: boolean;
  forcePrependId?: boolean;
}

type ChatCommandCallbackResult =
  | ChatMessage.CreateData
  | EmptyObject
  | undefined;

export const MODULE_ID = "hexprotocol" as const;

export function localizeModuleStrings() {
  const i18n = getGame().i18n;

  // Localize error messages
  Object.entries(errorIds).forEach(([id, data]) => {
    data.desc = i18n.localize(`HEXPROTO.error.${id}.description`);
  });

  // Localize protocol categories
  Object.entries(protocolCodes).forEach(([key, val]) => {
    protocolCodes[key as HexProtocolCode] = i18n.localize(
      `HEXPROTO.protocol.categories.${val}`,
    );
  });
}
