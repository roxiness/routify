<!-- routify:meta inline -->
<script>
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const isWin = navigator.platform.toUpperCase().indexOf('WIN') >= 0
    const ctrlKey = isMac ? '⌘' : isWin ? 'Ctrl' : 'Ctrl'
</script>

<h1>Explore</h1>

<article>
    <h3>Persistent state</h3>
    <label
        >Name
        <input type="text" placeholder="Don't forget me" />
    </label>
    <p>
        Whatever you enter here will persist as long you navigate between this and page
        its inlined siblings.
    </p>
    <p>
        Navigating away from this inline group will clear the state. To try this, visit
        the
        <a href="/">
            <strong> splash screen. </strong>
        </a>
    </p>
</article>

<article>
    <h3>Swipe navigation</h3>
    <p>Pages can be navigated by swiping from side to side.</p>
    <h5>To try in a compatible browser:</h5>

    <ol>
        <li>
            Open the <strong>dev tools</strong> <kbd>{ctrlKey}</kbd>+<kbd>Shift</kbd>+<kbd
                >i</kbd>
        </li>
        <li>
            Click the <strong>toggle device toolbar</strong> <kbd>{ctrlKey}</kbd>+<kbd
                >Shift</kbd
            >+<kbd>m</kbd>
        </li>
    </ol>
</article>
