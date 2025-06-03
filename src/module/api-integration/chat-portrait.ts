declare module "fvtt-types/configuration" {
  interface FlagConfig {
    ChatMessage: {
      hexprotocol: {
        icon?: ChatIconID;
      };
    };
  }
}
interface ChatPortraitCustomData {
  customIconPortraitImage?: string;
  customImageReplacerData?: { name: string; icon: string }[];
}

export type ChatIconID = "drone" | "ai";

const CHAT_PORTRAIT_PATHS = {
  drone: "modules/hexprotocol/img/drone_avatar.png",
  ai: "modules/hexprotocol/img/hive_mainframe.Avatar.webp",
};

export function replaceChatPortrait(
  chatPortraitCustomData: ChatPortraitCustomData,
  chatMessage: ChatMessage,
) {
  const icon = chatMessage.getFlag("hexprotocol", "icon");
  if (icon) {
    chatPortraitCustomData.customIconPortraitImage = CHAT_PORTRAIT_PATHS[icon];
  }

  return chatPortraitCustomData;
}
