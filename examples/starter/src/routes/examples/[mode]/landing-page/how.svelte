<!-- routify:meta inline -->
<!-- routify:meta order=4 -->
<h3>How Does It Work?</h3>

<p>
    Implementing Inline Pages in Routify is straightforward and can be done in two ways:
</p>

<h4>1. Add the Meta Field to the Page</h4>

<p>
    In the Svelte component of the page you want to inline, add the following meta field:
    <code>&lt;!-- routify:meta inline --&gt;</code>
</p>

<h4>2. Add 'inline' to the Slot of the Parent Module</h4>

<p>
    Alternatively, you can add the 'inline' attribute to the slot element in the parent
    module:
</p>

<code>&lt;slot inline /&gt;</code>

<p>
    Either method tell Routify to treat the page as an Inline Page, loading its content
    alongside the other Inline Pages and preserving its state when navigating away. This
    makes for a seamless and efficient user experience!
</p>
