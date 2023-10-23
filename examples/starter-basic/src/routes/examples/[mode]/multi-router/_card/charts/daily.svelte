<h3>Daily</h3>
<svg width="100%" viewBox="0 0 550 400">
    <text x="300" y="30" text-anchor="middle">Daily</text>
    <!-- Axes -->
    <line x1="50" y1="350" x2="550" y2="350" stroke-width="2" />
    <line x1="50" y1="350" x2="50" y2="50" stroke-width="2" />
    <!-- Bars -->
    <rect x="80" y="300" width="40" height="50" />
    <rect x="150" y="250" width="40" height="100" />
    <rect x="220" y="200" width="40" height="150" />
    <rect x="290" y="150" width="40" height="200" />
    <rect x="360" y="280" width="40" height="70" />
    <rect x="430" y="230" width="40" height="120" />
    <rect x="500" y="180" width="40" height="170" />
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
