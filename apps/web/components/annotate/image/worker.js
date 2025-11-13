import { pipeline } from "@huggingface/transformers";

class MyDetectionPipeline {
  static task = "object-detection";
  static model = null;
  static instance = null;
  static config = {};
  static isInitialized = false;

  static async getInstance(progress_callback = null) {
    // 如果实例不存在或者配置发生变化，才重新创建
    if (!this.instance || !this.isInitialized) {
      console.log("正在初始化模型...");
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        ...this.config,
      });
      this.isInitialized = true;
    }
    return this.instance;
  }

  static setConfig({ model, enableGPU }) {
    const newModel = model || "zgb6/object-detection";
    const newConfig = enableGPU ? { dtype: "q4", device: "webgpu" } : {};

    if (
      this.model !== newModel ||
      JSON.stringify(this.config) !== JSON.stringify(newConfig)
    ) {
      this.model = newModel;
      this.config = newConfig;
      this.isInitialized = false;
      console.log("配置已更新，需要重新初始化模型");
    }
  }

  // 清理实例
  static dispose() {
    if (this.instance) {
      this.instance = null;
      this.isInitialized = false;
      console.log("模型实例已清理");
    }
  }
}

// 节流 progress
let lastProgressTime = 0;

self.addEventListener("message", async (event) => {
  const { type, data } = event.data;

  try {
    switch (type) {
      case "load": {
        MyDetectionPipeline.setConfig(data.config || {});

        await MyDetectionPipeline.getInstance((progress) => {
          const now = Date.now();
          if (now - lastProgressTime > 200) {
            lastProgressTime = now;
            self.postMessage({ status: "loading", progress });
          }
        });

        self.postMessage({ status: "loaded" });
        break;
      }

      case "detect": {
        // 直接使用已初始化的实例，无需重新等待
        if (!MyDetectionPipeline.isInitialized) {
          throw new Error("模型未加载，请先调用 load 方法");
        }
        const detector = MyDetectionPipeline.instance;
        const output = await detector(data.img, { threshold: 0.7 });
        self.postMessage({ status: "complete", output, imgSrc: data.img });
        break;
      }

      case "unload": {
        // 清理模型实例
        MyDetectionPipeline.dispose();
        self.postMessage({ status: "unloaded" });
        break;
      }

      case "getStatus": {
        // 返回当前状态
        self.postMessage({
          status: "status",
          data: {
            isInitialized: MyDetectionPipeline.isInitialized,
            model: MyDetectionPipeline.model,
            hasGPU: !!MyDetectionPipeline.config.device,
          },
        });
        break;
      }

      default:
        self.postMessage({ status: "error", message: "Unknown message type" });
    }
  } catch (err) {
    self.postMessage({ status: "error", message: err.message });
  }
});
