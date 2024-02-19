# Routify-vite-plugin

This plugin integrates Routify with Vite, providing enhanced support for Server Side Rendering (SSR), Static Site Generation (SSG), and Client Side Rendering (CSR) within your Routify projects. It comes with a set of options to customize the behavior of these rendering modes, as well as Vite-specific enhancements to streamline your development workflow.

## Features
- **SSR Support:** Prerender your pages on the server for faster initial loads and SEO benefits.
- **SSG Support:** Generate static sites at build time, perfect for hosting on static file servers.
- **CSR Support:** Dynamically render pages in the client's browser, ideal for Single Page Applications (SPAs).
- **Development Enhancements:** Force logging in production and automatically run Routify with configurable options.

## Installation
```
npm install your-vite-plugin-routify --save-dev
```


## Usage
```javascript
import routifyPlugin from 'your-vite-plugin-routify';

export default {
  plugins: [
    routifyPlugin({
      /* Routify options */
      
      /* Plugin-specific options
      run: true,
      forceLogging: false,
      render: {
        ssr: {...},
        ssg: {...},
        csr: {...}
      }*/
    })
  ],
}
```

## Options
This plugin accepts all **Routify 3** options as well as the following specific options:

### `run` (Boolean)
- Enables Routify.
- Default: true

### `forceLogging` (Boolean)
- Forces logging in production for debugging purposes.
- Default: false

### `render` (Object)
- Configure rendering modes with specific options:

#### `ssr` (Object | Boolean)
- Enables Server Side Rendering with optional configuration.
- enable (Boolean): Enable SSR in development.
- `type` ("cjs" | "esm"): Module type for SSR builds.

#### `ssg` (Object | Boolean)
- Enables Static Site Generation with optional configuration.
- `enable` (Boolean): Enable SSG.
- `spank` (Any): Options for the spank prerendering tool.

#### csr (Object | Boolean)
- Enables Client Side Rendering (SPA mode) with optional configuration.
- `enable` (Boolean): Enable CSR.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your improvements.
