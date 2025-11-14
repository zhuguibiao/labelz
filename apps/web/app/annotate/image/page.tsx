"use client";

import { useImageAnnotationStore } from "./imageStore";
import { AnnotationHeader } from "@/components/header";
import { ImageAnnotator } from "@/components/annotate/image/image-annotator";
import { ImageSidebar } from "@/components/annotate/image/image-sidebar";
import { useShallow } from "zustand/shallow";
import { useI18n } from "@/components/i18n-provider";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";

export default function ImageAnnotationPage() {
  const { t } = useI18n();
  const {
    images,
    currentIndex,
    setImages,
    setCurrentIndex,
    labels,
    setLabels,
    showImageList,
  } = useImageAnnotationStore(
    useShallow((state) => ({
      images: state.images,
      currentIndex: state.currentIndex,
      setImages: state.setImages,
      setCurrentIndex: state.setCurrentIndex,
      labels: state.labels,
      setLabels: state.setLabels,
      showImageList: state.showImageList,
    }))
  );

  useBeforeUnload({
    enabled: images.length > 0,
  });

  const handleMarksUploaded = (uploadedMarks: any[]) => {
    setImages(uploadedMarks);
    setCurrentIndex(-1);
  };

  const handleMarkSelect = (index: any) => {
    setCurrentIndex(index);
  };

  const onLabelsChange = (newLabels: string[]) => {
    localStorage.setItem("labels", JSON.stringify(newLabels));
    setLabels(newLabels);
  };

  return (
    <div className="flex h-screen flex-col">
      <AnnotationHeader type="image" />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Images and Labels */}
        <ImageSidebar
          images={images}
          currentIndex={currentIndex}
          labels={labels}
          onImagesUploaded={handleMarksUploaded}
          onImageSelect={handleMarkSelect}
          onLabelsChange={onLabelsChange}
        />

        {/* Annotation Area */}
        <div className="flex-1 overflow-hidden">
          <ImageAnnotator item={images?.[currentIndex] || {}} labels={labels} />
        </div>
      </div>
    </div>
  );
}
