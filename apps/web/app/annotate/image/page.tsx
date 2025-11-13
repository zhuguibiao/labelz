"use client";

import { useImageAnnotationStore } from "./imageStore";
import { AnnotationHeader } from "@/components/header";
import { ImageAnnotator } from "@/components/annotate/image/image-annotator";
import { ImageSidebar } from "@/components/annotate/image/image-sidebar";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n-provider";

export default function ImageAnnotationPage() {
  const { t } = useI18n();
  const {
    images,
    currentIndex,
    drawInstance,
    setImages,
    setCurrentIndex,
    labels,
    setLabels,
    showImageList,
    setDrawType,
  } = useImageAnnotationStore(
    useShallow((state) => ({
      drawInstance: state.drawInstance,
      images: state.images,
      currentIndex: state.currentIndex,
      setImages: state.setImages,
      setCurrentIndex: state.setCurrentIndex,
      labels: state.labels,
      setLabels: state.setLabels,
      showImageList: state.showImageList,
      setDrawType: state.setDrawType,
    }))
  );

  const handleMarksUploaded = (uploadedMarks: any[]) => {
    setImages(uploadedMarks);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (drawInstance.clear) {
      drawInstance?.clear?.();
      drawInstance?.setShapes?.(images[currentIndex].shapes);
      drawInstance.setDrawType?.(
        drawInstance.canvas.currentDrawingType || "rect"
      );
      setDrawType?.(drawInstance.canvas.currentDrawingType);
    }
  }, [images, currentIndex, drawInstance]);

  const handleMarkSelect = (mark: any, index: any) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex h-screen flex-col">
      <AnnotationHeader type="image" />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Images and Labels */}
        {showImageList && (
          <ImageSidebar
            images={images}
            currentIndex={currentIndex}
            labels={labels}
            onImagesUploaded={handleMarksUploaded}
            onImageSelect={handleMarkSelect}
            onLabelsChange={setLabels}
          />
        )}

        {/* Annotation Area */}
        <div className="flex-1 overflow-hidden">
          {images.length && currentIndex > -1 ? (
            <ImageAnnotator item={images[currentIndex]} labels={labels} />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted/30">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-muted rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium">
                    {t("no_image_selected")}
                  </h3>
                  <p className="text-muted-foreground">
                    {showImageList
                      ? t("upload_images_from_left")
                      : "Show the image panel to upload and select images"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
