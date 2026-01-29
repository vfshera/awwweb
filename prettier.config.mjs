/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["clsx", "cn"],
  importOrderSortSpecifiers: true,
  importOrder: [
    "^.*\\.\\/\\+types\\/.*$", // Route module types
    "^react$", // React imports
    "^react-router$", // React Router imports
    "<THIRD_PARTY_MODULES>", // Other third-party packages
    "^~.*\\.server.*$", // Imports containing `.server` eg `~/.server/util`, `~/auth.server/` , `~/lib/db.server`, `~/utils/markdown/.server/parser`
    "^~.*\\.client.*$", // Imports containing `.client` eg `~/.client/util`, `~/auth.client/` , `~/lib/db.client`, `~/utils/markdown/.client/parser`
    "^~.*$", // Alias imports (starting with ~)
    "^[./]", // Other JavaScript/TypeScript imports
    "^import type", // Types
    "^.+$", // Other imports
  ],
};
