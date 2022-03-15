/**
 * 固定item高度 - 虚拟列表滚动
 */

export interface VitualListScrollPropsModal {
  firstItemId: string;
  lastItemId: string;
  container: HTMLElement;
  listSizeLimit: number;
  listItemHeight: number;
  render: (index: number) => void;
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
  protected observer: IntersectionObserver;
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

  // 动态调整容器的padding实现滚动
  protected adjustPadding(isScrollDown: boolean) {
    const { container, listItemHeight, listSizeLimit } = this._props;
    const { currentPaddingTop, currentPaddingBottom } = this.domDataCache;
    let [newCurrentPaddingTop, newCurrentPaddingBottom] = [0, 0];

    // compute padding increment
    const paddingIncrementVal = listItemHeight * Math.floor(listSizeLimit / 2);

    if (isScrollDown) {
      newCurrentPaddingTop = currentPaddingTop + paddingIncrementVal;
      newCurrentPaddingBottom =
        currentPaddingBottom === 0
          ? 0
          : currentPaddingBottom - paddingIncrementVal;
    } else {
      newCurrentPaddingBottom = currentPaddingBottom + paddingIncrementVal;
      newCurrentPaddingTop =
        currentPaddingTop === 0 ? 0 : currentPaddingTop - paddingIncrementVal;
    }

    // 给 container 动态设置padding
    container.style.paddingBottom = `${newCurrentPaddingBottom}px`;
    container.style.paddingTop = `${newCurrentPaddingTop}px`;

    // update cachae
    this.updateDomDataCache({
      currentPaddingTop: newCurrentPaddingTop,
      currentPaddingBottom: newCurrentPaddingBottom
    });
  }

  // compute first index
  protected getFirstIndex(isScrollDown: boolean) {
    const { currentIndex } = this.domDataCache;

    // 以容器内元素的一半作为增量
    const indexIncrement = Math.floor(this._props.listSizeLimit / 2);
    let firstIndex = 0;
    firstIndex = isScrollDown
      ? currentIndex + indexIncrement
      : currentIndex - indexIncrement;

    if (firstIndex < 0) {
      firstIndex = 0;
    }
    return firstIndex;
  }

  // IntersectionObserver 观察首尾节点是否进入/离开视窗
  protected initIntersectionObserver() {
    const { firstItemId, lastItemId } = this._props;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === firstItemId && entry.isIntersecting) {
          this.topAccurateJudgment(entry); // 上滑精准判断
        } else if (entry.target.id === lastItemId && entry.isIntersecting) {
          this.bottomAccurateJudgment(entry); // 下滑精准判断
        }
      });
    });

    this.observer.observe(this.firstItemEle);
    this.observer.observe(this.lastItemEle);
  }

  // 上滑精准判断
  protected topAccurateJudgment(entry) {
    const {
      topSentinelPreviousY,
      topSentinelPreviousRatio
    } = this.domDataCache;
    const currentY = entry.boundingClientRect.top;
    const currentRatio = entry.intersectionRatio;

    if (
      currentY > topSentinelPreviousY &&
      currentRatio >= topSentinelPreviousRatio
    ) {
      const firstIndex = this.getFirstIndex(false);
      this._props.render(firstIndex);
      this.adjustPadding(false);

      this.updateDomDataCache({
        currentIndex: firstIndex,
        topSentinelPreviousY: currentY,
        topSentinelPreviousRatio: currentRatio
      });
    } else {
      this.updateDomDataCache({
        topSentinelPreviousY: currentY,
        topSentinelPreviousRatio: currentRatio
      });
    }
  }

  // 下滑精准判断
  protected bottomAccurateJudgment(entry) {
    const {
      bottomSentinelPreviousRatio,
      bottomSentinelPreviousY
    } = this.domDataCache;

    const currentY = entry.boundingClientRect.top;
    const currentRatio = entry.intersectionRatio;

    if (
      currentY < bottomSentinelPreviousY &&
      currentRatio >= bottomSentinelPreviousRatio
    ) {
      const firstIndex = this.getFirstIndex(true);

      this._props.render(firstIndex);
      this.adjustPadding(true);

      this.updateDomDataCache({
        currentIndex: firstIndex,
        bottomSentinelPreviousY: currentY,
        bottomSentinelPreviousRatio: currentRatio
      });
    } else {
      this.updateDomDataCache({
        bottomSentinelPreviousY: currentY,
        bottomSentinelPreviousRatio: currentRatio
      });
    }
  }

  // start observer
  public startObserver() {
    this.initIntersectionObserver();
  }

  // unObserver
  public unObserver() {
    this.observer.unobserve(this.firstItemEle);
    this.observer.unobserve(this.lastItemEle);
  }
}
