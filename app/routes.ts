import { autoRoutes } from "react-router-auto-routes";

export default autoRoutes({
  ignoredRouteFiles: [
    "**/.*" /** Ignore hidden files (starting with dot) */,
    "**/*.server.ts" /** Ignore server files (ending with .server.ts) */,
    "**/*.client.ts" /** Ignore client files (ending with .client.ts) */,
  ],
});
