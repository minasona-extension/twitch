(function () {
  const styleNode = document.createElement("style");
  styleNode.setAttribute("type", "text/css");
  styleNode.id = "ffz-minasona-styles-badges";

  let badgeCSSRules = [];

  // Starts listening for FFZ setting changes.
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (typeof event.data !== 'object' || event.data === null) return;

    document.head.contains(styleNode) || document.head.appendChild(styleNode);

    if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_READY === 'boolean')
      switchCSSRule(event.data.FFZ_MINASONATWITCHEXTENSION_READY, `.minasona-icon-container`, `display: none !important;`);

    if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_ICONSIZE === 'string') 
      switchCSSRule(true, '.ffz-badge[data-badge*="addon.minasona_twitch_extension.badge"]', `
          min-width: ${event.data.FFZ_MINASONATWITCHEXTENSION_ICONSIZE}px; 
          height: ${event.data.FFZ_MINASONATWITCHEXTENSION_ICONSIZE}px; 
          background-size: ${event.data.FFZ_MINASONATWITCHEXTENSION_ICONSIZE}px !important;
      `);
  });

  /**
   * Enables or disables a CSS rule by adding or removing it from the style node.
   * @param enable whether to enable or disable the rule
   * @param rule the CSS rule to add or remove
   */
  function switchCSSRule(enable: boolean, match: string, css: string) {
    badgeCSSRules = badgeCSSRules.filter(r => !r.includes(match));
    if (enable)
      badgeCSSRules.push(match + ' { ' + css + ' }');
    styleNode.textContent = badgeCSSRules.join('\n');
  }
})();