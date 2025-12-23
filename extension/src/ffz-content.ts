const styleNode = document.createElement("style");
styleNode.setAttribute("type", "text/css");
styleNode.id = "ffz-minasona-styles-badges";
document.head.appendChild(styleNode);

const BADGE_CSS = `.minasona-icon-container .ffz-badge { display: none !important; }`;

startFFZListener();

/**
 * Starts listening for FFZ setting changes.
 */
function startFFZListener() {
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (typeof event.data !== 'object' || event.data === null) return;

    if (event.data?.FFZ_BADGE_IMAGES_SETTING ?? true)
      styleNode.textContent = '';
    else
      styleNode.textContent = BADGE_CSS;
  });
}