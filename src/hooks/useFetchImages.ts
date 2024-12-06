import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Image {
  id: string;
  author: string;
  download_url: string;
}

interface UseFetchImagesReturn {
  images: Image[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPage: number;
  goToPage: (page: number) => void;
}

const API_URL = "https://picsum.photos/v2/list";

export const useFetchImages = (): UseFetchImagesReturn => {
  //storing where its coming from
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page") || "1", 10);

  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  //pagination states
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPage] = useState<number>(10);

  const fetchImages = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=6`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: Image[] = await response.json();
      setImages(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  const goToPage = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return { images, loading, error, currentPage, totalPage, goToPage };
};
