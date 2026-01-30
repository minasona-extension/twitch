import type { PalsonaEntry } from "./types";

class MinasonaFrankerFaceZAddonHelper extends Object {
  /**
   * Checks if FrankerFaceZ is ready
   */
  get isFrankerFaceZReady(): boolean {
    return this._isFrankerFaceZReady;
  }

  private _isFrankerFaceZReady: boolean = false;
  private _onShowMinasonaPopoverCallbacks: ((target: HTMLElement, imageUrl: string, fallbackImageUrl: string) => void)[] = [];
  private _onReadyCallbacks: ((self: MinasonaFrankerFaceZAddonHelper) => void)[] = [];

  constructor(...args: any[]) {
    super(...args);
    this.frankerFaceZListener();
  }

  /**
   * Loads badges from storage
   */
  loadBadgesFromStorage() {
    if (!this.isFrankerFaceZReady) return;
    const ffzCommunities: string[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
    for (const community of ffzCommunities)
      this.postCommunityBadge(community);
  }

  /**
   * Posts a refresh message to FFZ
   */
  postRefresh() {
    if (!this.isFrankerFaceZReady) return;
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_REFRESH: true });
  }

  /**
   * Sets the addon icon in FFZ
   */
  async postAddonMetadata(metadata: any) {
    window.postMessage({
      FFZ_MINASONATWITCHEXTENSION_SETMETADATA: {
        ...metadata,
        author: 'HellPingwan',
        maintainer: 'rosrwan',
        website: 'https://github.com/minasona-extension/twitch',
      }
    });// pushes the ffz addon icon
  }

  /**
   * Listens for messages from FrankerFaceZ.
   */
  frankerFaceZListener() {
    window.addEventListener('message', async (event) => {
      if (event.source !== window) return;
      if (typeof event.data?.FFZ_MINASONATWITCHEXTENSION_READY !== "boolean") return;
      this._isFrankerFaceZReady = event.data?.FFZ_MINASONATWITCHEXTENSION_READY;
      if (!this.isFrankerFaceZReady) return;
      this.onReady(this.loadBadgesFromStorage.bind(this));
      this.onReady();
    });
  }

  /**
   * Registers a community badge in FFZ
   * @param community Name of the community
   * @param iconUrl URL of the community icon
   * @param genericBadges List of generic badge URLs
   */
  postCommunityBadge(community: string, iconUrl?: string, genericBadges?: string[]) {
    if (!this.isFrankerFaceZReady) return;
    window.postMessage({ FFZ_MINASONATWITCHEXTENSION_ADDCOMMUNITY: { community: community, icon: iconUrl, generics: genericBadges } });
  }

  /**
   * Post badge blueprint to FFZ
   */
  postBadgeBlueprint(node: HTMLElement, ps: PalsonaEntry, index: number, username: string, iconSize: number, isGeneric: boolean) {
    if (!this.isFrankerFaceZReady) return;
    const community = /(\w+)\/((\w+)(-backfill)?)\/((\w+)\/)?(\w+)_(\d+)x(\d+)\.(\w+)/i.exec(ps.iconUrl ?? ps.imageUrl)?.[3] ?? "minawan";// backfill counts

    let ffzCommunities: string[] = JSON.parse(localStorage.getItem("FFZ:minasona-twitch-icons.communities")) ?? [];
    if (!ffzCommunities.includes(community)) {
      ffzCommunities.push(community);
      localStorage.setItem("FFZ:minasona-twitch-icons.communities", JSON.stringify(ffzCommunities));
    }

    // add click listener for popover
    node.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.dataset?.badge !== `addon.minasona_twitch_extension.badge_${community}`) return;
      e.preventDefault();
      e.stopPropagation();
      this.onShowMinasonaPopover(target, ps.imageUrl, ps.fallbackImageUrl);
    });

    // send badge blueprint to FFZ if available
    window.postMessage({
      FFZ_MINASONATWITCHEXTENSION_BADGE: {
        index: index,
        userId: node.querySelector<HTMLElement>("[data-user-id]")?.dataset?.userId ?? 0,
        iconUrl: ps.iconUrl,
        imageUrl: ps.imageUrl,
        username: username,
        isGeneric: isGeneric,
        iconSize: iconSize,
        community: community
      }
    });
  }

  /**
   * Called when FFZ addon is ready.
   */
  onReady(): void;

  /**
   * Registers a callback for when FFZ addon is ready.
   */  
  onReady(callback: (self: MinasonaFrankerFaceZAddonHelper) => void): void;

  onReady(...args): void {
    if (args.length === 1 && typeof args[0] === "function") {
      this._onReadyCallbacks.push(args[0]);
    }
    else if (args.length === 0) {
      if (!this.isFrankerFaceZReady) return;
      for (const cb of this._onReadyCallbacks) 
        cb?.(this);
    }
  }

  /**
   * Registers a callback for when the Minasona popover is shown in FFZ.
   */
  onShowMinasonaPopover(callback: (target: HTMLElement, imageUrl: string, fallbackImageUrl: string) => void): void;

  /**
   * Shows the Minasona popover in FFZ.
   */
  onShowMinasonaPopover(target: HTMLElement, imageUrl: string, fallbackImageUrl: string): void;

  onShowMinasonaPopover(...args): void {
    if (args.length === 1 && typeof args[0] === "function") {
      this._onShowMinasonaPopoverCallbacks.push(args[0]);
    }
    else if (args.length === 3 && args[0] instanceof HTMLElement && typeof args[1] === "string" && typeof args[2] === "string") {
      const [target, imageUrl, fallbackImageUrl] = args;
      if (!this.isFrankerFaceZReady) return;
      for (const cb of this._onShowMinasonaPopoverCallbacks)
        cb?.(target, imageUrl, fallbackImageUrl);
    }
  }
}

export { MinasonaFrankerFaceZAddonHelper };