# Svelte Template Hot

This is a copy of official [Svelte template](https://github.com/sveltejs/template) with added HMR support. It lives at https://github.com/rixo/svelte-template-hot.

Progress of Svelte HMR support can be tracked in [this issue](https://github.com/sveltejs/svelte/issues/3632).

This template aims to remain as close to the official template as possible. Please refer to official docs for general usage. For HMR specific stuff, see bellow.

**:warning: Experimental :warning:**

This HMR implementation relies on Svelte's private & non documented API. This means that it could stop working with any new version of Svelte.

## Installation

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit rixo/svelte-template-hot svelte-app
cd svelte-app
npm install
```

Run the build script a first time, in order to avoid 404 errors about missing `bundle.css` in the browser:

```bash
npm run build
```

## Quick start

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and... Eyeball!

## Usage

HMR is supported both with [Nollup](https://github.com/PepsRyuu/nollup) or with Rollup itself with (very experimental) [rollup-plugin-hot](https://github.com/rixo/rollup-plugin-hot).

Nollup implements the shortest possible path from a file change to the module reload in the browser and is all in-memory. Said otherwise, it is insanely fast. Also, it has been around for some time so it is quite battle tested already.

The Rollup plugin on the other hand is still little more than a proof of concept by now, but it has better sourcemap support and error reporting.

Support for both Nollup and Rollup HMR is provided by (also pretty experimental) [rollup-plugin-svelte-hot](https://github.com/rixo/rollup-plugin-svelte-hot). Please report issues regarding HMR in [this plugin's tracker](https://github.com/rixo/rollup-plugin-svelte-hot/issues). Or [the current project](https://github.com/rixo/svelte-template-hot/issues) might make more sense. You be the judge.

### Start HMR server with Nollup

```bash
npm run dev:nollup
```

### Start Rollup with HMR support

```bash
npm run dev:rollup
```

### Start with LiveReload (no HMR)

This is the default `dev` of official template.

```bash
npm run dev:livereload
```

### Start with default method

Rollup HMR is also aliased as `dev` so you can simply run:

```bash
npm run dev
```

You can change the default `dev` script to your preferred method in the `scripts` section of `package.json`.
