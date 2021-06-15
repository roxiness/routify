import { RoutifyBuildtime } from '../lib/buildtime/RoutifyBuildtime.js'

const instance = new RoutifyBuildtime({
    routesDir: {
        default: 'src/routes',
        widget1: 'src/widget1/routes',
        widget2: 'src/widget2/routes',
    },

    watch: true,
})
instance.start()
