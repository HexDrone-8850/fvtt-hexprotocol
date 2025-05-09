import { dronifyCommand } from "./commands/dronify";
import { formatMsgCommand } from "./commands/format";
import { unassignCommand } from "./commands/unassign";
import { getGame } from "./utils";

interface ChatCommanderObject {
  register: (data: ChatCommandData) => void;
}

const chatCommands = [formatMsgCommand, dronifyCommand, unassignCommand];

Hooks.on("chatCommandsReady", (commands: ChatCommanderObject) => {
  chatCommands.forEach((cmd) => {
    if (cmd.description) {
      cmd.description = getGame().i18n.localize(cmd.description);
    }
    commands.register(cmd);
  });
});
