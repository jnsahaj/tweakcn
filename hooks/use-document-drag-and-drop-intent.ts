import { useEffect, useRef, useState } from "react";

export function useDocumentDragAndDropIntent() {
  const [isUserDragging, setIsUserDragging] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      dragCounter.current++;
      if (e.dataTransfer?.types?.includes("Files")) {
        setIsUserDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        setIsUserDragging(false);
      }
    };
    const handleDrop = () => {
      dragCounter.current = 0;
      setIsUserDragging(false);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return { isUserDragging };
}
