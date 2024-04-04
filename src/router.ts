import type { BunFSRouterOptions, Route } from "../types";

function createBunFSRouter(options: BunFSRouterOptions) {
  const bunRouter = new Bun.FileSystemRouter(Object.assign({
    style: "nextjs",
    dir: options.dir || `${process.cwd()}/src/routes`,
    assetPrefix: "_kori/static/",
  }, options));

  return bunRouter;
}

function extractParams(path: string) {
  // path = "/:id/:slug" => ["id", "slug"]
  const params = path.match(/:([^/]+)/g);
  return params ? params.map((param) => param.slice(1)) : [];
}

function cleanPath(path: string) {
  // path = "/(don't_include)/[id]/[slug]" => "/:id/:slug"
  // path = "/(skip)/[id]/[...slug]" => "/:id/*slug"
  let newPath = path.replace(/\([^)]+\)/g, ""); // remove (...)
  newPath = newPath.replace(/\[\.\.\./g, "*"); // replace [... with *
  newPath = newPath.replace(/\[/g, ":"); // replace [ with :
  newPath = newPath.replace(/\]/g, "");// remove ]
  // remove first / if it exists
  if (newPath[0] === "/") {
    newPath = newPath.slice(1);
  }

  return newPath;
}


function transformRoutes(routes: Record<string, string>) {
  const transformedRoutes: Route[] = [];

  for (const [originalPath, filePath] of Object.entries(routes)) {
    const path = cleanPath(originalPath);
    const params = extractParams(path);
    transformedRoutes.push({
      originalPath,
      path,
      filePath,
      params,
    })

  }

  return transformedRoutes;
}

export {
  createBunFSRouter,
  transformRoutes
};
