import type { AIProvider, ProviderInput } from "@/types";

function unavailable(name: string): AIProvider {
  const run = async (input: ProviderInput) => ({
    title: `${name} 未配置 / not configured`,
    content: `请先设置 ${name} 环境变量，再运行 "${input.prompt || "this request"}"。Set the ${name} environment key before running this request.`,
    assetType: "text" as const
  });

  return {
    id: name.toLowerCase(),
    name,
    configured: false,
    generateImage: run,
    editImage: run,
    generateVideo: run,
    generateAudio: run,
    enhancePrompt: run,
    estimateCost: async () => 0
  };
}

export const createPlaceholderProvider = unavailable;
