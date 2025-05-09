import { dronifyCommand } from "./commands/dronify";
import { formatMsgCommand } from "./commands/format";
import { statusCommand } from "./commands/status";
import { unassignCommand } from "./commands/unassign";
import type { ChatCommandData } from "./config";
import { getGame } from "./utils";

interface ChatCommanderObject {
  register: (data: ChatCommandData) => void;
}

const chatCommands = [
  formatMsgCommand,
  dronifyCommand,
  unassignCommand,
  statusCommand,
];

Hooks.on("chatCommandsReady", (commands: ChatCommanderObject) => {
  const game = getGame();
  chatCommands.forEach((cmd) => {
    if (cmd.description) {
      cmd.description = game.i18n.localize(cmd.description);
    }
    commands.register(cmd);
  });
});
