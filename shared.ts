import type { UserConfig } from "./types";

const g_ctx = {
  config: {
    base: "/",
    router: {
      dir: process.cwd() + "/routes"
    },
    bun: {
      serve: {
        port: 3000
      }
    },
  } as UserConfig
}

function defineConfig(config: UserConfig) {
  return validateConfig(config);
}

function validateConfig(config: UserConfig): UserConfig {
  for (const key in config) {
    // check if required keys are defined
    if (key === "base" && !config.base) {
      throw new Error("Base path is required");
    }
  }

  return config;
}

export {
  defineConfig, g_ctx
};
