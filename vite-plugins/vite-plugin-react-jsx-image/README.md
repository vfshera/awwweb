# React Image Optimization

> This is extracted from Qwik Default [Image Optimization](https://qwik.dev/docs/integrations/image-optimization/)

Image optimization is the process of reducing the number of bytes that represent an image. The smaller the image size, the faster it will load on a page. The smaller the image size, the less bandwidth it consumes. The less bandwidth it consumes, the better the experience for your users especially on mobile networks.

## Responsive Images

This is a built-in feature that relies on the [`vite-imagetools`](https://www.npmjs.com/package/vite-imagetools) module, so no additional packages or components need to be installed.

#### How it works

- Import any image from the `src` folder
- The image is converted in several webp images, one for each breakpoint (200px, 400px, 600px, 800px, 1200px)
- The image is processed and optimized to reduce its size
- An `<img>` element is rendered, using the `srcset` attribute to set the image source for several resolutions
- Now the browser will load the most suitable image for the resolution in use

#### Key Points

The community love this API for a number of reasons:

- Zero runtime, zero JS
- Zero props by default, simple API
- Zero 404, strongly typed API
- Zero layout reflows (Automatic width/height)
- Hashed images, immutable cached
- Automatic `.webp` / `.avif` format optimization
- Automated `srcSet` generation
- Extendable (use any `<img>` attribute)
- Loading lazy and async decoding by default
- Lightweight, a single `<img>` node in the HTML

#### Usage

Add the `?jsx` suffix **at the end** of the import

```tsx
import Image from "[IMAGE_PATH]?w=24&h=24&jsx";
```

> ⚠️ Make sure to put the `jsx` query parameter at the end of the import path, otherwise typescript might complain.

Use the image in the template as a component:

```tsx
<Image />
```

#### Result

This script will generate the following `<img>` element with the following optimizations:

- Quality = 75
- Format = .webp

```tsx
<img

  decoding="async"
  loading="lazy"
  srcset="
    /@imagetools/141464b77ebd76570693f2e1a6b0364f4b4feea7 200w,
    /@imagetools/e70ec011d10add2ba28f9c6973b7dc0f11894307 400w,
    /@imagetools/1f0dd65f511ffd34415a391bf350e7934ce496a1 600w,
    /@imagetools/493154354e7e89c3f639c751e934d1be4fc05827 800w,
    /@imagetools/324867f8f1af03474a17a9d19035e28a4c241aa1 1200w"
  width="1200"
  height="1200"
>
```

> - `decoding="async"`: indicates that the image will not block the rendering of the page while the image is being decoded. For further reference, please check the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding).
> - `loading="lazy"`: allows the browser to delay the loading of an image until it is visible in the viewport, which helps improve [page loading performance](https://web.dev/browser-level-image-lazy-loading/)
> - `srcset`: this attribute allows to choose the most appropriate image based on the device's screen size and resolution
> - `width` and `height`: setting `width` and `height` attributes prevents layout reflow, which hurts the [CLS](https://web.dev/cls/) score

> **Note:** You can also change the default behavior by manually setting the value of these properties:
>
> - `<Image decoding="sync" loading="eager" />`

Thanks to `srcset` attribute the browser will load the most suitable image for the device's resolution:

#### Example

```tsx
import Image from "~/media/your_image.png?jsx";

export default Hero(){
  return (
    <div>
      <Image />
    </div>
  );
}
```

#### Customize image format

Images are automatically converted to `.webp` format, but you can also specify the format manually:
Available formats:

<div class="docs-long-list">
- `heic`
- `heif`
- `avif`
- `jpeg`
- `jpg`
- `jpe`
- `tile`
- `dz`
- `png`
- `raw`
- `tiff`
- `tif`
- `webp`
- `gif`
- `jp2`
- `jpx`
- `j2k`
- `j2c`
- `jxl`
</div>

Supported file formats to be converted are:

<div class="docs-long-list">
- `jpg`
- `jpeg`
- `png`
- `webp`
- `gif`
- `tiff`
- `avif`
</div>

In the below example, a `jpg` image is converted to a `png` format:

```tsx
import Image from "~/media/your_image.jpg?format=png&jsx";

export default Header(){
  return (
    <div>
      <Image />
    </div>
  );
}
```

#### Customize image quality

As noted above, the default quality is set to 75, but you can also specify the quality manually.

Quality parameter is an integer between 1 and 100.

```tsx
import Image from "~/media/your_image.png?quality=100&jsx";

export default Footer(){
  return (
    <div>
      <Image />
    </div>
  );
}
```

#### Customize image `width` and `height`

You may need to set a custom `width` to the image:

```tsx
<Image style={{ width: "300px" }} />
```

but in that case you need to manually specify the `height` as well to avoid it being stretched:

```tsx
<Image style={{ width: "300px", height: "200px" }} />
```

Below you can see a simple trick to avoid having to manually set the `height`, while also maintaining the aspect ratio:

> **TIP:** you should always specify `width` and `height` values to prevent layout reflow

```tsx
import Image from "~/media/emote.png?jsx";
import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <h1>Image Example</h1>
      <div className="image-wrapper">
        <Image />
      </div>
    </>
  );
});
```

```css
.image-wrapper {
  width: 300px; /* Set the desired width of the wrapper */
  position: relative; /* Required for absolute positioning */
}

.image-wrapper img {
  width: 100%; /* Make the image fill the width of its container */
  height: auto; /* Let the browser calculate the height to maintain aspect ratio */
  display: block; /* Remove any extra white space below the image */
}
```

#### Image Optimization for SVGs

<abbr title="Scalable Vector Graphics">SVGs</abbr> can be added directly to your JSX code, but you can also use the image optimization approach to optimize them:

```tsx
import SvgImage from "~/media/your_image.svg?jsx";

export default Card(){
  return (
    <>
      <h1>Image Example</h1>
      <div className="image-wrapper">
        <SvgImage />
      </div>
    </>
  );
}
```
