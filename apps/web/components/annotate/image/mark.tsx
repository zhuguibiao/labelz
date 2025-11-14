"use client";

import { KeyboardEvent, useEffect, useRef } from "react";
import MarkCanvas from "@labelz/mark-board";
import styles from "./mark.module.css";

export interface ShapeItem {
  id?: number;
  shapeType: string;
  color: string;
  data: any;
}

export interface MarkConfig {
  id?: string;
  label?: string;
  color?: string;
  backgroundUrl?: string;
  shapes?: any;
}

export interface MarkRef {
  clear: () => void;
  setDrawType: (type: any) => void;
  getSelectObject: () => void;
  setSelectShape: (id: number) => void;
  setImg: (img: string) => void;
  deleteShape: (id: number) => void;
  setShapes: (list: ShapeItem[]) => void;
  setConfig: (cfg: MarkConfig) => void;
  getObjects: () => any[];
  getInstance: () => MarkCanvas;
}

interface MarkProps {
  markItem?: MarkConfig;
  onShapeChange?: (b: any) => void;
  onKeyDown?: (b: any) => void;
  ref?: React.RefObject<MarkRef | null>;
}

export function Mark({
  markItem = {},
  onShapeChange,
  onKeyDown,
  ref,
}: MarkProps) {
  const canvasRef = useRef<MarkCanvas | null>(null);
  const configRef = useRef<MarkConfig>(markItem);
  const onShapeChangeRef = useRef(onShapeChange);
  const onKeyDownRef = useRef(onKeyDown);

  useEffect(() => {
    onShapeChangeRef.current = onShapeChange;
  }, [onShapeChange]);

  useEffect(() => {
    onKeyDownRef.current = onKeyDown;
  }, [onKeyDown]);

  useEffect(() => {
    const canvas = new MarkCanvas({
      view: "#mark-box",
      lineWidth: 2,
      showLabel: true,
    });
    canvasRef.current = canvas;

    const onDraw = (e: any) => {
      canvas.currentDrawingType = e.type;
    };
    const onChange = () => {
      onShapeChangeRef.current?.(canvas.objects);
    };
    const onComplete = (e: any) => {
      e.ok({
        label: configRef.current.label,
        color: configRef.current.color || "red",
      });
    };
    const onResize = () => {
      canvas.handleResize();
    };
    const onkeydown = (e: KeyboardEvent) => {
      onKeyDownRef.current?.(e);
    };
    canvas.on("ondraw", onDraw);
    canvas.on("onchange", onChange);
    canvas.on("oncomplete", onComplete);
    canvas.on("onkeydown", onkeydown);
    window.addEventListener("resize", onResize);

    // bind ref
    if (ref) {
      ref.current = {
        getSelectObject: () => {
          return canvas.selectObject;
        },
        deleteShape: (id: any) => {
          canvas.deleteObject(id);
        },
        clear: () => {
          canvas.clearMarkShapes();
        },
        setDrawType: (type) => {
          canvas?.setDrawType(type || "rect");
        },
        setSelectShape: (id: any) => {
          canvas?.selectObjectById(id);
        },
        setShapes: (list: any[]) => {
          canvas.setObjectData(list);
        },
        setConfig: (cfg: MarkConfig) => {
          configRef.current = cfg;
          if (cfg.backgroundUrl) canvas.setBackground(cfg.backgroundUrl);
        },
        setImg: (img: string) => {
          if (img) canvas.setBackground(img);
        },
        getObjects: () => canvas.objects,
        getInstance: () => canvas,
      };
    }

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.off("ondraw", onDraw);
      canvas.off("onchange", onChange);
      canvas.off("oncomplete", onComplete);
      canvas.off("onkeydown", onkeydown);
      canvas?.destroy();
    };
  }, []);

  // config update
  useEffect(() => {
    configRef.current = markItem;
  }, [markItem]);

  return (
    <div
      id="mark-box"
      className={styles["image-wrapper"]}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
