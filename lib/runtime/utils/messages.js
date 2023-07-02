export const couldNotFindRoutes =
    name => `Could not find routes for the router '${name}'. Please use the 'routes' prop or create a route tree named '${name}'.
Eg. routesDir: {
    default: 'src/routes',
    ${name}: 'src/widget',
}`

export const noRoutesMapProvided = name =>
    `No routesMap provided. Make sure you\'ve either created a router for the '${name}' route or provided a routesMap`
