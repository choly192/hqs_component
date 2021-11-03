import * as React from "react";
import "./ribbon.css";

interface RibbonProps {
  text?: string;
}
const Ribbon: React.FC<RibbonProps> = (props) => {
  return (
    <div className="ribbon ribbon-placement ribbon-color-pink">
      <span className="ribbon-text">{props?.text}</span>
      <div className="ribbon-corner"></div>
    </div>
  );
};

export default Ribbon;
