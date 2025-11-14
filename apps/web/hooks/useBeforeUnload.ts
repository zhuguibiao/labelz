import { useEffect } from "react";

interface UseBeforeUnloadOptions {
  enabled?: boolean;
}

export function useBeforeUnload(options: UseBeforeUnloadOptions = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    // 开发环境不触发
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // 必须设置才能触发提示
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
