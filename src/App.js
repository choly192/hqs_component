import { useState } from "react";
import { Loading, Sping, Ribbon, Modal, Divider } from "./components";
import { TagComponent, WithProductCard } from "./hoc";
import "./styles.css";

const ItemPro = WithProductCard(TagComponent)({ isShowTag: true });
export default function App() {
  const [visibal, setVisibal] = useState(true);
  const handleCancle = () => {
    setVisibal(false);
  };

  return (
    <main className="App">
      <Loading />
      <ItemPro />
      <Ribbon text="Hippies" />
      <Modal visibal={visibal} title="component Modal" onCancel={handleCancle}>
        <Sping tip="LOADING..." />
      </Modal>
      <Divider type="horizontal" dashed />
      <button onClick={() => setVisibal(true)}>show Modal</button>
    </main>
  );
}
