import type { Server } from "bun";
import { Hono, type Context, type TypedResponse } from "hono";
import { g_ctx } from "../shared";
import type { UserConfig } from "../types";
import { createBunFSRouter, transformRoutes } from "./router";

const HttpVerbs = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];

function createHonoServer(options: UserConfig) {
  console.log(options);
  const app = new Hono(options.server).basePath(options.base);

  return app;
}

async function bootstrapServer(config: UserConfig = g_ctx.config) {
  let bunServer: Server;
  const honoServer = createHonoServer(config);
  const router = createBunFSRouter(config.router || {});
  const routes = transformRoutes(router.routes);
  
  route: for (const route of routes) {
    const { filePath, path } = route;
    console.log(path);
    const module: {
      default?: (c: Context) => Response & TypedResponse;
      middlewares?: ((c: Context) => Promise<void | Response & TypedResponse> | Response & TypedResponse)[];
      GET?: (c: Context) => Response & TypedResponse;
      POST?: (c: Context) => Response & TypedResponse;
      PUT?: (c: Context) => Response & TypedResponse;
      DELETE?: (c: Context) => Response & TypedResponse;
      PATCH?: (c: Context) => Response & TypedResponse;
      OPTIONS?: (c: Context) => Response & TypedResponse;
      HEAD?: (c: Context) => Response & TypedResponse;
    } = await import(filePath);

    const availableMethods = (Object.keys(module) as (keyof Omit<typeof module, "default">)[]).filter((method) => HttpVerbs.includes(method)).map(method => method.toLocaleLowerCase()) as ("get" | "post" | "put" | "delete" | "patch" | "options")[];
    for (const method of availableMethods) {
      const handler = module[method.toUpperCase() as keyof typeof module] || module.default;
      if (!handler) {
        console.warn(`No handler found for method ${method} in file ${filePath}`);
        continue route;
      }

      honoServer[method](path, ...([...(module.middlewares || []).filter(Boolean), handler]) as any);
    }
  }

  return {
    start() {
      bunServer = Bun.serve({
        ...(config.bun?.serve || {}) as Server,
        fetch: honoServer.fetch,
      });
    },
    stop() {
      if (!bunServer) {
        throw new Error("No server instance was found on method stop(). Did you forget start the server?");
      }
      bunServer.stop(true);
    },
    getRoutes() {
      return routes;
    },
    honoServer,
    get bunServer() {
      return bunServer;
    }
  };
}


export {
  bootstrapServer
};
