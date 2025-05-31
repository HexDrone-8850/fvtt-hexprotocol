declare module "fvtt-types/configuration" {
  interface FlagConfig {
    ChatMessage: {
      hexprotocol: {
        replaceChatPortrait?: "drone" | "ai";
      };
    };
  }
}

// type PortraitPath = keyof typeof CHAT_PORTRAIT_PATHS;

interface ChatPortraitCustomData {
  customIconPortraitImage?: string;
  customImageReplacerData?: { name: string; icon: string }[];
}

const CHAT_PORTRAIT_PATHS = {
  drone: "modules/hexprotocol/img/drone_avatar.png",
  ai: "modules/hexprotocol/img/hive_mainframe.Avatar.webp",
};

export function replaceChatPortrait(
  chatPortraitCustomData: ChatPortraitCustomData,
  chatMessage: ChatMessage,
) {
  const replaceChatPortrait = chatMessage.getFlag(
    "hexprotocol",
    "replaceChatPortrait",
  );
  if (replaceChatPortrait) {
    chatPortraitCustomData.customIconPortraitImage =
      CHAT_PORTRAIT_PATHS[replaceChatPortrait];
  }

  return chatPortraitCustomData;
}
