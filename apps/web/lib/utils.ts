import JSZip from "jszip";

type Point = { x: number; y: number };

type Shape = {
  id: string;
  label: string;
  type: string;
  color: string;
  pointList: [Point, Point];
  resolution: { width: number; height: number };
};

type Data = {
  id: number;
  imageName: string;
  imageUrl: string;
  shapes: Shape[];
};

type CategoryMap = Record<string, number>; // label -> id

// ------------------- 浏览器保存文件 -------------------
function saveFile(content: Blob | string, filename: string) {
  const blob =
    content instanceof Blob
      ? content
      : new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportDefalutJson(dataset: Data[]) {
  saveFile(
    JSON.stringify(
      dataset.map((item) => ({
        // ...item,
        imageName: item.imageName,
        shapes: item.shapes.map(({ id, color, ...rest }) => rest),
      })),
      null,
      2
    ),
    "annotations.json"
  );
  // return dataset;
}

/** export coco json file */
export function exportToCocoJson(dataset: Data[]) {
  const images: any[] = [];
  const annotations: any[] = [];
  const categoriesMap: CategoryMap = {};
  let categoryCounter = 0;
  let annotationCounter = 0;

  dataset.forEach((data, imageIdx) => {
    const imageWidth = data.shapes[0]?.resolution.width || 0;
    const imageHeight = data.shapes[0]?.resolution.height || 0;
    images.push({
      id: imageIdx,
      file_name: data.imageName,
      width: imageWidth,
      height: imageHeight,
    });

    data.shapes
      .filter((s) => s.type === "rect")
      .forEach((shape) => {
        if (!(shape.label in categoriesMap)) {
          categoriesMap[shape.label] = categoryCounter++;
        }
        const category_id = categoriesMap[shape.label];

        const [p1, p2] = shape.pointList;
        const x = p1.x;
        const y = p1.y;
        const width = p2.x - p1.x;
        const height = p2.y - p1.y;

        annotations.push({
          id: annotationCounter++,
          image_id: imageIdx,
          category_id,
          bbox: [x, y, width, height],
          area: width * height,
          iscrowd: 0,
        });
      });
  });

  const categories = Object.entries(categoriesMap).map(([name, id]) => ({
    id,
    name,
  }));

  const cocoJson = { images, annotations, categories };

  saveFile(JSON.stringify(cocoJson, null, 2), "coco_annotations.json");

  return cocoJson;
}

// ✅ 主函数：导出 YOLO ZIP
export async function exportToYoloZip(dataset: Data[]) {
  const zip = new JSZip();
  const labelMap: Record<string, number> = {};
  let classCounter = 0;

  // ---------- 生成每张图片的 YOLO TXT ----------
  dataset.forEach((data) => {
    const lines: string[] = [];
    data.shapes
      .filter((s) => s.type === "rect")
      .forEach((shape) => {
        if (!(shape.label in labelMap)) {
          labelMap[shape.label] = classCounter++;
        }
        const class_id = labelMap[shape.label];
        const [p1, p2] = shape.pointList;
        const width = p2.x - p1.x;
        const height = p2.y - p1.y;
        const x_center = p1.x + width / 2;
        const y_center = p1.y + height / 2;
        const img_w = shape.resolution.width;
        const img_h = shape.resolution.height;

        const line = [
          class_id,
          (x_center / img_w).toFixed(6),
          (y_center / img_h).toFixed(6),
          (width / img_w).toFixed(6),
          (height / img_h).toFixed(6),
        ].join(" ");
        lines.push(line);
      });

    const txtName = data.imageName.replace(/\.[^.]+$/, ".txt");
    zip.file(`labels/${txtName}`, lines.join("\n"));
  });

  // ---------- 生成 data.yaml ----------
  const yaml = [
    `path: .`,
    `train: images`,
    `val: images`,
    `nc: ${Object.keys(labelMap).length}`,
    `names:`,
    ...Object.entries(labelMap).map(([name, id]) => `  ${id}: ${name}`),
  ].join("\n");

  zip.file("data.yaml", yaml);

  // ---------- 打包 ZIP ----------
  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
  });
  saveFile(blob, "yolo_dataset.zip");

  console.log("✅ YOLO 数据集 ZIP 已生成并下载");
}
