// Workspace config — picked at build time from VITE_WORKSPACE env var.
// Shared schema, shared mutations, shared Convex deployment (for now).
// Each Railway service sets VITE_WORKSPACE to "opened" | "rlm" | etc.
// When we add a new workspace, drop a JSON in workspaces/ and import it here.
import openedConfig from "../workspaces/opened.json";
import rlmConfig from "../workspaces/rlm.json";

export type DocType =
  | "social_post"
  | "short_form_video"
  | "blog_draft"
  | "podcast"
  | "newsletter"
  | "note";

export type PlatformKey =
  | "x"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "substack"
  | "webflow"
  | "beehiiv"
  | "youtube";

export interface WorkspaceConfig {
  name: string;
  displayName: string;
  tagline: string;
  defaultAuthor: string;
  docTypes: DocType[];
  platforms: PlatformKey[];
  scheduler: "manual" | "feedhive";
}

const configs: Record<string, WorkspaceConfig> = {
  opened: openedConfig as WorkspaceConfig,
  rlm: rlmConfig as WorkspaceConfig,
};

const envKey = (import.meta.env.VITE_WORKSPACE as string | undefined) || "opened";
const key = configs[envKey] ? envKey : "opened";

export const WORKSPACE: WorkspaceConfig = configs[key];
