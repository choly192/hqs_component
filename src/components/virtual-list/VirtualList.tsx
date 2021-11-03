import React, { useEffect, useRef, useState } from "react";

export interface VirtualListProps {
  // 列表数据
  data: Array<any>;
  // 真实渲染的 列表dom数量
  actualRows?: number;
  // 单个list 的高度
  height?: number;
  // 虚拟列表高度
  vitualHeight?: number;
  // 虚拟列表宽度
  vitualWidth?: number;
}
const VirtualList: React.FC<VirtualListProps> = (props) => {
  const {
    actualRows = 10,
    height = 30,
    vitualHeight = 300,
    vitualWidth = 300
  } = props;
  let virtualListRef = useRef<HTMLDivElement>();
  const [data, setData] = useState([]);
  const scrollHeight = props.data.length * height;

  // 计算当前状态索引
  const getCurrFirstLastIndex = (): number[] => {
    const st = virtualListRef.current?.scrollTop;
    const firstIndex = Math.floor(st / height);
    // 维持dom数量不变的情况下计算索引
    const maxIndex =
      props.data.length - actualRows < 0 ? 0 : props.data.length - actualRows;
    const minFirstIndex = Math.min(maxIndex, firstIndex);
    const lastIndex = minFirstIndex + actualRows - 1;
    return [minFirstIndex, lastIndex];
  };

  // 获取当前视窗内的数据
  const getDataInview = (data) => {
    const currIndexArr = getCurrFirstLastIndex();
    return data.slice(currIndexArr[0], currIndexArr[1] + 1).map((item) => ({
      origin: item,
      pos: currIndexArr[0] * height,
      index: `VLitem_${currIndexArr[0]++}`
    }));
  };

  // 判断滚动条方向
  let oldScrollTop = 0;
  const scrollDirection = (): string => {
    const currentScrollTop = virtualListRef.current.scrollTop;
    if (currentScrollTop > oldScrollTop) {
      oldScrollTop = currentScrollTop;
      return "down";
    } else {
      oldScrollTop = currentScrollTop;
      return "up";
    }
  };

  // scroll 事件
  const scrcollEvent = (e) => {
    if (e?.target === virtualListRef.current) {
      const diffSliceIndexes = getDiffIndexes(
        getDataInview(props.data),
        getCurrFirstLastIndex()
      );
      let newIndex =
        scrollDirection() === "down"
          ? getCurrFirstLastIndex()[1] - diffSliceIndexes.length + 1
          : getCurrFirstLastIndex()[0];

      diffSliceIndexes.forEach((index) => {
        const item = getDataInview(props.data)[index];
        item.origin = data[index];
        item.pos = newIndex * height;
        item.index = `VLitem_${newIndex++}`;
      });
    }
    setData(getDataInview(props.data));
  };

  useEffect(() => {
    setData(getDataInview(props.data));
    if (virtualListRef.current) {
      virtualListRef.current.addEventListener("scroll", scrcollEvent);
    }
    return () =>
      virtualListRef.current?.removeEventListener("scroll", scrcollEvent);
  }, []);

  return (
    <div
      style={{
        height: vitualHeight,
        width: vitualWidth,
        border: "1px solid black",
        overflow: "auto"
      }}
      ref={virtualListRef}
    >
      <div style={{ position: "relative", height: scrollHeight }}>
        {data.length > 0 &&
          data.map((item, i) => (
            <div
              key={item.index}
              style={{
                position: "absolute",
                width: "100%",
                transform: `translateY(${item.pos}px)`
              }}
            >
              {(props.children as any)(item.origin)}
            </div>
          ))}
      </div>
    </div>
  );
};
export default VirtualList;

// 获取滚动前后索引差集
const getDiffIndexes = (
  dataSnatShot: Array<any>,
  firstLastIndex: number[]
): number[] => {
  const indexes: number[] = [];
  dataSnatShot.forEach((item, i) => {
    if (item.$index < firstLastIndex[0] || item.index > firstLastIndex[1]) {
      indexes.push(i);
    }
  });
  return indexes;
};
