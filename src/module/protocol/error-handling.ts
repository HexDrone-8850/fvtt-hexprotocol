import { getGame } from "../utils";

export type HexProtocolErrorId = keyof typeof errorIds;

export const errorIds = {
  invalidProtocolCode: {
    code: "00",
    desc: "",
  },
  droneIdMismatch: {
    code: "01",
    desc: "",
  },
  idNotPrepended: {
    code: "02",
    desc: "",
  },
  speechOptimized: {
    code: "03",
    desc: "",
  },
  contentMissing: {
    code: "04",
    desc: "",
  },
  unknownErrorCode: {
    code: "05",
    desc: "",
  },
  droneNotFound: {
    code: "10",
    desc: "",
  },
  subjectNotFound: {
    code: "11",
    desc: "",
  },
  notADrone: {
    code: "12",
    desc: "",
  },
  isADrone: {
    code: "13",
    desc: "",
  },
  invalidDroneId: {
    code: "20",
    desc: "",
  },
  invalidConfigKey: {
    code: "21",
    desc: "",
  },
  invalidConfigValue: {
    code: "22",
    desc: "",
  },
  permissionDenied: {
    code: "30",
    desc: "",
  },
};

export function localizeError(error: HexProtocolErrorId, isAdmin = false) {
  const game = getGame();
  const userType = isAdmin ? "admin" : "user";
  const templateString = `HEXPROTO.error.template.${userType}`;

  const { desc, code } = errorIds[error];

  const prefix = game.i18n.localize("HEXPROTO.error.prefix");

  return game.i18n.format(templateString, {
    prefix,
    code,
    desc,
  });
}

export function isErrorID(
  id: string | number | undefined,
): id is HexProtocolErrorId {
  return id != undefined && id in errorIds;
}

export function getErrorByCode(code: string | number) {
  for (const error of Object.values(errorIds)) {
    if (error.code == code) {
      return getGame().i18n.format("HEXPROTO.explain", {
        code: error.code,
        desc: error.desc,
      });
    }
  }

  return undefined;
}
