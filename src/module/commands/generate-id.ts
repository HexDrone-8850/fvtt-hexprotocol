import {
  generateChatOutput,
  MODULE_ID,
  type ChatCommandData,
} from "../interface-config";
import { getGame, randomString } from "../utils";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890" as const;
const numbers = "1234567890" as const;

export const generateIdCommand: ChatCommandData = {
  name: "/hc!generate",
  aliases: ["/hc!gen"],
  module: MODULE_ID,
  description: "",
  callback: generateIdCallback,
};

function generateIdCallback(
  _chat: ChatLog,
  _parameters: string,
  _messageData: ChatMessage.CreateData,
): ChatMessage.CreateData {
  const game = getGame();

  const id1 = randomString(3, chars);
  const id2 = randomString(2, chars);
  const commId = randomString(4, numbers);

  const msg = `${id1}-${id2}-${commId}`;

  return generateChatOutput({
    msg,
    chatAlias: "hiveAI",
    whisper: [game.user.id],
  });
}
