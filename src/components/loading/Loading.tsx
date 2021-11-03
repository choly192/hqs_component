import React from "react";
import "./Loading.css";

interface LoadingProps {}
const Loading: React.FC<LoadingProps> = (props) => {
  return (
    <section className="loader-container">
      <div className="loader loader-1">
        <div className="loader-outter"></div>
        <div className="loader-inner"></div>
      </div>
    </section>
  );
};

export default Loading;
