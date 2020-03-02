/**
 * Hot module replacement for Svelte in the Wild
 *
 * @export
 * @param {object} Component Svelte component
 * @param {object} [options={ target: document.body }] Options for the Svelte component
 * @param {string} [id='hmr'] ID for the component container
 * @param {string} [eventName='app-loaded'] Name of the event that triggers replacement of previous component
 * @returns
 */
export default function HMR(Component, options = { target: document.body }, id = 'hmr', eventName = 'app-loaded') {
    const oldContainer = document.getElementById(id)

    // Create the new (temporarily hidden) component container
    const appContainer = document.createElement("div")
    if (oldContainer) appContainer.style.visibility = 'hidden'
    else appContainer.setAttribute('id', id) //ssr doesn't get an event, so we set the id now

    // Attach it to the target element
    options.target.appendChild(appContainer)

    // Wait for the app to load before replacing the component
    addEventListener(eventName, replaceComponent)

    function replaceComponent() {
        if (oldContainer) oldContainer.remove()
        // Show our component and take over the ID of the old container
        appContainer.style.visibility = 'initial'
        // delete (appContainer.style.visibility)
        appContainer.setAttribute('id', id)
    }

    return new Component({
        ...options,
        target: appContainer
    });
}