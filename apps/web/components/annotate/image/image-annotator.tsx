"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@labelz/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@labelz/ui/components/select";
import { Square, Circle, Download, Hexagon } from "lucide-react";
import { Mark } from "./mark";
import { useShallow } from "zustand/shallow";
import { useImageAnnotationStore } from "@/app/annotate/image/imageStore";
import { AnnotationList } from "./annotation-list";
import AiDetection from "./ai-annotate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@labelz/ui/components/dropdown-menu";
import Guide from "./guide";
import { useI18n } from "@/components/i18n-provider";
import {
  exportDefalutJson,
  exportToCocoJson,
  exportToYoloZip,
} from "@/lib/utils";

interface ImageAnnotatorProps {
  item: any;
  labels: string[];
}

export function ImageAnnotator({ item, labels }: ImageAnnotatorProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>(labels[0] || "");
  const [annotations, setAnnotations] = useState<any[]>([]);
  const markRef = useRef<any>({});
  const { t } = useI18n();

  const {
    drawType,
    images,
    setImages,
    currentIndex,
    setCurrentIndex,
    setDrawType,
  } = useImageAnnotationStore(
    useShallow((state) => ({
      setCurrentIndex: state.setCurrentIndex,
      setDrwaInstance: state.setDrwaInstance,
      drawType: state.drawType,
      images: state.images,
      currentIndex: state.currentIndex,
      setImages: state.setImages,
      setDrawType: state.setDrawType,
    }))
  );

  useEffect(() => {
    if (currentIndex > -1 && item.imageUrl) {
      const instance = markRef.current.getInstance();
      markRef.current.setImg(item.imageUrl);
      markRef.current?.clear?.();
      markRef.current?.setShapes?.(images[currentIndex].shapes);
      setDrawType(instance.currentDrawingType || "rect");
      instance.setDrawType(instance.currentDrawingType || "rect");
    }
  }, [currentIndex, item]);

  const onShapeChange = useCallback(
    (shapes: any[]) => {
      images[currentIndex].shapes = shapes;
      setImages(images);
      setAnnotations(shapes);
    },
    [currentIndex]
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft") {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    if (e.code === "ArrowRight") {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const onApplyDetection = (shapes: any) => {
    markRef.current.setShapes(shapes);
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col flex-1 h-full">
        <div className="border-b p-4">
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1 items-center border rounded-md">
              <Button
                size="sm"
                variant={drawType === "rect" ? "secondary" : "ghost"}
                onClick={() => {
                  setDrawType("rect");
                  markRef.current.setDrawType("rect");
                }}
              >
                <Square className="h-4 w-4" />
                <span className="sr-only">rect</span>
              </Button>
              <Button
                size="sm"
                variant={drawType === "polygon" ? "secondary" : "ghost"}
                onClick={() => {
                  setDrawType("polygon");
                  markRef.current.setDrawType("polygon");
                }}
              >
                <Hexagon className="h-4 w-4" />
                <span className="sr-only">Polygon</span>
              </Button>
              <Button
                size="sm"
                variant={drawType === "circle" ? "secondary" : "ghost"}
                onClick={() => {
                  setDrawType("circle");
                  markRef.current.setDrawType("circle");
                }}
              >
                <Circle className="h-4 w-4" />
                <span className="sr-only">Circle</span>
              </Button>
            </div>

            <Select value={selectedLabel} onValueChange={setSelectedLabel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select label" />
              </SelectTrigger>
              <SelectContent>
                {labels.map((label, index) => (
                  <SelectItem key={index} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center ml-auto gap-2">
              <Guide />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Download className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      exportDefalutJson(images);
                    }}
                  >
                    {t("export_for_defalut")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      exportToYoloZip(images);
                    }}
                  >
                    {t("export_for_yolo")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      exportToCocoJson(images);
                    }}
                  >
                    {t("export_for_coco")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AiDetection
                imageUrl={item.imageUrl}
                onApplyDetection={onApplyDetection}
              />
            </div>

            {/* <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Undo className="h-4 w-4" />
              <span className="sr-only">Undo</span>
            </Button>
            <Button variant="outline" size="icon">
              <Redo className="h-4 w-4" />
              <span className="sr-only">Redo</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => {}}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear All</span>
            </Button>
          </div> */}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/30">
          <Mark
            ref={markRef}
            onKeyDown={onKeyDown}
            markItem={{
              id: item.id,
              label: selectedLabel,
              color: "red",
              backgroundUrl: item.imageUrl,
              shapes: item.shapes,
            }}
            onShapeChange={onShapeChange}
          />
        </div>
      </div>

      {/* annotation list */}
      <AnnotationList
        annotations={annotations}
        onAnnotationSelect={(annotation) => {
          markRef.current.setSelectShape(annotation.id);
        }}
        onAnnotationDelete={(id) => {
          markRef.current.deleteShape(id);
        }}
        selectedId={markRef.current?.getSelectObject?.()?.id}
      />
    </div>
  );
}
