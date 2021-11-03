import React, { Fragment, useEffect, useRef, useState } from 'react';
import { throttle, getClassName } from './utils';
import SmoothScroll from './smoothScroll';
interface ScrollChangeTabProps {
  navIds: string[];
  activeClassName: string;
  isStartParent: boolean;
  clickClassName?: string;
  className?: string;
  style?: any;
  datasetAttr?: string;
  offset?: number;
  rootEl?: string;
  componentTag?: string;
  duration?: number;
}
interface itemsModal {
  type: string;
  props: any;
}
const ScrollChangeTab: React.FC<ScrollChangeTabProps> = (props) => {
  const itemsRef = useRef();
  const [viewStateData, setViewStateData] = useState(null);
  useEffect(() => {
    initFromProps();
    onEvent();
    return () => offEvent();
  }, []);

  const initScrollContent = (ids) => {
    if (!ids.length) return null;
    const targetItems = ids.map((id) => {
      return document.getElementById(id);
    });
    return targetItems;
  };

  // 初始化参数
  const initFromProps = () => {
    const targetScrollContentEles = initScrollContent(props.navIds);
    itemsRef.current = targetScrollContentEles;
    handleScroll(targetScrollContentEles);
  };

  // 滚动监听方法
  const handleScroll = (targets) => {
    const elementsViewState = getElementViewState(targets);
    setViewStateData(elementsViewState);
  };

  // 节流
  const _throttle = () => {
    throttle(handleScroll(undefined), 100);
  };

  // 判断元素是否在视口中
  const isInView = (el) => {
    if (!el) {
      return false;
    }

    const { offset = 0 } = props;
    const rect = el.getBoundingClientRect();
    const clientH = document.body.clientHeight || document.documentElement.clientHeight;
    const { scrollTop } = getScrollDimension();
    const scrollBottom = scrollTop + clientH;
    const elTop = rect.top + scrollTop + offset;
    // const elBottom = elTop + el.offsetHeight + 50;
    const clientW = document.body.clientWidth || document.documentElement.clientWidth;
    const elBottom = clientW <= 799 ? elTop + el.offsetHeight : elTop + el.offsetHeight + 50;
    return elTop < scrollBottom && elBottom > scrollTop;
  };

  // 返回元素相关状态值
  const getElementViewState = (contentEls) => {
    let [elemsInView, elemsOutView, viewStatusList] = [[], [], []];
    const targetItems = contentEls ? contentEls : itemsRef.current;
    let hasInViewAlready = false;
    for (let i = 0, max = targetItems.length; i < max; i++) {
      const currentContent = targetItems[i];
      let isInViewBool = hasInViewAlready ? false : isInView(currentContent);

      if (isInViewBool) {
        hasInViewAlready = true;
        elemsInView.push(currentContent);
      } else {
        elemsOutView.push(currentContent);
      }

      const isLastItem = i === max - 1;
      const isScrolledBool = isScrolled();

      const isLastShortItemAtBottom =
        isAtBottom() && isInView(currentContent) && !isInViewBool && isLastItem && isScrolledBool;

      if (isLastShortItemAtBottom) {
        elemsOutView.pop();
        elemsOutView.push(...elemsInView);
        elemsInView = [currentContent];
        viewStatusList = fillArray(viewStatusList, false);
        isInViewBool = true;
      }

      viewStatusList.push(isInViewBool);
    }
    return {
      inView: elemsInView,
      outView: elemsOutView,
      viewStatusList,
      // scrolledPast: this.props.scrolledPastClassName && this._getScrolledPast(viewStatusList),
    };
  };

  const fillArray = (array, val) => {
    let newArray = [];

    for (let i = 0, max = array.length; i < max; i++) {
      newArray[i] = val;
    }

    return newArray;
  };
  // 是否滚动到底部
  const isAtBottom = () => {
    const { scrollTop, scrollHeight } = getScrollDimension();
    const clientH = document.body.clientHeight || document.documentElement.clientHeight;
    const scrolledToBottom = scrollTop + clientH >= scrollHeight;
    return scrolledToBottom;
  };
  // 获取滚动参数
  const getScrollDimension = () => {
    const scrollTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || window.pageYOffset || document.body.scrollHeight;
    return {
      scrollHeight,
      scrollTop,
    };
  };

  //是否已滚动
  const isScrolled = () => {
    return getScrollDimension().scrollTop > 0;
  };

  // 监听
  const onEvent = () => {
    const el = props.rootEl ? document.querySelector(props.rootEl) : window;
    el.addEventListener('scroll', _throttle);
    if (props?.clickClassName) {
      const elArr = document.querySelectorAll(`.${props?.clickClassName}`);
      elArr.forEach((item) => {
        item.addEventListener('click', handleClick);
      });
    }
  };

  // 解除监听
  const offEvent = () => {
    const el = props.rootEl ? document.querySelector(props.rootEl) : window;
    el.removeEventListener('scroll', _throttle);
    if (props?.clickClassName) {
      const elArr = document.querySelectorAll(`.${props?.clickClassName}`);
      elArr.forEach((item) => {
        item.removeEventListener('click', handleClick);
      });
    }
    itemsRef.current = null;
  };

  const positionById = (id) => {
    const currentItem = initScrollContent([id]);
    if (!currentItem[0]) {
      return;
    }
    const rect = currentItem[0]?.getBoundingClientRect();
    const { offset = 0 } = props;
    const { scrollTop } = getScrollDimension();
    // 兼容判断
    SmoothScroll.scrollTo(
      window,
      scrollTop,
      rect?.top + scrollTop + offset,
      props?.duration,
      () => {},
    );
  };

  //点击切换tab
  const handleClick = (e) => {
    const id = e.target.dataset.scrollId;
    positionById(id);
  };
  const { children, className, isStartParent, datasetAttr, style, activeClassName } = props;

  const getReactTag = (child, index) => {
    if (!child) return null;
    const ChildTag = child.type;
    const childClass = getClassName({
      [`${child.props.className}`]: child.props.className,
      [`${activeClassName}`]: child.props[datasetAttr] && viewStateData?.viewStatusList[index],
    });

    return (
      <ChildTag {...child.props} className={childClass}>
        {child.props.children}
      </ChildTag>
    );
  };

  const Tag: any = props.componentTag ? props.componentTag : Fragment;
  const items = React.Children.map(children, (child: itemsModal, index: number) => {
    if (!child) {
      return null;
    }
    const ChildTag = child.type;
    const childClass = getClassName({
      [`${child.props.className}`]: child.props.className,
      [`${activeClassName}`]: isStartParent && viewStateData?.viewStatusList[index],
    });
    return (
      <ChildTag
        {...child.props}
        className={childClass}
        key={props.componentTag ? `scroll_children_tag_${index}` : ''}
      >
        {isStartParent ? child.props.children : getReactTag(child.props.children, index)}
      </ChildTag>
    );
  });

  const tagClass = getClassName({
    [`${className}`]: className,
  });
  return props.componentTag ? <Tag className={tagClass}>{items}</Tag> : <Tag>{items}</Tag>;
};

export default ScrollChangeTab;
