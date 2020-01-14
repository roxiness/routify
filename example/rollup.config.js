/* eslint-env node */

import svelte from 'rollup-plugin-svelte-hot'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import hmr, { autoCreate } from 'rollup-plugin-hot'
import routify from '@sveltech/routify/plugins/rollup'

// Routify needs SPA support from server
const spa = true

// NOTE The NOLLUP env variable is picked by various HMR plugins to switch
// in compat mode. You should not change its name (and set the env variable
// yourself if you launch nollup with custom comands).
const nollup = !!process.env.NOLLUP
const watch = nollup || !!process.env.ROLLUP_WATCH
const useLiveReload = !!process.env.LIVERELOAD

const dev = watch || useLiveReload
const production = !dev

const hot = watch && !useLiveReload

const src = process.env.NODE_ENV === 'test' ? 'src.test' : 'src'

export default {
  input: `${src}/main.js`,
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    ...nollup ? {
      dir: 'public/build',
      entryFileNames: 'build/bundle.js',
    } : {
      file: nollup ? 'build/bundle.js' : 'public/build/bundle.js',
    }
  },
  plugins: [
    routify({
      dynamicImport: true,
      pages: `${src}/pages`,
      outputDir: `${src}/.tmp`
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      ...(!hot && {
        css: css => {
          css.write('public/build/bundle.css')
        },
      }),
      hot: hot && {
        // optimistic will try to recover from runtime
        // errors during component init
        optimistic: true,
        // turn on to disable preservation of local component
        // state -- i.e. non exported `let` variables
        noPreserveState: false,
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      // rollup-plugin-svelte-hot automatically resolves & dedup svelte
    }),
    commonjs(),

    // In dev mode, call `npm run start:dev` once
    // the bundle has been generated
    dev && !nollup && serve({ spa }),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    useLiveReload && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // Automatically create missing imported files. This helps keeping
    // the HMR server alive, because Rollup watch tends to crash and
    // hang indefinitely after you've tried to import a missing file.
    hot &&
      autoCreate({
        include: 'src/**/*',
        // Set false to prevent recreating a file that has just been
        // deleted (Rollup watch will crash when you do that though).
        recreate: true,
      }),

    hot &&
      hmr({
        public: 'public',
        inMemory: true,
      }),
  ],
  watch: {
    clearScreen: false,
  },
}

function serve() {
  let started = false
  return {
    name: 'svelte/template:serve',
    writeBundle() {
      if (!started) {
        started = true
        const flags = ['run', 'start', '--', '--dev']
        if (spa) {
          flags.push('--single')
        }
        require('child_process').spawn('npm', flags, {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        })
      }
    },
  }
}
