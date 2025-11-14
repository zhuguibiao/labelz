import { useEffect } from "react";

interface UseBeforeUnloadOptions {
  enabled?: boolean;
}

export function useBeforeUnload(options: UseBeforeUnloadOptions = {}) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
