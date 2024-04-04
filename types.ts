
import type { Serve } from "bun";
import type { Env } from "hono";
import type { HonoOptions } from "hono/hono-base";

/// <reference types="hono/jsx" />
/// <reference types="hono/jsx/dom" />


declare global {
  namespace Kori {
    interface KoriEnv extends Env {}
  }
}


type BunFSRouterOptions = Partial<{
  assetPrefix: string;
  dir: string;
  fileExtensions: string[];
  style: "nextjs";
}>;

type UserConfig = {
  base: string;
  routeDir?: string;
  server?: HonoOptions<Kori.KoriEnv>,
  router?: BunFSRouterOptions;
  bun?: {
    serve: Partial<Serve>;
  }
};

type Route = {
  originalPath: string;
  path: string;
  filePath: string;
  params: string[];
}

export type {
  BunFSRouterOptions, Route, UserConfig
};

