export declare class SimpleEventEmitter {
    private events;
    constructor();
    on(event: string, listener: (...args: any[]) => void): () => void;
    emit(event: string, payload: any): void;
}
