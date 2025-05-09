import type { ProtocolConfigKey } from "./config";

export function getGame(): ReadyGame {
  if (game instanceof Game && game.ready) {
    return game;
  }

  throw new Error("game is not initialized yet!");
}

export function randomString(length: number, chars: string) {
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)] ?? "";
  return result;
}

export function getDroneById(droneId: string): User | undefined {
  return getGame().users.find(
    (user) => user.getFlag("hexprotocol", "droneId") === droneId,
  );
}

export function getDroneData(droneId: string, key: ProtocolConfigKey) {
  const drone = getDroneById(droneId);
  return drone?.getFlag("hexprotocol", key);
}

export function validateDroneId(droneId: string) {
  return /^\d{4}$/.test(droneId);
}
