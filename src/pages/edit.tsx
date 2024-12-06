import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditImage = () => {
  const { id } = useParams<{ id: string }>(); // Getting the id from the route
  const navigate = useNavigate();
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing images
  const [width, setWidth] = useState<number>(50);
  const [height, setHeight] = useState<number>(50);
  const [blur, setBlur] = useState<number>(0);
  const [greyscale, setGreyscale] = useState<boolean>(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://picsum.photos/id/${id}/info`);
        if (!response.ok) {
          throw new Error("Failed to fetch image details");
        }
        const data = await response.json();
        setImage(data);

        // Restore saved edits from localStorage, even after reload and check back
        const savedEdits = JSON.parse(localStorage.getItem(`edited_${id}`) || "{}");
        if (savedEdits.url) {
          setEditedImageUrl(savedEdits.url);
          setWidth(savedEdits.width);
          setHeight(savedEdits.height);
          setBlur(savedEdits.blur);
          setGreyscale(savedEdits.greyscale);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImageDetails();
    }
  }, [id]);

  const handleSave = () => {
    setSaving(true);
    const baseUrl = `https://picsum.photos/id/${id}/${width}/${height}`;
    let params = "";

    if (blur > 0) {
      params += `?blur=${blur}`;
    }
    if (greyscale) {
      params += params ? "&grayscale" : "?grayscale";
    }

    const newUrl = baseUrl + params;

    setTimeout(() => {
      setEditedImageUrl(newUrl);
      setSaving(false);

      // Save edits to localStorage
      localStorage.setItem(
        `edited_${id}`,
        JSON.stringify({ url: newUrl, width, height, blur, greyscale })
      );
    }, 1000); 
  };

  const goBack = () => {
    const currentPage = localStorage.getItem("currentPage") || "1";
    navigate(`/?page=${currentPage}`);
  };

  // Download function
  const handleDownload = async () => {
    try {
      const response = await fetch(editedImageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
      
      // Convert image to Blob
      const blob = await response.blob();
      
      // Create a download link for the Blob
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `edited_image_${id}.jpg`; 
      link.click();
      
      // Cleanup the object URL after download
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 w-[100%] flex justify-center">
      <div className="mt-4 w-[95%] flex justify-between">
        <img
          src={image.download_url}
          alt={image.author}
          className="rounded-xl w-[50%] h-[50vh]"
        />

        <div className="ml-3 self-start w-[50%]">
        
          <div className="mt-4 pl-2 flex flex-col bg-blue-950 text-white p-2 rounded-lg">
            <h3 className="text-[12px] w-[100px] text-center m1 font-semibold bg-slate-600">
              Edit Options
            </h3>

            
            <div className="mt-2">
              <h3 className="text-[12px] font-semibold">Adjust Dimensions:</h3>
              <div className="flex pt-2">
                <label className="block mt-1 text-[13px] pr-2">Width:</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="border rounded-md text-[13px] p-1 w-ful text-black"
                />

                <label className="block mt-1 text-[13px] px-2">Height:</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="border text-[13px] rounded-md p-1 w-ful text-black"
                />
              </div>
            </div>

            <hr className="my-2" />

          
            <div>
              <h3 className="text-[12px] font-semibold">Greyscale</h3>
              <label className="flex items-center space-x-2 mt-1">
                <input
                  type="radio"
                  checked={greyscale}
                  onChange={(e) => setGreyscale(e.target.checked)}
                />
                <span className="text-[12px]">Apply Greyscale</span>
              </label>
            </div>

            <hr className="my-2" />

          
            <div>
              <h3 className="text-[12px] font-semibold">Blur</h3>
              <label className="block mt-1 text-[12px]">Blur (0-10):</label>
              <input
                type="range"
                min="0"
                max="10"
                height="1"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-[12px]">{blur}</span>
            </div>

            <button
              className="mt-2 text-[12px] bg-blue-500 text-white py-2 px-4 rounded-md"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          
          <div className="mt-2 pl-2 flex flex-col bg-blue-950 text-white p-2 rounded-lg">
            <h3 className="text-[12px] w-[100px] text-center font-semibold bg-slate-600">
              Edited Image
            </h3>
            <div className="w-[100%] flex justify-center">
              <div className="w-[60%]">
                {saving ? (
                  <p>Applying changes...</p>
                ) : editedImageUrl ? (
                  <img
                    src={editedImageUrl}
                    alt="Edited"
                    className="rounded-xl mt-4 w-full"
                  />
                ) : (
                  <p className="mt-4 text-gray-400">No edits applied yet.</p>
                )}
              </div>
            </div>
          </div>

          
          <button
            className="mt-4 text-[12px] bg-green-500 text-white py-2 px-4 rounded-md"
            onClick={handleDownload}
            disabled={!editedImageUrl}
          >
            Download Edited Image
          </button>

      
        </div>
      </div>
    </div>
  );
};

export default EditImage;
