/**
 * mounts app to target element 
 *
 * @export
 * @param {object} Component Svelte component
 * @param {object} [options={ target: document.body }] Options for the Svelte component
 * @param {string} [id='hmr'] ID for the component container
 * @param {string} [eventName='app-loaded'] Name of the event that triggers replacement of previous component
 * @returns
 */
export default function HMR(Component, options = { target: document.body }, id = 'hmr', eventName = 'app-loaded') {
    const prerenderedHtmlElement = document.getElementById(id)

    // Create a hidden target element to contain our app
    const target = document.createElement("div")
    target.style.visibility = 'hidden'
    options.target.appendChild(target)

    if (!prerenderedHtmlElement)
        showApp()
    else
        // Wait for the app to load before replacing the prerendered HTML
        addEventListener(eventName, showApp)

    function showApp() {
        removeEventListener(eventName, showApp)
        if (prerenderedHtmlElement) prerenderedHtmlElement.remove()
        // Show our component and take over the ID of the old container
        target.style.visibility = null
        target.setAttribute('id', id)
    }

    return new Component({ ...options, target });
}