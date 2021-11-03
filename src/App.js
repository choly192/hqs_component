import { useState } from "react";
import {
  Loading,
  Sping,
  Ribbon,
  Modal,
  Divider,
  VirtualList
} from "./components";
import { TagComponent, WithProductCard } from "./hoc";
import "./styles.css";

const ItemPro = WithProductCard(TagComponent)({ isShowTag: true });
const data = Array.from({ length: 1000 }).map((_, i) => i);
export default function App() {
  const [visibal, setVisibal] = useState(true);
  const handleCancle = () => {
    setVisibal(false);
  };
  const handleClick = (val) => {
    console.log(val);
  };
  return (
    <main className="App">
      {/* <Loading />
      <ItemPro />
      <Ribbon text="Hippies" />
      <Modal visibal={visibal} title="component Modal" onCancel={handleCancle}>
        <Sping tip="LOADING..." />
      </Modal>
      <Divider type="horizontal" dashed />
      <button onClick={() => setVisibal(true)}>show Modal</button> */}
      <VirtualList data={data}>
        {(data) => (
          <div style={{ height: 30 }} onClick={() => handleClick(data)}>
            {data}
          </div>
        )}
      </VirtualList>
    </main>
  );
}
