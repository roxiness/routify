<div align="center">
    <img src="routify.png" alt="routify" width="512" /><br>
    <img src="https://badgen.net/npm/v/@sveltech/routify" alt="Badge" />
</div> 

----

<p> 
  <strong>Routify is a work in progress. Since v1.5 we have a stable release. But this is a relatively young project. You can expect it to evolve.</strong>
</p>

----

## Install

* Install the Router only: `npm install --save-dev @sveltech/routify`
* Clone the [starter template](https://github.com/sveltech/routify-starter):
    * `npx @sveltech/routify init`
    * The starter template contains a lot more than just the router, for more info see [here](https://routify.dev/guide/starter-Template).

## Documentation

[routify.dev](https://routify.dev/guide/introduction)

## Template

[Routify starter template](https://github.com/sveltech/routify-starter)
Includes SSR, prerendering, code splitting and much more.

## Example

[Starter example](https://example.routify.dev/example) Example from the starter template. Refresh a page to see how it is loaded.

### CLI (Command-Line Interface)

> 💡 Example: `routify <command> <...options>`

#### `run` - Default command
* `-d`, `--debug` - Extra debugging
* `-p`, `--pages <location>` - path/to/pages
* `-i`, `--ignore <list>` - Blob of files and directories to be ignored
* `-D`, `--dynamic-imports` - Code splitting
* `-b`, `--single-build` - Don't watch for file changes
* `-e`, `--extensions <names>` - Included file extensions (comma-separated)
* `-c`, `--child-process <command>` - Run npm task when Routify is ready
* `-r`, `--routify-dir <dir>` - Output directory for Routify's temporary files
* `--no-hash-scroll` - Disable automatic scroll to hash

#### `init` - Initializing a project
* `-s`, `--start-dev` - Run `npm run dev` after installation
* `-e`, `--no-example` - Deletes the example directory
* `-n`, `no-install` - Prevents automatic NPM installation
* `-b`, `--branch <name>` - Branch to checkout (commit hash or release tag compliant)

#### `export` - Exporting a Routify program
* `--dist-dir <path>` - Distrobution directory
* `-r`, `--routify-dir <path>` - Routify directory
* `-i`, `--convert-to-index` - Outputs pages as index files (e.g. `foo.svelte` -> `foo/index.html`)
* `--basepath <path>` - Comma-separated basepaths (prefixes) to static exports.

## Tutorials

* [Easy client-side SPA routing with Routify](https://www.youtube.com/watch?v=AGLUJlOC6f0) by Jitesh
* [How to add PostSCSS to Routify Starter](https://johanronsse.be/2020/05/01/how-to-add-postcss-to-routify/) by Wolfr
* [Add SCSS to a Routify project](https://johanronsse.be/2020/04/05/how-to-add-scss-to-a-svelte-project-using-routify/) by Wolfr (slightly outdated)

## Support
Please feel free to open an issue or a pull request. All feedback is welcome.

<img height="32px" src="https://discordapp.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg" /> **Join us on Discord** 

Want help? Have ideas about Routify? Chat with us on Discord. 
https://discord.gg/ntKJD5B

## Older versions

For the old version (svelte-filerouter), please go [here](https://github.com/sveltech/routify/tree/v1)
