<h3>Monthly</h3>
<svg width="100%" viewBox="0 0 550 400">
    <!-- Axes -->
    <line x1="50" y1="350" x2="550" y2="350" stroke-width="2" />
    <line x1="50" y1="350" x2="50" y2="50" stroke-width="2" />
    <!-- Bars -->
    <rect x="100" y="300" width="80" height="50" />
    <rect x="200" y="250" width="80" height="100" />
    <rect x="300" y="150" width="80" height="200" />
    <rect x="400" y="200" width="80" height="150" />
    <rect x="500" y="280" width="80" height="70" />
</svg>

<style>
    h3 {
        position: absolute;
        inset: auto 0 auto 50%;
        transform: translateX(-25%);
    }
    svg {
        height: 100%;
        fill: var(--surface-3);
        stroke: var(--surface-1);
    }
</style>
