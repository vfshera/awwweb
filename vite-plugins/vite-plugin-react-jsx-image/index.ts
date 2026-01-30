import fs from "node:fs";
import path from "node:path";
import {
  type BuiltinsWithOptionalParams as SVGOBuiltinPluginsWithOptionalParams,
  type Config as SVGOConfig,
  optimize,
} from "svgo";
import type { PluginOption } from "vite";
import {
  type OutputFormat,
  type ProcessedImageMetadata,
  imagetools,
} from "vite-imagetools";

export interface ImageOptimizationOptions {
  jsxDirectives?: {
    quality?: `${number}`;
    format?: "webp" | "avif" | "png";
    w?: string;
    h?: string;
    [key: string]: string | undefined;
  };
  svgo?: Pick<SVGOConfig, "floatPrecision" | "multipass" | "plugins"> & {
    defaultPresetOverrides?: SVGOBuiltinPluginsWithOptionalParams["preset-default"]["overrides"];
    prefixIds?: SVGOBuiltinPluginsWithOptionalParams["prefixIds"] | false;
  };
  enabled?: boolean | "only-production";
}

export function parseId(originalId: string) {
  const [pathId, query] = originalId.split("?");

  const queryStr = query || "";

  return {
    originalId,
    pathId,
    query: queryStr ? `?${query}` : "",
    params: new URLSearchParams(queryStr),
  };
}

export function jsxImagePlugin(
  userOptions?: ImageOptimizationOptions,
): PluginOption[] {
  const supportedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif",
    ".tiff",
  ];

  return [
    imagetools({
      exclude: [],
      extendOutputFormats(builtins) {
        const jsx: OutputFormat = () => (metadatas) => {
          const srcSet = metadatas
            .map((meta) => `${meta.src} ${meta.width}w`)
            .join(", ");

          let largestImage: ProcessedImageMetadata | null = null;

          let largestImageSize = 0;

          for (let i = 0; i < metadatas.length; i++) {
            const m = metadatas[i];

            if (m.width > largestImageSize) {
              largestImage = m;
              largestImageSize = m.width;
            }
          }

          return {
            srcSet,
            width:
              largestImage === null || largestImage === void 0
                ? void 0
                : largestImage.width,
            height:
              largestImage === null || largestImage === void 0
                ? void 0
                : largestImage.height,
          };
        };

        return {
          ...builtins,
          jsx,
        };
      },
      defaultDirectives: (url) => {
        if (url.searchParams.has("jsx")) {
          const { jsx, ...params } = Object.fromEntries(
            url.searchParams.entries(),
          );

          return new URLSearchParams({
            format: "webp",
            quality: "75",
            w: "200;400;600;800;1200",
            withoutEnlargement: "",
            ...userOptions?.jsxDirectives,
            ...params,
            as: "jsx",
          });
        }

        return new URLSearchParams();
      },
    }),
    {
      name: "vite-plugin-react-jsx-image",

      enforce: "pre",
      async load(id) {
        const { params, pathId } = parseId(id);

        const extension = path.extname(pathId).toLowerCase();

        if (extension === ".svg" && params.has("jsx")) {
          const code = await fs.promises.readFile(pathId, "utf-8");

          return {
            code,
            moduleSideEffects: false,
          };
        }
      },
      transform(code, id) {
        id = id.toLowerCase();
        const { params, pathId } = parseId(id);

        if (params.has("jsx")) {
          const extension = path.extname(pathId).toLowerCase();

          if (supportedExtensions.includes(extension)) {
            if (!code.includes("srcSet")) {
              this.error(`Image '${id}' could not be optimized to JSX`);
            }

            const index = code.indexOf("export default");

            return {
              code:
                code.slice(0, index) +
                `
import { createElement } from 'react';
export default function Image(props) {
 return createElement('img', {
    srcSet,
    width,
    height,
    decoding: 'async',
    loading: 'lazy',
    ...props
  });
}`,
              map: null,
            };
          } else if (extension === ".svg") {
            const { svgAttributes } = optimizeSvg(
              { code, path: pathId },
              userOptions,
            );

            return {
              code: `
import { createElement } from 'react';
export default function SvgImage(props) {
  return createElement('svg', {
    ...${JSON.stringify(svgAttributes)},
    ...props
  });
}`,
              map: null,
            };
          }
        }

        return null;
      },
    },
  ];
}

export function optimizeSvg(
  { code, path }: { code: string; path: string },
  userOptions?: ImageOptimizationOptions,
) {
  const svgAttributes: Record<string, unknown> = {};

  const prefixIdsConfiguration = userOptions?.svgo?.prefixIds;

  const maybePrefixIdsPlugin: SVGOConfig["plugins"] =
    prefixIdsConfiguration !== false
      ? [{ name: "prefixIds", params: prefixIdsConfiguration }]
      : [];

  const userPlugins =
    userOptions?.svgo?.plugins?.filter((plugin) => {
      if (
        plugin === "preset-default" ||
        (typeof plugin === "object" && plugin.name === "preset-default")
      ) {
        console.warn(
          `You are trying to use the preset-default SVGO plugin. This plugin is already included by default, you can customize it through the defaultPresetOverrides option.`,
        );

        return false;
      }

      if (
        plugin === "prefixIds" ||
        (typeof plugin === "object" && plugin.name === "prefixIds")
      ) {
        console.warn(
          `You are trying to use the preset-default SVGO plugin. This plugin is already included by default, you can customize it through the prefixIds option.`,
        );

        return false;
      }

      return true;
    }) || [];

  const data = optimize(code, {
    floatPrecision: userOptions?.svgo?.floatPrecision,
    multipass: userOptions?.svgo?.multipass,
    path: path,
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            ...userOptions?.svgo?.defaultPresetOverrides,
          },
        },
      },
      {
        name: "customPluginName",
        fn: () => {
          return {
            element: {
              exit: (node) => {
                if (node.name === "svg") {
                  node.name = "g";
                  Object.assign(svgAttributes, node.attributes);
                  node.attributes = {};
                }
              },
            },
          };
        },
      },
      ...maybePrefixIdsPlugin,
      ...userPlugins,
    ],
  }).data;

  svgAttributes.dangerouslySetInnerHTML = {
    __html: data.slice(data.indexOf(">") + 1, data.lastIndexOf("</svg>")),
  };

  return {
    data,
    svgAttributes,
  };
}
