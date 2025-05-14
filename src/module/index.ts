import { configMsgCommand } from "./commands/drone-config";
import { registerCommand } from "./commands/register";
import { formatMsgCommand } from "./commands/format";
import { listCommand } from "./commands/list";
import { statusCommand } from "./commands/status";
import { unregisterCommand } from "./commands/unregister";
import type { ChatCommandData } from "./config";
import { getGame } from "./utils";
import { registerModuleSettings } from "./settings";

interface ChatCommanderObject {
  register: (data: ChatCommandData) => void;
}

const chatCommands = [
  formatMsgCommand,
  registerCommand,
  unregisterCommand,
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
