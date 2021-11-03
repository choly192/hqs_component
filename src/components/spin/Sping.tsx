import * as React from "react";
import "./Sping.css";

interface SpingProps {
  tip?: string | HTMLElement;
}
const Sping: React.FC<SpingProps> = (props) => {
  const { tip } = props;
  return (
    <div className="sping">
      <div className="sping-container">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {tip && <div className="sping-tip-text">{tip}</div>}
    </div>
  );
};

export default Sping;
