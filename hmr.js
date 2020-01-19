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

    // Wait for the app to load before replacing the component
    addEventListener(eventName, replaceComponent)

    // Create the new (temporarily hidden) component container
    const appContainer = document.createElement("div")
    appContainer.style.visibility = 'hidden'

    // Attach it to the target element
    options.target.appendChild(appContainer)

    function replaceComponent() {
        const oldContainer = document.getElementById(id)
        if (oldContainer) oldContainer.remove()

        // Show our component and take over the ID of the old container
        appContainer.style.visibility = 'initial'
        appContainer.id = id
    }

    return new Component({
        target: appContainer
    });
}