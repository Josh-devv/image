
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose(); // Close modal if clicked outside the image
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
    >
      <div className="relative w-[90%] max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-700 p-2 rounded-full hover:bg-gray-900"
        >
          ✕
        </button>
        <img src={imageSrc} alt={imageAlt || "Image Preview"} className="w-full h-auto rounded-md" />
      </div>
    </div>
  );
};

export default Modal;
