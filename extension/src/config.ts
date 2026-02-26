// the main channel this extension belongs to
// this community always has priority when displaying the icons in chat
export const MAIN_CHANNEL = "cerbervt";

// interval in minutes to fetch from the API
export const UPDATE_INTERVAL = 15;

export function getIconSrc(dataId: string): string {
  switch (dataId) {
    case "main-channel":
      return "assets/Cerby_64x64.png";
    case "current-channel":
      return "assets/wormpal.png";
    case "other-channels":
      return "assets/unknown_minasona.png";
    case "default-minasona":
      return "assets/Minawan_Purple.webp";
  }
}
