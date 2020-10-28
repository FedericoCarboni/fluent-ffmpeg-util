export function abort(command) {
    command.ffmpegProc.stdin.write(new Uint8Array([113, 13, 10]));
}
