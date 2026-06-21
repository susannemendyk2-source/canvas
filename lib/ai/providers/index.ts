import { mockProvider } from "./mockProvider";
import { comfyProvider } from "./comfyProvider";
import { falProvider } from "./falProvider";
import { replicateProvider } from "./replicateProvider";
import { openaiProvider } from "./openaiProvider";
import { klingProvider } from "./klingProvider";
import { veoProvider } from "./veoProvider";
import { minimaxProvider } from "./minimaxProvider";

export const providers = [
  mockProvider,
  openaiProvider,
  falProvider,
  replicateProvider,
  comfyProvider,
  klingProvider,
  veoProvider,
  minimaxProvider
];

export const activeProvider = mockProvider;
