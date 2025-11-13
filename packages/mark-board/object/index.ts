import type { IObject } from "../types";
import MarkObject from "./object";
import MarkPolygonObject from "./polygon";
import MarkRectObject from "./rect";
import MarkPolylineObject from "./polyline";
import MarkEllipseObject from "./ellipse";
import MarkCircleObject from "./circle";

enum MarkObjectType {
  NONE = "",
  /** 矩形 */
  RECT = "rect",
  /** 多边形 */
  POLYGON = "polygon",
  /** 圆 */
  CIRCLE = "circle",
  /** 椭圆 */
  ELLIPSE = "ellipse",
  /** 点 */
  POINT = "point",
  /** 多线段 */
  POLYLINE = "polyline",
}

const markMap: IObject = {
  [MarkObjectType.NONE]: "",
  [MarkObjectType.RECT]: MarkRectObject!,
  [MarkObjectType.POLYGON]: MarkPolygonObject!,
  [MarkObjectType.CIRCLE]: MarkCircleObject!,
  [MarkObjectType.ELLIPSE]: MarkEllipseObject!,
  [MarkObjectType.POLYLINE]: MarkPolylineObject!,
};

export {markMap, MarkObject, MarkObjectType };
