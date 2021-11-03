import * as React from "react";
import classNames from "classnames";
import "./style/index.css";

export interface PartialDividerProps {
  type: "horizontal" | "vertical";
  className: string;
  dashed: boolean;
  style: React.CSSProperties;
}

const Divider: React.FC<Partial<PartialDividerProps>> = (props) => {
  const { type, className, dashed, ...restProps } = props;
  const prefixCls = "divider";
  const classNameStr = classNames(
    prefixCls,
    `${prefixCls}-${type}`,
    {
      [`${prefixCls}-dashed`]: !!dashed
    },
    className
  );
  return <div className={classNameStr} {...restProps}></div>;
};

export default Divider;
