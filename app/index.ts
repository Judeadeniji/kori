import { g_ctx } from "../shared";
import { bootstrapServer } from "../src/server";

const server = bootstrapServer(g_ctx.config)

server.then((server) => {
  server.start();
})