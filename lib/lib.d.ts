import type { FfmpegCommand } from "fluent-ffmpeg";

export declare function handleOutputStream(stream: NodeJS.WritableStream): {
    path: string;
    close(): void;
};
export declare function handleInputStream(stream: NodeJS.ReadableStream): {
    path: string;
    close(): void;
};
export declare function pause(command: FfmpegCommand): boolean;
export declare function resume(command: FfmpegCommand): boolean;
export declare function abort(command: FfmpegCommand): void;
export declare function tee(...destinations: (string | NodeJS.WritableStream)[]): string;
