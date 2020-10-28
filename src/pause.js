import { isWin32 } from './util';

export var pause, resume;

if (isWin32)
    (function () {
        try {
            var ntsuspend = require('ntsuspend');
            pause = function (command) {
                if (!command.ffmpegProc)
                    return false;
                return ntsuspend.suspend(command.ffmpegProc.pid);
            };
            resume = function (command) {
                if (!command.ffmpegProc)
                    return false;
                return ntsuspend.resume(command.ffmpegProc.pid);
            };
        } catch (_e) {
            var error = new TypeError('Cannot require() ntsuspend');
            pause = resume = function () { throw error; };
        }
    }());
else {
    pause = function (command) {
        if (!command.ffmpegProc)
            return false;
        return command.ffmpegProc.kill('SIGSTOP');
    };
    resume = function (command) {
        if (!command.ffmpegProc)
            return false;
        return command.ffmpegProc.kill('SIGCONT');
    };
}
