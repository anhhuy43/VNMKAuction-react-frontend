import React from "react";
import "./Modal.css"; // CSS riêng cho modal

const Modal = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;
