"use client";

import { Button } from "@labelz/ui/components/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@labelz/ui/components/popover";
import { HelpCircle } from "lucide-react";

export default function Guide() {
  return (
    <div className="text-sm opacity-70">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            title="操作说明"
            variant="outline"
            size="icon"
            className="relative"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[340px] text-sm leading-relaxed">
          <div className="space-y-3">
            <div>
              <b>画布操作</b>：<div>1. Ctrl + 滚轮 缩放画布</div>
              <div>2. 双击 恢复初始</div>
              <div>3. 按住空格 拖动画布</div>
            </div>
            <div>
              <b>多边形和线段</b>：
              <div>1. 完成时：点第一个点、按回车 都是完成</div>
              <div>2. 新增时：右键删除最后一个点</div>
            </div>

            <div>
              <b>矩形和圆形</b>：<div>1. 按住鼠标 滑动 绘制图形</div>
            </div>

            <div>
              <b>公共操作</b>：<div>1. 移动：点击图形 长按拖动</div>
              <div>2. 编辑：调整白色点拖动改变大小</div>
              <div>3. 删除：按 Delete / Backspace 键删除选中的图形</div>
              <div>{"4. A D 或 <- ->左右方向键盘 切换图片"}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
