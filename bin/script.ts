#!/usr/bin/env bun

import { g_ctx } from "../shared";
import { bootstrapServer } from "../src/server";

async function start() {
  // get process.cwd()/kori.config.(ts|js)

  try {
    const config = await import(`${process.cwd()}/kori.config.ts`);
    g_ctx.config = config.default;
    const server = await bootstrapServer();
    server.start();

    console.log("Server started on port", server.bunServer.port);
  } catch (e) {
    console.error("Error starting server", e);
  }
}

start();