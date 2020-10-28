export function abort(command) {
    if (!command.ffmpegProc) {
        command.logger.warn('[util] Cannot abort ffmpeg, no process found');
        return;
    }
    command.ffmpegProc.stdin.write(new Uint8Array([113, 13, 10]));
}
