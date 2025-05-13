import { configMsgCommand } from "./commands/drone-config";
import { dronifyCommand } from "./commands/assign";
import { formatMsgCommand } from "./commands/format";
import { listCommand } from "./commands/list";
import { statusCommand } from "./commands/status";
import { unassignCommand } from "./commands/unassign";
import type { ChatCommandData } from "./config";
import { getGame } from "./utils";
import { registerModuleSettings } from "./settings";

interface ChatCommanderObject {
  register: (data: ChatCommandData) => void;
}

const chatCommands = [
  formatMsgCommand,
  dronifyCommand,
  unassignCommand,
  statusCommand,
  configMsgCommand,
  listCommand,
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

Hooks.on("ready", () => {
  registerModuleSettings();
});
