"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@labelz/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@labelz/ui/components/select";
import { Input } from "@labelz/ui/components/input";
import { Square, Circle, Download, Hexagon, ImageIcon } from "lucide-react";
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
  const [shapeColor, setShapeColor] = useState<string>("#ff0000");
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
      markRef.current?.setImg(item.imageUrl);
      markRef.current?.clear?.();
      markRef.current?.setShapes?.(images[currentIndex].shapes);
      setDrawType(instance.currentDrawingType || "rect");
      instance.setDrawType(instance.currentDrawingType || "rect");
    } else if (currentIndex === -1) {
      markRef.current?.clear?.();
      setAnnotations([]);
    }
  }, [currentIndex, item]);

  const onShapeChange = useCallback(
    (shapes: any[]) => {
      if (currentIndex > -1) {
        images[currentIndex].shapes = shapes;
        setImages(images);
        setAnnotations(shapes);
      }
    },
    [currentIndex]
  );

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const onApplyDetection = (shapes: any) => {
    markRef.current.setShapes(shapes);
  };

  const Ai = useMemo(() => {
    return (
      <AiDetection
        imageUrl={item.imageUrl}
        onApplyDetection={onApplyDetection}
      />
    );
  }, [item.imageUrl]);

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col flex-1 h-full">
        <div className="border-b p-2">
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
            <Input
              className="w-[50px]"
              onChange={(e) => {
                setShapeColor(e.target.value);
              }}
              type="color"
              defaultValue="#ff0000"
            />

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
              {Ai}
            </div>
          </div>
        </div>

        <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center bg-muted/30">
          {/* mark mark */}
          {!(images.length && currentIndex > -1) && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 bg-muted">
              <div className="text-center space-y-4">
                <ImageIcon className="w-20 h-20 mx-auto text-muted-foreground justify-center" />
                <div>
                  <h3 className="text-lg font-medium">
                    {t("no_image_selected")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("upload_images_from_left")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Mark
            ref={markRef}
            markItem={{
              id: item.id,
              label: selectedLabel,
              color: shapeColor,
              backgroundUrl: item.imageUrl,
              shapes: item.shapes,
            }}
            onKeyDown={onKeyDown}
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
