import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageCard from "../components/ImageCard";
import { useFetchImages } from "../hooks/useFetchImages";

const Home = () => {
  //just for consistency
  const location = useLocation();
  //routing to pages
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page") || "1", 10);

  //hooks coming from useFetchImages.ts
  const { images, loading, error, goToPage, currentPage } = useFetchImages();

  useEffect(() => {
    if (currentPage !== page) {
      goToPage(page);
    }
  }, [page, currentPage, goToPage]);

  const handlePageChange = (newPage: number) => {
    navigate(`/?page=${newPage}`); 
    goToPage(newPage); 
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-[100%] flex justify-center">
      <div className="w-[90%]">
        <h1 className="text-[40px] text-center max-md:text-[30px] max-sm:text-[25px]">Image Editor</h1>

        <div className="image grid grid-cols-3 gap- max-md:grid-cols-2 max-sm:grid-cols-1">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>

        {/* Pagination for the Image list*/}
        <div className="pagination overflow-x-auto max-sm:justify-start mt-4 flex justify-center space-x-2">
          {Array.from({ length: 10 }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 text-[12px] py-2 rounded-full ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
