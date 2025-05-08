import { formatErrors, customOutputCodes, protocolCodes } from "./protocol";

export function getGame(): ReadyGame {
  if (game instanceof Game && game.ready) {
    return game;
  }

  throw new Error("game is not initialized yet!");
}

export function localizeErrorMessage(error: FormatCommandError) {
  const game = getGame();
  const userCategory = game.user.getFlag("hexprotocol", "isAdmin")
    ? "admin"
    : "user";

  const prefix = game.i18n.localize("HEXPROTO.error.prefix");
  const code = game.i18n.localize(`HEXPROTO.error.${error}.code`);
  const errorDesc = game.i18n.localize(`HEXPROTO.error.${error}.description`);
  const templateString = `HEXPROTO.error.template.${userCategory}`;

  return game.i18n.format(templateString, {
    prefix,
    errorDesc,
    code,
  });
}
export function isCustomProtocolCode(
  code: unknown,
): code is CustomProtocolCode {
  return customOutputCodes.includes(code as CustomProtocolCode);
}
export function isProtocolCode(
  code: string | number | undefined,
): code is HexProtocolCode {
  return code != undefined && code in protocolCodes;
}
export function isFormatErrorID(id: string): id is FormatCommandError {
  return id in formatErrors;
}
