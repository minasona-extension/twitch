let attempts = 0;
new MutationObserver((mutationsList, observer) => {
  attempts++;

  if (attempts % 10 === 0) {// 10 attempts or give up
    observer.disconnect();
    console.log("Minasona: FFZ addon observer disconnected after 10 attempts");
    return;
  }

  if (typeof FrankerFaceZ === 'undefined') return;
  if (!FrankerFaceZ.instance?.addons) return;

  FrankerFaceZ.instance.addons.on(':ready', addons_ready);
  observer.disconnect();
}).observe(document.body, { childList: true, subtree: true });

function addons_ready(event) {
  window.postMessage({ FFZ_IS_READY: true });

  FrankerFaceZ.instance.settings.on(":changed:tooltip.badge-images", (value) => {
    window.postMessage({ FFZ_BADGE_IMAGES_SETTING: value });
  });
  const hasBadgeImagesEnabled = FrankerFaceZ.instance.settings.get("tooltip.badge-images");
  window.postMessage({ FFZ_BADGE_IMAGES_SETTING: hasBadgeImagesEnabled });
}