"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@labelz/ui/components/button";
import { Input } from "@labelz/ui/components/input";
import { Badge } from "@labelz/ui/components/badge";
import { ScrollArea } from "@labelz/ui/components/scroll-area";
import { Separator } from "@labelz/ui/components/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@labelz/ui/components/collapsible";
import {
  Plus,
  X,
  ImageIcon,
  ChevronDown,
  ChevronRight,
  Tag,
  Images,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import {
  defaultLabels,
  useImageAnnotationStore,
} from "@/app/annotate/image/imageStore";
import { useShallow } from "zustand/shallow";

interface ImageSidebarProps {
  images: any[];
  currentIndex: any;
  labels: string[];
  onImagesUploaded: (images: any[]) => void;
  onImageSelect: (index: any) => void;
  onLabelsChange: (labels: string[]) => void;
}

export function ImageSidebar({
  images,
  currentIndex,
  labels,
  onImagesUploaded,
  onImageSelect,
  onLabelsChange,
}: ImageSidebarProps) {
  const { t } = useI18n();
  const { setLabels } = useImageAnnotationStore(
    useShallow((state) => ({
      setLabels: state.setLabels,
    }))
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [showImages, setShowImages] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 释放旧的 URL，避免泄漏
      images.forEach((img) => {
        if (img.imageUrl) URL.revokeObjectURL(img.imageUrl);
      });
      const uploadedFiles = Array.from(e.target.files);
      const markItems = uploadedFiles.map((file, index) => ({
        id: Date.now() + index,
        imageName: file.name,
        imageUrl: URL.createObjectURL(file),
        shapes: [],
      }));
      onImagesUploaded([...markItems]);
    }
  };

  const addLabel = () => {
    const newLabel = inputRef.current?.value || "";
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      onLabelsChange([...labels, newLabel.trim()]);
    }
  };

  const removeLabel = (labelToRemove: string) => {
    onLabelsChange(labels.filter((label) => label !== labelToRemove));
  };

  useEffect(() => {
    setLabels(
      localStorage.getItem("labels")
        ? JSON.parse(localStorage.getItem("labels")!)
        : defaultLabels
    );
  }, []);

  return (
    <div className="w-70 border-r flex flex-col bg-background">
      {/* Upload Section */}
      <div className="p-4 border-b">
        {/* <h3 className="font-medium mb-3">{t("upload_images")}</h3> */}
        <div
          className="border-2 border-dashed rounded-lg p-1 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {/* <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" /> */}
          <p className="text-sm text-muted-foreground">
            {t("click_to_upload_images")}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </div>
      </div>

      {/* images List - Collapsible */}
      <Collapsible
        className="flex flex-col"
        open={showImages}
        onOpenChange={setShowImages}
      >
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              <span className="font-medium">
                {t("images")} ({images.length})
              </span>
            </div>
            {showImages ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-380px)] px-4">
            <div className="space-y-2 pb-4">
              {images.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {t("no_images_uploaded")}
                  </p>
                </div>
              ) : (
                images.map((mark, index) => (
                  <div
                    key={mark.id}
                    className={`flex items-center gap-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                      currentIndex === index ? "bg-muted" : ""
                    }`}
                    onClick={() => onImageSelect(index)}
                  >
                    <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={mark.imageUrl}
                        alt={mark.imageName || "mark"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {mark.imageName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {`${mark.shapes?.length || 0} ${t("shapes")}`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Labels Section - Collapsible */}
      <Collapsible open={showLabels} onOpenChange={setShowLabels}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span className="font-medium">
                {t("labels")} ({labels.length})
              </span>
            </div>
            {showLabels ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="p-2 pt-0">
            <div className="flex gap-2 mb-3">
              <Input
                ref={inputRef}
                placeholder={t("add_label")}
                className="h-8 px-2 py-1"
                onKeyDown={(e) => e.key === "Enter" && addLabel()}
              />
              <Button size="sm" onClick={addLabel}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[100px]">
              <div className="flex flex-wrap gap-1">
                {labels.map((label, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <span>{label}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                      onClick={() => removeLabel(label)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
