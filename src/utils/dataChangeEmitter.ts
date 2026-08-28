type DataChangeCallback = () => void;

class DataChangeEmitter {
  private listeners: Set<DataChangeCallback> = new Set();

  subscribe(callback: DataChangeCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit() {
    this.listeners.forEach((cb) => cb());
  }
}

export const dataChangeEmitter = new DataChangeEmitter();
