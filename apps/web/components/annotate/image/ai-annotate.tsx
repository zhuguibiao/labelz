"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@labelz/ui/components/button";
import { Switch } from "@labelz/ui/components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@labelz/ui/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@labelz/ui/components/popover";
import { Loader2, Bot, Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

const modelMap = [
  { name: "zgb6/object-detection", label: "zgb6/object-detection" },
];

// 转换函数
function convertDetectionToAnnotation(detections: any[]): any[] {
  return detections.map((detection) => {
    const { box, label, score } = detection;

    // 转换坐标点
    // 注意：这里假设原始坐标已经是正确的，如果需要缩放或调整，可以在这里处理
    const pointList = [
      { x: box.xmin, y: box.ymin }, // 左上角
      { x: box.xmax, y: box.ymax }, // 右下角
    ];

    return {
      label: label, // 或者可以映射到固定标签，如 "Object"
      type: "rect",
      color: "red",
      select: false,
      pointList,
    };
  });
}

interface DetectionResult {
  bbox: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  label: string;
  score: number;
}

export default function AiDetection({
  imageUrl,
  onApplyDetection,
}: {
  imageUrl?: string;
  onApplyDetection?: (results: DetectionResult[]) => void;
}) {
  const { t } = useI18n();
  const workerRef = useRef<Worker | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [model, setModel] = useState("zgb6/object-detection");
  const [enableGPU, setEnableGPU] = useState(true);
  const [autoDetector, setAutoDetector] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>(
    []
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });

    const worker = workerRef.current;

    worker.onmessage = (e) => {
      const { status, output, message, imgSrc } = e.data;
      switch (status) {
        case "loaded":
          console.log("✅ 模型加载完成");
          setLoaded(true);
          setLoading(false);
          break;
        case "complete":
          console.log("🎯 检测结果:", output);
          setDetectionResults(output || []);
          setLoading(false);
          drawDetectionPreview(imgSrc, output);
          break;
        case "error":
          console.error("❌ Worker 错误:", message);
          setLoading(false);
          break;
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  // 绘制检测结果预览
  const drawDetectionPreview = (imgSrc: any, results: DetectionResult[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.font = "20px Arial";
      ctx.fillStyle = "red";
      results.forEach((obj: any) => {
        const { xmin, ymin, xmax, ymax } = obj.box;
        const width = xmax - xmin;
        const height = ymax - ymin;
        ctx.strokeRect(xmin, ymin, width, height);
        ctx.fillText(
          `${obj.label} (${(obj.score * 100).toFixed(1)}%)`,
          xmin,
          ymin - 5
        );
      });
    };
  };

  // 加载模型
  const handleLoadModel = () => {
    if (!workerRef.current) return;
    setLoading(true);
    setLoaded(false);
    workerRef.current.postMessage({
      type: "load",
      data: {
        config: { model, enableGPU },
      },
    });
  };

  // 执行检测
  const handleDetect = () => {
    if (!imageUrl) {
      alert("请先选择图片");
      return;
    }
    if (!loaded) {
      alert("请先加载模型");
      return;
    }
    if (!workerRef.current) return;
    setLoading(true);
    workerRef.current.postMessage({
      type: "detect",
      data: { img: imageUrl },
    });
  };

  useEffect(() => {
    if (autoDetector && imageUrl && loaded) {
      handleDetect();
    }
  }, [autoDetector, imageUrl]);

  // 应用检测结果到上图
  const handleApplyToImage = () => {
    if (detectionResults.length === 0) {
      return;
    }
    if (onApplyDetection) {
      onApplyDetection(convertDetectionToAnnotation(detectionResults));
      setDetectionResults([]);
    }
  };
  return (
    <Popover modal={false}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bot className="h-5 w-5" />
          {loaded && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="w-100"
        align="end"
      >
        <div className="flex flex-col gap-2">
          {/* 标题区域 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <div className="text-sm font-medium">
                {t("ai_detection_config")}
              </div>
            </div>
          </div>

          {/* 模型选择 */}
          <div className="flex items-center justify-between text-xs">
            <span className="">{t("detection_model")}</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelMap.map((m) => (
                  <SelectItem key={m.name} value={m.name}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* GPU 开关 */}
          <div className="flex items-center justify-between text-xs">
            <span className="">{t("enable_gpu")}</span>
            <Switch checked={enableGPU} onCheckedChange={setEnableGPU} />
          </div>

          {/* 自动检测 开关 */}
          <div className="flex items-center justify-between text-xs">
            <span className="">{t("auto_detect")}</span>
            <Switch checked={autoDetector} onCheckedChange={setAutoDetector} />
          </div>

          {/* 状态指示 */}
          <div className="flex items-center justify-between text-xs">
            <span className="">{t("model_status")}</span>
            <span
              className={
                loaded ? "text-green-600 font-medium" : "text-orange-600"
              }
            >
              {loaded ? t("loaded") : t("not_loaded")}
            </span>
          </div>

          {/* 检测结果统计 */}
          {detectionResults.length > -1 && (
            <div className="flex items-center justify-between text-xs">
              <span className="">{t("detected")}</span>
              <span className="text-blue-600 font-medium">
                {detectionResults.length} {t("targets")}
              </span>
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={handleLoadModel}
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : loaded ? (
                `✅ ${t("loaded")}`
              ) : (
                t("load_model")
              )}
            </Button>

            <Button
              className="flex-1"
              onClick={handleDetect}
              disabled={loading || !loaded}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Bot className="h-3 w-3 mr-1" />
                  {t("run_detection")}
                </>
              )}
            </Button>
          </div>
          {/* 提示信息 */}
          {!loaded && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {t("first_load_slow")}
            </div>
          )}
          {/* 应用按钮 */}
          <div className="flex gap-2">
            <Button
              disabled={!detectionResults.length}
              onClick={handleApplyToImage}
              size="sm"
              className="flex-1"
            >
              <Check className="h-3 w-3 mr-1" />
              {t("apply_to_image")}
            </Button>
          </div>

          <div className="border rounded-md p-2 bg-gray-50">
            <div className="text-xs font-medium  mb-2">
              {t("detection_preview")}
            </div>
            <div className="overflow-auto max-h-40">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
