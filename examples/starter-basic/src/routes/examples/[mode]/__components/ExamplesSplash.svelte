<script>
    import img from '../__assets/Ilustration_V2_3d_design_modern_pink_1.jpg'
</script>

<div class="splash" style="--splash-img: url({img})">
    <div class="image" />
    <div class="intro">
        <h1>Welcome to Your New Routify 3 Project!</h1>
        <p>
            This is the default index page for your project. From here, you can start
            building your Svelte/Routify application.
        </p>
        <a href="/examples/list" class="button">Check out the new examples</a>
        <p class="note">
            This page is located at src/routes/index.svelte and can be edited freely.
        </p>
        <ul class="links">
            <li><a href="https://routify.dev">Documentation</a></li>
            <li><a href="https://github.com/roxiness/routify">GitHub</a></li>
            <li><a href="https://discord.com/invite/KTXqQnV">Discord</a></li>
        </ul>
    </div>
</div>

<style>
    .splash * {
        all: revert;
        list-style: none;
    }
    .splash {
        text-align: center;
        text-wrap: balance;
        display: grid;
        grid-template-columns: 1fr;
        max-width: 1920px;
        margin: 0 auto;
        align-items: center;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        font-size: min(14px + 0.6vw);
        color: #444;
    }
    .splash .links {
        display: flex;
        gap: clamp(1ch, 1vw, 38px);
        text-shadow: 2px 2px 20px white, -2px -2px 20px white, 2px -2px 20px white,
            -2px 2px 20px white, 2px 2px 20px white, -2px -2px 20px white,
            2px -2px 20px white, -2px 2px 20px white;

        flex-direction: column;
        margin: 0;
        padding: 0;
    }
    .splash .links a {
        color: #777;
        text-decoration: none;
    }

    .image {
        min-height: min(50vh, 100vw);
        background: var(--splash-img) 50% / contain no-repeat;
    }
    .intro {
        display: grid;
        gap: clamp(20px, 2vw, 38px);
        justify-items: center;
    }
    .splash h1 {
        font-size: min(20px + 2vw);
    }
    .note {
        color: #aaa;
        position: absolute;
        bottom: 2vw;
        font-size: smaller;
        font-style: italic;
    }

    .splash .intro > * {
        margin: 0;
    }

    .button {
        background-color: #d62bd9; /* This is a purple color */
        color: #ffffff; /* This is white color */
        border: none;
        padding: clamp(12px, 1vw, 19px) clamp(24px, 2vw, 38px); /* This adds some space around the text */
        text-align: center; /* This centers the text */
        text-decoration: none;
        font-size: 1.25em; /* This sets the font size */
        transition: background-color 0.3s ease; /* This adds a smooth transition effect */
        cursor: pointer; /* This changes the cursor to a hand when you hover over the button */
        border-radius: 5px; /* This rounds the corners of the button */
        display: inline-block;
    }

    .button:hover {
        background-color: #4b1ca5; /* This is a darker purple color */
    }

    @media screen and (min-width: 1200px) {
        .splash {
            grid-template-columns: 1fr 1fr;
            text-align: left;
        }
        .splash .links {
            position: absolute;
            inset: 1ch max(2vw, 1ch) auto auto;
            flex-direction: row;
        }
        .splash .image {
            min-height: min(100vh, 100vw);
        }
        .splash .intro {
            padding: 0 min(2vw, 38px);
            justify-items: start;
        }
    }
</style>
