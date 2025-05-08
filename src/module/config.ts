import type { EmptyObject } from "fvtt-types/utils";
import { customOutputCodes, formatErrors, protocolCodes } from "./protocol";
import { getGame, isFormatErrorID, isProtocolCode } from "./utils";

declare global {
  interface FlagConfig {
    User: {
      hexprotocol: {
        // 4 digits
        droneID: string;
        isAdmin: boolean;
        optimizeSpeech: boolean;
        forcePrependId: boolean;
      };
    };
  }

  interface ChatCommandData {
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
    ) => ChatMessage.CreateData | EmptyObject | undefined;
    // Check this if it's actually used
    // autocompleteCallback?: (
    //   menu: unknown,
    //   alias: string,
    //   parameters: string,
    // ) => string[];
    closeOnComplete?: boolean;
  }

  type FormatCommandError = keyof typeof formatErrors;
  type HexProtocolCode = keyof typeof protocolCodes;
  type CustomProtocolCode = (typeof customOutputCodes)[number];
}

export const MODULE_ID = "hexprotocol";

// Localize module strings
Hooks.on("ready", () => {
  const i18n = getGame().i18n;

  // Localize error messages
  const prefix = i18n.localize("HEXPROTO.error.prefix");
  Object.keys(formatErrors).forEach((key) => {
    if (isFormatErrorID(key)) {
      formatErrors[key] = i18n.format(`HEXPROTO.error.format.${key}`, {
        prefix,
      });
    }
  });

  // Localize protocol categories
  Object.entries(protocolCodes).forEach(([key, val]) => {
    if (isProtocolCode(key)) {
      protocolCodes[key] = i18n.localize(`HEXPROTO.messageCategories.${val}`);
    }
  });
});
