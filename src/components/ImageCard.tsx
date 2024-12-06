import React, { useState } from "react";
import Modal from "./ImageModal";
import { useNavigate } from "react-router-dom";

type ImageCardProps = {
  image: {
    id: string;
    download_url: string;
    author: string;
  };
};

const ImageCard = ({ image }: ImageCardProps) => {
  const navigate = useNavigate();
  const handleEditClick = () => {
    const currentPage = localStorage.getItem("currentPage") || "1"; // Get current page from localStorage
    navigate(`/edit/${image.id}?page=${currentPage}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-1 m-1 border">
      <img src={image.download_url} className="rounded-xl" alt={image.author} />
      <div className="pt-2 flex justify-between text-white">
        <button onClick={handleEditClick} className="p-1 w-[47%] text-[13px] bg-slate-400 rounded-md">
          Click to Edit
        </button>
        <button onClick={openModal} className="p-1 text-[13px] w-[47%] bg-blue-500 rounded-md">
          Preview Image
        </button>
      </div>

      {/*popup Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={image.download_url}
        imageAlt={image.author}
      />
    </div>
  );
};

export default ImageCard;
