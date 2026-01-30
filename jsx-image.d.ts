declare module "*.svg?jsx" {
  import type { FC, SVGProps } from "react";

  const Svg: FC<SVGProps<SVGSVGElement>>;

  export default Svg;
}

declare module "*?jsx" {
  import type { FC } from "react";
  const Component: FC<
    Omit<
      React.ImgHTMLAttributes<HTMLImageElement>,
      "src" | "width" | "height" | "srcSet"
    >
  >;

  export default Component;

  export const width: number;

  export const height: number;

  export const srcSet: string;
}

declare module "*&jsx" {
  import type { FC } from "react";
  const Component: FC<
    Omit<
      React.ImgHTMLAttributes<HTMLImageElement>,
      "src" | "width" | "height" | "srcSet"
    >
  >;

  export default Component;

  export const width: number;

  export const height: number;

  export const srcSet: string;
}
