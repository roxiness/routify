<!-- routify:meta inline -->

<h1>Guide</h1>

<article>
    <h3>Persistent state</h3>
    <p>
        Persistent state can be enabled by using <strong>inline pages</strong>. These
        pages coexist with their inlined siblings and are only destroyed when the user
        navigates navigates to a page outside the inline group.
    </p>
    <details>
        <summary>Inlining a page with HTML comments</summary>
        <code><pre>&lt;!-- routify:meta inline --&gt;</pre></code>
    </details>
</article>

<article>
    <h3>Swipe navigation</h3>
    <h5>To enable swipe navigation:</h5>
    <ol>
        <li>
            <details>
                <summary
                    ><strong>Inline</strong> the pages that should be swipable</summary>
                <code><pre>&lt;!-- routify:meta inline --&gt;</pre></code>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    Detect scroll events with <strong>RouteOnScroll</strong>
                </summary>
                <code>
                    <pre>&lt;div class=&quot;app&quot;&gt;
    &lt;main class=&quot;scroll-snap&quot; data-routify-scroll-lock use:$routeOnScroll&gt;
        &lt;slot /&gt;
    &lt;/main&gt;
    &lt;Navigation /&gt;
&lt;/div&gt;</pre>
                </code>
                <h5>Explanations</h5>
                <p>
                    <code>data-routify-scroll-lock</code> prevents propagation of scroll instructions
                    past this element.
                </p>
                <p>
                    <code>use:$routeOnScroll</code> updates the route when the scroll position
                    changes.
                </p>
            </details>
        </li>
        <li>
            <details>
                <summary>Make pages snapable with CSS</summary>

                <code>
                    <pre>.scroll-snap &#123;
    display: flex;
    height: 100%;
    width: 100%;
    overflow: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    &::-webkit-scrollbar &#123;
        display: none;
    &#125;
&#125;
.scroll-snap > * &#123;
    scroll-snap-align: start;
    flex: 0 0 100%;
&#125;</pre>
                </code>
                <h5>Explanations</h5>
                <p>
                    <code>scroll-snap-type: x mandatory;</code> enables horizontal swiping.
                </p>
                <p>
                    <code>scroll-snap-align: start;</code> makes sure the page snaps to the
                    left side of the screen.
                </p>
                <p>
                    <code>scroll-behavior: smooth;</code> enables smooth scrolling.
                </p>
                <p>
                    <code>scrollbar-width: none;</code> hides the scrollbar.
                </p>
                <p>
                    <code
                        >&#123;::-webkit-scrollbar &#123; display: none; &#125; &#125;</code>
                    hides the scrollbar on webkit browsers.
                </p>
            </details>
        </li>
    </ol>
</article>

<style>
    pre {
        white-space: pre-wrap;
    }
</style>
