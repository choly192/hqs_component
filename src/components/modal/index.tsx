import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./style/index.css";

export interface ModalProps {
  // modal 是否可见
  visibal?: boolean;
  // 是否显示左上角关闭按钮
  closable?: boolean;
  // 是否显示 mask
  mask?: boolean;
  // 点击mask是否允许关闭modal
  maskClosable?: boolean;
  children?: React.ReactElement;
  // 标题
  title?: ReactElement | string;
  // moadal 宽度
  width?: number;
  // modal 高度
  height?: number;
  // 点击确定回调
  onOk?: (e: React.MouseEvent<HTMLElement>) => void;
  // 确定 按钮文字
  okText?: ReactNode;
  // 点击 取消/mask/关闭按钮 回调
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
  // 取消 按钮文字
  cancelText?: ReactNode;
  // 底部内容
  footer?: ReactNode;
  closeIcon?: ReactNode;
}
const Modal: React.FC<ModalProps> = (props) => {
  const [visibal, setVisibal] = useState(false);
  useEffect(() => setVisibal(props?.visibal), [props?.visibal]);
  const {
    title = "",
    children = undefined,
    width = 520,
    footer = undefined,
    mask = true,
    closable = true,
    maskClosable
  } = props;

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { onCancel } = props;
    onCancel?.(e);
  };

  const handleOk = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { onOk } = props;
    onOk?.(e);
  };

  const DefaultFooter = () => {
    const { cancelText, okText } = props;
    return (
      <>
        <button className="common-btn" onClick={handleCancel}>
          {cancelText || "取消"}
        </button>
        <button className="common-btn common-btn-primary" onClick={handleOk}>
          {okText || "确定"}
        </button>
      </>
    );
  };

  return createPortal(
    visibal && (
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-section" style={{ width: width + "px" }}>
            <div className="modal-content">
              {closable && (
                <span className="modal-close-icon" onClick={handleCancel}>
                  <i className="close-icon"></i>
                </span>
              )}
              <div className="modal-title">{title}</div>
              <div className="modal-body">{children}</div>
              <div className="modal-operator">
                {footer === undefined ? <DefaultFooter /> : footer}
              </div>
            </div>
          </div>
        </div>
        {mask ? (
          <div
            className="mask"
            onClick={maskClosable ? () => handleCancel : null}
          ></div>
        ) : null}
      </div>
    ),
    document.body
  );
};

export default Modal;
