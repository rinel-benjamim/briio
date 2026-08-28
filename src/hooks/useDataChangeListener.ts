import { useEffect } from "react";
import { dataChangeEmitter } from "@/utils/dataChangeEmitter";

export function useDataChangeListener(callback: () => void) {
  useEffect(() => {
    const unsubscribe = dataChangeEmitter.subscribe(callback);
    return unsubscribe;
  }, [callback]);
}
