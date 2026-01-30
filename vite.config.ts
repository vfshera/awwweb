import { jsxImagePlugin } from "./vite-plugins/vite-plugin-react-jsx-image";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    jsxImagePlugin(),
    tailwindcss(),
    reactRouterHonoServer({ serverEntryPoint: "./server/index.ts" }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
