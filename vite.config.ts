import { defineConfig } from "vite";

function inferBasePath() {
  const explicitBase = process.env.VITE_GITHUB_PAGES_BASE;
  if (explicitBase) {
    return explicitBase.startsWith("/") ? explicitBase : `/${explicitBase}`;
  }

  const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (process.env.GITHUB_ACTIONS === "true" && repository) {
    return `/${repository}/`;
  }

  return "/";
}

export default defineConfig({
  base: inferBasePath(),
});
