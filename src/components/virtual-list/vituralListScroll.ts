/**
 * 固定item高度 - 虚拟列表滚动
 */

export interface VitualListScrollPropsModal {
  firstItemId: string;
  lastItemId: string;
  container: HTMLElement;
  listSizeLimit: number;
  listItemHeight: number;
  render: () => void;
}

export interface DomDataCacheModal {
  currentPaddingTop: number;
  currentPaddingBottom: number;
  topSentinelPreviousY: number;
  bottomSentinelPreviousY: number;
  topSentinelPreviousRatio: number;
  bottomSentinelPreviousRatio: number;
  currentIndex: number;
}

export class VitualListScroll {
  protected firstItemEle: HTMLElement;
  protected lastItemEle: HTMLElement;
  protected domDataCache: DomDataCacheModal;
  constructor(protected readonly _props: VitualListScrollPropsModal) {
    this.initPropsCheck();
  }

  // 初始化检查 props
  protected initPropsCheck() {
    if (!this._props && typeof this._props !== "object") {
      throw new Error("props are illegal");
    }

    this.firstItemEle = document.getElementById(this._props.firstItemId);
    this.lastItemEle = document.getElementById(this._props.lastItemId);

    this.domDataCache = {
      currentPaddingTop: 0,
      currentPaddingBottom: 0,
      topSentinelPreviousY: 0,
      topSentinelPreviousRatio: 0,
      bottomSentinelPreviousY: 0,
      bottomSentinelPreviousRatio: 0,
      currentIndex: 0
    };
  }

  // update cache
  protected updateDomDataCache(newData) {
    Object.assign(this.domDataCache, newData);
  }
}
