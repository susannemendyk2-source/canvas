import type { AIProvider, ProviderInput, ProviderResult } from "@/types";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function result(input: ProviderInput, kind: ProviderResult["assetType"]): Promise<ProviderResult> {
  await wait(650);
  return {
    title: kind === "video" ? "电影感发布片段 / Cinematic launch cut" : "生成概念画面 / Generated concept frame",
    content: input.prompt || "Premium creator concept with cinematic lighting.",
    assetType: kind,
    preview:
      kind === "video"
        ? "12 秒竖屏视频预览，平滑推进镜头和产品揭示。12s vertical video preview, smooth camera push and product reveal."
        : "AI 生成视觉方向，软玻璃质感、杂志式构图和克制光晕。AI generated visual direction with soft glass, editorial composition and controlled glow."
  };
}

export const mockProvider: AIProvider = {
  id: "mock",
  name: "Polaris Mock Engine",
  configured: true,
  generateImage: (input) => result(input, "generated"),
  editImage: (input) => result(input, "image"),
  generateVideo: (input) => result(input, "video"),
  generateAudio: (input) => result(input, "audio"),
  enhancePrompt: async (input) => {
    await wait(350);
    return {
      title: "增强提示词 / Enhanced prompt",
      content: `${input.prompt}. 加入电影感构图、克制霓虹点缀、高级材质纹理、清晰主体层级和可生产的负向提示词。Add cinematic framing, restrained neon accents, premium material texture, clear subject hierarchy and production-ready negative prompts.`,
      assetType: "prompt"
    };
  },
  estimateCost: async () => 18
};
