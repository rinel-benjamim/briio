import { useRef, useCallback, useEffect } from "react";

type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(
  saveFn: () => Promise<void>,
  deps: any[],
  delay: number = 400
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusRef = useRef<AutosaveStatus>("idle");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const save = useCallback(async () => {
    try {
      statusRef.current = "saving";
      await saveFn();
      if (mountedRef.current) {
        statusRef.current = "saved";
        setTimeout(() => {
          if (mountedRef.current && statusRef.current === "saved") {
            statusRef.current = "idle";
          }
        }, 1500);
      }
    } catch {
      if (mountedRef.current) {
        statusRef.current = "error";
      }
    }
  }, [saveFn]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);

  const triggerSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    save();
  }, [save]);

  return { triggerSave, status: statusRef.current };
}
